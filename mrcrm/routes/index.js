var express = require('express');
var router = express.Router();
const auth = require('./auth')

router.get('/', auth.authIfNotRedirectLogin, (req, res) => {
  res.render('index', {
    data: res.data
  });
})

router.get('/get/list/users', auth.authIfNotRedirectLogin, (req, res) => {
  res.db.select("User", ["id", "name"], "", (err, rows) => {
    if(!err) res.json({users:rows})
    else res.json({err:err})
  })
})

module.exports = router;
