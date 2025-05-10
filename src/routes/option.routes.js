const { addOptionController } = require('../controllers/addOptionController.js');
const { getOptionController, getAllOptionsController} = require('../controllers/getOptionsController.js');

const optionRoutes = require("express").Router();

optionRoutes.put("/option/add/",addOptionController);
optionRoutes.get("/option/get/:field",getOptionController);
optionRoutes.get("/options/get/all",getAllOptionsController);




module.exports = optionRoutes