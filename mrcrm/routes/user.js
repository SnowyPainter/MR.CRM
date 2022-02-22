var express = require('express');
var config = require('../config/config')
var router = express.Router();
const jwt = require('jsonwebtoken');
const auth = require('./auth')

router.get('/', auth.checkLogin, (req, res) => {
  res.render('login', {
    login: res.login,
    data: res.data,
  })
})

function parsePermission(permission) {
  let p = []
  if(permission == null) return p;
  permission.split(',').forEach(team => {
    const s = team.trim().split(' ')
    p.push([s[0], s[1]])
  });
  return p
}

router.get('/manage', auth.authIfNotRedirectLogin,(req, res) => {
  if (res.data.manager != 1) res.json({ err: "not manager" })
  
  res.db.select("User", [], "", (err, rows) => {
    if(!err) {
      res.render("userManage", {
        users: rows,
        data: res.data
      });
    } else {
      res.send(err);
    }
  })
})

router.post('/login', (req, res) => {
  res.db.select("User", [], "WHERE email='"+req.body.email+"' AND "+"password='"+req.body.password+"'", (err, rows) => {
    if(!err && rows.length > 0) {
      const row = rows[0]
      const user = {
        id: row.id,
        email: row.email,
        name: row.name,
        manager: row.manager,
        permission: parsePermission(row.permission)
      }
      let token = jwt.sign(user, config.secretCode);
      res.cookie("auth-token", token); 
      res.redirect("/");
    } else {
      res.redirect("/user")
    }
  })
})

router.post('/logout', (req, res) => {
  res.clearCookie("auth-token");
  res.json({success:true});
})

module.exports = router;