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
    try{

        render_data.title = "게시판";
        render_data.source = "board/replyUpdate";
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