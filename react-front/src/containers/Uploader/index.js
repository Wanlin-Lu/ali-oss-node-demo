import React, { useState, useRef } from 'react'
import { v4 as uuidv4 } from "uuid";
import { useAlioss } from '../../hooks/oss-hook'
import { useHttpClient } from '../../hooks/http-hook'

import './style.less'

const Uploader = () => {
  let [files, setFiles] = useState(null);
  const { upload } = useAlioss()
  const { sendRequest } = useHttpClient()
  const filePickRef = useRef()

  const handleChange = e => {
    // setFiles(e.target.value);
    console.log(e.target.files)
    console.log(Array.from(e.target.files))
    setFiles(Array.from(e.target.files))
  };

  const handleUpload = async () => {
    let nameList = []
    files.forEach(file => {
      file.uname = `${uuidv4()}-${file.name}`;
      nameList.push({img:file.uname})
    })
    await upload(files)
    console.log("upload return uploaded:", nameList)
    const images = {'images':nameList}
    await postImages(images);
  };

  async function postImages(images) {
    console.log(images)
    console.log(JSON.stringify(images))
    try {
      const dbResponse = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/upload/images`,
        {
          method: "POST",
          body: JSON.stringify(images),
          headers:{"Content-Type": "application/json",}
        }
      );
      console.log(dbResponse);
    } catch (e) {
      console.log("uploaded post failed");
    }
  }
  
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