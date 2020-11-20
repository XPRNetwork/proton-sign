import React from 'react';
import Dropzone from 'react-dropzone';
import { PropTypes } from 'prop-types';
import PageLayout from '../../components/PageLayout';

const UploadDoc = ({ onFileUpload }) => {
  const maxSize = 5000000;
  return (
    <PageLayout
      firstTitleLine="Welcome!"
      secondTitleLine="Let's get your file signed.">
      <Dropzone
        onDrop={onFileUpload}
        accept="application/pdf"
        minSize={0}
        maxSize={maxSize}>
        {({ getRootProps, getInputProps, isDragReject }) => {
          return (
            <div className="dashed upload uploadbox">
              <div {...getRootProps()}>
                <input {...getInputProps()} />
                {isDragReject && 'Only PDF files are accepted, sorry!'}

                <div className="center">
                  <img src="./images/upload.png" alt="Upload File" />
                </div>

                <p className="center upload">
                  Drop your doc here, or <font color="#4d5dc1">browse</font>
                </p>

                <ul className="center">
                  <li>
                    <label className="upload grey">Supports: PDF files</label>
                  </li>
                </ul>
              </div>
            </div>
          );
        }}
      </Dropzone>
    </PageLayout>
  );
};

export default UploadDoc;

UploadDoc.propTypes = {
  onFileUpload: PropTypes.func,
};

UploadDoc.defaultProps = {
  onFileUpload: null,
};
