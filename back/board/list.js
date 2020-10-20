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

    let page = COMMON.toInt(request.query.page);
    if(page === 0) page = 1;

    const pageSize = 10;
    const pageBlock = 10;
    const currentPage = page;
    const pageNumber = currentPage * pageSize;

    const startRow=(currentPage-1)*pageSize;
    const endRow=(currentPage)*pageSize;
    const startSize = startRow.toString();
    const endSize = endRow.toString();

    const setSql = "SET startSize=? and endSize=?";

    const sql="SELECT * FROM board_table WHERE 1 ORDER BY num DESC LIMIT ?, ?";
    const resultData = await db.query(sql, [startRow, endRow]);
    if(resultData===false){
        throw "게시글 불러오기 실패.";
    }

    const count = "SELECT COUNT(*) FROM board_table"
    const boardCount = await db.queryOne(count, []);

    if(boardCount===false){
        throw "게시글 불러오기 실패.";
    }

    const countResult = parseInt(boardCount['COUNT(*)']);


    try{

        render_data.boardCount = countResult;
        render_data.pageSize = pageSize;
        render_data.pageBlock = pageBlock;
        render_data.currentPage = currentPage;
        render_data.pageNumber = pageNumber;

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

