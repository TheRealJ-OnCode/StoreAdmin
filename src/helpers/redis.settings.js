const redis = require("redis");
const redisClient = redis.createClient({});
redisClient.connect();
redisClient.on('error',err=>console.log('Redis Client error: ',err));
module.exports  = redisClient
