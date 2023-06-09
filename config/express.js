const express = require('express')
const cookieParser = require('cookie-parser');
const config = require('config');
const sessions = require('express-session');

const oneDay = 1000 * 60 * 60 * 24;

module.exports = () => {
    const app = express();

    app.set('port', process.env.PORT || config.get('server.port'));
    app.use(express.urlencoded({ extended: true }));
    app.use(express.json());
    app.use(cookieParser());

    app.use(sessions({
        secret: 'th1515453cr3tk3y',
        saveUninitialized: true,
        cookie: { maxAge: oneDay },
        resave: false
    }));

    app.use(express.static('./app/static'))
    app.set('view engine', 'ejs');
    app.set('views', './app/views');

    return app;
};