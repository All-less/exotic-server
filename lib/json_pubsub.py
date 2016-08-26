# -*- coding:utf-8 -*-
import json
import logging

import zmq
from zmq.eventloop.future import Context as ZMQContext
from zmq.eventloop.zmqstream import ZMQStream
from tornado import gen

logger = logging.getLogger('server.' + __name__)


class JsonPubsub:

    @gen.coroutine
    def init_pubsub(self, recv_port, send_port, topic):
        ctx = ZMQContext.instance()
        self.topic = topic
        self.sub = ctx.socket(zmq.SUB)
        self.sub.setsockopt(zmq.SUBSCRIBE, self.topic)
        self.sub.connect('tcp://127.0.0.1:{}'.format(recv_port))
        self.sub_stream = ZMQStream(self.sub)
        self.sub_stream.on_recv(self.on_recv_sub)
        self.pub = ctx.socket(zmq.PUB)
        self.pub.connect('tcp://127.0.0.1:{}'.format(send_port))
        yield gen.sleep(0.1) # make sure self.pub has been setup

    @gen.coroutine
    def on_recv_sub(self, future):
        msg = yield future  # result of sub.recv_multipart
        try:
            dict_ = json.loads(msg[1].decode('utf-8'))
            yield self.on_recv_json(dict_)
        except Exception as e:
            logger.error('Error occurs during decoding data from device.\n\
                          {}'.format(e), exc_info=True)

    @gen.coroutine
    def on_recv_json(self, dict_):
        pass

    @gen.coroutine
    def pub_json(self, dict_):
        yield self.pub.send_multipart([self.topic, json.dumps(dict_).encode('utf-8')])

    def close_pubsub(self):
        self.sub.close()
        self.sub_stream.close()
        self.pub.close()
