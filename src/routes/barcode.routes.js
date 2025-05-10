const { clearBarcodesController } = require('../controllers/clearBarcodesController.js');
const { deleteBarcodeController } = require('../controllers/deleteBarcodeController.js');
const { getAllBarcodesController } = require('../controllers/getAllBarcodesController.js');
const { addBarcodeController } = require('../controllers/addBarcodeController.js');
const { barcodeController } = require('../controllers/barcodeController.js');
const barcodeRoutes = require("express").Router();
barcodeRoutes.put("/barcodes/add", addBarcodeController);
barcodeRoutes.delete("/barcodes/delete/", deleteBarcodeController)
barcodeRoutes.delete("/barcodes/clear/all", clearBarcodesController);
barcodeRoutes.get("/barcodes/get-all-barcodes", getAllBarcodesController)
barcodeRoutes.get("/barcodes/exists/:barcode",barcodeController)

module.exports = barcodeRoutes;