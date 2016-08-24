# -*- coding: utf-8 -*-
from tornado.options import options


class ProxyPool:

    @classmethod
    def get_ports(cls):
        base = options.proxy_port_start
        try:
            cls.i = (cls.i + 1) % options.proxy_port_pairs   
        except AttributeError:  # cls.i has not been defined yet
            cls.i = 0
        return (base + cls.i * 2, 
                base + cls.i * 2 + 1)
