/**
 * /board 랜더링 준비 처리
 * @param request
 * @param response
 * @param render_data
 * @param {[]} query_list
 * @return {Promise<boolean>}
 */
module.exports = async function(request, response, render_data, query_list) {
    const COMMON = require('../class/common');
    const insertData = ["num"];

    const DAO_MYSQL = require('../class/dao_mysql');
    const db = new DAO_MYSQL();
    db.setTable('board_table');
    const sql="select max(num) from board_table";
    const resultData = await db.query(sql, insertData);

    try{
        render_data.num = resultData;
        render_data.source = "board/write";
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
