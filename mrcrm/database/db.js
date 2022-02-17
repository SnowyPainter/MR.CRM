const { get } = require("express/lib/response");
let config = require("../config/config")
const sqlite3 = require('sqlite3').verbose();
let db = undefined;

function isDatabaseUndefined() {
    if(!db)
        return true;
    return false;
}
function getNowDate() {
    const d = new Date();
    return d.getFullYear()+"-"+d.getMonth()+"-"+d.getDay()+" "+d.getHours()+":"+d.getMinutes()+":"+d.getSeconds()+":"+d.getMilliseconds()
}
function getDateFromString(str) {
    return new Date(str)
}
function insertString(table, insertOrder, values) {
    let order = insertOrder.map((f) => f).join(',');
    let val = values.map((v)=>"'"+v+"'").join(',');
    return "INSERT INTO "+table+" ("+order+")"+" VALUES("+val+");";
}
function selectString(table, fieldArray, condition) {
    const f = fieldArray.length == 0 ? "*" : fieldArray.map((f)=>f).join(',');
    return "SELECT "+f+" FROM "+table+" "+condition;
}
function createTableString(name, field) {
    let t = []
    for(const [key, detail] of Object.entries(field)) {
        t.push(key+" "+detail)
    }
    return "CREATE TABLE IF NOT EXISTS "+name+"("+t.map((f)=>f).join(', ')+");"
}

module.exports.insert = (table, orderArray, valueArray) => {
    db.run(insertString(table, orderArray,
            valueArray));
}
module.exports.select = (table, fieldArray, condition, handler) => {
    db.all(selectString(table, fieldArray, condition), [], (err, rows) => {
        handler(err, rows)
    })
}

module.exports.initialize = () => {
    db = new sqlite3.Database(config.dbPath, (err) => {
        if (err) {
            console.log(err)
        }
        console.log("Well connected to sqlite");
    });
    db.serialize(() => {
        db.run(createTableString("Team", {
            "id" : "INTEGER PRIMARY KEY AUTOINCREMENT",
            "name" : "TEXT"
        }))
        db.run(createTableString("User", {
            "id" : "INTEGER PRIMARY KEY AUTOINCREMENT", 
            "manager" : "INTEGER", 
            "email" : "TEXT",
            "password" : "TEXT",
            "permission" : "TEXT",
            "team" : "TEXT"
        }));
        /* db.run(insertString("Team", ["name"],
            ["t"])) */
        /*db.run(insertString("User", ["manager", "email", "password", "permission", "team"],
            ["0", "aa", "1234", "1 R, 2 RW", "2"])) */
        db.run(createTableString("ReportForm", {
            "id" : "INTEGER PRIMARY KEY AUTOINCREMENT",
            "html" : "TEXT"
        }))
        db.run(createTableString("ReportFormField", {
            "id" : "INTEGER PRIMARY KEY AUTOINCREMENT", 
            "field" : "TEXT"
        }))
        db.run(createTableString("Report", {
            "id" : "INTEGER PRIMARY KEY AUTOINCREMENT", 
            "user" : "INTEGER", 
            "form" : "INTEGER",
            "data" : "TEXT",
            "date" : "TEXT"
        }))
    })
}

module.exports.getTeamUrlPairs = (handler) => {
    this.select("Team", [], "", (err, rows) => {
        let teams = []
        if(err) {
            handler(teams)
            return;
        }
        rows.forEach(r => {
          teams.push([r.name, "/teams/"+r.id])
        });
        handler(teams)
    })
}