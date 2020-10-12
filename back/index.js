'use strict';
const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const app = express();
const router = express.Router();
const session = require("express-session");
const main = require('./main');
const db = require("./class/dao_mysql");
const fileStore = require('session-file-store')(session);

router.use(bodyParser.urlencoded({extended: true}));
router.use(cookieParser('beanpage_practice'));

//보안관련 설정
app.disable('x-powered-by');

//front 패스 지정
app.set('views', path.join(__dirname, '../front'));

//랜더링 엔진 EJS 엔진 사용
app.set('view engine', 'ejs');

//세션 준비
app.use(session({
    secret: 'beanpage_practice',
    resave: false,
    saveUninitialized: false,
    cookie: {secure: false},
    store: new fileStore(session)
}));

//GET요청에 대한 모든 처리
router.get('*', (req, res) => {
    main("get", req, res);
});

//POST 요청에 대한 처리
router.post('*', (req, res) => {
    const reqBody = req.body;
    const num = reqBody['num'];
    const subject = reqBody['subject'];
    const writer = reqBody['writer'];
    const write_date = reqBody['write_date'];
    const write_content = reqBody['write_content'];
    const count = parseInt(reqBody['count']);

    const sql = 'insert into board_table values (?, ?, ?, ?, timestamp, ?)';
    const insertData = [
        num, subject, writer, write_content, write_date, count+1
    ];
    module.exports = db;
    db.conn_data = db.CONN_DATA_TEST;
    db.query(sql, insertData, function (err, rows) {
        if(err){
            console.log(err);
            res.redirect('/board/write');
        }
        console.log("input success");
        res.redirect('/board/read');
    });
    main("post", req, res);
});

app.use('/', router);

module.exports = app;