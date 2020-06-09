const express = require('express');
const router = express.Router();
const User = require('../models/User')
const bcrypt = require('bcryptjs')
const passport = require('passport');
const jwt      = require('jsonwebtoken');

router.get('/login', function(req,res) {
  res.json({msg: 'Login page!'});
});

router.get('/register', function(req,res) {
  res.send('Register page!');
});

router.post('/register', async (req, res) => {
  console.log(req.body)
  const { name, email, password, password2 } = req.body;
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

    const user = await User.findOne({ email: email })
    try {
      
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
    }
   catch (err){
    return res.status(400).json({
      msg: 'Something is not right',
      
      });
  }
}
});


router.post('/login', function (req, res, next) {
  passport.authenticate('local', {session: false}, (err, user, info) => {
      console.log(err, user, info);
      if (err || !user) {
          return res.status(400).json({
              message: 'Something is not right',
              user   : user,
              
          });
      }
     req.login(user, {session: false}, (err) => {
         if (err) {
             res.send(err);
         }
         
         const token = jwt.sign(user.toJSON(), 'olesrSecret');
         return res.json({user, token});
      });
  })(req, res);
});

// Logout
router.get('/logout', (req, res) => {
  req.logout();
  res.redirect('/users/login');
});

module.exports = router;
