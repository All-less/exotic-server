import React from 'react';
import { connect } from 'react-redux';
import { Navbar, Nav, NavItem, NavDropdown, MenuItem } from 'react-bootstrap';

import { toggleSetting } from '../../redux/device';
import { logout } from '../../redux/account';
import style from './style';
import remote from '../../socket';

@connect(
  (state) => ({
    occupied: state.device.occupied,
    acquired: state.device.acquired
  }),
  {
    toggleSetting, logout
  }
)
class Header extends React.Component {

  handleLogout() {
    if (this.props.acquired) {
      remote.release();
    }
    this.props.logout();
  }

  render() {
    return (
      <header className={style.wrapper}>
        <svg className={style.logo}>
          <path className={style.path} d="M2.26 18.34L2.26 0.77L14.35 0.77L14.35 2.64L4.54 2.64L4.54 8.33L13.99 8.33L13.99 10.39L4.54 10.39L4.54 16.25L14.74 16.25L14.74 18.34L2.26 18.34L2.26 18.34ZM23.26 18.34L29.47 9.46L23.81 0.77L26.64 0.77L30.98 7.56L35.35 0.77L38.18 0.77L32.33 9.46L38.54 18.34L35.52 18.34L30.98 11.35L26.28 18.34L23.26 18.34L23.26 18.34ZM46.30 8.88Q46.30 8.47 46.34 8.05Q46.39 7.63 46.49 7.20Q47.04 4.73 49.16 2.65Q51.29 0.58 54.82 0.58Q55.25 0.58 55.68 0.61Q56.11 0.65 56.54 0.74Q59.02 1.20 61.10 3.25Q63.19 5.30 63.31 9.65Q63.31 13.34 61.04 16.12Q58.78 18.89 54.24 18.89Q50.28 18.89 48.29 16.08Q46.30 13.27 46.30 8.88L46.30 8.88M48.58 10.03Q48.62 10.61 48.74 11.30Q48.86 12.00 49.13 12.72Q49.63 14.16 50.81 15.40Q51.98 16.63 54.24 16.82Q54.41 16.85 54.56 16.86Q54.72 16.87 54.89 16.87Q57.26 16.87 59.14 14.84Q61.01 12.82 60.86 8.69Q60.72 6.29 59.11 4.46Q57.50 2.64 54.82 2.64Q54.50 2.64 54.19 2.68Q53.88 2.71 53.57 2.78Q51.70 3.17 50.14 4.90Q48.58 6.62 48.58 10.03L48.58 10.03ZM76.94 18.34L76.94 2.64L71.09 2.64L71.09 0.77L84.89 0.77L84.89 2.64L79.39 2.64L79.39 18.34L76.94 18.34L76.94 18.34ZM93.94 18.34L93.94 0.77L96.22 0.77L96.22 18.34L93.94 18.34L93.94 18.34ZM105.86 9.84Q105.89 9.34 105.95 8.82Q106.01 8.30 106.10 7.78Q106.58 5.21 108.31 3.01Q110.04 0.82 113.81 0.58Q114.41 0.58 115.18 0.71Q115.94 0.84 116.76 1.18Q118.01 1.73 119.14 2.95Q120.26 4.18 120.79 6.43L118.34 6.43Q117.82 4.51 116.56 3.58Q115.30 2.64 113.86 2.64Q113.76 2.64 113.68 2.64Q113.59 2.64 113.52 2.66Q111.62 2.81 110.03 4.52Q108.43 6.24 108.34 9.46Q108.34 13.32 109.94 15.04Q111.55 16.75 113.47 16.78Q113.50 16.78 113.51 16.78Q113.52 16.78 113.54 16.78Q115.42 16.78 117 15.44Q118.58 14.11 118.73 11.90L121.18 11.90Q121.13 12.22 121.07 12.54Q121.01 12.86 120.91 13.20Q120.29 15.34 118.50 17.11Q116.71 18.89 114 18.89Q109.90 19.01 107.88 16.26Q105.86 13.51 105.86 9.84L105.86 9.84Z"/>
        </svg>
        <ul className={style.nav}>
          <li><a onClick={this.props.toggleSetting}>设置</a></li>
          <li>
            <a onClick={this.props.acquired ? remote.release :
                        this.props.occupied ? null : remote.acquire}>
             { this.props.acquired ? '释放控制' :
               this.props.occupied ? '已被占用' :'获取控制' }
            </a>
          </li>
          <li><a onClick={this.handleLogout.bind(this)}>注销登录</a></li>
          <li><a href="#">使用帮助</a></li>
        </ul>
      </header>
    );
  }
}

export default Header;
