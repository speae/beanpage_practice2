//공용 클래스 (static 함수만 사용)
class COMMON{

    /**
     * req 요청을 이용해서 query list 리턴
     * @param req
     * @return []
     */
    static getQueryList(req){
        //쿼리 처리
        let query = req.path.trim();

        //URL 맨앞이나 마지막이 / 로 끝나면 제거
        if (query!==''){
            if (query.endsWith('/')) query = query.slice(0, -1);
            if (query.startsWith('/')) query = query.substr(1);
        }

        //쿼리 리스트 작성 (/를 기준으로 분리)
        return query.split('/');
    }

    /**
     * 객체를 복사해서 리턴
     * @param {Object} obj
     * @return Object
     */
    static copy(obj) {
        return JSON.parse(JSON.stringify(obj));
    }

    /**
     * 고유 코드 생성
     * @param {string} prefix    코드 종류를 식별하기 위한 접두사
     * @return {string}   생성된 코드
     */
    static makeCode(prefix=''){
        const UNIQID = require("uniqid");
        return UNIQID(prefix);
    }


    /**
     * 오늘 Date 객체 리턴
     * @return Date
     */
    static getToday() {
        return new Date();
    }

    /**
     * 어제 날짜의 Date 객체 리턴
     * @return Date
     */
    static getYesterday() {
        const today_date = this.getToday();
        const new_date = today_date;
        new_date.setDate(today_date.getDate() - 1);
        return new_date;
    }

    /**
     * 특정 시간 이내의 새 아이템인지 체크
     * @param {string | Date}	item_w_time	아이템 작성 시간
     * @param {number}	ref_time	기준 시간 - 24시간(86400000)
     * @return	boolean
     */
    static isNewItem (item_w_time, ref_time = 86400000){
        return new Date(item_w_time).getTime() >= (Date.now()-ref_time);
    }

    /**
     * 날짜의 요일을 구한다.
     * @param {Date}	date_obj
     * @param {boolean}	short
     * @return {string}
     */
    static getWeekdayString(date_obj,short=true){
        const weekday = (short===true) ? ['일', '월', '화', '수', '목', '금', '토'] : ['일요일','월요일','화요일','수요일','목요일','금요일','토요일'];
        return weekday[new Date(date_obj).getDay()];
    }
    /**
     * 랜덤 숫자 생성(string)
     * @param {number}	i 자리수
     * @return	{string}
     */
    static getRandomInt(i=10){
        let uniqInt = "";
        for (let length = 1; length <= 10; length++) {
            const randomInt = Math.floor(Math.random() * 10);
            uniqInt = uniqInt + randomInt;
        }
        return uniqInt;
    }

    /**
     * 세션 데이터 가져오기
     * @param {{}} request
     * @param {string} key
     * @returns {Promise<string>}
     */
    static async getSession(request, key){
        try{
            if (typeof request.session[key]==="undefined") return '';
            return request.session[key];
        }catch(e){
            return '';
        }
    }

    /**
     * 세션 데이터 가져오기
     * @param {{}} request
     * @param {string} key
     * @param {string} value
     * @returns {Promise<string>}
     */
    static async setSession(request, key, value){
        try {
            return new Promise(function (resolve, reject) {
                request.session[key] = value==='' ? undefined : value;
                request.session.save(function(){
                    resolve();
                });
            });
        }catch(e){
            return '';
        }
    }

    /**
     * 세션 클리어
     * @param {{}} request
     * @param {{}} response
     * @returns {Promise<string>}
     */
    static async clearSession(request,response){
        try {
            request.session.destroy();  // 세션 삭제
            //response.clearCookie(COMMON.SESSION_SID); // 세션 쿠키 삭제
        }catch(e){
            return '';
        }
    }

    /**
     * 쿠키 데이터 가져오기
     * @param {{}} request
     * @param {string} name
     * @param {boolean}	signed 쿠키 암호화 유무(암호화된 쿠키는 signedCookies 으로 가져옴)
     * @returns {Promise<string>}
     */
    static async getCookie(request, name, signed=false){
        try{
            if (signed){ //암호화
                if (typeof request.signedCookies[name]==="undefined") return '';
                return request.signedCookies[name];
            } else {
                if (typeof request.cookies[name]==="undefined") return '';
                return request.cookies[name];
            }

        }catch(e){
            return '';
        }
    }

