const Response = require('../utils/Response.class.js');
const {productSchema} = require('../schemas/product.schema.js');


const compareProductAndAlternativeCounts = (product_count, alternatives) => {
    let alter_count = 0
    alternatives.forEach(_item => alter_count += Number(_item.count));
    return {isEqual : alter_count === Number(product_count),alter_count};

}
const validateProductController = (req, res) => {
    try {
        const product = req.body;
        const {alternativesList} = product;
        if (alternativesList?.length !== 0) {
            
            const {isEqual,alter_count} = compareProductAndAlternativeCounts(product.product_count, alternativesList)
            console.log({isEqual})
            if (!isEqual) return new Response(
                `Məhsul sayı ${Number(product.product_count)} ilə alternativlərin sayı ${alter_count} fərqlənir`,
                "Doğrulama da xəta baş verdi",
                false).error404(res)
        }

        const {error} = productSchema.validate(product, {abortEarly: true});
        if (error) {
            const errorMessage = error.details.map((detail) => detail.message).join('.\n');

            return new Response(errorMessage, "Doğrulama da xəta baş verdi", false).error403(res);
        }
        return new Response(product, "OK", true).success(res);
    } catch (err) {
        console.log(err)
        return new Response(req.body, "Server xətası", true).error500(res);

    }


};
module.exports = {validateProductController}