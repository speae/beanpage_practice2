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

    const jsdom = require("jsdom");
    const {JSDOM} = jsdom;
    const {window} = new JSDOM();
    const {document} = (new JSDOM('')).window;
    global = document;
    let jQuery = require('jquery')(window);
    const $ = jQuery;

    const DAO_MYSQL = require('../class/dao_mysql');
    const db = new DAO_MYSQL();
    const num = $(location).attr('search').slice($(location).attr('search').indexOf('=')+1);
    console.log(num);

    const sql = "SELECT * FROM board_table WHERE num=" + num;
    const selectData = await db.query(sql, []);
    if (selectData === false) {
        throw "개인 게시글 불러오기 실패.";
    }
    try{
        render_data.title = "게시판";
        render_data.source = "board/read?num="+num;
        render_data.rows = selectData;
        throw console.log("개인 게시글 불러오기.");
    }catch (e) {
        if (e === "SUCCESS") {
            return true;
        } else {
            render_data.err_msg = e;
            return false;
        }
    }
};
