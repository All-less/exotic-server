import React from 'react';
import { connect } from 'react-redux';
import classNames from 'classnames';

import remote from '../../socket';
import style from './style';

@connect(
  (state) => ({
    switches: state.device.switches,
    acquired: state.device.acquired,
    status: state.device.switchStatus
  })
)
class Switches extends React.Component {

  render() {
    const { switches, acquired } = this.props;
    const status = Array(4).fill(0).map(
      (e, i) => ((switches & Math.pow(2, i)) >> i)
    );
    return (
      <div>
        <p style={{color: acquired ? '#fff' : '#777' }}>虚拟开关 <span id="status">{this.props.status}</span></p>
        <div id="switch_contain">
          {
            Array(4).fill(0).map((e, i) => (
              <div key={i} className={style.switch_border}
                   onClick={!acquired ? null : 
                            status[i] ? remote.closeSwitch.bind(undefined, i) :
                                        remote.openSwitch.bind(undefined, i)}
                   style={{borderColor: acquired ? '#fff' : '#777' }}>
                {/* below div's are separated for CSS animation */}
                {
                  !!status[i] &&
                    <div className={classNames(style.switch, style.switch_up)}
                         style={{backgroundColor: acquired ? '#fff' : '#777'}} />
                }
                {
                  !!status[i] ||
                    <div className={classNames(style.switch, style.switch_down)}
                         style={{backgroundColor: acquired ? '#fff' : '#777'}} />
                }
              </div>
            ))
          }
        </div>
      </div>
    );
  }
}

export default Switches;
