const { getS3UrlController } = require('../controllers/getS3UrlController.js');
const { uploadImageController } = require('../controllers/uploadImageController.js');
const { multerParse } = require('../helpers/multer.config.js');

const imageRoutes = require("express").Router();


imageRoutes.get("/get/s3url",getS3UrlController);
imageRoutes.put("/images/upload", multerParse, uploadImageController);


module.exports  = imageRoutes