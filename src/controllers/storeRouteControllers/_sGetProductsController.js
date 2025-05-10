const productModel = require('../../db/models/product.model.js');
const { getOption } = require('../../helpers/barcodeManagement/getOption.js');
const Response = require('../../utils/Response.class.js');

const sGetProductsController = async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const minPrice = parseFloat(req.query.minPrice) || 0;
    const maxPrice = parseFloat(req.query.maxPrice) || Number.MAX_SAFE_INTEGER;
    const categories = req.query.categories ? req.query.categories.split(',') : [];
    const inStock = req.query.inStock === 'true';
    const priceType = req.query.priceType || 'all';
    const productName = req.query.product_name || '';  // Add product_name query param

    // Build filters based on query parameters
    const categoryFilter = categories.length ? { product_category: { $in: categories } } : {};
    const stockFilter = inStock ? { inStock: true } : {};
    
    // Initialize the base filter with the price range and other conditions
    const filter = {
        product_sales_price: { $gte: minPrice, $lte: maxPrice },
        ...categoryFilter,
        ...stockFilter,
    };

    // If a product_name query exists, add it to the filter using a regex for partial match
    if (productName) {
        filter.product_name = { $regex: productName, $options: 'i' }; // 'i' for case-insensitive search
    }

    // Set up sorting based on priceType query
    let sort = {};
    if (priceType === 'asc') {
        sort = { product_sales_price: 1 };
    } else if (priceType === 'desc') {
        sort = { product_sales_price: -1 };
    }

    try {
        // Query the products with filters and sorting
        const products = await productModel.find(filter)
            .sort(sort)
            .skip((page - 1) * limit)
            .limit(limit)
            .exec();

        const count = await productModel.countDocuments(filter);  // Get total number of products matching filter
        const totalPages = Math.ceil(count / limit);

        const categories = await getOption("product_category");  // Get product categories

        new Response({
            categories,
            products,
            currentPage: page,
            totalPages
        }, "OK!", true).success(res);

    } catch (err) {
        console.log(err);
        new Response([], err.message, true).error500(res);
    }
};

module.exports = { sGetProductsController };
