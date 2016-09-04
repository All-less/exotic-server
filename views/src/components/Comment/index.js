import React from 'react';
import { connect } from 'react-redux';

import { displayError } from '../../redux/device';
import remote from '../../socket';
import style from './style';

@connect(
  f => f,
  {
    displayError
  }
)
class Comment extends React.Component {

  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
    this.handleKey = this.handleKey.bind(this);
  }

  handleClick() {
    const content = this.refs.comment.value;
    if (content.length > 120) 
      this.props.displayError('评论内容不得长于120字符。');
    else if (content.length <= 0)
      this.props.displayError('请输入评论内容。');
    else
      remote.broadcast(content);
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
                   onKeyDown={this.handleKey}/>
          </div>
          <div className={style.biu} onClick={this.handleClick}>发送</div>
        </div>
      </div>
    );
  }
}

export default Comment;
