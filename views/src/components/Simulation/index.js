import React from 'react';

import FpgaSimulation from '../FpgaSimulation';
import VideoSimulation, { init as initVideo } from '../VideoSimulation';
import Barrage from '../Barrage';
import style from './style';

class Simulation extends React.Component {

  render() {
    return (
      <div className={style.right}>
        <div className={style.border}>
          {/* 
          <FpgaSimulation /> 
          */}
          <VideoSimulation onScriptLoaded={initVideo}/>
          <Barrage />
        </div>
      </div>
    );
  }
}

export default Simulation;
