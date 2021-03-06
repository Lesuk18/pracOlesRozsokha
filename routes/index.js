const express = require('express');
const router = express.Router();
const { ensureAuthenticated, forwardAuthenticated,jwtAuthenticated } = require('../config/auth');
const News = require('../models/News')
const User = require('../models/User')
const mongoose = require('mongoose');

router.get('/', forwardAuthenticated, (req, res) => res.json({ msg: 'welcome'}));
const db = require('../config/keys').MongoURI;


router.get('/dashboard', jwtAuthenticated, (req, res) =>
  res.json(req.user)
);



router.post('/dashboard/add_news', jwtAuthenticated, function(req, res) {
  const title = req.body.title;
  const description = req.body.description;
  console.log(req.user);
  const userID = req.user.name
  const newNews = new News({
    title,
    description,
  })
  newNews.author = userID;


  newNews.save();

  res.json({ msg: 'News added'});

  console.log(newNews);
  
}
);

router.get('/dashboard/show_news', jwtAuthenticated, async function(req, res) {
  
  const news = await News.find({})
  res.json(news);
});

router.get('/dashboard/show_news/:id', jwtAuthenticated, async function(req, res) {
 
  const news = await News.find({})
  res.json(news[req.params.id]);
});

router.get('/dashboard/delete_news/:id', jwtAuthenticated, async function(req, res) {
 
  const news = await News.find({})
  
  News.deleteOne({ title: news[req.params.id].title}, function(err, obj) {
    if (err) throw err;
    console.log("1 document deleted");
  });
  res.json({msg: 'news deleted'});
});

router.get('/dashboard/update_news/:id', jwtAuthenticated, async function(req, res) {
 
  const news = await News.find({})
  News.updateOne({title: news[req.params.id].title}, {$set: {description: "Updated"}}, function(err, res) {
    if (err) throw err;
    console.log("1 document updated");
    
  });
  res.json(news[req.params.id]);
});

module.exports = router;


