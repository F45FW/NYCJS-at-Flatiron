const redis = require('redis');
const Promise = require('bluebird');
Promise.promisifyAll(redis.RedisClient.prototype);
let client = redis.createClient({
  db: 4
});
client.randomkeyAsync()
  .then(key => {
    console.log(`got random key: ${key}`);
    return client.getAsync(key);
  })
  .then(val => {
    console.log(`value: ${val}`);
    process.exit(0);
  });