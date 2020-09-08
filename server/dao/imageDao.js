let images

const injectDB = async (mdc) => {
  if (images) return
  try {
    images = await mdc.db("oss_demo").collection("images");
  } catch (e) {
    console.error(`Unable to establish collection handles in userDAO: ${e}`);
  }
}

const getImages = async () => {
  try {
    return await images.find().toArray()
  } catch (e) {
    console.error("Unable to get images");
    return { error: e}
  }
}

const postImages = async (imgs) => {
  try {
    await images.insertMany(imgs)
    return {success: true}
  } catch (e) {
    console.error('Unable to post images')
    return { error: e }
  }
}

exports.injectDB = injectDB
exports.getImages = getImages
exports.postImages = postImages