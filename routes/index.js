var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/teleport', function(req, res, next) {

  console.log('request');

});

module.exports = router;
