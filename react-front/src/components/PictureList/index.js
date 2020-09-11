import React from 'react'
import {Carousel, Image } from 'antd'

const PictureList = props => {
  console.log(props)
  return (
    <Carousel autoplay={true}>
      {props.imgs.pl &&
        props.imgs.pl.map((i) => <Image key={i._id} src={i.src} />)}
    </Carousel>
  );
}

export default PictureList