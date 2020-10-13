/**
 *
 */
// const express = require('express');
// const router = express.Router();
// const dao = require('../class/dao_mysql');
// const conn = dao.conn_data;
//
// router.post('./board/write', function(req, res){
//     const reqBody = req.body;
//     const num = reqBody['num'];
//     const subject = reqBody['subject'];
//     const writer = reqBody['writer'];
//     const write_date = reqBody['write_date'];
//     const write_content = reqBody['write_content'];
//     const count = 0;
//
//     const sql = 'INSERT INTO board_table VALUES (?, ?, ?, ?, TIMESTAMP, ?)';
//     const insertData = [
//         num, subject, writer, write_content, write_date, count
//     ];
//     conn.query(sql, insertData, function (err) {
//         if(err){
//             console.log(err);
//             res.status(500).send('internal Server Error');
//         }
//         console.log('insert success');
//         res.redirect('board/read');
//     })
// });
//
// module.exports = router;
/**
 *
 * @param request
 * @param response
 * @param render_data
 * @param query_list
 * @returns {Promise<boolean>}
 */
module.exports = async function(request, response, render_data, query_list) {
    const COMMON = require('../class/common');
    const main = require('../main');
    try{
        render_data.writer = 'writer';
        render_data.source = "board/write_pro";
        throw "SUCCESS";
    }catch (e) {
        if (e === "SUCCESS") {
            return true;
        } else {
            render_data.err_msg = e;
            return false;
        }
    }
};