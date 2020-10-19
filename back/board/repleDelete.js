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
    const DAO_MYSQL = require('../class/dao_mysql');

    const db = new DAO_MYSQL();

    try{

        const reqQuery = request.query;
        const num = reqQuery.num;
        const reply_num = reqQuery.reply_num;

        const sql = "SELECT * FROM board_table WHERE num=?";
        const viewData = await db.queryOne(sql, [num]);

        if (viewData === false) {
            throw "개인 게시글 불러오기 실패.";
        }

        const replySql = "SELECT * FROM reply WHERE num=?";
        const replyData = await db.query(replySql, [num]);
        if (replyData === false) {
            throw "댓글불러오기 실패";
        }

        db.setTable('reply');
        db.add('reply_num', reply_num);
        if (await db.delete('reply_num=?', [reply_num]) === false) {
            throw "삭제 실패.";
        }

        render_data.title = "게시판";
        render_data.rows = viewData;
        render_data.reply = replyData;
        response.redirect('/board/read?num='+num);
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
