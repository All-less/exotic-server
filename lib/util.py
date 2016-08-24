from __future__ import absolute_import
import hashlib
from random import choice
from string import ascii_uppercase, digits, ascii_letters

from tornado.options import options
from models import Rpi
from .constant import *

def cook_password(password, salt):
    saltPos = options.salt_pos
    s = hashlib.sha512()
    s.update(bytes(salt[:saltPos], 'utf-8'))
    s.update(bytes(password, 'utf-8'))
    s.update(bytes(salt[saltPos:], 'utf-8'))
    return s.hexdigest() 

def digest_password(password):
    salt = gen_salt()
    return salt, cook_password(password, salt)

def check_password(password, salt, cooked):
    return cooked == cook_password(password, salt)

def gen_password():
    return ''.join(choice(ascii_letters + digits) for i in range(12))
    
def gen_salt():
    return ''.join(choice(ascii_letters + digits) for i in range(64))

def gen_vcode():
    return ''.join(choice(ascii_uppercase + digits) for i in range(4))

async def get_authed_list():
    cursor = Rpi.find({'send_port': {'$gt': 0}}, 
                      {'_id': 0, 'device_id': 1})  # exclude _id, only device_id
    res = await cursor.to_list(None)
    res = list(map(lambda x: x['device_id'], res))
    return res

def embed_code(dict_):
    code = dict_.get('code', None)
    if code is not None:
        return code
    type_ = dict_.get('type', None)
    if type_ in TYPES:
        brief = dict_.get(TYPES[type_], None)
    else:
        brief = 'error'
    code = CODES.get(brief, -1)
    dict_['code'] = code
    return code
