const express = require('express')
const app = express();
const mongoose = require('mongoose')
const flash = require('connect-flash');
const session = require('express-session');
const passport = require('passport');

const db = require('./config/keys').MongoURI;
require('./config/passport')(passport);

mongoose.connect(db,{useNewUrlParser: true})
  .then(() => console.log('Mongo conected'))
  .catch(err => console.log(err))

app.use(
    session({
      secret: 'secret',
      resave: true,
      saveUninitialized: true
    })
);

app.use(flash());

app.use(function(req, res, next) {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  next();
});

app.use(passport.initialize());
app.use(passport.session());

app.use(express.urlencoded({ extended: true }));

app.use ('/', require('./routes/index.js'));
app.use ('/users', require('./routes/users.js'));

const PORT = 3000;
app.listen(PORT, console.log('Server start'));
