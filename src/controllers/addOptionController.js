const { saveOption } = require('../helpers/barcodeManagement/saveOption.js');
const Response = require('../utils/Response.class.js');

const addOptionController = async (req, res) => {
    try {
        const { field, value } = req.body;

        const reply = await saveOption(field,value)
        return new Response({reply}, null, true).success(res);
    } catch (error) {
        console.error(error);
        return new Response(error, null, false).error500(res);
    }
};
module.exports = { addOptionController }