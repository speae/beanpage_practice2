/**
 * /board/read 랜더링 준비 처리
 * @param request
 * @param response
 * @param render_data
 * @param {[]} query_list
 * @return {Promise<boolean>}
 */
module.exports = async function(request, response, render_data, query_list) {
    const COMMON = require('../class/common');
    const insertData = ["num", "subject", "writer", "write_content", "write_date", "count"];

    const DAO_MYSQL = require('../class/dao_mysql');
    const db = new DAO_MYSQL();

    const sql="select * from board_table order by num desc";
    const resultData = await db.query(sql, insertData);


    try{
        render_data.title = "게시판";
        render_data.source = "board/list";
        render_data.rows = resultData;
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
