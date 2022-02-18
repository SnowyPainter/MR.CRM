var express = require('express');
var router = express.Router();
const auth = require('./auth')

router.get('/', auth.authIfNotRedirectLogin, (req, res) => {
  res.render('index', {
    data: res.data
  });
})
router.get('/create', auth.authIfNotRedirectLogin, (req, res) => {
  if(res.data.manager == 1) {
    res.render('createForm', {
      data: res.data
    });
  } else {
    res.redirect('/')
  }
})

module.exports = router;
