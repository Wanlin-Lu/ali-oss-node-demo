const OSS = require("ali-oss");
const STS = OSS.STS;

const sts = new STS({
  accessKeyId: process.env.ALI_OSS_APP_ACCESS_KEY_ID,
  accessKeySecret: process.env.ALI_OSS_APP_ACCESS_KEY_SECRET,
});

const imageDAO = require('../dao/imageDao')

const getCredentials = async (req, res, next) => {
  try {
    const { credentials } = await sts.assumeRole(
      "acs:ram::1786389648930150:role/uploader", //role arn
      null, // policy
      15 * 60, // expiration
      "web-client" // session name
    );
    console.log(credentials);
    res.status(200).json({ result: credentials });
  } catch (err) {
    res.status(401).json({ e: err });
  }
};

const getImages = async (req, res, next) => {
  try {
    const imageResponse = imageDAO.getImages()

    res.status(200).json({images: imageResponse})
  } catch (e) {
    res.status(500).json({message:'Fail to get images.',e})
  }
};

const postImages = async (req, res, next) => {
  try {
    const images = req.body.images

    const imageResponse = imageDAO.postImages(images)

    if (imageResponse.success) {
      res.status(200).json({ status: "ok" });
    }
  } catch (e) {
    res.status(500).json({ message: "Fail to post", e });
  }
}

exports.getCredentials = getCredentials
exports.getImages = getImages
exports.postImages = postImages
