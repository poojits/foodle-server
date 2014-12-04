var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', { title: 'Foodle: Food Graph based on Nutritional Information' });
});

module.exports = router;
