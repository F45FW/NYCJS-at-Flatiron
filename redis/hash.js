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

client.hsetAsync('example-hash', 'a', 1)
  .then(result => {
    console.log('set a to 1:', result);
    return client.hmsetAsync('example-hash', 'b', 2, 'c', 3);
  })
  .then(result => {
    console.log('set b to 2 and c to 3:', result);
    return client.hincrbyAsync('example-hash', 'c', 4);
  })
  .then(result => {
    console.log('increment c by 4:', result);
    return client.hgetallAsync('example-hash');
  })
  .then(result => {
    console.log('get entire hash:', result);
    return client.hlenAsync('example-hash');
  })
  .then(result => {
    console.log('get number of fields in hash:', result);
    return client.hgetAsync('example-hash', 'c');
  })
  .then(result => {
    console.log('get value of c:', result);
    process.exit(0);
  });