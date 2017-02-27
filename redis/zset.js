var redis = require('redis');
const Promise = require('bluebird');
Promise.promisifyAll(redis.RedisClient.prototype);
var client = redis.createClient({
  db: 4
});

// You can start issuing commands at this point - they'll be queued and executed when the client is ready.
// However you may want to handle the events the redis client emits:

client
  // once the connection is established
  .on('connect', function () {
    console.log('Successfully connected to redis server');
  })
  // once the client is ready to execute commands
  .on('ready', function () {
    console.log('Ready to issue commands.');
  })
  // if the client disconnects
  .on('end', function () {
    console.log('Established Redis server connection has closed');
  })
  // capture warnings and errors
  .on('warning', function (warning) {
    console.log('Redis warning: ' + warning);
  })
  .on('error', function (err) {
    console.log('Redis error: ' + err);
  });

client.zaddAsync('example-zset', 1, 'redis', 2, 'mongo')
  .then(result => {
    console.log('add redis and mongo to sorted set:', result);
    return client.zaddAsync('example-zset', 3, 'neo4j');
  })
  .then(result => {
    console.log('add neo4j to sorted set:', result);
    return client.zcardAsync('example-zset');
  })
  .then(result => {
    console.log('number of items in set:', result);
    return client.zrangeAsync('example-zset', 0, -1);
  })
  .then(result => {
    console.log('all items in set, low to high:', result);
    return client.zremAsync('example-zset', 'redis');
  })
  .then(result => {
    console.log('remove redis from set:', result);
    return client.zrevrangeAsync('example-zset', 0, -1, 'WITHSCORES');
  })
  .then(result => {
    console.log('all items in set, high to low, with scores', result);
    process.exit(0);
  });