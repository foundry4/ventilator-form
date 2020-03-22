var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', {  });
});

router.post('/submit', function(req, res, next) {
  console.log(res);
  
  res.render('confirm', { });
});

module.exports = router;
