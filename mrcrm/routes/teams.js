var express = require('express');
var config = require('../config/config')
var router = express.Router();
const jwt = require('jsonwebtoken');
const auth = require('./auth')

router.use('/', auth.authIfNotRedirectLogin);

router.get('/:id', auth.authIfNotRedirectLogin, (req, res) => {
    const id = req.params.id
    new Promise((rs, rj) => {
        res.data.permission.map((arr) => {
            if(arr[0] == id)
                rs(true)
        })
        rj(false)
    }).then((result) => {
        if(result == true) {
            res.db.select("Team", [], "WHERE id=" + id, (err, row) => {
                if(err || row == undefined) {
                    res.redirect('/');
                }
                res.render('team', {
                    team: row,
                    data: res.data
                });
            })
        } else {
            res.redirect('/')
        }
    }).catch((reason) => {
        if(reason == false) {
            res.redirect('/')
        }
    })
})

router.get('/get/list',(req, res) => {
    if(res.data != undefined) {
        res.db.getTeamUrlPairs((teams) => {
            res.json({teams:teams})
        })
    } else {
        res.json({teams:[]})
    }
})

module.exports = router;
