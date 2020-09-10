import React from 'react'

const PictureList = props => {
  console.log(props)
  return (
    <ul>
      {/* imgs.length !== 0 ? imgs.map(i => <img key={i._id} src={i.src} alt="pic" />) : <h1>loading...</h1> */}
      {props.imgs.pl && props.imgs.pl.map((i) => (
        <img key={i._id} src={i.src} alt="pic" />
      ))}
    </ul>
  );
}

export default PictureList