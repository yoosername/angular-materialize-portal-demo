var express = require('express');
var router = express.Router();

router.route('/')
    .post((req, res) => {
      var newPassword = req.body.password || {};
      console.log("POST: /api/password: " + JSON.stringify(newPassword));
      var pass = creds.insert( { 'password' : newPassword } );
      success(res, {reset:true});
    })

module.exports = router;
