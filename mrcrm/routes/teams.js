var express = require('express');
var config = require('../config/config')
var router = express.Router();
const jwt = require('jsonwebtoken');
const auth = require('./auth');
const { redirect } = require('express/lib/response');

router.use('/', auth.authIfNotRedirectLogin);

router.get('/add/member/:userId', (req, res) => {
    if (res.data.manager != 1) res.json({ err: "not manager" })

    const userId = req.params.userId;
    const teamId = req.query.teamId;
    let newPermission = req.query.p;

    res.db.select("User", [], "WHERE id=" + userId, (err, rows) => {
        if (!err) {
            const row = rows[0];
            let permission = auth.permissionUpdateOrInsert(teamId, newPermission, row.permission);
            const user = {
                id: row.id,
                email: row.email,
                manager: row.manager,
                permission: auth.parsePermission(row.permission)
            }
            let token = jwt.sign(user, config.secretCode);
            res.cookie("auth-token", token);
            res.db.update("User", {
                "permission": permission
            }, "WHERE id=" + userId);
            res.json({})
        }
    })
})
router.get('/create/team', (req, res) => {
    if (res.data.manager != 1) res.json({ err: "not manager" })

    const teamName = req.query.team;
    res.db.serialize(() => {
        res.db.insert("Team", {
            "name": teamName
        })
        res.db.select("Team", ["id"], "ORDER BY id DESC LIMIT 1", (err, rows) => {
            console.log(rows)
            if (!err) res.json({ teamId: rows[0].id })
            else res.json({ err: err })
        })
    })
})
router.get('/create', (req, res) => {
    if (res.data.manager != 1) res.redirect('/')
    res.render('createTeam', {
        data: res.data
    });
})

router.get('/:id', (req, res) => {
    const id = req.params.id
    new Promise((rs, rj) => {
        res.data.permission.map((arr) => {
            if (arr[0] == id)
                rs(true)
        })
        rj(false)
    }).then((result) => {
        if (result == true) {
            res.db.select("Team", [], "WHERE id=" + id, (err, row) => {
                if (err || row == undefined) {
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
        if (reason == false) {
            res.redirect('/')
        }
    })
})

router.get('/get/list', (req, res) => {
    if (res.data != undefined) {
        res.db.getTeamUrlPairs((teams) => {
            res.json({ teams: teams })
        })
    } else {
        res.json({ teams: [] })
    }
})

module.exports = router;
