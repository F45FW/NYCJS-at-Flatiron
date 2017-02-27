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

// variable number of arguments w/ callback
client.set('key1', 'value1', function (err, res) {
  console.dir({ err, res });
});
// array arg and callback
client.set(['key2', 'val'], function (err, res) {
  console.dir({ err, res });
  client.get('key2', function (err, res) {
    console.dir({ err, res });
    client.append('key2', 'ue2', function (err, res) {
      console.dir({ err, res });
      client.get('key2', function (err, res) {
        console.dir({ err, res });
      });
    });
  })
});

