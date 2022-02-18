var express = require('express');
var router = express.Router();
const auth = require('./auth')

router.get('/', auth.authIfNotRedirectLogin, (req, res) => {
  res.render('index', {
    data: res.data
  });
})

module.exports = router;
