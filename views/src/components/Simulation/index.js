import React from 'react';
import { connect } from 'react-redux';

import SvgSimulation from '../SvgSimulation';
import VideoSimulation, { init as initVideo } from '../VideoSimulation';
import Barrage from '../Barrage';
import style from './style';

@connect(
  (state) => ({
    videoSim: state.device.videoSim
  })
)
class Simulation extends React.Component {

  render() {
    return (
      <div className={style.right}>
        <div className={style.border}>
          {
            this.props.videoSim 
              ? <VideoSimulation onScriptLoaded={initVideo}/> 
              : <SvgSimulation /> 
          }
          <Barrage />
        </div>
      </div>
    );
  }
}

export default Simulation;
