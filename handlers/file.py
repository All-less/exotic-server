# -*- coding: utf-8 -*- 
import logging
from pathlib import Path

from tornado.options import options
from tornado.web import StaticFileHandler

from handlers.base import BaseHandler

logger = logging.getLogger('server.' + __name__)


class DownloadHandler(StaticFileHandler):
    
    @classmethod
    def get_absolute_path(cls, root, path):
        return str(Path(options.tmp_dir) / path)

    def set_extra_headers(self, path):
        self.set_header('Content-Disposition', 'attachment;')
        self.set_header('Content-Type', 'application/force-download')


class UploadHandler(BaseHandler):
    
    def post(self):
        # self.request.files['file'] stores all files as an array.
        # 'file' is determined by 'name' attribute input element.
        if 'file' in self.request.files and len(self.request.files['file']) > 0:
            file_ = self.request.files['file'][0]
            device_id = self.get_argument('device_id')
            file_name = "{}.bit".format(device_id)
            file_path = Path(options.tmp_dir) / file_name
            with file_path.open('wb') as f:
                f.write(file_['body'])
            logger.info('File saved to {}.'.format(file_path))

