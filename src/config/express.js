
const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet');
const routes = require('./routes');
const { logs, env } = require('./vars');
const error = require('./error');


/**
* Express instance
* @public
*/
const app = express();

// *** SO IMPORTANT *** this will handle promises on routers 
require('express-async-errors');

// request logging. dev: console | production: file
app.use(morgan(logs));

// secure apps by setting various HTTP headers
app.use(helmet());

// routes
app.use(routes);

if (env !== 'development') {
    app.use(error);
}

module.exports = app;
