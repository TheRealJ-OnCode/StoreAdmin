const {getOption} = require('../helpers/barcodeManagement/getOption.js');
const Response = require('../utils/Response.class.js');

const getOptionController = async (req, res) => {

    try {
        const {field} = req.params;
        const reply = await getOption(field);
        return new Response(reply, null, true).success(res);
    } catch (error) {
        console.log(error);
        return new Response(error, null, false).error500(res);

    }
};
const getAllOptionsController = async (req, res) => {
    try {

        const [product_companies,
            product_categories,
            product_units] = await Promise.all([
            getOption("product_company"),
            getOption("product_category"),
            getOption("product_unit")
        ])
        const data = {
            product_category: product_categories,
            product_company: product_companies,
            product_unit_1: product_units,
            product_unit_2: product_units,

        }
        return new Response(
            data,
            null,
            true
        )
            .success(res);

    } catch (err) {
        console.log(err)
        return new Response(err, "Server error", false).error500(res);

    }
}


module.exports = {getOptionController, getAllOptionsController}