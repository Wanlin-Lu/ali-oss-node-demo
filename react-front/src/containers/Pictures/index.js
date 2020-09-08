import React, {useEffect, useState} from 'react'
import { useAlioss } from '../../hooks/oss-hook'
import { useHttpClient } from '../../hooks/http-hook'
import PictureList from '../../components/PictureList'

import {Carousel, Image} from 'antd'

import './style.less'

const Pictures = () => {
  const [results, setResults] = useState({})
  const [images, setImages] = useState([])
  const { allowUrl } = useAlioss()

  useEffect(() => {
    getImages();
  }, [])
  
  async function getImages() {
    try {
      const dbResponse = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/upload/images`
      );

      const resu = await dbResponse.json();

      mySetResult(resu);

      resu.imgs.forEach((result) => {
        allowUrl(result.img).then((res) => {
          result.img = res;
        });
      });

      mySetImages(resu.imgs);
    } catch (e) {
      console.log("get images failed");
    }
  }
  
  const mySetImages = (images) => {
    setImages(images)
  }

  const mySetResult = (results) => {
    setResults(results)
  }
  
  return (
    <div className="picture">
      <PictureList imgs={images} />
    </div>
  );
};

export default Pictures