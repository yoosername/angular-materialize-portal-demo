var Datastore = require('nedb')
  , db = new Datastore({ filename: 'data/db', autoload: true });

module.exports = db
