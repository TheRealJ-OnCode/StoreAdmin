const Response = require('../utils/Response.class.js');
const { handleFileUpload } = require('../utils/file-upload.utils.js');


const uploadImageController = async (req, res) => {
    const attachments = req.files;

    if (!attachments || attachments.length === 0)
        return new Response(null, "Şəkil yoxdur", false).error404(res);
    const uploadResponses = [];
    for (let i = 0; i < attachments.length; i++) {
        const uploadResponse = await handleFileUpload(attachments[i]);
        uploadResponses.push(uploadResponse);
    }

    return new Response(uploadResponses, null, true).success(res);
};

module.exports = { uploadImageController };
