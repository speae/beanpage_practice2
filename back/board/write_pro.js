var express = require('express');
var router = express.Router();
const app = require("../index");
const db = require("../class/dao_mysql");

app.post('board/write_pro.js', function (req, res) {
    var reqBody = req.body;
    var insertData = [
        reqBody.num, reqBody.subject, reqBody.writer, reqBody.write_content, reqBody.write_date, reqBody.count+1
    ];
    var sql = 'insert into board_table values (?, ?, ?, ?, timestamp, ?)';
    db.CONN_DATA_TEST(sql, insertData, function (err, results) {
        if(err){
            console.log(err);
        }
        console.log("input success "+results.insertId);
    });
    res.redirect('/board/read');
})