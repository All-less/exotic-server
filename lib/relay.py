#!env/bin/python
# -*- coding: utf-8 -*-
import argparse

import zmq


def start_relay(in_port, out_port):
    ctx = zmq.Context.instance()
    inlet = ctx.socket(zmq.XSUB)
    inlet.bind('tcp://*:{}'.format(in_port))
    outlet = ctx.socket(zmq.XPUB)
    outlet.bind('tcp://*:{}'.format(out_port))

    try:
        zmq.proxy(inlet, outlet)
    except:
        pass


def main():
    parser = argparse.ArgumentParser(description='Message relay for instant \
                                     messaging between users and rpi.')

    parser.add_argument('-i', '--in-port', type=int, default=7070,
                        help='Input port of the queue.')
    parser.add_argument('-o', '--out-port', type=int, default=7071,
                        help='Output port of the queue.')

    args = parser.parse_args()
    print('Start message relay [*:{}] -> [*:{}]'.format(
          args.in_port, args.out_port))
    start_relay(args.in_port, args.out_port)

    
if __name__ == '__main__':
    main()
