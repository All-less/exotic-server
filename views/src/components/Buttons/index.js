import React from 'react';
import { connect } from 'react-redux';
import classNames from 'classnames';

import remote from '../../socket'; 
import style from './style';

@connect(
  (state) => ({
    acquired: state.device.acquired,
    buttons: state.device.buttons,
    status: state.device.buttonStatus
  })
)
class Buttons extends React.Component {

  render() {
    const { buttons, acquired } = this.props;
    const status = Array(4).fill(0).map(
      (e, i) => ((buttons & Math.pow(2, i)) >> i)
    );
    return (
      <div>
        <p style={{color: acquired ? '#fff' : '#777' }}>虚拟按钮 <span id="status">{this.props.status}</span></p>
        <div id="button_contain">
          {
            Array(4).fill(0).map((e, i) => (
              <div key={i} className={style.button_border}
                   onClick={
                     !acquired ? null :
                     status[i] ? remote.releaseButton.bind(undefined, i) :
                                 remote.pressButton.bind(undefined, i)
                   }
                   style={{borderColor: acquired ? '#fff' : '#777' }}>
                {
                  !!status[i] && 
                    <div className={classNames(style.button, style.button_down)}
                         style={{backgroundColor: acquired ? '#fff' : '#777'}}/>
                }
                {
                  !!status[i] || 
                    <div className={classNames(style.button, style.button_up)}
                         style={{backgroundColor: acquired ? '#fff' : '#777'}}/>
                }
              </div>
            ))
          }
        </div>
      </div>
    );
  }
}

export default Buttons;
