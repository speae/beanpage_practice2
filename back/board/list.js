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


    const pageSize = 10;
    const pageBlock = 10;
    const count = "SELECT COUNT(*) FROM board_table"
    const boardCount = await db.queryOne(count, []);

    if(boardCount===false){
        throw "게시글 불러오기 실패.";
    }

    const countResult = parseInt(boardCount['COUNT(*)']);
    const currentPage = COMMON.toInt(request.query.page);

    try{

        render_data.boardCount = countResult;
        render_data.pageSize = pageSize;
        render_data.pageBlock = pageBlock;
        render_data.currentPage = currentPage;

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

