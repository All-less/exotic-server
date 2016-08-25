import React from 'react';
import { connect } from 'react-redux';

import Header from '../Header';
import Panel from '../Panel';
import Simulation from '../Simulation';
import Message from '../Message';

import './reset';
import style from './style';

@connect(
  (state) => ({
    error: state.device.error
  })
)
class DevicePage extends React.Component {
  render() {
    return (
      <div>
        <Header />
        { this.props.error && <Message /> }
        <div id="main">
          <Panel />
          <Simulation />
        </div>
      </div>
    );
  }
}

export default DevicePage;
