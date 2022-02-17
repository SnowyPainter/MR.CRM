var express = require('express');
var config = require('../config/config')
var router = express.Router();
const jwt = require('jsonwebtoken');
const auth = require('./auth')

router.use('/', auth.authIfNotRedirectLogin);

router.get('/:id', auth.authIfNotRedirectLogin, (req, res) => {
    const id = req.params.id
    res.db.select("Team", [], "WHERE id=" + id, (err, row) => {
        if(err || row == undefined) {
            res.redirect('/');
        }
        res.render('team', {
            team: row,
            data: res.data
        });
    })
})

router.get('/get/list', (req, res) => {
    res.db.getTeamUrlPairs((teams) => {
        res.json({teams:teams})
    })
})

module.exports = router;
