# -*- coding: utf-8 -*-
import logging
import time
import json
import math
import random

import zmq
from zmq.eventloop.future import Context as ZMQContext
from zmq.eventloop.zmqstream import ZMQStream
import tornado.websocket
from tornado import gen

from lib.json_pubsub import JsonPubsub
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
        if not isinstance(user, bytes):  # user should be logged in
            self.close()
        self.device_id = device_id
        self.user = user.decode('utf-8')
        logger.info('200 WebSocket /platform/{} from user {}.'.format(
                    device_id, self.user))
        rpi = yield Rpi.find_one({'device_id': device_id})
        # invalid device_id or device is offline
        if not rpi or not rpi['recv_port']:
            self.close()
        yield self.init_pubsub(rpi['recv_port'], rpi['send_port'], device_id.encode('utf-8'))

    @gen.coroutine
    def on_message(self, message):
        try:
            dict_ = json.loads(message)
            logger.debug('WebSocket: get {}'.format(dict_))
        except Exception as e:
            logger.error('Error occurs during decoding data from WebSocket.\n'
                         '{}'.format(e), exc_info=True)

        code = dict_.get('type', None)
        if code == ACT_BROADCAST:
            cur_time = time.time()
            if cur_time - self.last_comment_time < 2:
                return  # discard the message
            self.last_comment_time = cur_time
            dict_.update({'type': INFO_BROADCAST})
        if code == ACT_ACQUIRE:
            dict_['user'] = self.user
        logger.debug('Pubsub: {} send {}'.format(self.device_id, dict_))
        yield self.pub_json(dict_)

    @gen.coroutine
    def on_recv_json(self, dict_):
        code = dict_.get('type', None)
        if code == INFO_USER_CHANGED:
            self.is_operator = dict_.get('user', None) == self.user
        if code in [INFO_USER_CHANGED, INFO_BROADCAST, INFO_DISCONN,
                    STAT_OUTPUT, STAT_INPUT, STAT_DOWNLOADED,
                    STAT_PROGRAMMED, INFO_MODE_CHANGED, INFO_VIDEO_URL]:
            logger.debug('WebSocket: {} send {}'.format(self.device_id, dict_))
            self.write_message(dict_)

    @gen.coroutine
    def on_close(self):
        logger.info('WebSocket from user "{}" closed.'.format(self.user))
        if self.is_operator:
            yield self.pub_json({'type': ACT_RELEASE})
        self.close_pubsub()
