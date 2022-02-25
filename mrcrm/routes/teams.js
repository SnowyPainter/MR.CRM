var express = require('express');
var config = require('../config/config')
var router = express.Router();
const jwt = require('jsonwebtoken');
const auth = require('./auth');
const { redirect } = require('express/lib/response');

router.use('/', auth.authIfNotRedirectLogin);

router.get('/manage', (req, res) => {
    if (res.data.manager != 1) { res.redirect('/'); return; }
    
    res.db.getTeamUrlPairs((teams) => {
        res.render("manageTeam", { 
            teams: teams ,
            data: res.data
        })
    })
})
router.get('/create', (req, res) => {
    if (res.data.manager != 1) res.redirect('/')
    res.render('createTeam', {
        data: res.data
    });
})
router.get('/create/team', (req, res) => {
    if (res.data.manager != 1) { res.json({ err: "not manager" }); return }

    const teamName = req.query.team;
    res.db.serialize(() => {
        res.db.insert("Team", {
            "name": teamName
        })
        res.db.select("Team", ["id"], "ORDER BY id DESC LIMIT 1", (err, rows) => {
            if (!err) res.json({ teamId: rows[0].id })
            else res.json({ err: err })
        })
    })
})
//routing order. 맨 끝에 있어야함.
router.get('/:id', (req, res) => {
    const teamId = req.params.id
    new Promise((rs, rj) => {
        if(teamId == res.data.team) rs(true)
        res.data.permission.map((arr) => {
            if (arr[0] == teamId)
                rs(true)
        })
        rj(false)
    }).then((result) => {
        if (result == true) {
            res.db.select("Team", [], "WHERE id=" + teamId, (err, row) => {
                if (err || row == undefined) {
                    res.redirect('/');
                }
                res.render('team', {
                    team: row,
                    data: res.data,
                    readonly: auth.permissionCheck(res.data.permission, teamId, "R")
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
router.get('/edit/:id', (req,res) => {
    if (res.data.manager != 1) { res.redirect('/'); return; }

    const teamId = req.params.id;
    res.db.select("Team", [], "WHERE id="+teamId, (err, rows) => {
        if(!err) {
            res.render("editTeam", {
                id:rows[0].id,
                name:rows[0].name,
                data: res.data
            });
        }
    })
})
router.get('/update/:teamId', (req,res) => {
    if (res.data.manager != 1) { res.json({err:"not manager"}); return; }
    const teamId = req.params.teamId;
    const name = req.query.name;

    res.db.update("Team", {
        "name": name,
    }, "WHERE id="+teamId)

    res.json({})
});

router.get('/add/member/:userId', (req, res) => {
    if (res.data.manager != 1) { res.json({ err: "not manager" }); return; }

    const userId = req.params.userId;
    const teamId = req.query.teamId;
    let newPermission = req.query.p;

    res.db.select("User", [], "WHERE id=" + userId, (err, rows) => {
        if (!err) {
            const row = rows[0];
            let permission = auth.permissionUpdateOrInsert(teamId, newPermission, row.permission);
            if(userId == res.data.id) {
                const user = {
                    id: row.id,
                    email: row.email,
                    name: row.name,
                    manager: row.manager,
                    permission: auth.parsePermission(permission),
                    team: row.team
                }
                let token = jwt.sign(user, config.secretCode);
                res.clearCookie("auth-token")
                res.cookie("auth-token", token);
            }

            res.db.update("User", {
                "permission": permission
            }, "WHERE id=" + userId);
            res.json({})
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

router.get('/get/:teamId', (req, res) => {
    const teamId = req.params.teamId;
    res.db.select("Team", ["name"], "WHERE id="+teamId, (err, rows) => {
        if(!err) {
            res.json({team:rows[0]})
        } else {
            res.json({team:[]})
        }
    })
})

module.exports = router;
