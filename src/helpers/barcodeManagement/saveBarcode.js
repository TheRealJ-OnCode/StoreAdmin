const redisClient = require('../redis.settings.js')

const saveBarcode = async(barcode)=>{
    try {
        return await redisClient.sAdd("barcodes",barcode)
    } catch (error) {
        return {
            message:"Error",
            error
        }
    }
}
module.exports = {saveBarcode}