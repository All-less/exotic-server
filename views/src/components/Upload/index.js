import React from 'react';
import { connect } from 'react-redux';

import { setUploadStatus, displayError } from '../../redux/device';
import remote from '../../socket';
import style from './style';

@connect(
  (state) => ({
    acquired: state.device.acquired,
    status: state.device.uploadStatus,
    device_id: state.device.device_id,
    uploaded: state.device.uploaded
  }),
  {
    setUploadStatus, displayError
  }
)
class Upload extends React.Component {

  state = {
    file: null
  };

  handleChange = (e) => {
    this.setState({file: e.target.files[0]});
  };

  handleUpload = () => {
    if (!this.state.file) {
      this.props.displayError('请选择文件');
      return;
    }

    const formData = new FormData();
    formData.append('file', this.refs.inputFile.files[0]);
    formData.append('filetype', 'bit');
    formData.append('device_id', this.props.device_id);

    const req = new XMLHttpRequest();
    req.addEventListener("abort", this.props.setUploadStatus.bind(null, '上传失败'));
    req.addEventListener("error", this.props.setUploadStatus.bind(null, '上传失败'));
    req.addEventListener("loadend", () => {
      this.props.setUploadStatus('正在传输');
      remote.fileUploaded();
    });
    req.addEventListener("loadstart", this.props.setUploadStatus.bind(null, '正在上传'));
    req.open('post', '/api/upload');
    req.send(formData);
  };

  handleProgram = () => {
    if (!this.props.uploaded) {
      this.props.displayError('您尚未上传bit文件或正在上传中。');
    } else {
      remote.program();
    }
  }

  render() {
    const color = this.props.acquired ? '#fff' : '#777';
    return (
      <div>
        <p style={{color: color}}>Bit 文件 <span id="status">{this.props.status}</span></p>
        <div id="bitfile_contain">
          <ul id="about_file">
            <li id="path_for_file" style={{color: color, borderColor: color}}>
              {(this.state.file && this.state.file.name) || null}
            </li>
            <li id="file_input" style={{backgroundColor: color, borderColor: color}}>
              <input type="file" 
                     id="input_file" 
                     ref="inputFile"
                     onChange={this.handleChange} />
              <span id="file_hint">···</span>
            </li>
          </ul>
          <ul id="about_button">
            <li id="upload" className="click_button" onClick={this.handleUpload}
                style={{
                  backgroundColor: color,
                  borderColor: color
                }}>上传</li>
            <li id="program" className="click_button" onClick={this.handleProgram}
                style={{
                  backgroundColor: color,
                  borderColor: color
                }}>烧录</li>
          </ul>
        </div>
      </div>
    );
  }
}

export default Upload;
