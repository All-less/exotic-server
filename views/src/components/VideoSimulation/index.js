import React from 'react';
import scriptLoader from 'react-async-script-loader'

import style from './style';
import store from '../../redux/store';
import { displayError } from '../../redux/device';

export const init = () => {
  const player = jwplayer('mediaspace');
  const {
    live_host, rtmp_port, rtmp_app, stream_key, hls_path
  } = store.getState().device;

  if (!(rtmp_host && rtmp_port && rtmp_app && stream_key && hls_path)) {
    store.dispatch(displayError('获取视频信息错误，请刷新重试'));
    return
  }
  player.setup({
    sources: [
      {file: `rtmp://${live_host}:${rtmp_port}/${rtmp_app}/${stream_key}`},
      {file: `http://${live_host}/${hls_path}/${stream_key}.m3u8`}
    ],
    height: 450,
    width: 550,
    rtmp: {
      bufferlength: 0.1
    },
    primary: "flash"
  });
};

@scriptLoader(
  '/static/vendor/jwplayer.js'
)
class VideoSimulation extends React.Component {

  componentWillUnmount() {
    jwplayer('mediaspace').remove()
  }

  render() {
    return (
      <div className={style.media} id="mediaspace">
        {/*
        <video src={`http://${location.hostname}/hls/live.m3u8`}
               width="550" height="450" autoPlay controls></video>
        */}
      </div>
    );
  }
}

export default VideoSimulation;
