//const DELAY = require('delay');
const COMMON = require('./common');
const MYSQL2 = require('mysql2/promise');

class DAO_MYSQL{

    /**
     * 디비 생성자
     * @param {string} host
     * @param {string} user
     * @param {string} pwd
     * @param {string} db_name
     * @param {number} port
     */
    constructor(host='', user='', pwd='', db_name='', port=32123){
        this.db_name = db_name;
        if (host===''){
            host = DAO_MYSQL.conn_data.host;
            user = DAO_MYSQL.conn_data.user;
            pwd = DAO_MYSQL.conn_data.pwd;
            db_name = DAO_MYSQL.conn_data.db_name;
            port = DAO_MYSQL.conn_data.port;
        }
        this.host = host;
        this.user = user;
        this.pwd = pwd;
        this.db_name = db_name;
        this.port = port;
    }

    /**
     * mysql 접속
     * @return {Promise<*>|boolean}
     */
    async connect(){
        // create the connection to database
        try{
            //디비 접속 옵션
            let conn_opts = {
                host: this.host,
                user: this.user,
                password: this.pwd,
                database: this.db_name,
                port: this.port,
                dateStrings: 'date',
            };

            const conn_key = `${conn_opts.host}${conn_opts.database}`;
            let conn = DAO_MYSQL.conn_cache_list.get(conn_key);
            if (typeof conn==="undefined"){	//같은 옵션의 접속캐시가 있으면 기존 접속을 재활용
                conn = await MYSQL2.createConnection(conn_opts);
                DAO_MYSQL.conn_cache_list.set(conn_key, conn);
            }else{
                //conn 을 ping을 때려서 에러가 발생할경우 재연결처리
                try{
                    await conn.ping();
                }catch(e){
                    conn = await MYSQL2.createConnection(conn_opts);
                    DAO_MYSQL.conn_cache_list.set(conn_key, conn);
                }
            }
            return conn;

        } catch(err) {
            await COMMON.error(`MYSQL2 Connect Error ${this.host}, ${this.user}, ${this.db_name}, ${this.port}`);
            return false;
        }
    }

    /**
     * 필드정보 클리어
     */
    clear() {
        this.values = new Map();
    }

    setTable(table_name){
        this.table_name = `${this.db_name}.${table_name}`;
        this.clear();
    }

    add(column_name, value, is_constant=true){
        if (typeof value==="undefined") value="";
        this.values.set(column_name, {value:value, is_constant:is_constant});
    }

    add_null(column_name, value, is_constant=true){
        if (typeof value==="undefined") value="";
        this.values.set(column_name, value===''? {value:'NULL', is_constant:false} : {value:value, is_constant:is_constant});
    }

    /**
     * INSERT 쿼리 생성
     * @return string
     */
    insert_sql() {
        if (this.values.size<1) return '';

        //value_list 의 갯수만큼큼  ?,?... 형태의 문자열 생성
        const value_list_str = [...this.values.values()].map(value_list_item => value_list_item.is_constant ? '?' : value_list_item.value).join(',');
        const column_list_str = [...this.values.keys()].join(',');
        return `INSERT INTO ${this.table_name} (${column_list_str}) VALUES(${value_list_str})`;
    }

    /**
     * REPLACE 쿼리 생성
     * @return string
     */
    replace_sql() {
        if (this.values.size<1) return '';

        //value_list 의 갯수만큼큼  ?,?... 형태의 문자열 생성
        const value_list_str = [...this.values.values()].map(value_list_item => value_list_item.is_constant ? '?' : value_list_item.value).join(',');
        const column_list_str = [...this.values.keys()].join(',');
        return `REPLACE INTO ${this.table_name} (${column_list_str}) VALUES(${value_list_str})`;
    }


    /**
     * DELETE 쿼리 생성
     * @param {string} where_query WHERE을 포함하지않는 조건문자열 (idx=1)
     * @return string
     */
    delete_sql(where_query) {
        if (where_query==='') return '';	//DELETE 문에 where 절을 빼먹는 실수가 많으므로
        let sql = `DELETE FROM ${this.table_name}`;
        if (where_query!=='') sql += ` WHERE ${where_query}`;
        return sql;
    }

    /**
     * UPDATE 쿼리 생성
     * @param {string} where_query WHERE을 포함하지않는 조건문자열 (idx=1)
     * @return string
     */
    update_sql(where_query) {
        if (this.values.size<1) return '';
        if (where_query==='') return '';	//UPDATE 문에 where 절을 빼먹는 실수가 많으므로
        const column_list_str = [...this.values.entries()].map(values_data => values_data[0] + '=' + (values_data[1].is_constant ? '?' : values_data[1].value) ).join(',');	//필드목록을 field1=?, field2=? 형태로 변경
        let sql = `UPDATE ${this.table_name} SET ${column_list_str} WHERE ${where_query}`;
        return sql;
    }

