const mongoose = require("mongoose");
const barcodeSchema = new mongoose.Schema({
    barcode:{type:Number,required:true,unique:true},
},{timestamps:true});
barcodeSchema.index({ barcode: 1 });

const barcodeModel = mongoose.model("barcodes",barcodeSchema);

module.exports = {barcodeModel};



