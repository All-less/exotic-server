# -*- coding: utf-8 -*-
from pathlib import Path

from fabric.api import sudo, run, cd, local, put, get, warn
from fabric.contrib.files import exists


def stop():
    sudo('service nginx stop')
    sudo('supervisorctl stop exotic_server:*')
    sudo('supervisorctl stop exotic_proxy:*')

def start():
    sudo('supervisorctl start exotic_proxy:*')
    sudo('supervisorctl start exotic_server:*')
    sudo('service nginx start')

def restart():
    stop()
    start()

def commit(message='', push='n'):
    """
    Usage:
        $ fab commit:message='commit message and escaping comma\, this way',push=n
    """
    local("git add . && git commit -m '{}'".format(message))
    if push == 'y':
        local("git push")

def deploy():
    stop()
    with cd('/var/www/exotic-server'):
        run('git checkout .')
        run('git pull')
    with cd('/var/www/exotic-server/views'):
        run('/home/exotic/.nvm/versions/node/v6.2.0/bin/node '
            '/home/exotic/.nvm/versions/node/v6.2.0/lib/node_modules/npm '
            'run build')
    start()

def backup_config():
    tmp_dir = Path('/tmp/exotic-server/')
    if not tmp_dir.exists():
        tmp_dir.mkdir(parents=True)
        warn('Create path /tmp/exotic-server/')
    get('/etc/nginx/nginx.conf', '/tmp/exotic-server/nginx.conf', use_sudo=True)
    get('/etc/supervisor/conf.d/exotic.conf', '/tmp/exotic-server/exotic.conf', use_sudo=True)
