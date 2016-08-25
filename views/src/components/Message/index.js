import React from 'react';
import { connect } from 'react-redux';

import style from './style';

@connect(
  (state) => ({
    error: state.device.error
  })
)
class Message extends React.Component {

  render() {
    return (
      <div className={style.container}>
        <span className={style.content}>
          <i className="fa fa-exclamation-triangle" aria-hidden="true"/>
          {"  " + this.props.error}
        </span>
      </div>
    );
  }
}

export default Message;
