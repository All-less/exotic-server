import React from 'react';
import scriptLoader from 'react-async-script-loader'

import style from './style';

export const init = () => {
  jwplayer('mediaspace').setup({
    sources: [
      {file: `rtmp://${location.hostname}/rtmp/live`},
      {file: `http://${location.hostname}/hls/live.m3u8`}
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

  render() {
    return (
      <div className={style.media} id="mediaspace">
        <video src={`http://${location.hostname}/hls/live.m3u8`}
               width="550" height="450" autoPlay controls></video>
      </div>
    );
  }
}

export default VideoSimulation;
