const express = require('express')
var app = express();
var port    =   process.env.PORT || 8000;
var router = express.Router();
const bodyParser = require('body-parser')

const db = require('./server/database')

// Middleware to log API calls
router.use(function(req, res, next) {
    console.log(req.method, req.url, req.body);
    next();
});

// Static routes used by angular single page app
app.use('/lib', express.static(__dirname + '/bower_components'));
app.use('/js', express.static(__dirname + '/app/js'));
app.use('/css', express.static(__dirname + '/app/css'));
app.use('/img', express.static(__dirname + '/app/img'));
app.use('/partials', express.static(__dirname + '/app/partials'));

// API routes
const factory = require('./server/routes/api');

router.use('/jira', factory("jira"));
router.use('/confluence',factory("confluence"));
router.use('/bitbucket',factory("bitbucket"));
router.use('/password',require('./server/routes/password'));

// Parse json in API calls
app.use(bodyParser.json({ type: 'application/json' }))
app.use('/api', router)

// Serve Static Index
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/app/index.html')
})

// Start listening
app.listen(port, function(){
  console.log('Listening on port ' + port);
})
