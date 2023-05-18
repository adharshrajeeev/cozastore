var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var userRouter = require('./routes/users');
var adminRouter = require('./routes/admin');
var productRouter=require('./routes/products')

var app = express();
// var Handlebars=require('express-handlebars')

var fileUpload=require('express-fileupload')

var db=require('./config/connection')
var session=require('express-session');
const Handlebars = require('handlebars');
const { handlebars } = require('hbs');

// ------------------------VIEW ENGINE SETUP-------------------

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');


//----------------------------BROWSER CACHE -----------------------------

app.use(function (req, res, next) {
  res.set("cache-control", "no-cache,no-store,must-revalidate");
  next();
});

handlebars.registerHelper('ifEquals', function(state, value, options) {
  return (state == value) ? options.fn(this) : options.inverse(this);
});

handlebars.registerHelper("inc", function(value, options)
{
    return parseInt(value) + 1;
});

//----------------------MIDDLEWARES TO PARSE ETC--------------------------

// app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


//----------------------DATABASE MONGODB CONNECTION------------

db.connect((err)=>{
  if(err){
    console.log("Connection Error",err);
  }else{
    console.log("DATABSE CONNECTED SUCCESFULLY AT PORT 27017");
  }
  
})

//----------------------IMAGE UPLOAD------------

app.use(fileUpload());


//---------------SESSION CREATION----------------------------

app.use(session({secret:"SECRET",resave: true,
saveUninitialized: true,cookie:{maxAge:6000000}}))


//------------ROUTERS------------------------------

app.use('/', userRouter);
app.use('/admin', adminRouter);
app.use('/products', productRouter)




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


app.listen(4000,()=>{
  console.log(`SERVER STARTED AT PORT ${process.env.PORT}`)
})

module.exports = app;
