const Order = require('../db/models/order.model.js');
const productModel = require('../db/models/product.model.js');
const { getOption } = require('../helpers/barcodeManagement/getOption.js');
const Response = require('../utils/Response.class.js');
const { getAllProducts } = require('./getAllProducts.js');

const indexPageRenderer = async (req, res) => {
    const [product_category, product_unit, product_company,] = await Promise.all([
        getOption("product_category"),
        getOption("product_unit"),
        getOption("product_company")
    ]);

    res.render('index', {
        product_category,
        product_unit,
        product_company
    });

};

const productsPageRenderer = async (req, res) => {
    const { product_categories, product_unit, product_company, products } = await getAllProducts(null, null, "helpers")
    const data = {
        products,
    }
    res.render("products", { data })
    // res.json({data})
}


const findedProductsRenderer = async (req, res) => {
    let product = []


    const { productName } = req.query;
    if (!productName) {
        product = await productModel.find({});
    };
    product = await productModel.find({
        product_name: { $regex: new RegExp(productName, 'i') },
    });
    const data = {
        products: product,
        query: productName
    }

    return res.render("products", { data })


}

const productDetailsRenderer = async (req, res) => {
    try {
        const { pid, product_name } = req.query;
        if (!pid || !product_name) return new Response("", "Məlumat əksikdir", false).error429(res);
        const product = await productModel.findOne({ product_name, pid });
        product.product_barcode = product?.product_barcodes[0];
        if (!product) return new Response("", "Məhsul tapılmadı", false).error429(res);
        const pageTitle = product.product_name + " detalları";
        return res.render("product-details", { product, pageTitle });

    } catch (error) {
        console.log(error);
        return new Response(error, "Server error", false).error429(res);
    }
}


const orderPageRenderer = async (req, res) => {
    try {

        const { type } = req.query;
        let query = {};
        if (type === "today") {
            const startOfDay = new Date();
            startOfDay.setHours(0, 0, 0, 0);
            const endOfDay = new Date();
            endOfDay.setHours(23, 59, 59, 999);

            query = { createdAt: { $gte: startOfDay, $lte: endOfDay } };
        }

        const orders = await Order.find(query)
            .populate('items.productId')
            .sort({ createdAt: -1 });

        for (let order of orders) {
            const orderObj = order.toObject();
            for (let i = 0; i < orderObj.items.length; i++) {
                const item = orderObj.items[i];
                if (item.variant) {
                    const product = await productModel.findOne({ pid: item.productId });
                    if (product) {
                        const matchingAlternative = product.product_alternatives.find(
                            (alt) => alt.key === item.variant
                        );
                        if (matchingAlternative) {
                            orderObj.items[i] = { ...item, alternativeDetails: matchingAlternative };
                        }
                    }
                }
            }
            orders[orders.indexOf(order)] = orderObj;
        }

        return res.render("orders", { orders, type });
    } catch (error) {
        console.log(error);
        return new Response(error, "Server error", false).error500(res);
    }
};

const searchOrdersController = async (req, res) => {
    const { query } = req.query;

    if (!query) {
        return res.status(400).json({ error: 'Arama sorgusu boş olamaz.' });
    }

    try {
        let orders = await Order.find({
            $or: [
                { orderCode: { $regex: query, $options: "i" } },
                { "customerInfo.name": { $regex: query, $options: "i" } },
                { "customerInfo.surname": { $regex: query, $options: "i" } },
                { "items.name": { $regex: query, $options: "i" } },
                { "address": { $regex: query, $options: "i" } }
            ]
        }).sort({ createdAt: -1 });

        for (let order of orders) {
            const orderObj = order.toObject();
            for (let i = 0; i < orderObj.items.length; i++) {
                const item = orderObj.items[i];
                if (item.variant) {
                    const product = await productModel.findOne({ pid: item.productId });
                    if (product) {
                        const matchingAlternative = product.product_alternatives.find(
                            (alt) => alt.key === item.variant
                        );
                        if (matchingAlternative) {
                            orderObj.items[i] = { ...item, alternativeDetails: matchingAlternative };
                        }
                    }
                }
            }
            orders[orders.indexOf(order)] = orderObj;
        }

        res.json(orders);
    } catch (error) {
        console.error('Arama hatası:', error);
        res.status(500).json({ error: 'Bir hata oluştu.' });
    }
};


const refreshOrdersController = async (req, res) => {
    try {
        const orders = await Order.find().populate('items.productId').sort({ createdAt: -1 });
        return new Response(orders, null, true).success(res);
    } catch (error) {
        console.log(error);
        return new Response(error, "Server error", false).error500(res);
    }
}




const demoProductDetailsRenderer = async (req, res) => {
  const product = req.query;
  return res.render("product-details", {
    product,
    pageTitle: `Detallar || ${product.product_name}`,
    activePage: "Məhsullar"
  });
};





module.exports = { orderPageRenderer, indexPageRenderer, productDetailsRenderer, productsPageRenderer, findedProductsRenderer, demoProductDetailsRenderer, refreshOrdersController ,searchOrdersController}