let createError = require('http-errors');
let express = require('express');
let bodyParser = require("body-parser");
let path = require('path');
let cookieParser = require('cookie-parser');
let logger = require('morgan');
let fileupload = require('express-fileupload');

let indexRouter = require('./routes/index');
let userRouter = require('./routes/user');
let reportRouter = require('./routes/report')
let teamsRouter = require('./routes/teams');
let db = require('./database/db') 

db.initialize();

var app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(fileupload());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'uploads')));

app.use((req, res, next) => {
  res.db = db;
  req.rootDir = path.join(__dirname, 'uploads');
  next();
})

app.use('/', indexRouter);
app.use('/user', userRouter);
app.use('/report', reportRouter)
app.use('/teams', teamsRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
