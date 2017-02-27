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

client.lpushAsync('example-list', 'a')
  .then(result => {
    console.log('push a to list:', result)
    return client.rpushAsync('example-list', 'b');
  })
  .then(result => {
    console.log('push b to list:', result)
    return client.rpushAsync('example-list', 'b');
  })
  .then(result => {
    console.log('push b to list again:', result)
    return client.lpushAsync('example-list', 'c');
  })
  .then(result => {
    console.log('shift c to front of list:', result)
    return client.llenAsync('example-list');
  })
  .then(result => {
    console.log('get length of list:', result)
    return client.lrangeAsync('example-list', 0, -1);
  })
  .then(result => {
    console.log('get list contents:', result)
    process.exit(0);
  });