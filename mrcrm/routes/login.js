var express = require('express');
var config = require('../config/config')
var router = express.Router();
const jwt = require('jsonwebtoken');

router.get('/', checkLogin, (req, res) => {
  res.render('login', {
    login: res.login,
    data: res.data
  })
})

function checkLogin(req, res, next) {
  try {
    const token = req.cookies["auth-token"]
    jwt.verify(token, config.secretCode, (error, authData) => {
      if (error) {
        res.login = false;
      } else {
        res.login = true;
        res.data = authData;
      }
    })
    next()
  } catch (e) {
    console.log(e)
  }
}

router.post('/login', (req, res) => {
  //connect to db and get id, permissions
  const user = {
    email: req.body.email,
  }
  let token = jwt.sign(user, config.secretCode);
  res.cookie("auth-token", token); 
  res.redirect("/");
})

router.post('/logout', (req, res) => {
  res.clearCookie("auth-token");
  res.json({success:true});
})

module.exports = router;