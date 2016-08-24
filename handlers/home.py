# -*- coding: utf-8 -*- 
from __future__ import print_function
import logging

import zmq
from zmq.eventloop.future import Context as ZMQContext
from tornado import gen

from handlers.base import BaseHandler
from models import User

logger = logging.getLogger('server.' + __name__)


class HomeHandler(BaseHandler):

    async def get(self, *args):
        self.render('index.html')
