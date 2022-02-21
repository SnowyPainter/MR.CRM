var express = require('express');
var config = require('../config/config')
var router = express.Router();
const jwt = require('jsonwebtoken');
const auth = require('./auth')

router.use('/', auth.authIfNotRedirectLogin);

router.get('/create', (req, res) => {
    if (res.data.manager != 1) res.redirect('/')

    res.render('createForm', {
        creation: true,
        data: res.data
    });
})

router.get('/form/manage', (req, res) => {
    if (res.data.manager != 1) res.redirect('/')

    res.db.select("ReportForm", ["id", "title"], "", (err, rows) => {
        if(!err) {
            res.render("reportFormManage", {
                forms:rows,
                data:res.data
            })
        } else {
            res.redirect("/")
        }
    })
})
router.get('/manage/:formId', (req, res) => {
    if (res.data.manager != 1) res.redirect('/')

    res.db.select("ReportForm", [],"WHERE id="+req.params.formId, (err, rows) => {
        if(!err && rows.length > 0) {
            res.render("createForm", {
                creation: false,
                formId: rows[0].id,
                quests: rows[0].quests.split(' '),
                title:rows[0].title,
                data: res.data,
            })
        } else {
            res.send(err)
        }
    })
})

router.get('/get/list/:table', (req, res) => {
    if (res.data.manager != 1) res.json({ data: [] });
    res.db.select(req.params.table, [], "", (err, rows) => {
        if(!err)
            res.json({ data: rows });
        else
            res.json({ err:err})
    })
})

router.get('/get/:table/:id', (req, res) => {
    const table = req.params.table;
    const id = req.params.id;
    res.db.select(table, [], "WHERE id=" + id, (err, rows) => {
        if (!err) {
            res.json({rows:rows})
        } else {
            res.json({err:err})
        }
    })
})
router.get('/update/form/:id', (req,res) => {
    const id = req.params.id;
    const qs = req.query.quests;
    const title = req.query.title;

    res.db.update("ReportForm", {
        "title": title,
        "quests": qs,
    }, "WHERE id="+id)
    res.json({result:true})
})
router.get('/add/form', (req, res) => {
    const quests = req.query.quests;
    const title = req.query.title;
    res.db.insert("ReportForm", {
        "quests" : quests,
        "title": title,
    })
    res.send(quests)
})
router.get('/add/quest', (req, res) => {
    const fieldId = req.query.fieldId;
    const type = req.query.type;

    res.db.insert("ReportFormQuest", {
        "fieldId": fieldId,
        "submitType": type,
    })
    res.send({})
})
router.get('/add/fields', (req, res) => {
    const fieldText = req.query.field;
    res.db.serialize(() => {
        res.db.insert("ReportFormField", {
            "field": fieldText
        })
        res.db.select("ReportFormField", ["id"], "ORDER BY id DESC LIMIT 1", (err, rows) => {
            if (!err) {
                res.send({
                    id: rows[0].id
                })
            } else {
                res.send({
                    err: err
                })
            }
        })
    })
})

router.get('/delete/quests/:id', (req, res) => {
    const id = req.params.id;
    res.db.delete("ReportFormQuest", "WHERE id=" + id);
    res.send({})
})
router.get('/delete/fields/:id', (req, res) => {
    const id = req.params.id;
    res.db.delete("ReportFormField", "WHERE id=" + id);
    res.db.select("ReportFormQuest", [], "WHERE id=" + id, (err, rows) => {
        rows.forEach(row => {
            if (row.fieldId == id) {
                res.db.delete("ReportFormQuest", "WHERE id=" + row.id)
            }
        });
    })
    res.send({})
})
router.get('/update/quests/:id', (req, res) => {
    const id = req.params.id;
    const fieldId = req.query.fieldId;
    const submitType = req.query.type;
    res.db.update("ReportFormQuest", {
        "fieldId": fieldId,
        "submitType": submitType
    }, "WHERE id=" + id)
    res.send({})
})
router.get('/update/fields/:id', (req, res) => {
    const id = req.params.id;
    const fieldText = req.query.field;
    res.db.update("ReportFormField", {
        "field": fieldText
    }, "WHERE id=" + id)
    res.send({})
})

module.exports = router;