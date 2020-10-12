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
    let render_data = {err_msg:'', m:'', m2:'', m3:'', COMMON: COMMON, site_data:{}, js_command_list:[], site_url:'', source:'', is_template_site:'N', alert_msg:'', redirect_url:'', meta_tag_list : []};
    try{

        //요청이 들어온 쿼리 리스트 구하기
        const query_list = COMMON.getQueryList(request);

        //GET 일경우 UI 랜더링 처리
        if (type==="get") {

            if(query_list[0]==='board'){
                if(query_list[1]==='read'){
                    await require('./board/read')(request, response, render_data, query_list);
                }else if(query_list[1]==='write'){
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
            //POST 일경우 내부 처리후 json 랜더링
        }else if (type==="post"){
            let result = {};
            let render_data = {};

            switch(query_list[0].trim()) {

            }
            response.json(result);
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