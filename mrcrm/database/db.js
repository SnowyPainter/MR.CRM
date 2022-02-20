const { get } = require("express/lib/response");
let config = require("../config/config")
const sqlite3 = require('sqlite3').verbose();
let db = undefined;

function isDatabaseUndefined() {
    if (!db)
        return true;
    return false;
}
function getNowDate() {
    const d = new Date();
    return d.getFullYear() + "-" + d.getMonth() + "-" + d.getDay() + " " + d.getHours() + ":" + d.getMinutes() + ":" + d.getSeconds() + ":" + d.getMilliseconds()
}
function getDateFromString(str) {
    return new Date(str)
}
function safeChar(str) {
    str = str.replaceAll("'", "");
    str = str.replaceAll('"', "");
    return str
}
function updateString(table, sets, condition) {
    let set = []
    for (let [column, value] of Object.entries(sets)) {
        value = safeChar(value)
        set.push(column + "=" + "'" + value + "'")
    }
    const s = "UPDATE " + table + " SET " + set.join(', ') + " " + condition;
    return s
}
function insertString(table, insertOrder, values) {
    for(let i = 0;i < values.length;i++) {
        values[i] = safeChar(values[i])
    }
    let order = insertOrder.map((f) => f).join(',');
    let val = values.map((v) => "'" + v + "'").join(',');
    return "INSERT INTO " + table + " (" + order + ")" + " VALUES(" + val + ");";
}
function selectString(table, fieldArray, condition) {
    const f = fieldArray.length == 0 ? "*" : fieldArray.map((f) => f).join(',');
    const s = "SELECT " + f + " FROM " + table + " " + condition;
    return s;
}
function createTableString(name, field) {
    let t = []
    for (const [key, detail] of Object.entries(field)) {
        t.push(key + " " + detail)
    }
    return "CREATE TABLE IF NOT EXISTS " + name + "(" + t.map((f) => f).join(', ') + ");"
}
function deleteRowString(table, condition) {
    return "DELETE FROM "+table+" "+condition;
}

function _insert(table, orderArray, valueArray) {
    const s = insertString(table, orderArray,
        valueArray);
    db.run(s);
}

module.exports.insert = (table, keyvalueArray) => {
    order = []
    vals = []
    for (const [key, value] of Object.entries(keyvalueArray)) {
        order.push(key)
        vals.push(value)
    }
    _insert(table, order, vals)
}
module.exports.select = (table, fieldArray, condition, handler) => {
    db.all(selectString(table, fieldArray, condition), [], (err, rows) => {
        handler(err, rows)
    })
}
module.exports.update = (table, sets, condition) => {
    const s = updateString(table, sets, condition);
    db.run(s)
}
module.exports.updateOrInsert = (table, values, condition) => {
    order = []
    vals = []
    for (const [key, value] of Object.entries(values)) {
        order.push(key)
        vals.push(value)
    }
    this.select(table, ["id"], condition, (err, rows) => {
        if (err || rows == undefined || rows.length == 0) {
            _insert(table, order, vals)
        } else {
            this.update(table, values, condition)
        }
    })
}
module.exports.delete = (table, condition) => {
    if(condition == undefined || condition == "") return;
    db.run(deleteRowString(table, condition))
}
module.exports.serialize = (f) => {f()}
module.exports.initialize = () => {
    db = new sqlite3.Database(config.dbPath, (err) => {
        if (err) {
            console.log(err)
        }
        console.log("Well connected to sqlite");
    });
    db.serialize(() => {
        db.run(createTableString("Team", {
            "id": "INTEGER PRIMARY KEY AUTOINCREMENT",
            "name": "TEXT"
        }))
        db.run(createTableString("User", {
            "id": "INTEGER PRIMARY KEY AUTOINCREMENT",
            "manager": "INTEGER",
            "email": "TEXT",
            "name" : "TEXT",
            "password": "TEXT",
            "permission": "TEXT",
            "team": "TEXT"
        }));
         this.insert("User", {
            "manager":"1",
            "email":"a",
            "name":"a",
            "password":"1",
            "permission": "1 R, 2 RW",
            "team": "1"
        })
        db.run(createTableString("ReportForm", {
            "id": "INTEGER PRIMARY KEY AUTOINCREMENT",
            "quests": "TEXT",
            "title" : "TEXT"
        }))
        db.run(createTableString("ReportFormField", {
            "id": "INTEGER PRIMARY KEY AUTOINCREMENT",
            "field": "TEXT"
        }))
        db.run(createTableString("ReportFormQuest", {
            "id": "INTEGER PRIMARY KEY AUTOINCREMENT",
            "fieldId": "TEXT",
            "submitType": "TEXT"
        }))
        db.run(createTableString("Report", {
            "id": "INTEGER PRIMARY KEY AUTOINCREMENT",
            "user": "INTEGER",
            "form": "INTEGER",
            "data": "TEXT",
            "date": "TEXT"
        }))
    })
}

module.exports.getTeamUrlPairs = (handler) => {
    this.select("Team", [], "", (err, rows) => {
        let teams = []
        if (err) {
            handler(teams)
            return;
        }
        rows.forEach(r => {
            teams.push([r.name, "/teams/" + r.id])
        });
        handler(teams)
    })
}