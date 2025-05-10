const scriptRoutes = require("express").Router();
const path = require("path");
// ! model/upload
scriptRoutes.get("/models/uploadModel", (req, res) => {
    res.sendFile(path.join(__dirname, "../views/public/models/uploadModel.js"))
})
scriptRoutes.get("/models/uploadView", (req, res) => {
    res.sendFile(path.join(__dirname, "../views/public/models/uploadView.js"))
})
// ! /model/product
scriptRoutes.get("/models/productModel", (req, res) => {
    res.sendFile(path.join(__dirname, "../views/public/models/productModel.js"))
})
scriptRoutes.get("/models/productView", (req, res) => {
    res.sendFile(path.join(__dirname, "../views/public/models/productView.js"))
})
// ! /model/home
scriptRoutes.get("/models/homeModel",(req,res)=>{
    res.sendFile(path.join(__dirname,"../views/public/models/homeModel.js"))
})
scriptRoutes.get("/models/homeView",(req,res)=>{
    res.sendFile(path.join(__dirname,"../views/public/models/homeView.js"))
})


scriptRoutes.get("/models/orderModel",(req,res)=>{
    res.sendFile(path.join(__dirname,"../views/public/models/orderModel.js"))
})
scriptRoutes.get("/models/orderView",(req,res)=>{
    res.sendFile(path.join(__dirname,"../views/public/models/orderView.js"))
})


// !utils
scriptRoutes.get("/models/utils/validators", (req, res) => {
    res.sendFile(path.join(__dirname, "../views/public/models/utils/validators.js"))
})
scriptRoutes.get("/models/utils/customPrompt", (req, res) => {
    res.sendFile(path.join(__dirname, "../views/public/models/utils/customPrompt.js"))
})
scriptRoutes.get("/models/utils/requests", (req, res) => {
    res.sendFile(path.join(__dirname, "../views/public/models/utils/requests.js"))
})
scriptRoutes.get("/models/utils/upload-image.utils", (req, res) => {
    res.sendFile(path.join(__dirname, "../views/public/models/utils/upload-image.utils.js"))
})
// ! new class
scriptRoutes.get("/models/class/OrderClass", (req, res) => {
    res.sendFile(path.join(__dirname, "../views/public/models/class/OrderClass.js"))
})
// !helpers
scriptRoutes.get("/models/helpers/DOM.utils", (req, res) => {
    res.sendFile(path.join(__dirname, "../views/public/models/helpers/DOM.utils.js"))
})
scriptRoutes.get("/models/helpers/idGenerator", (req, res) => {
    res.sendFile(path.join(__dirname, "../views/public/models/helpers/idGenerator.js"))
})
scriptRoutes.get("/models/helpers/displayNotification", (req, res) => {
    res.sendFile(path.join(__dirname, "../views/public/models/helpers/displayNotification.js"))
})
scriptRoutes.get("/models/helpers/displayModals", (req, res) => {
    res.sendFile(path.join(__dirname, "../views/public/models/helpers/displayModals.js"))
})
scriptRoutes.get("/models/helpers/displayPreviewLayout", (req, res) => {
    res.sendFile(path.join(__dirname, "../views/public/models/helpers/displayPreviewLayout.js"))
})

scriptRoutes.get("/models/helpers/displayScreenFreezer", (req, res) => {
    res.sendFile(path.join(__dirname, "../views/public/models/helpers/displayScreenFreezer.js"))
})
//partials
scriptRoutes.get("/models/partials/handleSlider", (req, res) => {
    res.sendFile(path.join(__dirname, "../views/public/models/partials/handleSlider.js"))
})


module.exports = scriptRoutes