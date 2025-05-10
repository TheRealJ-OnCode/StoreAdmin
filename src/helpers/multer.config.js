const multer = require("multer");
const multerParse = multer({
    dest: "uploads/"
}).array("attachment");

module.exports = { multerParse };
