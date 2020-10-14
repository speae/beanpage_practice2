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
    try{

        render_data.title = "게시판";
        render_data.source = "board/write";
        throw console.log("게시글 쓰기.");
    }catch (e) {
        if (e === console.log("SUCCESS")) {
            return true;
        } else {
            render_data.err_msg = e;
            return false;
        }
    }
};
