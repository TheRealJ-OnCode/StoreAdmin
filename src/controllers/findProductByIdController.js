const { findProductById } = require('../helpers/findProduct.js');

const findProductByIdController = async (req, res) => {
    try {
        const productID = req.params.id;
        const { product } = await findProductById(productID);
        if(!product) return res.json({})
        res.json(product)

    } catch (error) {
        console.log(error);
        res.status(500).json({ error })
    }
}
module.exports = {findProductByIdController}