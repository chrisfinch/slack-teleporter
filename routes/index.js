var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/teleport', function(req, res, next) {

  console.log('request', req);

});

router.post('/teleport', function(req, res, next) {

  console.log('request', req);

});

module.exports = router;
