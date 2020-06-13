import React, {Component} from "react";
import PropTypes from "prop-types";

import {dataURItoBlob, shouldRender} from "../../../utils/utils";

function addNameToDataURL(dataURL, name) {
  return dataURL.replace(";base64", `;name=${encodeURIComponent(name)};base64`);
}

function processFile(file) {
  const {name, size, type} = file;
  return new Promise((resolve, reject) => {
    const reader = new window.FileReader();
    reader.onerror = reject;
    reader.onload = event => {
      resolve({
        dataURL: addNameToDataURL(event.target.result, name),
        name,
        size,
        type,
      });
    };
    reader.readAsDataURL(file);
  });
}

function processFiles(files) {
  return Promise.all([].map.call(files, processFile));
}

function FilesInfo(props) {
  const {filesInfo} = props;
  if (filesInfo.length === 0) {
    return null;
  }
  return (
    <ul className="file-info">
      {filesInfo.map((fileInfo, key) => {
        const {name, size, type} = fileInfo;
        return (
          <li key={key}>
            <strong>{name}</strong> ({type}, {size} bytes)
          </li>
        );
      })}
    </ul>
  );
}

function extractFileInfo(dataURLs) {
  return dataURLs
    .filter(dataURL => typeof dataURL !== "undefined")
    .map(dataURL => {
      const {blob, name} = dataURItoBlob(dataURL);
      return {
        name: name,
        size: blob.size,
        type: blob.type,
      };
    });
}

class ProfilePictureFileWidget extends Component {
  constructor(props) {
    super(props);
    const {value} = props;

    const values = Array.isArray(value) ? value : [value];
    this.state = {values, filesInfo: extractFileInfo(values)};
  }

  shouldComponentUpdate(nextProps, nextState) {
    return shouldRender(this, nextProps, nextState);
  }

  onChange(event) {
    const {multiple, onChange} = this.props;
    processFiles(event.target.files).then(filesInfo => {
      const state = {
        values: filesInfo.map(fileInfo => fileInfo.dataURL),
        filesInfo,
      };
      this.setState(state, () => {
        if (multiple) {
          onChange(state.values);
        } else {
          onChange(state.values[0]);
        }
      });
    });
  };

  commonChooseFile(e) {
    if (e.target.name !== 'ajax-upload-file-input') {
      e.preventDefault();
      this.inputRef.click();
    }
    e.stopPropagation();
  };

  render() {
    const {multiple, id, readonly, disabled, autofocus, options, schema} = this.props;
    const {values} = this.state;
    return (
      <a className="avatar-file-upload"
         onClick={this.commonChooseFile.bind(this)}
         style={{
           backgroundImage: `url('${(values.length && values[0] !== undefined) ? values[0] : schema.picture_url || ""}')`,
           width: '60px',
           height: '60px',
           backgroundSize: 'contain',
           display: 'block',
           borderRadius: '50%',
           cursor: 'pointer'
         }}>
        <input
          ref={ref => (this.inputRef = ref)}
          id={id}
          name={'ajax-upload-file-input'}
          type="file"
          style={{display: 'none'}}
          disabled={readonly || disabled}
          onChange={this.onChange.bind(this)}
          defaultValue=""
          autoFocus={autofocus}
          multiple={multiple}
          accept={options.accept}
        />
      </a>
    );
  }
}

ProfilePictureFileWidget.defaultProps = {
  autofocus: false,
};

ProfilePictureFileWidget.propTypes = {
  multiple: PropTypes.bool,
  value: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.arrayOf(PropTypes.string),
  ]),
  autofocus: PropTypes.bool,
};

export default ProfilePictureFileWidget;
