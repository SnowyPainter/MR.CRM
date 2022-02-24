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

router.post('/add', auth.authIfNotRedirectLogin, (req, res) => {
  if (res.data.manager != 1) { res.redirect('/'); return; }

  res.db.insert("User", {
    "email": req.body.email,
    "name": req.body.name,
    "password": req.body.password,
    "manager": req.body.manager,
    "permission":"",
    "team":""
  })
  
  res.redirect('/user')
})

router.get('/update/team/:id', auth.authIfNotRedirectLogin, (req, res) => {
  const userId = req.params.id;
  const teamId = req.query.teamId;

  res.db.update("User", {
    "team": teamId
  }, "WHERE id="+userId)
  res.json({})
})
router.get('/update/:id', auth.authIfNotRedirectLogin, (req, res) => {
  if (res.data.manager != 1) res.json({ err: "not manager" })
  const id = req.params.id;
  const name = req.query.name;
  const password = req.query.password;
  const email = req.query.email;
  const team = req.query.affteam;
  const ismanager = req.query.ismanager;
  let parsedPermission = [];
  req.query.team.forEach((p) => parsedPermission.push(p))
  parsedPermission = parsedPermission.join(', ');
  res.db.update("User", {
    "name": name,
    "password": password,
    "email": email,
    "manager": ismanager,
    "permission": parsedPermission
  }, "WHERE id="+id);

  res.redirect('/user/manage');
})

router.get('/get/list', (req, res) => {
  res.db.select("User", [], "", (err, rows) => {
    if(!err) {
      res.json({users:rows})
    } else {
      res.json({err:err})
    }
  })
})
router.get('/get/team/:id', (req, res) => {
  const id = req.params.id;
  res.db.select("User", ["team"], "WHERE id="+id, (err, rows) => {
    if(!err) {
      res.json({data:rows})
    } else {
      res.json({data:{}})
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
        permission: auth.parsePermission(row.permission)
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