    /**
     * 쿠키 데이터 저장하기
     * @param {{}} response
     * @param {string} name
     * @param {string} value
     * @param {number} ttl 쿠키유효시각(초단위) 세션쿠키로사용하고싶으면 0 지정
     * @param {boolean}	httpOnly httpOnly 유무
     * @param {boolean}	signed 쿠키 암호화 유무
     * @param {string}	domain 쿠키 도메인
     * @returns {Promise<boolean>}
     */
    static async setCookie(response, name, value, ttl=86400*300, httpOnly=false, signed=false, domain=''){
        try {
            let param = {};
            if (ttl>0) {	//ttl 이 0이면 세션쿠키 (브라우저가 켜져있을동안에만 쿠키유지)
                param.maxAge = ttl * 1000;
            }
            param.httpOnly = httpOnly;
            param.signed = signed;
            if (domain !== '') param.domain = domain;
            response.cookie(name, value, param);
            return true;
        }catch(e){
            return false;
        }
    }

    /**
     * 쿠키 데이터 삭제
     * @param {{}}	response
     * @param {string}	name	삭제할 쿠키 이름
     * @param {string}	domain	삭제할 쿠키 도메인(일치하지 않으면 삭제하지 않음)
     */
    static clearCookie(response, name,domain = ''){
        const opt = {
            domain : domain,
        };
        response.clearCookie(name,opt);
    }

    /**
     * 현재 년도를 구하기
     * @return string
     */
    static getYear(){
        return (new Date()).getFullYear().toString();
    }

    /**
     * undefined 일경우 공백을 리턴
     * @param {string} s
     * @return {string}
     */
    static undefinedToString(s){
        if (s==null) return "";
        if (typeof s === "undefined") return "";
        return s;
    }

    /**
     * 문자열에서 숫자만 리턴
     * @param {string}	s
     * @return {string}
     */
    static getStringToNumber(s){
        return s.replace(/[^0-9]/g,"");
    }

    /**
     * undefined/NaN 을 피하여 int로 변환
     * @param s
     * @return {Number}
     */
    static toInt(s){
        if (s===null) return 0;
        if (s==="") return 0;
        if (s===true || s===false) return 0;
        if (isNaN(s)) return 0;
        return parseInt(s);
    }


    /**
     * undefined/null 을 피하여 Array 로 변환
     * @param {Array} v
     * @return {Array}
     */
    static toArray(v){
        if (typeof v === "undefined") return [];
        if (v === null) return [];
        if (!Array.isArray(v)) return [];
        return v;
    }

    /**
     * undefined/NaN 을 피하여 double로 변환
     * @param s
     * @return {Number}
     */
    static toFloat(s){
        if (s===null) return 0;
        if (s==="") return 0;
        if (s===true || s===false) return 0;
        if (isNaN(s)) return 0;
        return parseFloat(s);
    }

