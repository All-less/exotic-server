# -*- coding: utf-8 -*-
import logging
import tornado
import tornado.template
import os
from pathlib import Path
from tornado.options import define, options

import environment
from lib import logconfig

# Make filepaths relative to settings.
path = lambda root,*a: os.path.join(root, *a)
ROOT = os.path.dirname(os.path.abspath(__file__))

define('http_port', default=6060, help='port for http service', type=int)
define('tcp_port', default=6061, help='port for tcp connection', type=int)
define('proxy_port_start', default=7070, help='port for proxy messages', type=int)
define('proxy_port_pairs', default=1, help='number of port pairs for proxy', type=int)
define('proxy_port_diff', default=1, help='difference between send and recv port', type=int)
define('config', default='config.py', help='tornado config file', type=str)
define('mail_addr', default=None, help='email address to send system mail', type=str)
define('mail_pass', default=None, help='password of the email', type=str)
define('smtp_host', default=None, help='host address of SMTP server', type=str)
define('smtp_port', default=None, help='port address of SMTP server', type=int)
define('salt_pos', default=None, help='position to mix salt and password', type=int)
define('tmp_dir', default='/tmp/exotic-server', help='location for temporary files', type=str)
define('file_url', help='url for downloading file', type=str)
tornado.options.parse_command_line()

MEDIA_ROOT = path(ROOT, 'static')
TEMPLATE_ROOT = path(ROOT, 'static')

# Deployment Configuration

class DeploymentType:
    PRODUCTION = "PRODUCTION"
    DEV = "DEV"
    dict = {
        PRODUCTION: 1,
        DEV: 2
    }

if 'DEPLOYMENT_TYPE' in os.environ:
    DEPLOYMENT = os.environ['DEPLOYMENT_TYPE'].upper()
else:
    DEPLOYMENT = DeploymentType.DEV

settings = {}
settings['debug'] = DEPLOYMENT != DeploymentType.PRODUCTION
settings['static_path'] = MEDIA_ROOT
settings['cookie_secret'] = "your-cookie-secret"
settings['xsrf_cookies'] = False
settings['template_loader'] = tornado.template.Loader(TEMPLATE_ROOT)

SYSLOG_TAG = "exotic_server"
SYSLOG_FACILITY = logging.handlers.SysLogHandler.LOG_LOCAL2
LOG_LEVEL = logging.DEBUG if settings['debug'] else logging.INFO
USE_SYSLOG = DEPLOYMENT == DeploymentType.PRODUCTION
# See PEP 391 and logconfig for formatting help.  Each section of LOGGERS
# will get merged into the corresponding section of log_settings.py.
# Handlers and log levels are set up automatically based on LOG_LEVEL and DEBUG
# unless you set them here.  Messages will not propagate through a logger
# unless propagate: True is set.
LOGGERS = {
   'loggers': {
        'tornado.application': {}, #
        'tornado.access': {},      # enable default logging
        'tornado.general': {},     #
        'server': {
            'level': LOG_LEVEL
        }
    }
}

logconfig.initialize_logging(SYSLOG_TAG, SYSLOG_FACILITY, LOGGERS,
        LOG_LEVEL, USE_SYSLOG)

if options.config:
    tornado.options.parse_config_file(options.config)

if not Path(options.tmp_dir).exists():
    Path(options.tmp_dir).mkdir(parents=True, exist_ok=True)
