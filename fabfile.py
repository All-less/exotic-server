# -*- coding: utf-8 -*-
from fabric.api import sudo, run, cd, local, put, get
from fabric.contrib.files import exists


def stop_site():
    sudo('service nginx stop')
    sudo('supervisorctl stop exotic_server:*')
    sudo('supervisorctl stop exotic_proxy:*')

def start_site():
    sudo('supervisorctl start exotic_proxy:*')
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

def deploy():
    stop_site()
    with cd('/var/www/exotic-server'):
        run('git checkout .')
        run('git pull')
    with cd('/var/www/exotic-server/views'):
        run('/home/exotic/.nvm/versions/node/v6.2.0/bin/node '
            '/home/exotic/.nvm/versions/node/v6.2.0/lib/node_modules/npm '
            'run build')
    start_site()

def backup_config():
    get('/etc/nginx/nginx.conf', '/tmp/exotic-server', use_sudo=True)
    get('/etc/supervisor/conf.d/exotic.conf', '/tmp/exotic-server', use_sudo=True)
