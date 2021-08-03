var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var session=require('express-session'); //数据持久化 

var{Mongoose}=require('./untils/config.js'); //先要引入这个对象

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var adminRouter = require('./routes/admin'); //

var app = express(); ////创建app对象，底层原理 http模块的 createServer

// view engine setup
app.set('views', path.join(__dirname, 'views')); //设置视图目录
app.set('view engine', 'ejs'); //views使用的是 ejs


//配置session 它就是使用cookie来存储的。
app.use(session({
  secret: 'keyboard cat', //这个代表加密 后面是使用加密的字符串，可以自己修改
  name: 'sessionId',
  resave: false,
  saveUninitialized: false, //这个是给这个session一个初始值，
  cookie: {maxAge: 1000*60*60}  //这个代表过期时间1个小时  在客户端保存一个cookie
}))
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public'))); //这里的意思是相当于把public这个目录配置成默认的，所以在输入url时可以省略 public,

app.use('/', indexRouter);
//app.use('/users', usersRouter);
app.use('/api2/users',usersRouter); //定义 users这个路由中的上下文路径名   
app.use('/api2/admin',adminRouter)

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

Mongoose.connect(); //调用对象的方法连接数据库

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
