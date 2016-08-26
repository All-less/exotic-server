import store from './store';

const TOGGLE_SETTING = 'Exotic/TOGGLE_SETTING';
const PRESS_BTN = 'Exotic/TRY_PRESS_BTN';
const PRESS_BTN_SUCC = 'Exotic/PRESS_BTN_SUCC';
const PRESS_BTN_FAIL = 'Exotic/PRESS_BTN_FAIL';
const RELEASE_BTN = 'Exotic/RELEASE_BTN';
const RELEASE_BTN_SUCC = 'Exotic/RELEASE_BTN_SUCC';
const RELEASE_BTN_FAIL = 'Exotic/RELEASE_BTN_FAIL';
const OPEN_SWITCH = 'Exotic/OPEN_SWITCH';
const OPEN_SWITCH_SUCC = 'Exotic/OPEN_SWITCH_SUCC';
const OPEN_SWITCH_FAIL = 'Exotic/OPEN_SWITCH_FAIL';
const CLOSE_SWITCH = 'Exotic/CLOSE_SWITCH';
const CLOSE_SWITCH_SUCC = 'Exotic/CLOSE_SWITCH_SUCC';
const CLOSE_SWITCH_FAIL = 'Exotic/CLOSE_SWITCH_FAIL';
const FPGA_ACQUIRED = 'Exotic/FPGA_ACQUIRED';
const FPGA_RELEASED = 'Exotic/FPGA_RELEASED';
const SET_UPLOAD_STATUS = 'Exotic/device/SET_UPLOAD_STATUS';
const UPDATE_DEVICES = 'Exotic/UPDATE_DEVICES';
const UPDATE_SOCKET = 'Exotic/device/UPDATE_SOCKET';
const DISPLAY_ERROR = 'Exotic/device/DISPLAY_ERROR';
const SET_ERROR = 'Exotic/device/SET_ERROR';
const CLEAR_ERROR = 'Exotic/device/CLEAR_ERROR';
const UPDATE_OUTPUT = 'Exotic/device/UPDATE_OUTPUT';

const BTN_DOWN = 0;
const BTN_UP = 1;
const BTN_WAIT = 2;
const SW_OFF = 0;
const SW_ON = 1;
const SW_WAIT = 2;

export const state = {
  BTN_DOWN: 0,
  BTN_UP: 1,
  BTN_WAIT: 2,
  SW_OFF: 0,
  SW_ON: 1,
  SW_WAIT: 2
};

const init = {
  buttons: [BTN_UP, BTN_UP, BTN_UP, BTN_UP],
  switches: [SW_OFF, SW_OFF, SW_OFF, SW_OFF],
  setting: false,
  occupied: false,
  uploadStatus: null,
  led: 0x0000,
  segs: Array(8).fill(0)
};

export const toggleSetting = () => ({
  type: TOGGLE_SETTING
});

export const pressButton = (id) => ({
  type: PRESS_BTN,
  id
});

export const pressButtonSucc = (id) => ({
  type: PRESS_BTN_SUCC,
  id
});

export const pressButtonFail = (id) => ({
  type: PRESS_BTN_FAIL,
  id
});

export const releaseButton = (id) => ({
  type: RELEASE_BTN,
  id
});

export const releaseButtonSucc = (id) => ({
  type: RELEASE_BTN_SUCC,
  id
});

export const releaseButtonFail = (id) => ({
  type: RELEASE_BTN_FAIL,
  id
});

export const openSwitch = (id) => ({
  type: OPEN_SWITCH,
  id
});

export const openSwitchSucc = (id) => ({
  type: OPEN_SWITCH_SUCC,
  id
});

export const openSwitchFail = (id) => ({
  type: OPEN_SWITCH_FAIL,
  id
});

export const closeSwitch = (id) => ({
  type: CLOSE_SWITCH,
  id
});

export const closeSwitchSucc = (id) => ({
  type: CLOSE_SWITCH_SUCC,
  id
});

export const closeSwitchFail = (id) => ({
  type: CLOSE_SWITCH_FAIL,
  id
});

export const fpgaAcquired = () => ({
  type: FPGA_ACQUIRED
});

export const fpgaReleased = () => ({
  type: FPGA_RELEASED
});

export const setUploadStatus = (status) => ({
  type: SET_UPLOAD_STATUS,
  status
});

export const updateDevices = (list) => ({
  type: UPDATE_DEVICES,
  list
});

export const updateSocket = (device_id) => ({
  type: UPDATE_SOCKET,
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

export default (state=init, action) => {
  const switches = Array(...state.switches);
  const buttons = Array(...state.buttons);
  switch (action.type) {
  case OPEN_SWITCH:
  case CLOSE_SWITCH:
    switches[action.id] = SW_WAIT;
    return {
      ...state,
      switches
    };
  case OPEN_SWITCH_SUCC:
  case CLOSE_SWITCH_FAIL:
    switches[action.id] = SW_ON;
    return {
      ...state,
      switches
    };
  case OPEN_SWITCH_FAIL:
  case CLOSE_SWITCH_SUCC:
    switches[action.id] = SW_OFF;
    return {
      ...state,
      switches
    };
  case PRESS_BTN:
  case RELEASE_BTN:
    buttons[action.id] = BTN_WAIT;
    return {
      ...state,
      buttons
    };
  case RELEASE_BTN_FAIL:
  case PRESS_BTN_SUCC:
    buttons[action.id] = BTN_DOWN;
    return {
      ...state,
      buttons
    };
  case PRESS_BTN_FAIL:
  case RELEASE_BTN_SUCC:
    buttons[action.id] = BTN_UP;
    return {
      ...state,
      buttons
    };
  case TOGGLE_SETTING:
    return {
      ...state,
      setting: !state.setting 
    };
  case FPGA_ACQUIRED:
    return {
      ...state,
      occupied: true
    };
  case FPGA_RELEASED:
    return {
      ...state,
      occupied: false
    };
  case SET_UPLOAD_STATUS:
    return {
      ...state,
      uploadStatus: action.status
    };
  case UPDATE_DEVICES:
    return {
      ...state,
      list: action.list
    };
  case UPDATE_SOCKET:
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
  default:
    return state;
  }
};
