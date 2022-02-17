var express = require('express');
var config = require('../config/config')
var router = express.Router();
const jwt = require('jsonwebtoken');

router.get('/', (req, res) => {
  try {
    const token = req.cookies["auth-token"]
    jwt.verify(token, config.secretCode, (error, authData) => {
      if (error) {
        res.redirect('/user/')
      }
      console.log(authData)
      res.render('index', { title: authData.email });
    })
  } catch (error) {
    res.redirect('/user/')
  }
})

module.exports = router;
