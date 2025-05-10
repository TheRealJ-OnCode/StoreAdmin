const { barcodeModel } = require('../db/models/barcode.model.js');

const { deleteBarcode } = require('../helpers/barcodeManagement/deleteBarcode.js');
const { findProductById } = require('../helpers/findProduct.js');

const Response = require('../utils/Response.class.js');

const deleteProductController = async (req, res) => {
    const productId = req.params.productId

    try {
        const { product: productToDelete } = await findProductById(productId);
        if (!productToDelete) {
            return new Response(null, "Məhsul tapılmadı", false).error404(res);
        }
        const barcodeIds = productToDelete.product_barcodes;
        const barcodes = await barcodeModel.find({ _id: { $in: barcodeIds } }, 'barcode');
        await productToDelete.deleteOne({ _id: productId });
        await barcodeModel.deleteMany({ _id: { $in: barcodeIds } });
        for (const barcodeObject of barcodes) {
            const barcode = barcodeObject.barcode;
            await deleteBarcode(barcode.toString());
        }
        return new Response(productToDelete, "Məhsul silindi", true).success(res);
    } catch (error) {

        console.log(error);

        return new Response(null, "Internal server error", false).error500(res);
    }
};

module.exports = deleteProductController