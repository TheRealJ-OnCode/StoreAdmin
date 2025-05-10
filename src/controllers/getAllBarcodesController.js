const { barcodeModel } = require('../db/models/barcode.model.js');
const Response = require('../utils/Response.class.js');

const getAllBarcodesController = async(req, res) => {
    try {
        const barcodes = await barcodeModel.find({}).lean();
        return new Response(barcodes,"Barkodlar : ",true).success(res);
    } catch (error) {
        return new Response({body:req.body},"Internal Server Error  ",false).error500(res);

    }

};
module.exports = {getAllBarcodesController}