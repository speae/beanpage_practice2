process.env.TZ = "Asia/Seoul";

/**
 *
 * 메인 GET,POST 요청 처리
 * @param {string} type GET/POST
 * @param {{}} request
 * @param {{}} response
 */
module.exports = async function (type, request, response) {
    const COMMON = require("./class/common");
    const DAO_MYSQL = require("./class/dao_mysql");

    //렌더 데이터 생성
    let render_data = {
        err_msg: '',
        m: '',
        m2: '',
        m3: '',
        COMMON: COMMON,
        site_data: {},
        js_command_list: [],
        site_url: '',
        source: '',
        is_template_site: 'N',
        alert_msg: '',
        redirect_url: '',
        meta_tag_list: [],
     };

    try {

        //요청이 들어온 쿼리 리스트 구하기
        const query_list = COMMON.getQueryList(request);

        //GET 일경우 UI 랜더링 처리
        if (type === "get") {
           if (query_list[0] === 'board') {
                if (query_list[1] === 'list') {

                    await require('./board/list')(request, response, render_data, query_list);

                } else if (query_list[1] === 'write') {

                    await require('./board/write')(request, response, render_data, query_list);

                } else if (query_list[1] === 'read') {

                    await require('./board/read')(request, response, render_data, query_list);

                }else if (query_list[1] === 'update') {

                    await require('./board/update')(request, response, render_data, query_list);

                }else if (query_list[1] === 'delete') {

               await require('./board/delete')(request, response, render_data, query_list);

                }else if (query_list[1] === 'repleWrite') {

                    await require('./board/repleWrite')(request, response, render_data, query_list);

                }else if (query_list[1] === 'repleDelete') {

                    await require('./board/repleDelete')(request, response, render_data, query_list);

                }else if (query_list[1] === 'repleADD') {

                    await require('./board/repleADD')(request, response, render_data, query_list);

                }
            } else {
                await require('./site/index')(request, response, render_data, query_list);
            }

            //처리도중 얼러트 발생한경우
            if (render_data.alert_msg !== '') render_data.err_msg += `<script>alert('${COMMON.escapeJavascript(render_data.alert_msg)}')</script>`;

            //처리도중 리다이렉트가 발생한경우
            if (render_data.redirect_url !== '') render_data.err_msg += `<script>window.location.href='${render_data.redirect_url}'</script>`;

            //처리도중 에러가 발생한경우 에러화면으로 랜더링
            if (render_data.err_msg !== '') throw render_data.err_msg;

            //랜더링 시작
            if (render_data.source !== "") {
                response.render(render_data.source, render_data);
            }

            //POST 일경우 내부 처리후 json 렌더링
        } else if (type === "post") {
            const reqBody = request.body;

            const subject = reqBody['subject'];
            const writer = reqBody['writer'];
            const write_content = reqBody['write_content'];
            const count = 0;

            //db 인스턴스 생성
            const db = new DAO_MYSQL();

            if (query_list[0] === 'board') {
                if (query_list[1].trim() === 'write') {

                    db.setTable('board_table');
                    db.add('subject', subject);
                    db.add('writer', writer);
                    db.add('write_content', write_content);
                    db.add('count', count);

                    if (await db.insert() === false) {
                        throw "게시글 작성 실패.";
                    }
                    response.redirect('/board/list');
                } else if (query_list[1].trim() === 'update') {

                    const num = request.body.num;

                    db.setTable('board_table');
                    db.add('subject', subject);
                    db.add('writer', writer);
                    db.add('write_content', write_content);

                    if (await db.update('num=?', [num]) === false) {
                        throw "수정 실패.";
                    }
                    response.redirect('/board/list');
                } else if (query_list[1].trim() === 'delete') {

                    if (request.body.deleteNOW === "지금삭제") {
                        const num = request.body.num;

                        db.setTable('board_table');
                        if (await db.delete('num=?', [num]) === false) {
                            throw "삭제 실패.";
                        }

                        db.setTable('reple');
                        if (await db.delete('num=?', [num]) === false) {
                            throw "삭제 실패.";
                        }
                        response.redirect('/board/list');
                    } else {
                        throw "삭제 취소";

                    }
                } else if (query_list[1].trim() === 'repleWrite') {
                    const reqBody = request.body;

                    const reple_writer = reqBody['reple_writer'];
                    const reple_content = reqBody['reple_content'];
                    const num = reqBody['num'];

                    db.setTable('reple');
                    db.add('num', num);
                    db.add('reple_writer', reple_writer);
                    db.add('reple_content', reple_content);
                    if (await db.insert() === false) {
                        throw "등록 실패.";
                    }
                    response.redirect('/board/read?num='+num);
                }
            }
        }
    } catch (e) {
        /* 에러 발생시 처리 */
        if (type === 'get') {	//GET 일땐 에러 화면렌더링
            render_data.err_msg = e;
            response.render('error', render_data);

        } else if (type === 'post') {	//POST 일땐 msg 에 에러메세지 리턴
            response.json({
                msg: e
            });
        }
    }
};