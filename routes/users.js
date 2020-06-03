const express = require('express');
const router = express.Router();
const User = require('../models/User')
const bcrypt = require('bcryptjs')
const passport = require('passport');

router.get('/login', function(req,res) {
  res.send('Login page!');
});

router.get('/register', function(req,res) {
  res.send('Register page!');
});

router.post('/register', (req, res) => {
  console.log(req.query)
  const { name, email, password, password2 } = req.query;
  let errors = [];

  if (!name || !email || !password || !password2) {
    res.send({ msg: 'Please enter all fields' });
  }

  if (password != password2) {
    res.send({ msg: 'Passwords do not match' });
  }

  if (password.length < 6) {
    res.send({ msg: 'Password must be at least 6 characters' });
  }

  if (errors.length > 0) {
    res.send('errors');
  } else {
    User.findOne({ email: email }).then(user => {
      if (user) {
        res.send({ msg: 'Email already exists' });
      } else {
        const newUser = new User({
          name,
          email,
          password
        });
        console.log(newUser);
        //res.send('Good');
        bcrypt.genSalt(10, (err, salt) => {
          bcrypt.hash(newUser.password, salt, (err, hash) => {
            if (err) throw err;
            newUser.password = hash;
            newUser
              .save()
              .then(user => {
                res.send(
                  'You are now registered and can log in'
                );
                //res.redirect('/users/login');
              })
              .catch(err => console.log(err));
          });
        });
      }
    });
  }
});


router.post('/login',
  passport.authenticate('local', {
    successRedirect: '/dashboard',
    failureRedirect: '/users/login',
  })
);

// Logout
router.get('/logout', (req, res) => {
  req.logout();
  res.redirect('/users/login');
});

module.exports = router;
