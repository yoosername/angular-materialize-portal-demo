var express = require('express')
var router = express.Router()
var utils = require('../utils'), success = utils.success, error = utils.error

var db = require('../database')

const APP = "bitbucket"

router.route('/account')
    .get((req, res) => {

      db.findOne({'type':'account','application': APP}, function (err, doc) {
        if(err){
          error(res, 404, err)
        }
        success(res, doc);
      });

    })

router.route('/license')
    .put((req, res) => {

      var accActive = (req.body.signed) ? true : false;

      db.update(
        {type:'account',application: APP},
        {type:'account',application: APP, active: accActive},
        {upsert: true},
        function (err, numReplaced, upsert) {
          if(err){
            error(res, 404, err)
          }
          success(res, upsert);
        }
      );

    })

router.route('/project')
  .get((req, res) => {

    db.find({type:'project',application: APP}, function (err, docs) {

      if(err){
        error(res, 404, err)
      }

      success(res, docs)

    });

  })

  .post((req, res) => {

    db.insert(Object.assign({}, req.body, {
      // id field is mongo style = _id
      created: new Date().getTime(),
      type: "project",
      application: APP
    }), function (err, newDoc) {
      if(err){
        error(res, 404, err)
      }
      success(res, newDoc)
    });

  })

router.route('/project/:id')
  .get((req, res) => {

    db.findOne({type:'project',application: APP,_id:req.params.id}, function (err, doc) {
      if(err){
        console.log(err)
        error(res, 404, err)
      }
      success(res, doc);
    });

  })

  .put((req, res) => {

    db.update({ _id: req.params.id }, req.body, {returnUpdatedDocs:true}, function (err, numReplaced, docs) {
      if(err){
        error(res, 404, err)
      }
      success(res, docs)
    });

  })

  .delete((req, res) => {

    db.remove({ _id: req.params.id }, {}, function (err, numRemoved) {
      if(err){
        error(res, 404, err)
      }
      success(res, {"deleted":req.params.id})
    });

  })

module.exports = router;
