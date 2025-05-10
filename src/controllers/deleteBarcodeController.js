const { barcodeModel } = require('../db/models/barcode.model.js');
const productModel = require('../db/models/product.model.js');
const { deleteBarcode } = require('../helpers/barcodeManagement/deleteBarcode.js');
const Response = require('../utils/Response.class.js');

const deleteBarcodeController = async (req, res) => {
    try {
        const { barcode } = req.body;
        // * check the barcode is exist,isBarcodeExists returns null or direct barcode document
        const isBarcodeExists = await barcodeModel.findOne({ barcode });
        if (!isBarcodeExists) {
            return new Response(barcode, "Barkod tapılmadı", false).error403(res);
        }
        // * get barcode document id
        const barcodeId = isBarcodeExists._id;
        // * get the product which has this barcode
        const productHasThisBarcode = await productModel.findOne({ product_barcodes: { $in: barcodeId } });
        if (!productHasThisBarcode) {
            return new Response(null, "Məhsul tapılmadı", false).error403(res);
        }
        // *paralelize async operation
        // * if productHasThisBarcode is not null ,find product and update(delete this barcode) and delete this barcode from redis/db
        // * if productHasThisBarcode is null ,remove barcode only redis/db
        const updateProductPromise = productHasThisBarcode ? productModel.findByIdAndUpdate(productHasThisBarcode._id, { $pull: { product_barcodes: barcodeId } }, { new: true }) : null;
        const deleteOperations = [
            barcodeModel.findByIdAndDelete(barcodeId),
            deleteBarcode(String(barcode))
        ]
        const promises = updateProductPromise ? [updateProductPromise,...deleteOperations] : deleteOperations
        await Promise.all(promises);
        // * return success error
        return new Response(barcode,`${barcode} silindi`,true).success(res)
    } catch (error) {
        console.log(error);
        return new Response(null, "Internal server error", false).error500(res);
    }

};
module.exports = { deleteBarcodeController };