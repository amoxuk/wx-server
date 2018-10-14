var mysql = require("mysql");
var config = require(".config")
var pool = mysql.createPool({
    host: `${config.mysql.host}`,
    user: `${config.mysql.user}`,
    password: `${config.mysql.password}`,
    database: `${config.mysql.database}`,
    charset:`${config.mysql.charset}`,
});

function query(sql,callback){
    pool.getConnection(function(err,connection){
        connection.query(sql, function (err,rows) {
            callback(err,rows);
            connection.release();
        });
    });
}

exports.query = query;