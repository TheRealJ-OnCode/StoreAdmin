const aws = require("aws-sdk");
require("dotenv").config()


const accessKeyId = process.env.S3_ACCESS_KEY;
const secretAccessKey = process.env.S3_SECRET_ACCESS_KEY;
const region = process.env.S3_REGION;
const bucketName = process.env.S3_BUCKET_NAME;

const s3 = new aws.S3({
    region,
    accessKeyId,
    secretAccessKey,
    signatureVersion: "v4"

})


module.exports = { s3Config: s3, bucketName }