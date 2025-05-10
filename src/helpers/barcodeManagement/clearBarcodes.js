const redisClient = require('../redis.settings.js');

const clearBarcodes = async()=>{
    try {
        await redisClient.del('barcodes');
        return {message : "All barcodes have been cleared."}
    } catch (error) {
        console.error('Error clearing barcodes:', error);
        return error
    }
}

module.exports = { clearBarcodes };
