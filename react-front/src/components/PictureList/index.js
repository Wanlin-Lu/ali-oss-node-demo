import React from 'react'

const PictureList = ({ imgs }) => {
  return (
    <ul>
      {imgs.map(i => <img key={i._id} src={i.img} />)}
    </ul>
  )
}

export default PictureList