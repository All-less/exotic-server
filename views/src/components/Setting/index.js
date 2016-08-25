import React from 'react';
import { connect } from 'react-redux';

import style from './style';

@connect(
  (state) => ({
    device_list: state.device.list
  })
)
class Setting extends React.Component {
  render() {
    return (
      <div>
       {/*
        <p className={style.title}>Input using</p>
        <div className={style.item}>
          <div className={style.button_border}>
            <div className={style.button}></div>
          </div>
          <div className={style.option}>buttons & switches</div>
        </div>
        <div className={style.item}>
          <div className={style.button_border}>
            <div className={`${style.button} ${style.button_chosen}`}></div>
          </div>
          <div className={style.option}>script input</div>
        </div>
        <p className={style.title}>Key-stroke should be</p>
        <div className={style.item}>
          <div className={style.button_border}>
            <div className={style.button}></div>
          </div>
          <div className={style.option}>read and simulated</div>
        </div>
        <div className={style.item}>
          <div className={style.button_border}>
            <div className={style.button}></div>
          </div>
          <div className={style.option}>ignored</div>
        </div>
        */}
        <p className={style.title}>切换设备</p>
        <div className={style.device_wrapper}>
          <select name="device" className={style.device_selector}>
          { 
            this.props.device_list.map((e, i) => (
              <option value={i}>{e}</option>
            ))
          }
          </select>
        </div>
        <div className={style.button_wrapper}>
          <ul className={style.buttons}>
            <li className="click_button">确认</li>
            <li className="click_button">取消</li>
          </ul>
        </div>
      </div>
    );
  }
}

export default Setting;
