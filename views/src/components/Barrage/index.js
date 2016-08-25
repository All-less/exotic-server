import React from 'react';
import { connect } from 'react-redux';

import { addBullet } from '../../redux/barrage';
import style from './style';

@connect(
  (state) => ({
    bullets: state.barrage.bullets
  })
)
class Barrage extends React.Component {

  render() {
    return (
      <div className={style.container}>
        {
          this.props.bullets.map((e, i) => (
            <p key={i} className={style.bullet}
               style={{left: e.left, top: e.top}}>{e.content}</p>
          ))
        }
      </div>
    );
  }
}

export default Barrage;
