import React from 'react'
import {Carousel, Image } from 'antd'

const PictureList = ({imgs}) => {
  return (
    <Carousel autoplay={true}>
      {imgs && imgs.map((i) => <Image key={i._id} src={i.src} />)}
    </Carousel>
  );
}

export default PictureList