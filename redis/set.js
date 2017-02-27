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

client.saddAsync('example-set', 'a', 'b', 'c')
  .then(result => {
    console.log('add a,b,c to set:', result)
    return client.saddAsync('example-set', 'b');
  })
  .then(result => {
    console.log('try adding b again:', result)
    return client.smembersAsync('example-set');
  })
  .then(result => {
    console.log('list members:', result);
    return client.sremAsync('example-set', 'c');
  })
  .then(result => {
    console.log('remove c from set:', result);
    return client.sismemberAsync('example-set', 'c');
  })
  .then(result => {
    console.log('check if c is in set:', result);
    process.exit(0);
  });

