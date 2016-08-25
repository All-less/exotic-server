import React from 'react';

import FpgaSimulation from '../FpgaSimulation';
import Barrage from '../Barrage';
import style from './style';

class Simulation extends React.Component {

  render() {
    return (
      <div className={style.right}>
        <div className={style.border}>
          <FpgaSimulation />
          <Barrage />
        </div>
      </div>
    );
  }
}

export default Simulation;
