// ! Basic validation for product
const joi = require("joi");
const Response = require('../utils/Response.class.js');
const { isBarcodesExist } = require('./barcodeManagement/validateBarcode.js');
const { saveBarcode } = require('./barcodeManagement/saveBarcode.js');
const isArrayEmpty = (value, helpers) => {
    if (!value.length) {
        return helpers.error('array.empty')
    }
    return value
}

const productSchema = joi.object({
    product_name: joi.string().required().messages({
        "string.base": "Məhsul adı tekst olmalıdır",
        "string.empty": "Məhsul adı boş ola bilməz",
        "any.required": "Məhsul adı yoxdur",
    }),
    product_description: joi.string().optional().messages({}).allow(''),
    product_alternatives : joi.array().required(),
    product_sales_price: joi.number().required().messages({
        "number.base": "Məhsul satış qiyməti rəqəm olmalıdır",
        "number.empty": "Məhsul satış qiyməti boş ola bilməz",
        "any.required": "Məhsul satış qiyməti yoxdur",
    }),
    product_purchase_price: joi.number().required().messages({
        "number.base": "Məhsul alış qiyməti rəqəm olmalıdır",
        "number.empty": "Məhsul alış qiyməti boş ola bilməz",
        "any.required": "Məhsul alış qiyməti yoxdur",
    }),
    product_count: joi.number().required().messages({
        "number.base": "Məhsul sayı rəqəm olmalıdır",
        "number.empty": "Məhsul sayı boş ola bilməz",
        "any.required": "Məhsul sayı yoxdur",
    }),
    product_unit_1_value:joi.number().optional().messages({
        "number.base": "Məhsul ölçü vahidi rəqəm olmalıdır",
    }),
    product_unit_2_value:joi.number().optional().messages({
        "number.base": "Məhsul ölçü vahidi rəqəm olmalıdır",
    }),
    product_category: joi.string().optional(),
    product_company: joi.string().optional(),

    product_images: joi.array().required().custom(isArrayEmpty).messages({
        "array.base": "Məhsul şəkli array olmalıdır",
        "array.empty": "Məhsul şəkli boş ola bilməz",
        "any.required": "Məhsul şəkli yoxdur",
    }),
    product_unit_1: joi.string().required().messages({
        "string.base": "Məhsul ölçü vahidi tekst olmalıdır",
        "string.empty": "Məhsul ölçü vahidi boş ola bilməz",
        "any.required": "Məhsul ölçü vahidi yoxdur",
    }),
    product_unit_2: joi.string().optional(),
    product_barcodes: joi.array().required().custom(isArrayEmpty).messages({
        "array.base": "Məhsul barkodu array olmalıdır",
        "array.empty": "Məhsul barkodu boş ola bilməz",
        "any.required": "Məhsul barkodu yoxdur",
    }),
})
const validateProduct = async (req, res, next) => {
    try {
        const product = req.body;
        const { error } = productSchema.validate(product, { abortEarly: false });
        if (error) {
            const errorMessage = error.details.map((detail) => detail.message).join('\n');

            return new Response(req.body, errorMessage, false).error403(res);
        }
        const { product_barcodes } = product;
        const { exists: barcodeCheckingResult, existingBarcodes } = await isBarcodesExist(product_barcodes);
        if (barcodeCheckingResult) {
            return new Response(req.body, `${existingBarcodes} mövcuddur`, false).error403(res);

        }
        //! if barcodes is unique save barcodes 
            for (const barcode of product_barcodes) {
                await saveBarcode(String(barcode));
            }
            next();
    } catch (error) {
        return new Response(error, "Server'də xəta baş verdi", false).error500(res)

    }
}

module.exports = { validateProduct, isArrayEmpty }