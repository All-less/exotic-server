# -*- coding: utf-8 -*-
import logging
from email.mime.text import MIMEText

from tornado.options import options
from tornado import gen

from async_mailer import mailer
from handlers.base import BaseHandler
from models import User
from lib.util import digest_password
from lib.util import gen_vcode
from lib.util import check_password
from lib.util import gen_password
from lib.util import get_authed_list
from tcpserver.pool import DevicePool
from settings import DeploymentType, DEPLOYMENT

logger = logging.getLogger('server.' + __name__)


class LoginHandler(BaseHandler):

    async def post(self):
        email = self.get_json_argument('email')
        user = await User.find_one({'email': email})
        if not user:
            self.fail({'err': 'NO_USER'})
            return
        password = self.get_json_argument('password')
        if not check_password(password, user['salt'], user['password']):
            self.fail({'err': 'WRONG_PASSWORD'})
            return
        self.set_secure_cookie('user', email, 0.01)
        devices = await get_authed_list()
        self.succ({'status':
            {'devices': devices}
        })


class LogoutHandler(BaseHandler):

    def post(self):
        self.clear_cookie('user')
        self.succ({})


class RegisterHandler(BaseHandler):

    async def post(self):
        email = self.get_json_argument('email')
        user = await User.find_one({'email': email})
        if user:
            self.fail({'err': 'DUPLICATE_EMAIL'})
            return
        salt, cooked = digest_password(self.get_json_argument('password'))
        await User.insert({'email': email, 'password': cooked, 'salt': salt})
        self.set_secure_cookie('user', email, 0.01)
        devices = await get_authed_list()
        self.succ({'status':
            {'devices': devices,
             'user': email}
        })


class EmailHandler(BaseHandler):

    async def post(self):
        """
        Description:
            Send verification code to the given email.

        Request:
            email: 'xxx@xxx.com'
        """
        user_mail = self.get_json_argument('email')
        code = gen_vcode()
        message = MIMEText('您的验证码为：{}'.format(code))
        message['Subject'] = '【Exotic实验平台】邮箱验证码'
        message['From'] = options.mail_addr
        message['To'] = user_mail
        try:
            if DEPLOYMENT == DeploymentType.PRODUCTION:
                await mailer.sendmail(options.mail_addr, user_mail, message.as_string())
            else:
                logger.info('Verification code: {}'.format(code))
            self.succ({'code': code})
        except Exception as e:
            logger.error('Error: {}'.format(e), exc_info=True)
            self.fail({'err': 'SMTP_ERR'})


class FindPasswordHandler(BaseHandler):

    async def post(self):
        email = self.get_json_argument('email')
        user = await User.find_one({'email': email})
        if not user:
            self.fail({'err': 'NO_USER'})
            return
        password = gen_password()
        salt, cooked = digest_password(password)
        message = MIMEText('您的新登录密码为：{}'.format(password))
        message['Subject'] = '【Exotic实验平台】密码重置提醒'
        message['From'] = options.mail_addr
        message['To'] = email
        try:
            if DEPLOYMENT == DeploymentType.PRODUCTION:
                await mailer.sendmail(options.mail_addr, user_mail, message.as_string())
            else:
                logger.info('New password: {}'.format(password))
        except Exception as e:
            logger.error('Error: {}'.format(e), exc_info=True)
            self.fail({'err': 'SMTP_ERR'})
            return
        await User.update({'_id': user['_id']}, {'$set': {'password': cooked, 'salt': salt}})
        self.succ({})


class ChangePasswordHandler(BaseHandler):

    async def post(self):
        email = self.get_json_argument('email')
        user = await User.find_one({'email': email})
        if not user:
            self.fail({'err': 'NO_USER'})
            return
        oldpass = self.get_json_argument('oldpass')
        if not check_password(oldpass, user['salt'], user['password']):
            self.fail({'err': 'WRONG_PASSWORD'})
            return
        salt, cooked = digest_password(self.get_json_argument('newpass'))
        await User.update({'_id': user['_id']}, {'$set': {'password': cooked, 'salt': salt}})
        self.succ({})


class StatusHandler(BaseHandler):

    async def get(self):
        user = self.get_secure_cookie('user')
        if user:
            user = user.decode('utf-8')
            devices = await get_authed_list()
            self.succ({'status':
                {'devices': devices,
                 'user': user}
            })
        else:
            self.fail({})
