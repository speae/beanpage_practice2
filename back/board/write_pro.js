const express = require('express');
const router = express.Router();
const db = require("../class/dao_mysql");

router.post('board/write_pro.js', function (req, res, next) {
    const reqBody = req.body;
    const num = reqBody['num'];
    const subject = reqBody['subject'];
    const writer = reqBody['writer'];
    const write_date = reqBody['write_date'];
    const write_content = reqBody['write_content'];
    const count = parseInt(reqBody['count']);

    const sql = 'insert into board_table values (?, ?, ?, ?, timestamp, ?)';
    const insertData = [
        num, subject, writer, write_content, write_date, count+1
    ];
    db.CONN_DATA_TEST(sql, insertData, function (err, rows, fields) {
        if(err){
            console.log(err);
            res.redirect('/board/write');
        }
        console.log("input success");
        res.redirect('/board/read');
    });
})

module.exports = router;