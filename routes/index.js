//Dependencies
const express = require('express'),
      router = express.Router(),
      db = require("../models");

//get route to root, populating index.handlebars with articles
router.get('/', function(req,res) {
  db.Article
    .find({})
    .then(function(articles) 
      {res.render('index', {articles})
    })
    .catch(function(err) {
      res.json(err)});
});

module.exports = router;
