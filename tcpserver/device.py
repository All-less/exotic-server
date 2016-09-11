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
from models import Rpi
from .pool import DevicePool
from settings import settings

logger = logging.getLogger('server.' + __name__)


class Device(JsonStream, JsonPubsub):

    id_ = None
    device_id = None
    operator = None

    buttons = 0x0
    switches = 0x0
    led = 0xFFFF
    segs = [0x7F for _ in range(8)]
    mode = 'digital'

    live_host = None
    rtmp_port = None
    rtmp_app = None
    hls_path = None
    stream_key = None

    def __init__(self, stream, address):
        stream.set_close_callback(self.on_close)
        super().__init__(stream, address)
        self.id_ = uuid.uuid4()

    async def on_read_json(self, dict_):
        code = dict_.get('type', None)
        if not self.device_id and code == ACT_AUTH:
            await self.try_auth(dict_)
        else:
            if code == STAT_INPUT:
                self.buttons = dict_['buttons']
                self.switches = dict_['switches']
            elif code == INFO_MODE_CHANGED:
                self.mode = dict_['mode']
            elif code == STAT_OUTPUT:
                self.led = dict_['led']
                self.segs = dict_['segs']

            if code in [STAT_INPUT, STAT_DOWNLOADED, STAT_PROGRAMMED,
                        INFO_MODE_CHANGED, STAT_OUTPUT, STAT_DOWNLOAD_FAIL]:
                await self.pub_json(dict_)

    async def try_auth(self, dict_):
        device_id = dict_.get('device_id', None)
        auth_key = dict_.get('auth_key', None)
        rpi = await Rpi.find_one({'device_id': device_id})
        if not rpi or rpi['auth_key'] != auth_key:
            self.send_json({
                'type': STAT_AUTH_FAIL
            })
            return

        self.device_id = device_id
        DevicePool.remove_unauth_device(self)
        self.send_json({
            'type': STAT_AUTH_SUCC,
            'rtmp_host': rpi['live_host'],
            'rtmp_port': rpi['rtmp_port'],
            'rtmp_app': rpi['rtmp_app'],
            'rtmp_stream': self.device_id,
            'file_url': '{}/{}.bit'.format(options.file_url, self.device_id)
        })
        self.live_host = rpi['live_host']
        self.rtmp_port = rpi['rtmp_port']
        self.rtmp_app = rpi['rtmp_app']
        self.hls_path = rpi['hls_path']
        self.stream_key = self.device_id

        send_port, recv_port = ProxyPool.get_ports()
        await self.init_pubsub(recv_port, send_port, self.device_id.encode('utf-8'))
        await Rpi.update({'_id': rpi['_id']},
                         {'$set': {'send_port': send_port,
                                   'recv_port': recv_port}})

        logger.info('Device "{}" authenticated.'.format(device_id))

    @gen.coroutine
    def on_recv_json(self, dict_):
        logger.debug('Pubsub: {} get {}'.format(self.device_id, dict_))
        pubsub_handlers = {
            ACT_ACQUIRE: self.handle_acquire,
            ACT_RELEASE: self.handle_release
        }
        code = dict_.get('type', None)
        if code == ACT_SYNC:
            yield self.pub_json({
                'type': INFO_USER_CHANGED,
                'user': self.operator
            })
            yield self.pub_json({
                'type': STAT_OUTPUT,
                'led': self.led,
                'segs': self.segs
            })
            yield self.pub_json({
                'type': STAT_INPUT,
                'switches': self.switches,
                'buttons': self.buttons
            })
            yield self.pub_json({
                'type': INFO_MODE_CHANGED,
                'mode': self.mode
            })
            yield self.pub_json({
                'type': INFO_VIDEO_URL,
                'live_host': self.live_host,
                'rtmp_port': self.rtmp_port,
                'rtmp_app': self.rtmp_app,
                'stream_key': self.stream_key,
                'hls_path': self.hls_path
            })
            return
        if code in [OP_BTN_DOWN, OP_BTN_UP, OP_SW_OPEN, OP_SW_CLOSE,
                    STAT_UPLOADED, OP_PROG, ACT_CHANGE_MODE]:
            self.send_json(dict_)
            return
        res = {}
        if code in pubsub_handlers:
            res = pubsub_handlers[code](dict_)
        if res:  # if there is some response
            logger.debug('Pubsub: {} send {}'.format(self.device_id, res))
            yield self.pub_json(res)

    def handle_acquire(self, dict_):
        if not self.operator:
            user = dict_.get('user', None)
            self.operator = user
            res = {'type': INFO_USER_CHANGED, 'user': user}
            self.send_json(res)
            return res

    def handle_release(self, dict_):
        if self.operator:
            self.operator = None
            res = {'type': INFO_USER_CHANGED, 'user': None}
            self.send_json(res)
            return res

    async def on_close(self):
        if not self.device_id:  # device has not been auth'ed yet
            DevicePool.remove_unauth_device(self)
        else:
            await self.pub_json({'type': INFO_DISCONN})
            logger.info('Device "{}" disconnected.'.format(self.device_id))
            await Rpi.update({'device_id': self.device_id},
                             {'$set': {'send_port': 0,
                                       'recv_port': 0}})
