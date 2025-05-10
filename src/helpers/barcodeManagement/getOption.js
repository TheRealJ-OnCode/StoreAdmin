const redisClient = require('../redis.settings.js');

const getOption = async(field)=>{
    try {
        return await redisClient.sMembers(field)
    } catch (error) {
        return {
            message:"Error",
            error
        }
    }

};

module.exports = {getOption}