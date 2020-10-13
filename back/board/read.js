
module.exports = async function(request, response, render_data, query_list) {
    const COMMON = require('../class/common');
    const DAO_MYSQL = require('../class/dao_mysql');
    const db = new DAO_MYSQL();


    const reqBody = request.body;
    const num = reqBody['num'];
    const sql="select * from board_table where num="+num;

    const selectData = await db.query(sql, []);
    if(selectData===false){
        throw "개인 게시글 불러오기 실패.";
    }
    try{
        render_data.title = "게시판";
        render_data.source = "board/list";
        render_data.rows = selectData;
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
