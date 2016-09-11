import React from 'react';
import { connect } from 'react-redux';
import QueueAnim from 'rc-queue-anim';

import Buttons from './Buttons';
import Switches from './Switches';
import Upload from './Upload';
import KeyStroke from './KeyStroke';
import Comment from './Comment';
import Setting from './Setting';

@connect(
  (state) => ({
    setting: state.device.setting
  })
)
class Panel extends React.Component {
  render() {
    return (
      <div id="left">
        { !this.props.setting ?
            <div id="left_contain">
              <QueueAnim type="bottom">
                <Buttons key="buttons"/>
                <Switches key="switches"/>
                <Upload key="upload"/>
                <Comment key="comment"/>
                {/*
                <KeyStroke />
                */}
             </QueueAnim>
            </div>
          :
            <div id="left_contain">
              <Setting />
            </div>
        }
      </div>
    );
  }
}

export default Panel;
