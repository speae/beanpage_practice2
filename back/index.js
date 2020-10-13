'use strict';
const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const app = express();
const router = express.Router();
const session = require("express-session");
const main = require('./main');

const fileStore = require('session-file-store')(session);

router.use(bodyParser.urlencoded({extended: true}));
router.use(cookieParser('beanpage_practice2'));

//보안관련 설정
app.disable('x-powered-by');

//front 패스 지정
app.set('views', path.join(__dirname, '../front'));

//랜더링 엔진 EJS 엔진 사용
app.set('view engine', 'ejs');

//세션 준비
app.use(session({
    secret: 'beanpage_practice2',
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
    main("post", req, res);
});

app.use('/', router);

module.exports = app;