const joi = require("joi");
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
    product_description: joi.string().required().messages({
        "string.base": "Məhsul təsviri tekst olmalıdır",
        "string.empty": "Məhsul təsviri boş ola bilməz",
        "any.required": "Məhsul təsviri yoxdur",
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
    product_unit_1_value: joi.number().optional().messages({
        "number.base": "Məhsul ölçü vahidi rəqəm olmalıdır",
    }),
    product_unit_2_value: joi.number().optional().messages({
        "number.base": "Məhsul ölçü vahidi rəqəm olmalıdır",
    }),
    productDifferationMetric: joi.string().optional().messages({
        "string.empty": "Məhsul Fərqlilik vahidi tekst olmalıdır"
    }),
    alternativesList: joi.array().optional(),
    product_category: joi.string().optional(),
    product_company: joi.string().optional(),
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


module.exports = {productSchema};