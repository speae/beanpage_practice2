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
    const DAO_MYSQL = require('../class/dao_mysql');
    const db = new DAO_MYSQL();

    const sql="SELECT * FROM board_table ORDER BY num DESC";

    const resultData = await db.query(sql, []);
    if(resultData===false){
        throw "게시글 불러오기 실패.";
    }
    try{
        render_data.title = "게시판";
        render_data.source = "board/list";
        render_data.rows = resultData;
        throw console.log("게시글 불러오기.");
    }catch (e) {
        if (e === console.log("SUCCESS")) {
            return true;
        } else {
            render_data.err_msg = e;
            return false;
        }
    }
};

