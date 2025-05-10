const redisClient = require('../redis.settings.js')
const deleteBarcode = async(barcode)=>{
    try {
       return await redisClient.sRem("barcodes",barcode)
    } catch (error) {
        return {
            message: "Error",
            error
        };
    }

}

module.exports = {deleteBarcode}