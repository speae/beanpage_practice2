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


    let searchList = request.query.searchList
    let searchString = request.query.searchString;
    let escapeSearch = "'%"+searchString+"%'";

    const searchSql = "SELECT * FROM board_table WHERE ? LIKE '%'||?||'%' LIMIT ?, ?";
    const searchData = await db.queryComplex(searchSql, [searchList,  escapeSearch, startRow, pageSize]);

    const searchCount = "SELECT COUNT(*) FROM board_table WHERE ? LIKE '%'||?||'%'";
    const searchBoardCount = await db.queryOne(searchCount, [searchList, escapeSearch]);

    console.log(searchData);

    render_data.pageSize = pageSize;
    render_data.pageBlock = pageBlock;
    render_data.currentPage = currentPage;
    render_data.pageNumber = pageNumber;

    render_data.title = "게시판";
    render_data.source = "board/list";

    if(searchBoardCount===false){
        throw "검색 결과 불러오기 실패.";
    }

    const searchCountResult = parseInt(searchBoardCount['COUNT(*)']);

    if(searchData===false || (searchList || searchString) === undefined) {

        const sql = "SELECT * FROM board_table WHERE 1 ORDER BY num DESC LIMIT ?, ?";
        const resultData = await db.queryInteger(sql, [startRow, pageSize]);
        if (resultData === false) {
            throw "게시글 불러오기 실패.";
        }

        const count = "SELECT COUNT(*) FROM board_table"
        const boardCount = await db.queryOne(count, []);

        if (boardCount === false) {
            throw "게시글 불러오기 실패.";
        }

        const countResult = parseInt(boardCount['COUNT(*)']);


        try {

            render_data.rows = resultData;
            render_data.countResult = countResult;

            throw "SUCCESS";
        } catch (e) {
            if (e === "SUCCESS") {
                return true;
            } else {
                render_data.err_msg = e;
                return false;
            }
        }

    }else if (searchData !== false && (searchList && searchString) !== undefined) {

        try {
            render_data.rows = searchData;
            render_data.countResult = searchCountResult;

            throw "SUCCESS";
        } catch (e) {
            if (e === "SUCCESS") {
                return true;
            } else {
                render_data.err_msg = e;
                return false;
            }
        }


    }
};

