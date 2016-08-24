# -*- coding: utf-8 -*-
from collections import OrderedDict
import logging

from lib.constant import *

logger = logging.getLogger('server.' + __name__)


class DevicePool:
    """A class for temporarily saving all unautenticated devices. """

    devices_to_auth = OrderedDict()

    @classmethod
    def add_unauth_device(cls, device):
        """Add an unauthenticated device to to-auth list."""
        if len(cls.devices_to_auth) > 20:
            _, first = cls.devices_to_auth.popitem()
            first.send_json({'type': TYPE_INFO, 'info': 'AUTH_TIMEOUT'})
            first.close()
        cls.devices_to_auth[device.id_] = device

    @classmethod
    def remove_unauth_device(cls, device):
        """Remove a device from to-auth list."""
        if device.id_ in cls.devices_to_auth:
            del cls.devices_to_auth[device.id_]
