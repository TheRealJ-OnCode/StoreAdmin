const joi = require("joi");
const { isArrayEmpty } = require('./validateProduct.js');
const Response = require('../utils/Response.class.js');
const productSchema = joi.object(
    {
        product_name: joi.string().required().messages({
            "string.base": "Məhsul adı tekst olmalıdır",
            "string.empty": "Məhsul adı boş ola bilməz",
            "any.required": "Məhsul adı yoxdur",
        }),
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
    }
);


const validateEditedProduct = async(req,res,next)=>{
    const product = req.body;
    const {error} = productSchema.validate(product,{abortEarly:false});
    if (error) {
        const errorMessage = error.details.map((detail) => detail.message).join('\n');

        return new Response(errorMessage, "Doğrulama da xəta baş verdi", false).error403(res);
    } 
    next()
};


module.exports = {validateEditedProduct}


