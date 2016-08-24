# -*- coding; utf-8 -*-
from __future__ import absolute_import, print_function
import uuid
import logging

import zmq
from zmq.eventloop.future import Context as ZMQContext
from zmq.eventloop.zmqstream import ZMQStream
from tornado.options import options
from tornado import gen

from lib.constant import *
from lib.json_stream import JsonStream
from lib.json_pubsub import JsonPubsub
from lib.proxy_pool import ProxyPool
from lib.util import embed_code
from models import Rpi
from .pool import DevicePool
from settings import settings

logger = logging.getLogger('server.' + __name__)


class Device(JsonStream, JsonPubsub):

    id_ = None
    device_id = None
    operator = None

    def __init__(self, stream, address):
        stream.set_close_callback(self.on_close)
        super().__init__(stream, address)
        self.id_ = uuid.uuid4()

    async def on_read_json(self, dict_):
        code = embed_code(dict_)
        if not self.device_id and code == CODE_AUTH:
            await self.try_auth(dict_)
        else:
            pass  # TODO: broadcast dict_ to others

    async def try_auth(self, dict_):
        device_id = dict_.get('device_id', None)
        auth_key = dict_.get('auth_key', None)
        rpi = await Rpi.find_one({'device_id': device_id})

        if not rpi or rpi['auth_key'] != auth_key:
            self.send_json({
                'type': TYPE_STATUS, 
                'status': 'auth_failed'
            })
            return

        self.device_id = device_id
        DevicePool.remove_unauth_device(self)
        # TODO: add more fields
        self.send_json({
            'type': TYPE_STATUS, 
            'status': 'authorized'
        })

        send_port, recv_port = ProxyPool.get_ports()
        await self.init_pubsub(recv_port, send_port, self.device_id.encode('utf-8'))
        await Rpi.update({'_id': rpi['_id']}, 
                         {'$set': {'send_port': send_port,
                                   'recv_port': recv_port}})
        
        logger.info('Device "{}" authenticated.'.format(device_id))

    @gen.coroutine
    def on_recv_json(self, dict_):
        logger.debug('Pubsub: get {}'.format(dict_))
        pubsub_handlers = {
            CODE_ACQUIRE: self.handle_acquire,
            CODE_RELEASE: self.handle_release
        }
        code = dict_.get('code', -1)
        res = {}
        if code in pubsub_handlers:
            res = pubsub_handlers[code](dict_)
        if res:  # if there is some response
            logger.debug('Pubsub: send {}'.format(res))
            yield self.pub_json(res)

    def handle_acquire(self, dict_):
        if not self.operator:
            user = dict_.get('user', None)
            self.operator = user
            return {'type': TYPE_INFO, 'info': 'user_changed', 'user': user}

    def handle_release(self, dict_):
        if self.operator:
            self.operator = None
            return {'type': TYPE_INFO, 'info': 'user_changed', 'user': None}

    async def on_close(self):
        if not self.device_id:
            DevicePool.remove_unauth_device(self)
        else:
            logger.info('Device "{}" disconnected.'.format(self.device_id))
            await Rpi.update({'device_id': self.device_id}, 
                             {'$set': {'send_port': 0,
                                       'recv_port': 0}})