    /**
     * 문자열에 한글이 있는지 체크
     * @param {string}	s	검사할 문자열
     * @return {boolean}
     */
    static check_korean(s){
        return /[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/.test(s);
    }

    /**
     * 도메인 유효성 검사
     * @param {string} domain
     * @return boolean
     */
    static check_valid_domain(domain){
        if (domain.length>=64) return false;	//도메인이 너무 길경우
        if (/_/.test(domain)) return false;	 //_ 들어갈수없음
        if (/^\./.test(domain)) return false;	//.으로 시작할수 없음
        if (/(\w*)\.$/.test(domain)) return false;	//.으로 끝날수 없음
        if (/-\./.test(domain)) return false;	//-다음 .이 올수 없음
        if (/-$/.test(domain)) return false;	//-로 끝날수 없음
        if (/\.-/.test(domain)) return false;	//. 다음 -가 올수 없음
        if (/^-/.test(domain))	return false;	// - 으로 시작 할수 없음
        if (/\.\./.test(domain)) return false;	//.이 연속으로 들어갈수 없음
        if (/[\s{}\[\]\/?,;:|)*~`!^+<>@#$%&\\=('"]/.test(domain)) return false;	//공백등 특수문자 포함 여부 체크
        if (domain.split('.').length > 3) return false; //.이 3개 이상일 수 없음
        return true;
    }

    /**
     * 전화번호 유효성 검사
     * @param s
     * @return boolean
     */
    static check_valid_call_number(s){
        s = s.replace(/-/gi, "");	// - 제거
        const regExp = /^\d{2,3}\d{3,4}\d{4}$/;
        return regExp.test(s);
    }

    /**
     * 마임타입을 이용해서 이미지 여부구하기
     * @param {string} mimetype
     * @return boolean
     */
    static checkImageByMimeType(mimetype){
        switch (mimetype){
            case "image/jpeg":
            case "image/png":
            case "image/gif":
                return true;
        }
        return false;
    }

    /**
     * base64 인코드
     * @param {string}	string
     * @return {string}
     */
    static base64_encode(string){
        return Buffer.from(string, "utf8").toString('base64');
    }

    /**
     * base64 디코드
     * @param {string}	base64string
     * @return {string}
     */
    static base64_decode(base64string){
        return Buffer.from(base64string, 'base64').toString('utf8');
    }

    /**
     * 빈값인지 체크 - 빈 경우 true 리턴
     * @param {*}	value
     * @return {boolean}
     */
    static isEmpty (value) {
        if (value === null) return true;
        if (typeof value === 'undefined') return true;
        if (typeof value === 'string' && value === '') return true;
        if (Array.isArray(value) && value.length < 1) return true;
        if (typeof value === 'object' && value.constructor.name === 'Object' && Object.keys(value).length < 1 && Object.getOwnPropertyNames(value) < 1) return true;
        if (typeof value === 'object' && value.constructor.name === 'String' && Object.keys(value).length < 1) return true; // new String()
        return false
    }

    /**
     * 문자열 전체 일괄 치환
     */
    static replaceAll(str, searchStr, replaceStr) {
        return str.split(searchStr).join(replaceStr);
    }

    /**
     * 엔터->br 변환 처리
     * @param {string} str
     * @returns {string}
     */
    static nl2br(str){
        return (require('nl2br'))(str);
    }

    /**
     * 태그 제거
     * @param {string} str
     * @returns {string}
     */
    static RemoveTag(str){
        str = (require('htmlspecialchars'))(str);
        str = COMMON.replaceAll(str, '  ', '&nbsp;&nbsp;');	//공백->&nbsp; 는 따로 해줘야함
        return str;
    }
    /**
     * url에서 파일명을 추출
     * @param	{string}	url
     * @param	{boolean}	ext 확장자 포함 여부
     * @return	{string}
     */
    static getFileNameByUrl(url, ext = false){
        let full_name = url.split('/')[(url.split('/').length-1)];
        return ext === true ? full_name : full_name.split(".")[0];
    }

    /**
     * 파라메터를 조합해서 URL을 생성한다
     * @param {string} base_url
     * @param {{}} params
     */
    static makeUrl(base_url, params){
        const querystring = require('querystring');
        return `${base_url}${querystring.stringify(params)}`;
    }

    /**
     * HTML 태그 제거
     * @param {string} s 태그삭제할 문자열
     * @param {number} cut_length 잘라낼 길이(남길 길이)
     * @return {string}
     */
    static stripTags(s, cut_length = 0) {
        const str =  s.replace(/<\w+(\s+("[^"]*"|'[^']*'|[^>])+)?>|<\/\w+>/gi, '');
        return cut_length > 0 ? str.substring(0, cut_length) : str;
    }

    /**
     * 자바스크립트용 스트링 인코딩
     * @param {string} s
     * @return {string}
     */
    static escapeJavascript(s){
        return require('js-string-escape')(s);
    }

}

module.exports = COMMON;