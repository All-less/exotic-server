#!env/bin/python
# -*- coding: utf-8 -*- 
import os

import zmq
from zmq.eventloop import ioloop
ioloop.install()  # make sure it's called before all tornado stuff
import tornado.httpserver
import tornado.web
from tornado.options import options
from tornado import gen

from settings import settings
from urls import url_patterns
from tcpserver.server import DeviceServer


def main():
    app = tornado.web.Application(url_patterns, **settings)
    app.listen(options.http_port)
    tcp = DeviceServer()
    tcp.listen(options.tcp_port)
    ioloop.IOLoop.instance().start()

if __name__ == "__main__":
    main()
