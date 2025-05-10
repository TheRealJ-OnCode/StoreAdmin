const { barcodeModel } = require('../../db/models/barcode.model.js');

const saveBarcodesToMongo = async(barcodes)=>{
    const barcodeObjects = barcodes.map(barcode=>({barcode}));

    const saveBarcodes = await barcodeModel.insertMany(barcodeObjects);
    const barcodeIds = saveBarcodes.map(barcode=>barcode._id);


    return {barcodeIds,saveBarcodes};
}


module.exports = {saveBarcodesToMongo};