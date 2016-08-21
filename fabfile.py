# -*- coding: utf-8 -*-
from fabric.api import sudo, cd, local, put, shell_env
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
    put('config.py', '/var/www/exotic-server', use_sudo=True)

def deploy():
    stop_site()
    with cd('/var/www/exotic-server'):
        sudo('git pull')
    with cd('/var/www/exotic-server/views'):
        sudo('npm run build')
    put_config_files()
    start_site()

