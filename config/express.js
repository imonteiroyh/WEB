const express = require('express')
const bodyParser = require('body-parser');
const config = require('config');

module.exports = () => {
    const app = express();

    app.set('port', process.env.PORT || config.get('server.port'));

    app.use(bodyParser.json());

    app.use(express.static('public'))
    app.set('view engine', 'ejs');
    app.set('views', './routes');

    return app;
};