# -*- coding: utf-8 -*-
DELIMITER = '\n'
bDELIMITER = b'\n'

types = [
    'ACT_ACQUIRE',
    'ACT_RELEASE',
    'ACT_BROADCAST',
    'ACT_AUTH',
    'ACT_SYNC',
    'ACT_CHANGE_MODE',
    'STAT_AUTH_SUCC',
    'STAT_AUTH_FAIL',
    'STAT_INPUT',
    'STAT_OUTPUT',
    'STAT_UPLOADED',
    'STAT_DOWNLOADED',
    'STAT_PROGRAMMED',
    'STAT_DOWNLOAD_FAIL',
    'OP_BTN_DOWN',
    'OP_BTN_UP',
    'OP_SW_OPEN',
    'OP_SW_CLOSE',
    'OP_PROG',
    'INFO_USER_CHANGED',
    'INFO_DISCONN',
    'INFO_BROADCAST',
    'INFO_MODE_CHANGED',
    'INFO_VIDEO_URL'
]

for i, type_ in enumerate(types):
    exec('{} = {}'.format(type_, i))
