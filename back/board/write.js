/**
 * /board/write 랜더링 준비 처리
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

    try{

        const sql = "SELECT MAX(num) FROM board_table";
        const numData = await db.queryOne(sql, []);
        const number = parseInt(numData['MAX(num)']);

        if(numData === false){
            throw "게시글 번호 불러오기 실패";
        }

        render_data.number = number;
        render_data.title = "게시판";
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
