import React, { useState, useRef } from 'react'
import { useAlioss } from '../../hooks/oss-hook'

import './style.less'

const Uploader = () => {
  let [files, setFiles] = useState(null);
  const { upload, uploaded } = useAlioss()
  const filePickRef = useRef()

  const handleChange = e => {
    // setFiles(e.target.value);
    console.log(e.target.files)
    console.log(Array.from(e.target.files))
    setFiles(Array.from(e.target.files))
  };

  const handleUpload = async () => {
    await upload(files)
    if (uploaded) {
      console.log(uploaded);
    }
  };
  return (
    <div className="uploader">
      <input
        type="file"
        ref={filePickRef}
        multiple={true}
        onChange={handleChange}
      />
      <button onClick={handleUpload}>Upload</button>
    </div>
  );
};

export default Uploader