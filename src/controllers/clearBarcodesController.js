const { clearBarcodes } = require('../helpers/barcodeManagement/clearBarcodes.js')

const clearBarcodesController = async(req,res)=>{
    const result = await clearBarcodes();

    return res.json({result}) ;

}
module.exports = {clearBarcodesController};