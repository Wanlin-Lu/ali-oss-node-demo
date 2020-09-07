import { useState } from 'react'
import moment from 'moment'
import OSS from 'ali-oss'
import { v4 as uuidv4 } from 'uuid'

export const useAlioss = () => {
  let [ossClient, setOssClient] = useState();
  let [checkpoints, setCheckpoints] = useState({});
  let uploaded = []
  let credentials;

  const bucket = "mern-share-place";
  const region = "oss-cn-hangzhou";
  const partSize = 1024 * 1024; // 每个分片的大小
  const parallel = 3; // 同时上传的分片数

  const getCredential = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/upload/credential");
      const res_1 = await res.json();
      console.log("credentials === ", res_1.result);
      credentials = res_1.result;
      // setCredentials(res_1.result)
    } catch (err) {
      console.error(err);
    }
  };

  const initOSSClient = async () => {
    const bucket = "mern-share-place";
    const region = "oss-cn-hangzhou";
    console.log(credentials);
    const { AccessKeyId, AccessKeySecret, SecurityToken } = credentials;
    ossClient = new OSS({
      accessKeyId: AccessKeyId,
      accessKeySecret: AccessKeySecret,
      stsToken: SecurityToken,
      bucket,
      region,
    });
    setOssClient(ossClient);
  };

  const upload = async (fileList) => {
    await getCredential();
    fileList.forEach((file) => {
      // 如果文件大学小于分片大小，使用普通上传
      if (file.size < partSize) {
        commonUpload(file);
      } else {
        multipartUpload(file);
      }
    });
  };

  const commonUpload = async (file) => {
    if (!ossClient) {
      await initOSSClient();
    }
    const fileName = `${uuidv4()}-${file.name}`;
    return ossClient
      .put(fileName, file)
      .then((result) => {
        console.log(
          `Common upload ${file.name} succeeded, result = `,
          result
        );
        uploaded.push(result.name)
      })
      .catch((err) => {
        console.log(`Common upload ${file.name} failed = `, err);
      });
  };

  const multipartUpload = async (file) => {
    if (!ossClient) {
      await initOSSClient();
    }
    const fileName = `${uuidv4()}-${file.name}`;
    return ossClient
      .multipartUpload(fileName, file, {
        parallel,
        partSize,
        progress: onMultipartUploadProgress, // 分片上传进度回调
      })
      .then((result) => {
        const url = `http://${bucket}.${region}.aliyuncs.com/${fileName}`;
        console.log(`Multipart upload ${file.name} succeed, url = `, url);
        uploaded.push(result.name);
      })
      .catch((err) => {
        console.log(`Multipart upload ${file.name} failed = `, err);
      });
  };

  const onMultipartUploadProgress = async (progress, checkpoint) => {
    console.log(`${checkpoint.file.name} 上传进度 ${progress}`);

    setCheckpoints({ ...checkpoints, [checkpoint.uploadId]: checkpoint });

    // 判断STS Token是否将要过期，过期就重新获取
    const { Expiration } = credentials;
    const timegap = 14;
    if (
      Expiration &&
      moment(Expiration).subtract(timegap, "minute").isBefore(moment())
    ) {
      console.log(
        `STS token will expire in ${timegap} minutes, uploading will pause and resume after getting new STS token.`
      );
      if (ossClient) {
        ossClient.cancel();
      }
      await getCredential();
      await resumeMultipartUpload();
    }
  };

  const resumeMultipartUpload = async () => {
    Object.values(checkpoints).forEach((checkpoint) => {
      const { uploadId, file, name } = checkpoint;
      ossClient
        .multipartUpload(uploadId, file, {
          parallel,
          partSize,
          progress: onMultipartUploadProgress,
          checkpoint,
        })
        .then((result) => {
          console.log("before delete checkpoints = ", checkpoints);
          delete checkpoints[checkpoint.uploadId];
          console.log("after delete checkpoints = ", checkpoints);
          const url = `http://${bucket}.${region}.aliyuncs.com/${name}`;
          console.log(
            `Resume multipart upload ${file.name} succeed, url = `,
            url
          );
        })
        .catch((err) => {
          console.log("Resume multipart upload failed, ", err);
        });
    });
  };
  return { upload, uploaded }
}