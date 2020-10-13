
process.env.TZ = "Asia/Seoul";

/**
 *
 * 메인 GET,POST 요청 처리
 * @param {string} type GET/POST
 * @param {{}} request
 * @param {{}} response
 */
module.exports = async function(type, request, response) {
    const COMMON = require("./class/common");
    const DAO_MYSQL = require("./class/dao_mysql");

    //렌더 데이터 생성
    let render_data = {err_msg:'', m:'', m2:'', m3:'', COMMON: COMMON, site_data:{}, js_command_list:[], site_url:'', source:'', is_template_site:'N', alert_msg:'', redirect_url:'', meta_tag_list : [], rows: []};
    try{

        //요청이 들어온 쿼리 리스트 구하기
        const query_list = COMMON.getQueryList(request);

        //GET 일경우 UI 랜더링 처리
        if (type==="get") {

            if(query_list[0]==='board'){
                if(query_list[1]==='list'){
                    // const insertData = ["num", "subject", "writer", "write_content", "write_date", "count"];
                    //
                    // const DAO_MYSQL = require('./class/dao_mysql');
                    // const db = new DAO_MYSQL();
                    //
                    // const sql="select * from board_table";
                    // const resultData = await db.query(sql, insertData);
                    //
                    // const rows = function (rows=resultData) {
                    //     for(i<0; i<rows.length; i++){
                    //         console.rows[i].name;
                    //     }
                    //     return rows;
                    // }
   await require('./board/list')(request, response, render_data, query_list);

                }else if(query_list[1]==='write'){

                    const DAO_MYSQL = require('./class/dao_mysql');
                    const db = new DAO_MYSQL();
                    db.setTable('board_table');
                    const sql="select max(num) from board_table";
                    const num = db.queryOnlyOne(sql);

                    await require('./board/write')(request, response, render_data, query_list);

                }
            }else{
                await require('./site/index')(request, response, render_data, query_list);
             }

            //처리도중 얼러트 발생한경우
            if (render_data.alert_msg!=='') render_data.err_msg += `<script>alert('${COMMON.escapeJavascript(render_data.alert_msg)}')</script>`;

            //처리도중 리다이렉트가 발생한경우
            if (render_data.redirect_url!=='') render_data.err_msg += `<script>window.location.href='${render_data.redirect_url}'</script>`;

            //처리도중 에러가 발생한경우 에러화면으로 랜더링
            if (render_data.err_msg!=='') throw render_data.err_msg;

            //랜더링 시작
            if (render_data.source !== "") {
                response.render(render_data.source, render_data);
            }

            //POST 일경우 내부 처리후 json 렌더링
        }else if (type==="post"){
            const reqBody = request.body;
            const num = reqBody['num'];
            const subject = reqBody['subject'];
            const writer = reqBody['writer'];
            const write_content = reqBody['write_content'];
            const write_date = reqBody['write_date'];
            const count = 0;

            const insertData = [num, subject, writer, write_content, write_date, count];

            let result = {insertData};
            let render_data = {err_msg:'', m:'', m2:'', m3:'', COMMON: COMMON, site_data:{}, js_command_list:[], site_url:'', source:'', is_template_site:'N', alert_msg:'', redirect_url:'', meta_tag_list : []};
            if(query_list[0]==='board') {

                switch (query_list[1].trim()) {


                    case "write":
                        //db 인스턴스 생성
                        const db = new DAO_MYSQL();

                        db.setTable('board_table');
                        db.add('num', num+1);
                        db.add('subject', subject);
                        db.add('writer', writer);
                        db.add('write_content', write_content);
                        db.add('write_date', write_date);
                        db.add('count', count);

                        await db.insert();

                        return result;
                }
                response.json(result);
                response.render('/board/write_pro', {'writer': writer});
            }

        }
    }catch(e){
        /* 에러 발생시 처리 */
        if (type==='get'){	//GET 일땐 에러 화면렌더링
            render_data.err_msg = e;
            response.render('error', render_data);

        }else if (type==='post'){	//POST 일땐 msg 에 에러메세지 리턴
            response.json({
                msg: e
            });
        }
    }
};