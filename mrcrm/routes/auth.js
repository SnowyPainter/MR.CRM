var config = require('../config/config')
const jwt = require('jsonwebtoken');

module.exports.authIfNotRedirectLogin = (req, res, next) => {
  try {
    const token = req.cookies["auth-token"]
    jwt.verify(token, config.secretCode, (error, authData) => {
      if (error) {
        res.redirect('/user/')
      }
      res.data = authData;
      next();
    })
  } catch (error) {
    res.redirect('/user/')
  }
}

module.exports.checkLogin = (req, res, next) => {
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
    console.log("auth.js 32 "+e)
  }
}