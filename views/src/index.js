import 'babel-polyfill';
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { Router, Route, IndexRoute, browserHistory } from 'react-router';
import { ReduxAsyncConnect } from 'redux-connect';
import { syncHistoryWithStore } from 'react-router-redux';
import is from 'is_js';

import store from './redux/store';
import remote from './socket';
import { displayError } from './redux/device';

import App from './components/App';
import IndexPage from './components/IndexPage';
import DevicePage from './components/DevicePage';

const history = syncHistoryWithStore(browserHistory, store);

const checkFlash = () => {
  if (!is.safari()) {
    const swfobject = require('swfobject');
    const version = swfobject.getFlashPlayerVersion().major;
    if (!(version && version > 0)) {
      store.dispatch(displayError('未检测到Flash插件，视频反馈模式将无法使用。'));
    }
  }
};

const routes = (
  <Provider store={store}>
    <Router history={history}
            render={(props) => (<ReduxAsyncConnect {...props}/>)} >
      <Route path="/" component={App} >
        <IndexRoute component={IndexPage} />
        <Route path="/device/:id" component={DevicePage} onEnter={checkFlash} />
      </Route>
    </Router>
  </Provider>
);

ReactDOM.render(
  routes,
  document.getElementById('react-root')
);
