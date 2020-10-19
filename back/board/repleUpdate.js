/**
 *
 * @param request
 * @param response
 * @param render_data
 * @param query_list
 * @returns {Promise<boolean>}
 */
module.exports = async function (request, response, render_data, query_list) {
    const COMMON = require('../class/common');
    const DAO_MYSQL = require('../class/dao_mysql');

    const db = new DAO_MYSQL();

    try {

        const num = request.query.num;

        const sql = "SELECT * FROM board_table WHERE num=?";
        const viewData = await db.queryOne(sql, [num]);

        if (viewData === false) {
            throw "개인 게시글 불러오기 실패.";
        }

        const countSql = "SELECT count FROM board_table WHERE num=?";
        const count_data = await db.queryOne(countSql, [num]);
        if (count_data === false) {
            throw "조회 실패";
        }

        const repleSql = "SELECT * FROM reple WHERE num=?";
        const repleData = await db.query(repleSql, [num]);
        if (repleData === false) {
            throw "댓글불러오기 실패";
        }

        render_data.title = "게시판";
        render_data.source = "board/repleUpdate";
        render_data.rows = viewData;
        render_data.reple = repleData;

        throw "SUCCESS";
    } catch (e) {
        if (e === "SUCCESS") {

            return true;
        } else {
            render_data.err_msg = e;
            return false;
        }
    }
};
