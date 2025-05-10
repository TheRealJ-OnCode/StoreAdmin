const redisClient = require('../redis.settings.js')

const isBarcodesExist = async (barcodes) => {
    let exists = false;
    let existingBarcodes = [];
    for (const barcode of barcodes) {
        exists = await redisClient.sIsMember('barcodes', String(barcode));
        if (exists) {
            existingBarcodes.push(barcode);
            exists = true;
            break;
        }
    }
    return {exists,existingBarcodes};
}

module.exports = { isBarcodesExist }