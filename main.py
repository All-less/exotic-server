#!env/bin/python
# -*- coding: utf-8 -*- 
import os

import zmq
from zmq.eventloop import ioloop
from zmq.eventloop.future import Context
from zmq.eventloop.zmqstream import ZMQStream
ioloop.install()  # make sure it's called before all tornado stuff
import tornado.httpserver
import tornado.web
from tornado.options import options
from tornado import gen

from settings import settings
from urls import url_patterns
from tcpserver.server import DeviceServer


async def idle():
    while True:
        print('idle')
        await gen.sleep(0.5)


@gen.coroutine
def ping_recv(future):
    msg = yield future
    print('ping recv {}'.format(msg))
    

async def ping():
    ctx = Context()
    ping_sub = ctx.socket(zmq.SUB)
    ping_sub.setsockopt(zmq.SUBSCRIBE, b"ping")
    ping_sub.setsockopt(zmq.SUBSCRIBE, b"pong")
    ping_sub.connect('tcp://127.0.0.1:7071')
    stream = ZMQStream(ping_sub)
    stream.on_recv(ping_recv)
    ping_pub = ctx.socket(zmq.PUB)
    ping_pub.connect('tcp://127.0.0.1:7070')
    while True:
        await gen.sleep(0.5)
        await ping_pub.send(b'ping' + str(os.getpid()).encode('utf-8'))
        
@gen.coroutine
def pong_recv(future):
    msg = yield future
    print('pong recv {}'.format(msg))


async def pong():
    ctx = Context()
    pong_sub = ctx.socket(zmq.SUB)
    pong_sub.setsockopt(zmq.SUBSCRIBE, b"ping")
    pong_sub.setsockopt(zmq.SUBSCRIBE, b"pong")
    pong_sub.connect('tcp://127.0.0.1:7071')
    stream = ZMQStream(pong_sub)
    stream.on_recv(pong_recv)
    pong_pub = ctx.socket(zmq.PUB)
    pong_pub.connect('tcp://127.0.0.1:7070')
    while True:
        await pong_pub.send(b'pong' + str(os.getpid()).encode('utf-8'))
        await gen.sleep(0.5)


def main():
    app = tornado.web.Application(url_patterns, **settings)
    app.listen(options.http_port)
    tcp = DeviceServer()
    tcp.listen(options.tcp_port)
    """
    ioloop.IOLoop.instance().add_callback(idle)
    """
    # ioloop.IOLoop.instance().add_callback(ping)
    # ioloop.IOLoop.instance().add_callback(pong)

    ioloop.IOLoop.instance().start()

if __name__ == "__main__":
    main()