    /**
     * INSERT 실행
     * @param {boolean} error_slack_alarm 에러발생시 슬랙알람 여부
     * @return {Promise<number|boolean>} 성공일경우 idx 또는 true 실패이면 false
     */
    async insert(error_slack_alarm = true){
        const query = this.insert_sql();
        if (query==='') return false;

        //value_list 에서 is_constant 인것은 뺀후 value만 뽑아냄
        const query_params = [...this.values.values()].filter(value_list_item  => value_list_item.is_constant).map(value_list_item=>value_list_item.value);

        //쿼리 실행
        const res = await this.query(query, query_params, error_slack_alarm);
        this.clear();
        if (res===false) return false;
        return res.insertId>0 ? res.insertId : true;
    }

    /**
     * REPLACE 실행
     * @return {Promise<boolean>} 성공일경우 idx 또는 true 실패이면 false
     */
    async replace(){
        const query = this.replace_sql();
        if (query==='') return false;

        //value_list 에서 is_constant 인것은 뺀후 value만 뽑아냄
        const query_params = [...this.values.values()].filter(value_list_item  => value_list_item.is_constant).map(value_list_item=>value_list_item.value);

        //쿼리 실행
        const res = await this.query(query, query_params);
        this.clear();
        return res!==false;
    }

    /**
     * UPDATE 실행
     * @param {string} where_query WHERE을 포함하지않는 조건문자열 (idx=1)
     * @param {string[]} where_query_params 조건문자열에 변수가있을경우 변수와 치환할 값들의배열
     * @return {Promise<boolean>}
     */
    async update(where_query, where_query_params=[]){
        const query = this.update_sql(where_query);

        // values 에서 is_constant 가 true 인것들의 value 만
        const query_params = [...this.values.values()].filter(value_data=>value_data.is_constant).map(value_data=>value_data.value);

        const res = await this.query(query, query_params.concat(where_query_params));	//SET 절과 WHERE 절에 모두 ? 가 들어갈수있기때문에 value_list 와 where_query_params 를 합친다
        this.clear();
        if (res===false) return false;
        return true;
    }

    /**
     * DELETE 실행
     * @param {string} where_query WHERE을 포함하지않는 조건문자열 (idx=1)
     * @param {string[]} where_query_params 조건문자열에 변수가있을경우 변수와 치환할 값들의배열
     * @return {Promise<boolean>}
     */
    async delete(where_query, where_query_params=[]){
        const query = this.delete_sql(where_query);
        if (query==='') return false;
        const res = await this.query(query, where_query_params);
        this.clear();
        if (res===false) return false;
        return true;
    }


    /**
     * SQL 실행 (결과 레코드가 여러개일경우)
     * @param {String} query
     * @param {string[]} params
     * @param {boolean} error_slack_alarm 에러발생시 슬랙알람 여부
     * @return {Promise<boolean|Array>}
     */
    async query(query, params, error_slack_alarm=true){
        let conn=false;
        try {
            conn = await this.connect();
            if (conn===false) return false;
            /* Step 3. */
            const [rows] = await conn.query(query, params);
            return rows;
        } catch(err) {
            return false;
        }
    }

    /**
     *
     * @param query
     * @param {Number[]}params
     * @param error_slack_alarm
     * @returns {Promise<boolean|*>}
     */
    async queryInteger(query, params, error_slack_alarm=true){
        let conn=false;
        try {
            conn = await this.connect();
            if (conn===false) return false;
            /* Step 3. */
            const [rows] = await conn.query(query, params);
            return rows;
        } catch(err) {
            return false;
        }
    }

    /**
     * SQL 실행 (결과 레코드가 1개일경우)
     * @param {String} query
     * @param {[String]} params
     * @return {Promise<boolean|Object>}
     */
    async queryOne(query, params){
        const row_list = await this.query(query,params);
        if (!row_list) return false;
        for (const row_item of row_list){
            return row_item;
        }
        return false;
    }

    /**
     * 트랜잭션 시작
     * @returns {Promise<boolean>}
     */
    static async beginTrans(){
        let conn=false;
        try {
            const db = new DAO_MYSQL();
            conn = await db.connect();
            if (conn===false) return false;
            await conn.beginTransaction();
            return true;
        } catch(err) {
            return false;
        }
    }

    /**
     * 트랜잭션 종료
     * @returns {Promise<boolean>}
     */
    static async commitTrans(){
        let conn=false;
        try {
            const db = new DAO_MYSQL();
            conn = await db.connect();
            if (conn===false) return false;
            await conn.commit();
            return true;
        } catch(err) {
            return false;
        }
    }
}
module.exports = DAO_MYSQL;

//테스트 디비 접속 정보 (리얼 IP)
DAO_MYSQL.CONN_DATA_TEST = {
    'host': '13.124.105.184',
    'user': 'speae',
    'pwd': 'beanpage',
    'db_name': 'beanpage_practice2',
    'port': 32123
};

DAO_MYSQL.conn_data = DAO_MYSQL.CONN_DATA_TEST;

//접속을 재활용하기위한 접속 캐시 객체
DAO_MYSQL.conn_cache_list = new Map();