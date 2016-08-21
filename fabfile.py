# -*- coding: utf-8 -*-
from fabric.api import sudo, cd, local
from fabric.contrib.files import exists


def stop_site():
    sudo('service nginx stop')
    sudo('supervisorctl stop exotic_server:*')

def start_site():
    sudo('supervisorctl start exotic_server:*')
    sudo('service nginx start')

def commit(message='', push='n'):
    """
    Usage:

        $ fab commit:message='commit message and escaping comma\, this way',push=n
    """
    local("git add . && git commit -m '{}'".format(message))
    if push == 'y':
        local("git push")

def put_config_files():
    pass

def deploy():
    stop_site()
    with cd('/var/opt/exotic-server'):
        sudo('git pull')
    with cd('/var/www/exotic-server/views'):
        sudo('proxychains npm install')
        sudo('npm run build')
    start_site()

