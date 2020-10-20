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
    const Size = pageSize.toString();
    const pageBlock = 10;
    const currentPage = page;
    const pageNumber = count - (currentPage - 1) * pageSize;

    const startRow=(currentPage-1)*pageSize+1; //최소 1
    const endRow=(currentPage)*pageSize;

    const sql="SELECT @rowNumber := @rowNumber + 1 AS rowNumber, A.* FROM (SELECT * FROM board_table ORDER BY num DESC) A, (SELECT @rowNumber := 0 ) B WHERE @rowNumber<?";
    const resultData = await db.query(sql, [Size]);
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

