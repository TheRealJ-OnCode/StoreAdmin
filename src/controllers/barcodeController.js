const { isBarcodesExist } = require('../helpers/barcodeManagement/validateBarcode.js');
const Response = require('../utils/Response.class.js');

const barcodeController = async(req,res)=>{
    try {
        const {barcode} = req.params;
        const {exists} =await isBarcodesExist([barcode])
        if(exists) return new Response(barcode,"Barkod mövcuddur",false).error404(res)
        return new Response(barcode,"OK",true).success(res)

    } catch (error) {
        console.log(error);
        return new Response(barcode,"Internal server error",false).error500(res);
    }
};
module.exports = {barcodeController}