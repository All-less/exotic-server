import React from 'react';
import { connect } from 'react-redux';
import classNames from 'classnames';

import store from '../../redux/store';
import remote from '../../socket';
import style from './style';
import { 
  toggleSetting, fpgaStatus, gotoDevice 
} from '../../redux/device';

@connect(
  (state) => ({
    device_list: state.device.list,
    videoSim: state.device.videoSim,
    device_id: state.device.device_id,
    acquired: state.device.acquired
  }),
  {
    toggleSetting, fpgaStatus, gotoDevice
  }
)
class Setting extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      videoSim: props.videoSim,
      device_id: props.device_id
    };
    this.handleConfirm = this.handleConfirm.bind(this);
    this.handleSelect = this.handleSelect.bind(this);
    this.toggleVideo = this.toggleVideo.bind(this);
  }

  handleSelect() {
    this.setState({device_id: this.refs.select.value});
  }

  toggleVideo() {
    this.setState({videoSim: !this.state.videoSim});
  }

  handleConfirm() {
    if (this.state.videoSim !== this.props.videoSim) {
      remote.changeMode(this.state.videoSim ? 'video' : 'digital');
    }
    if (this.props.device_id !== this.state.device_id) {
      this.props.fpgaStatus(false, false);
      this.props.gotoDevice(this.state.device_id);
    }
    this.props.toggleSetting();
  }

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
        {
          this.props.acquired && 
            <div>
              <p className={style.title}>反馈方式</p>
              <div className={style.item}>
                <div className={style.button_border} onClick={this.state.videoSim ? this.toggleVideo : undefined}>
                  <div className={classNames(style.button, {[`${style.button_chosen}`]: !this.state.videoSim})}></div>
                </div>
                <div className={style.option}>模拟输出</div>
              </div>
              <div className={style.item}>
                <div className={style.button_border} onClick={this.state.videoSim ? undefined : this.toggleVideo}>
                  <div className={classNames(style.button, {[`${style.button_chosen}`]: this.state.videoSim})}></div>
                </div>
                <div className={style.option}>视频直播</div>
              </div>
            </div>
        }
        <p className={style.title}>切换设备</p>
        <div className={style.device_wrapper}>
          <select name="device" className={style.device_selector} ref="select" onChange={this.handleSelect}
                  defaultValue={this.props.device_id}>
          { 
            this.props.device_list.map((e, i) => (
              <option value={e} key={i}>{e}</option>
            ))
          }
          </select>
        </div>
        <div className={style.button_wrapper}>
          <ul className={style.buttons}>
            <li className="click_button" onClick={this.handleConfirm}>确认</li>
            <li className="click_button" onClick={this.props.toggleSetting}>取消</li>
          </ul>
        </div>
      </div>
    );
  }
}

export default Setting;
