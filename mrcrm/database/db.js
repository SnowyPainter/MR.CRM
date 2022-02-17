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
function createTableString(name, field) {
    let t = []
    for(const [key, detail] of Object.entries(field)) {
        t.push(key+" "+detail)
    }
    return "CREATE TABLE IF NOT EXISTS "+name+"("+t.map((f)=>f).join(', ')+");"
}

module.exports.initialize = () => {
    db = new sqlite3.Database(config.dbPath, (err) => {
        if (err) {
            console.log(err)
        }
        console.log("Well connected to sqlite");
    });
    db.serialize(() => {
        db.run(createTableString("User", {
            "id" : "INTEGER PRIMARY KEY AUTOINCREMENT", 
            "manager" : "INTEGER", 
            "email" : "TEXT",
            "password" : "TEXT",
            "permission" : "TEXT"
        }));
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
        
        /* db.run(insertString("User", ["manager", "email", "password"],
            ["0", "a@a.com", "1234"]));
        db.all("SELECT * FROM User", [], (err, rows) => {
            if(err) { throw err; }
            rows.forEach(row => {
                console.log(row)
            });
        }) */
    })
}