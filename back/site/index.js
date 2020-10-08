/**
 * / 랜더링 준비 처리
 * @param request
 * @param response
 * @param render_data
 * @param {[]} query_list
 * @return {Promise<boolean>}
 */
module.exports = async function(request, response, render_data, query_list) {
    const COMMON = require('../class/common');
    try{

        render_data.source = "site/index";
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