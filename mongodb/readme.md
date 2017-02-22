# Installing MongoDB Locally

We are going to "cheat" a little bit and use the mighty ScotchBox Vagrant box.

- Install [virtualbox](https://www.virtualbox.org/wiki/Downloads)
- Install [vagrant](https://www.vagrantup.com/docs/installation/)
- Install [Scotch Box](https://box.scotch.io/) using the directions below

### Vagrant + Virtual + ScotchBox = ~5 Min. Setup

- Vagrant is a container that allows us to *containerize* our local setup
- Virtualbox is a provider that handles virtual containers like vagrant
- ScotchBox is a popular vagrant setup that already has `npm`, `node`, and `mongodb` installed!

### Install Scotchbox

```
# Go to a directory where we can install a new vagrant box
cd /var/www

# clone repo into "mongoapp" directory

# vagrant is very picky with permissions. Let's chmod 777 the directory for quick setup - 
sudo mkdir mongoapp
sudo chmod -R 777 mongoapp  

git clone https://github.com/scotch-io/scotch-box.git mongoapp

cd mongoapp
vagrant up
```

## Setup a New Node Project

- SSH into vagrant
- Create a new directory `/var/www/mongoapp`
- Initialize a new npm project `npm init`
- Add `mongodb` as a dependency in package.json
- Install modules via `npm install`

```
vagrant ssh

# Once inside vagrant:
mkdir /var/www/mongoapp
cd /var/www/mongoapp

# Initialize new project
npm init

# add mongodb dependency to package.json
vim package.json
```

### package.json

The final package.json should look like this (notice how you'll need to add the dependency)

```javascript
{
  "name": "mongoapp",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "dependencies" : {
    "mongodb": "~2.2"
  },
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "author": "",
  "license": "ISC"
}
```

Finally install all the npm modules
```
npm install
```

## Simple App to Insert Mongo Documents

We will create a simple app to insert a few mongo documents.

Inside `/var/www/mongoapp` create a new file `app.js`:

```
cd /var/www/mongoapp
vim app.js
```

### app.js

```javascript
var MongoClient = require('mongodb').MongoClient
  , assert = require('assert');

// Connection URL 
var db = 'meetup';
var url = 'mongodb://localhost:27017/' + db;

// Use connect method to connect to the Server 
MongoClient.connect(url, function(err, db) {
  assert.equal(null, err);
  console.log("Connected correctly to server");

  var collection = 'flatiron';
  insertDocuments(db, collection, function() {
    db.close();
  });
});

var insertDocuments = function(db, collection, callback) {
  var collection = db.collection(collection);

  // Insert some documents 
  collection.insertMany([
    {
      "name" : "NoSQL Meetup",
      "date" : new Date('2017-02-22 18:30'),
      "presentations" : ['Redis', 'MongoDB', 'Neo4j Talk'],
      "attendees" : 77
    },
    {
      "artist" : "Calvin Harris",
      "album" : "Motion",
      "song" : "Summer",
      "year" : 2014,
      "length" : {
        "friendly" : "3:43",
        "seconds" : 223
      }
    }
  ], function(err, result) {
    assert.equal(err, null);
    assert.equal(2, result.result.n);
    assert.equal(2, result.ops.length);
    console.log("Inserted 2 documents into the document collection");
    callback(result);
  });
}
```

At this point, you can run `ls -la` to view all files in the directory. You should see something like:

#### Project Setup

```
vagrant@scotchbox:/var/www/mongoapp$ ls -la
total 8
drwxrwxrwx 1 vagrant vagrant  170 Feb 22 16:39 .
drwxrwxrwx 1 vagrant vagrant  306 Feb 22 15:35 ..
-rw-rw-rw- 1 vagrant vagrant 1207 Feb 22 16:10 app.js
drwxrwxrwx 1 vagrant vagrant  442 Feb 22 15:37 node_modules
-rw-rw-rw- 1 vagrant vagrant  252 Feb 22 15:37 package.json
```

## Running our App

```
node app.js
```

If everything was installed successfully, we should see a simple response:
```
vagrant@scotchbox:/var/www/mongoapp$ node app.js

Connected correctly to server
Inserted 2 documents into the document collection
```

## Final Frontier: View Documents in Mongo Shell

Scotchbox comes preloaded with the mongo console installed.

#### Enter the mongo console:
```
mongo
```
There may be a few warnings on start up - that is OK.

#### Inside Mongo Console
```
// Show databases - we should see: (local, meetup, scotchbox)
show dbs;

// Let's enter into "meetup" database
use meetup;

// Show collections - we should see: (flatiron, system.indexes)
show collections;

// Lets view our documents
db.flatiron.find();

// View document count
db.flatiron.count();
```

### Next Steps? --> Build something awesome.
