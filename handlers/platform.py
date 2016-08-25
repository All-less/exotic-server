# -*- coding: utf-8 -*-
import logging
import time
import json

import zmq
from zmq.eventloop.future import Context as ZMQContext
from zmq.eventloop.zmqstream import ZMQStream
import tornado.websocket
from tornado import gen

from lib.json_pubsub import JsonPubsub
from lib.util import embed_code
from lib.constant import *
from models import Rpi

logger = logging.getLogger('server.' + __name__)


class PlatformHandler(tornado.websocket.WebSocketHandler, JsonPubsub):

    device_id = None
    user = None
    is_operator = False
    last_comment_time = time.time()

    @gen.coroutine
    def open(self, device_id):
        user = self.get_secure_cookie('user')
        if not user:  # user should be logged in
            self.close()
        self.device_id = device_id
        self.user = user.decode('utf-8')
        logger.info('200 WebSocket /platform/{} from user {}.'.format(
                    device_id, self.user))
        rpi = yield Rpi.find_one({'device_id': device_id})
        if not rpi:  # invalid device_id
            self.close()
        yield self.init_pubsub(rpi['recv_port'], rpi['send_port'], device_id.encode('utf-8'))

    @gen.coroutine
    def on_message(self, message):
        try:
            dict_ = json.loads(message)
            logger.debug('WebSocket: get {}'.format(dict_))
        except Exception as e:
            logger.error('Error occurs during decoding data from WebSocket.\n\
                          {}'.format(e), exc_info=True)

        code = embed_code(dict_)
        if code == CODE_BROADCAST:
            cur_time = time.time()
            if cur_time - self.last_comment_time < 2:
                return  # discard the message
            self.last_comment_time = cur_time
            dict_.pop('action')
            dict_.update({
                'code': CODE_BROADCAST_INFO,
                'type': TYPE_INFO,
                'info': 'broadcast'
            })
        if code == CODE_ACQUIRE:
            dict_['user'] = self.user
        logger.debug('Pubsub: send {}'.format(dict_))
        yield self.pub_json(dict_)

    @gen.coroutine
    def on_recv_json(self, dict_):
        code = embed_code(dict_)
        if code == CODE_USER_CHANGE:
            self.is_operator = dict_.get('user', None) == self.user
        if code in [CODE_USER_CHANGE, CODE_BROADCAST_INFO]:
            logger.debug('WebSocket: send {}'.format(dict_))
            self.write_message(json.dumps(dict_))

    def on_close(self):
        print('closed')
