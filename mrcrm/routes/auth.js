var config = require('../config/config')
const jwt = require('jsonwebtoken');

module.exports.permissionUpdateOrInsert = (teamId, newPermission, permission) => {
  let find = false;
  let splited = permission.split(',');
  splited.forEach((p, i) => {
      if (p.trim().split(' ')[0] == teamId) {
          splited[i] = p[0] + " " + newPermission;
          find = true;
      }
  });
  permission = splited.join(',');
  if (!find) {
      if (permission != "") permission += ", ";
      permission += (teamId + " " + newPermission);
  }
  return permission;
}

module.exports.parsePermission = (permission) => {
  let p = []
  if(permission == null) return p;
  permission.split(',').forEach(team => {
    const s = team.trim().split(' ')
    p.push([s[0], s[1]])
  });
  return p
}

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