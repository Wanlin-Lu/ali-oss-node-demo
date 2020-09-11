import React, {useEffect, useState, useRef } from 'react'
import { useAlioss } from '../../hooks/oss-hook'
import PictureList from '../../components/PictureList'

import { useHttpClient } from '../../hooks/http-hook'

import './style.less'

const Pictures = () => {
  const [loading, setLoading] = useState(true)
  const [signatured, setSignatured] = useState(false)
  const [results, setResults] = useState()
  const [images, setImages] = useState({'pl':[]})
  const { allowUrl } = useAlioss()
  const { sendRequest } = useHttpClient();
  // ! useRef.current to sequency the operations
  const resultsDoSetRef = useRef(false)

  useEffect(() => {
    getImages();
  }, [])
  
  async function getImages() {
    try {
      const resu = await sendRequest(
        `${process.env.REACT_APP_BACKEND_URL}/upload/images`
      );

      setResults(resu);
      resultsDoSetRef.current = true
    } catch (e) {
      console.log("get images failed")
    } finally {
      setLoading(false)
      console.log("get images done!")
    }
  }

  /**
   * ! array.map(i => new Promises(i))
   * ! promise.all(tasks).then(v => {})
   * try promise.all().then()
   */

  function signatureUrl2(raw) {
    const tasks = raw.imgs.map(i => allowUrl(i.img))
    Promise.all(tasks).then(values => {
      let resultImgs = raw.imgs.map((t, index) => ({ ...t, src: values[index] }));

      setImages({ pl: resultImgs })
      setSignatured(true)
    })
  }

  useEffect(() => {
    if (resultsDoSetRef.current) {
      resultsDoSetRef.current = false
      signatureUrl2(results)
    }
  }, [results])

  
  return (
    <div className="picture">
      {loading && !signatured ? (
        <h1>Loading</h1>
      ) : (
        <PictureList imgs={images} />
      )}
    </div>
  );
};

export default Pictures