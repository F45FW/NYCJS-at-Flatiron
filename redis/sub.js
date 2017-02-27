var redis = require('redis');
//var client = redis.createClient();
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

client.on('message', function (channel, message) {
  console.log(`Received messsage on channel '${channel}':`);
  console.log(`${message}\n\n`);
});
client.subscribe('gt-half');
setTimeout(function () {
  console.log('subscribing to lt-half');
  client.subscribe('lt-half');
}, 5000);