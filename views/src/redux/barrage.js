import _ from 'lodash';
import store from './store';

const UPDATE_BARRAGE = 'Exotic/barrage/UPDATE_BARRAGE';
const ADD_BULLET = 'Exotic/barrage/ADD_BULLET';

const initialState = {
  bullets: []
};

const fontSize = 24;
const initialLeft = 540;  /* Initial position of a bullet comment */
const interval = 20;      /* Minimal interval between two comments on a row */

const channels = Array(18).fill(0).map((e, i) => ({
  speed: 0, /* 0 indicates that channel is open for next comment */
  left: initialLeft,
  width: 0, /* width of the previous comment */
  top: 25 * i
}));

export const addBullet = (content) => ({
  type: ADD_BULLET,
  content
});

export const updateBarrage = () => ({
  type: UPDATE_BARRAGE
});

export default (state=initialState, action) => {
  switch (action.type) {
    case ADD_BULLET:
      let index = _.findIndex(channels, (e) => (!e.speed));
      if (index < 1) { /* no channel available */
        let min = Number.MAX_SAFE_INTEGER;
        for (let i = 0; i < channels.length; i++) {
          if (channels[i].left + channels[i].width < min)
            index = i;
        }
      }
      let bullet = {
        content: action.content,
        top: channels[index].top,
        left: initialLeft,
        width: action.content.length * fontSize,
        speed: action.content.length / 100 + 1.8
      };
      channels[index] = {...bullet};
      state.bullets.push(bullet);
      requestAnimationFrame(() => { 
        store.dispatch(updateBarrage()); 
      });
      return state;
    case UPDATE_BARRAGE:
      channels.forEach((e) => { 
        e.left -= e.speed; 
        if (e.left + e.width + interval < initialLeft) {
          e.speed = 0;
        }
      });
      state.bullets.forEach((e) => { e.left -= e.speed; });
      const bullets = state.bullets.filter(
        (e) => ( e.left + e.width > 0 ));
      if (bullets.length > 0) {
        requestAnimationFrame(() => { 
          store.dispatch(updateBarrage()); 
        });
      }
      return {
        ...state,
        bullets
      };
    default:
      return state;
  }
};
