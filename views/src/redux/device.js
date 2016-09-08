import { push } from 'react-router-redux';

import store from './store';

const TOGGLE_SETTING = 'Exotic/TOGGLE_SETTING';
const FPGA_STATUS = 'Exotic/FPGA_STATUS';
const SET_UPLOAD_STATUS = 'Exotic/device/SET_UPLOAD_STATUS';
const SET_BUTTON_STATUS = 'Exotic/device/SET_BUTTON_STATUS';
const SET_SWITCH_STATUS = 'Exotic/device/SET_SWITCH_STATUS';
const UPDATE_DEVICES = 'Exotic/UPDATE_DEVICES';
const GOTO_DEVICE = 'Exotic/device/GOTO_DEVICE';
const DISPLAY_ERROR = 'Exotic/device/DISPLAY_ERROR';
const SET_ERROR = 'Exotic/device/SET_ERROR';
const CLEAR_ERROR = 'Exotic/device/CLEAR_ERROR';
const UPDATE_OUTPUT = 'Exotic/device/UPDATE_OUTPUT';
const UPDATE_INPUT = 'Exotic/device/UPDATE_INPUT';
const TOGGLE_VIDEO = 'Exotic/device/TOGGLE_VIDEO';
const TOGGLE_UPLOAD = 'Exotic/device/TOGGLE_UPLOAD';
const UPDATE_VIDEO_URL = 'Exotic/device/UPDATE_VIDEO_URL';

const init = {
  setting: false,
  occupied: false,
  acquired: false,
  uploadStatus: null,
  videoSim: false,
  buttons: 0x0,
  switches: 0x0,
  led: 0x0000,
  segs: Array(8).fill(0)
};

export const toggleSetting = () => ({
  type: TOGGLE_SETTING
});

export const toggleUpload = (uploaded) => ({
  type: TOGGLE_UPLOAD,
  uploaded
});

export const fpgaStatus = (acquired, occupied) => ({
  type: FPGA_STATUS,
  occupied,
  acquired
});

export const setUploadStatus = (status) => ({
  type: SET_UPLOAD_STATUS,
  status
});

export const setButtonStatus = (status) => ({
  type: SET_BUTTON_STATUS,
  status
});

export const setSwitchStatus = (status) => ({
  type: SET_SWITCH_STATUS,
  status
});

export const updateDevices = (list) => ({
  type: UPDATE_DEVICES,
  list
});

export const gotoDevice = (device_id) => ({
  type: GOTO_DEVICE,
  device_id
});

export const displayError = (error) => ({
  type: DISPLAY_ERROR,
  error
});

const setError = (error) => ({
  type: SET_ERROR,
  error
});

const clearError = () => ({
  type: CLEAR_ERROR
});

export const updateOutput = (segs, led) => ({
  type: UPDATE_OUTPUT,
  segs, 
  led
});

export const updateInput = (buttons, switches) => ({
  type: UPDATE_INPUT,
  buttons,
  switches
});

export const toggleVideo = (toggle) => ({
  type: TOGGLE_VIDEO,
  toggle
});

export const updateVideoUrl = (data) => ({
  type: UPDATE_VIDEO_URL,
  ...data
});

export default (state=init, action) => {
  switch (action.type) {
  case TOGGLE_SETTING:
    return {
      ...state,
      setting: !state.setting 
    };
  case FPGA_STATUS:
    return {
      ...state,
      occupied: action.occupied,
      acquired: action.acquired
    };
  case SET_UPLOAD_STATUS:
    return {
      ...state,
      uploadStatus: action.status
    };
  case SET_BUTTON_STATUS:
    return {
      ...state,
      buttonStatus: action.status
    };
  case SET_SWITCH_STATUS:
    return {
      ...state,
      switchStatus: action.status
    };
  case UPDATE_DEVICES:
    return {
      ...state,
      list: action.list
    };
  case GOTO_DEVICE:
    setTimeout(() => { 
      store.dispatch(push(`/device/${action.device_id}`));
    }, 0);
    return {
      ...state,
      device_id: action.device_id
    };
  case DISPLAY_ERROR:
    setTimeout(() => {
      store.dispatch(setError(action.error));
    }, 50);
    if (state.errorTimeout) { /* previous error has not been cleared */
      clearTimeout(state.errorTimeout);
    }
    return {
      ...state,
      error: null,  /* clear previous error message */
      errorTimeout: null
    };
  case SET_ERROR:
    return {
      ...state,
      error: action.error,
      errorTimeout: setTimeout(() => { store.dispatch(clearError()); }, 10000)
    };
  case CLEAR_ERROR:
    return {
      ...state,
      error: null,
      errorTimeout: null
    };
  case UPDATE_OUTPUT:
    return {
      ...state,
      led: action.led,
      segs: action.segs
    };
  case UPDATE_INPUT:
    return {
      ...state,
      buttons: action.buttons,
      switches: action.switches
    };
  case TOGGLE_VIDEO:
    return {
      ...state,
      videoSim: action.toggle === undefined ? !state.videoSim : action.toggle
    };
  case TOGGLE_UPLOAD:
    return {
      ...state,
      uploaded: action.uploaded
    };
  case UPDATE_VIDEO_URL:
    return {
      ...state,
      live_host: action.live_host,
      rtmp_port: action.rtmp_port,
      rtmp_app: action.rtmp_app,
      hls_path: action.hls_path,
      stream_key: action.stream_key
    };
  default:
    return state;
  }
};
