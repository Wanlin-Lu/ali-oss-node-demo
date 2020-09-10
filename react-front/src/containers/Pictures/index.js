import React, {useEffect, useState, useRef } from 'react'
import { useAlioss } from '../../hooks/oss-hook'
import PictureList from '../../components/PictureList'

import { useHttpClient } from '../../hooks/http-hook'
import {Carousel, Image} from 'antd'

import './style.less'

const Pictures = () => {
  const [loading, setLoading] = useState(true)
  const [signatured, setSignatured] = useState(false)
  const [results, setResults] = useState()
  const [images, setImages] = useState({'pl':[]})
  const { allowUrl } = useAlioss()
  // ! useRef.current to sequency the operations
  const resultsDoSetRef = useRef(false)
  const picListRef = useRef()

  useEffect(() => {
    getImages();
  }, [])
  
  async function getImages() {
    try {
      const dbResponse = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/upload/images`
      );

      const resu = await dbResponse.json();

      setResults(resu);
      resultsDoSetRef.current = true

      // const temImgs = []
      // await resu.imgs.forEach((result) => {
      //   allowUrl(result.img).then((res) => {
      //     result.src = res;
      //     temImgs.push(result)
      //   });
      // });

      // setImages(temImgs);
    } catch (e) {
      console.log("get images failed")
    } finally {
      setLoading(false)
      // console.log("get images and signatured")
      console.log("get images done!")
    }
  }
  
  /**
   * ! this way is wrong, forEach(i => async()) can't get wished
   * ! results
   * @param {*} raw 
   */
  async function signatureUrl(raw) {
    setSignatured(false)
    try {

      let tempImgs = []

      raw.imgs.forEach((r) => {
        allowUrl(r.img).then((res) => {
          r.src = res;
          tempImgs.push(r)
          console.log("r",r)
          console.log('r.src',r['src'])
        });
      });

      console.log("tempImgs",tempImgs)

      setImages({ 'pl': tempImgs });
    } catch (e) {
      console.log("signature failed",e)
    } finally {
      setSignatured(true)
      console.log("signature done!")
    }
  }

  /**
   * ! This is the right way to forEach a async function
   * @param {array} raw 
   * @param {setImages} callback 
   */
  function signatureUrl1(raw, callback) {
    let tempImgs = []
    let expecting = raw.imgs.length
    raw.imgs.forEach(function (entry, index) {
      signature(entry, function (result) {
        tempImgs[index] = result
        if (--expecting === 0) {
          callback({ pl: tempImgs });
        }
      })
    })
  }

  function signature(item, callback) {
    allowUrl(item.img).then(res => {
      item.src = res
      callback(item)
    })
  }

  useEffect(() => {
    if (resultsDoSetRef.current) {
      resultsDoSetRef.current = false
      // signatureUrl(results);
      signatureUrl1(results, setImages)
    }
  }, [results])
  
  // useEffect(() => {
  //   const setPicList = i => {
  //     return (
  //       <PictureList imgs={i} />
  //     )
  //   }
  //   picListRef.current = setPicList(images)
  // }, [images])
  
  return (
    <div className="picture">
      {loading && !signatured ? <h1>Loading</h1> : <PictureList imgs={images} />}
      {/* !!picListRef.current && picListRef.current */}
    </div>
  );
};

export default Pictures