const mongoose = require("mongoose");
const productSchema = new mongoose.Schema({
    pid: {
        type: String,
        required: true,
        index: true
    },
    product_name: {
        type: String,
        required: true,
        index: true

    },
    salesCount: {
        type: Number,
        index: true,
        default: 0,
        required: false
    },
    discountAmount: {
        type: Number,
        required: false,
        default: 0
    },
    product_count: {
        type: Number,
        required: true
    },
    product_company: {
        type: String,
        default: "-"
    },
    product_category: {
        type: String,
        default: "0"
    },
    product_description: {
        type: String,
        default : ""
    },
    product_sales_price: {
        type: Number,
        required: true
    },
    product_purchase_price: {
        type: Number,
        required: true
    },
    product_images: {
        type: Array,
        required: true
    },
    product_barcodes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'barcodes' }],
    product_unit_1: {
        type: String,
        required: true
    },
    product_unit_1_value: {
        type: String,
        required: false
    },
    product_unit_2: {
        type: String,
        required: true
    },
    product_unit_2_value: {
        type: String,
        required: false
    },
    product_alternatives: [
        {
            value: { type: String, required: true },
            price: { type: Number, required: true },
            count: { type: Number, required: true },
            key: { type: String, required: true }
        }
    ],
    productDifferationMetric: {
        type: String,
        default: "Variantlar"
    },
    inStock: {
        type: Boolean,
        default: true,
        required: false
    }
}, { timestamps: true })

const productModel = mongoose.model("products", productSchema);
module.exports = productModel;

