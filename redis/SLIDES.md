class: center, middle

# ⚡ Redis in Node ⚡

---

# ⚡ Installing Redis ⚡

- OSX: via Homebrew: `brew install redis`
- Windows: not officially supported, but an MSI is available here: [https://github.com/MSOpenTech/redis/releases](https://github.com/MSOpenTech/redis/releases)
- Free hosted Redis available from Redis To Go: [https://redistogo.com/signup](https://redistogo.com/signup)

---

# ⚡ Redis NodeJS Client ⚡

The recommended client for NodeJS is `node_redis`.
 - Homepage [http://redis.js.org/](http://redis.js.org/)
 - Github: [https://github.com/NodeRedis/node_redis](https://github.com/NodeRedis/node_redis)
 - Npm page: [https://www.npmjs.com/package/redis](https://www.npmjs.com/package/redis)

In a new directory,
- `npm init`
- You can leave everything blank or using the suggested values in the npm init prompts.
- `npm install redis --save`

If the recommended client doesn't meet your needs, there are many other options.

See here: [https://redis.io/clients#nodejs](https://redis.io/clients#nodejs)

---

# ⚡ Connecting ⚡

```javascript
var redis = require('redis');
//var client = redis.createClient();
var client = redis.createClient({
  url: 'redis://redistogo:YOUR_PASSWORD@koi.redistogo.com:11517'
});

// You can start issuing commands at this point - they'll be queued and executed when the client is ready.
// However you may want to handle the events the redis client emits:

client
  // once the connection is established
  .on('connect', function() {
    console.log('Successfully connected to redis server');
  })
  // once the client is ready to execute commands
  .on('ready', function() {
    console.log('Ready to issue commands.');
    process.exit(0);
  })
  // capture warnings and errors
  .on('warning', function (warning) {
    console.log('Redis warning: ' + warning);
  })
  .on('error', function (err) {
    console.log('Redis error: ' + err);
  });
```
---

# ⚡ Redis Data Structures ⚡

 | Type | Description | Possible Operations
 | --- | --- | ---
 | STRING | Strings, integers, or floating-point values | Operate on the whole string, parts, increment/ decrement the integers and floats
 | LIST | Linked list of strings | Push or pop items from both ends, trim based on offsets, read individual or multiple items, find or remove items by value
 | SET | Unordered collection of unique strings | Add, fetch, or remove individual items, check membership, intersect, union, difference, fetch random items
 | HASH | Unordered hash table of keys to values | Add, fetch, or remove individual items, fetch the whole hash
 | ZSET | Sorted set; ordered mapping of string members to floating-point scores, ordered by score | Add, fetch, or remove individual values, fetch items based on score ranges or member value

*from [redislabs - Redis in Action, chapter 1](https://redislabs.com/ebook/part-1-getting-started/chapter-1-getting-to-know-redis/1-2-what-redis-data-structures-look-like/)*

---

# ⚡ Data Structure 1: Strings ⚡

These are very simple, and so is their usage.

```javascript
// variable number of arguments w/ callback
client.set('key1', 'value1', function(err, res) {
  console.dir({err, res});
});
// array arg and callback
client.set(['key2', 'val'], function(err, res) {
  console.dir({err, res});
  client.get('key2', function (err, res) {
    console.dir({ err, res });
    client.append('key2', 'ue2', function (err, res) {
      console.dir({ err, res });
      client.get('key2', function (err, res) {
        console.dir({ err, res });
      });
    });
  });
});
```
Great, but those nested callbacks aren't very nice...

---
# ⚡ Using Promises ⚡

Fortunately, it's easy to use Promises with the `node_redis` client:

```javascript
const redis = require('redis');
const Promise = require('bluebird');
Promise.promisifyAll(redis.RedisClient.prototype);
let client = redis.createClient({
  url: 'redis://redistogo:YOUR_PASSWORD@koi.redistogo.com:11517'
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
```
---

# ⚡ Data Structure 2: Lists ⚡

```javascript
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
```

---

# ⚡ Data Structure 3: Sets ⚡

```javascript
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
```
---

# ⚡ Data Structure 4: Hashes ⚡

```javascript
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
```
---

# ⚡ Data Structure 5: Sorted Sets ⚡

```javascript
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
```
---

# ⚡ Bonus: Pub/Sub Messaging ⚡

pub.js
```javascript
var message = 'Hello';
setInterval(function() {
  let rand = Math.random();
  client.publish(rand > .5 ? 'gt-half' : 'lt-half', 'Random number: ' + rand)
}, 1000);
```

sub.js
```javascript
client.on('message', function(channel, message) {
  console.log(`Received messsage on channel '${channel}':`);
  console.log(`${message}\n\n`);
});
client.subscribe('gt-half');
setTimeout(function() {
  console.log('subscribing to lt-half');
  client.subscribe('lt-half');
}, 5000);
```

---
