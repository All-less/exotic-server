import React from 'react';
import remote from '../../socket';

import style from './style';


class Comment extends React.Component {

  handleClick() {
    remote.broadcast(this.refs.comment.value);
    this.refs.comment.value = ''
  }

  handleKey(event) {
    if (event.keyCode === 13)
      this.handleClick();
  }

  render() {
    return (
      <div id="div_discuss">
        <p>讨论</p>
        <div className={style.discuss_contain}>
          <div className={style.text}>
            <input ref="comment" type="text" className={style.input_biu} 
                   onKeyDown={this.handleKey.bind(this)}/>
          </div>
          <div className={style.biu} onClick={this.handleClick.bind(this)}>发送</div>
        </div>
      </div>
    );
  }
}

export default Comment;
