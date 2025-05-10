const redisClient = require('../redis.settings.js');

const saveOption = async(field,value)=>{
    try {
        return await redisClient.sAdd(field,value)
    } catch (error) {
        return {
            message:"Error",
            error
        }
    }

};

module.exports = {saveOption}