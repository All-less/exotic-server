import store from './redux/store';
import {
  fpgaStatus,
  displayError,
  updateOutput,
  updateInput,
  toggleUpload,
  toggleVideo,
  setUploadStatus,
  setButtonStatus,
  setSwitchStatus,
  updateVideoUrl
} from './redux/device';
import { push } from 'react-router-redux';
import { addBullet } from './redux/barrage';

const types = [
    'ACT_ACQUIRE', 
    'ACT_RELEASE', 
    'ACT_BROADCAST', 
    'ACT_AUTH', 
    'ACT_SYNC', 
    'ACT_CHANGE_MODE',
    'STAT_AUTH_SUCC', 
    'STAT_AUTH_FAIL', 
    'STAT_INPUT', 
    'STAT_OUTPUT', 
    'STAT_UPLOADED', 
    'STAT_DOWNLOADED',
    'STAT_PROGRAMMED', 
    'OP_BTN_DOWN', 
    'OP_BTN_UP', 
    'OP_SW_OPEN', 
    'OP_SW_CLOSE', 
    'OP_PROG', 
    'INFO_USER_CHANGED', 
    'INFO_DISCONN', 
    'INFO_BROADCAST',
    'INFO_MODE_CHANGED',
    'INFO_VIDEO_URL'
]

types.forEach((val, index) => {
  /* 
   * note that this statement will be executed 
   * in ES5 environment. 
   */
  eval(`window.${val} = ${index}`);
});

let socket = {};
let device_id = null;

store.subscribe(() => {
  const new_device_id = location.pathname.split('/').pop();
  if (new_device_id !== device_id) {
    device_id = new_device_id;
    reconnect_socket();
  }
});

const reconnect_socket = () => {
  if (!device_id) return
  try {
    if (socket.readyState === WebSocket.OPEN) {
      socket.close();
    }
    socket = new WebSocket(`ws://${location.host}/socket/${device_id}`);
  } catch (e) {
    store.dispatch(displayError('无法连接服务器，请重试'));
    return
  }
  socket.onopen = (event) => {
    remote.sync();
  };
  socket.onmessage = (event) => {
    const data = JSON.parse(event.data);
    switch (data.type) {
      case INFO_USER_CHANGED:
        const state = store.getState();
        const user = state.account.user;
        const occupied = state.device.occupied;
        const acquired = state.device.acquired;
        if (data.user === user) {
          if (!occupied && !acquired) {
            /* user has acquired successfully */
            store.dispatch(fpgaStatus(true, true));
            store.dispatch(displayError('获取控制成功'));
          }
        } else if (data.user === null) {
          if (occupied && acquired) {
            /* user has released successfully */
            store.dispatch(fpgaStatus(false, false));
            store.dispatch(displayError('释放控制成功'));
          } else if (occupied && !acquired) {
            /* other has released */
            store.dispatch(fpgaStatus(false, false));
            store.dispatch(displayError('设备当前空闲'));
          }
        } else { /* data.user is other user */
          if (!occupied) {
            store.dispatch(fpgaStatus(false, true));
            store.dispatch(displayError('设备已被占用'));
          }
        }
        break;
      case INFO_DISCONN:
        store.dispatch(displayError('当前设备已断开连接'));
        setTimeout(() => { store.dispatch(push('/')); }, 1000);
        break;
      case INFO_BROADCAST:
        store.dispatch(addBullet(data.content));
        break;
      case STAT_OUTPUT:
        store.dispatch(updateOutput(data.segs, data.led));
        break;
      case STAT_INPUT:
        store.dispatch(setSwitchStatus(''));
        store.dispatch(setButtonStatus(''));
        store.dispatch(updateInput(data.buttons, data.switches));
        break;
      case STAT_DOWNLOADED:
        store.dispatch(displayError('bit文件已上传成功'));
        store.dispatch(setUploadStatus(''))
        store.dispatch(toggleUpload(true));
        break;
      case STAT_PROGRAMMED:
        store.dispatch(displayError('bit文件烧录成功'));
        break;
      case INFO_MODE_CHANGED:
        if (data.mode === 'video') {
          store.dispatch(toggleVideo(true));
        } else if (data.mode === 'digital') {
          store.dispatch(toggleVideo(false));
        }
        break;
      case INFO_VIDEO_URL:
        delete data.type;
        store.dispatch(updateVideoUrl(data));
        break;
    }
  };
};

const send = (obj) => {
  if (socket.readyState === WebSocket.OPEN) {
    socket.send(JSON.stringify(obj));
  } else {
    store.dispatch(displayError('无法连接服务器，请刷新页面'));
  }
};

const remote = {
  sync: () => {
    send({
      type: ACT_SYNC
    });
  },
  openSwitch: (id) => {
    store.dispatch(setSwitchStatus('数据发送中'));
    send({
      type: OP_SW_OPEN, 
      id
    });
  },
  closeSwitch: (id) => {
    store.dispatch(setSwitchStatus('数据发送中'));
    send({
      type: OP_SW_CLOSE,
      id
    });
  },
  pressButton: (id) => {
    store.dispatch(setButtonStatus('数据发送中'));
    send({
      type: OP_BTN_DOWN,
      id
    });
  },
  releaseButton: (id) => {
    store.dispatch(setButtonStatus('数据发送中'));
    send({
      type: OP_BTN_UP,
      id
    });
  },
  broadcast: (content) => {
    send({
      type: ACT_BROADCAST,
      content
    });
  },
  acquire: () => {
    send({
      type: ACT_ACQUIRE
    });
  },
  release: () => {
    send({
      type: ACT_RELEASE
    });
  },
  fileUploaded: () => {
    send({
      type: STAT_UPLOADED
    });
  },
  program: () => {
    send({
      type: OP_PROG
    });
  },
  changeMode: (mode) => {
    if (mode !== 'video' && mode !== 'digital')
      return
    send({
      type: ACT_CHANGE_MODE,
      mode
    })
  }
};

export default remote;
