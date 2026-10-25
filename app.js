const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const cors = require('cors');
const helmet = require("helmet");
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');
const logger = require('morgan');
require('dotenv').config()
const routes = require('./app/routes/routes');
//const routes = require('./app/routes/routes');
const { swaggerDocument } = require('./docs/swagger');
const app = express();

app.set('views', path.join(__dirname, 'app/views'));
app.set('view engine', 'pug');

const isProduction = process.env.NODE_ENV === 'production';
app.use(logger(isProduction ? 'combined' : 'dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(bodyParser.json());

app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
if (isProduction && !process.env.FRONTEND_URL) {
  throw new Error('FRONTEND_URL must be set to the public frontend origin in production');
}
app.use(cors(isProduction ? { origin: process.env.FRONTEND_URL } : {}));

app.use(bodyParser.urlencoded({
  extended: true,
  limit: '500mb',
  parameterLimit: 100000,
}));



app.use('/api/v1', routes);

const swaggerSpec = swaggerJsdoc({
  definition: swaggerDocument,
  apis: ['./app/routes/*/*.js', './_v2/routes/*.js', './app/schemas/*/*.js'],
});

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
  swaggerOptions: {
    docExpansion: "none",
    persistAuthorization: true
  }
}));

app.get('docs.json', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.send(swaggerSpec);
});

app.use('/', express.static('storage'))

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.json({ error: isProduction ? { message: err.status && err.status < 500 ? err.message : 'Internal server error' } : err });
});

// app.use(express.static(path.join(__dirname, '/storage')));
module.exports = app;
