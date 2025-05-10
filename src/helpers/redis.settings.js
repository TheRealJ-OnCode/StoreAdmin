const redis = require("redis");
require("dotenv").config();
const redis_pass = process.env.REDIS_PASSWORD
const client = redis.createClient({
    url: `rediss://default:${redis_pass}@loyal-lark-15815.upstash.io:6379`
});
client.on("error", function (err) {
    throw err;
});
 client.connect()
// await client.set('foo', 'bar');
module.exports = client
