const { s3Config, bucketName } = require('../helpers/aws/s3.js');

const generateUploadURL = async () => {
    const imageName = "randomimagename"
    const params = ({
        Bucket: bucketName,
        Key: imageName,
        Expires: 240
    })
    const uploadUrl = await s3Config.getSignedUrlPromise('putObject', params);
    return uploadUrl

}
const getS3UrlController = async (req, res) => {
    const url = await generateUploadURL()
    res.send({ url })
};


module.exports = { getS3UrlController };