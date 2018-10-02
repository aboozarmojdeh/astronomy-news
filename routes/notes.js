//Dependencies
const express = require('express'),
      router = express.Router(),
      db = require("../models");

//get route to retrieve all notes for a particlular article
router.get('/getNotes/:id', function (req,res){
  db.Article
    .findOne({_id: req.params.id})
    .populate('notes')
    .then(function(results)  {
      res.json(results)
    })
    .catch(function(err){
       res.json(err)
    });
});

//get route to return a single note to view it
router.get('/getSingleNote/:id', function (req,res) {
  db.Note
  .findOne({_id: req.params.id})
  .then( function(result) {
    res.json(result)
  })
  .catch(function(err) {
    res.json(err)
  });
});

//post route to create a new note in the database
router.post('/createNote', function (req,res){
  let { title, body, articleId } = req.body;
  let note = {
    title,
    body
  };
  db.Note
    .create(note)
    .then( function(result) {
      db.Article
        .findOneAndUpdate({_id: articleId}, {$push:{notes: result._id}},{new:true})//saving reference to note in corresponding article
        .then( function(data) {
          res.json(result)
        })
        .catch( function(err) {
          res.json(err)
        });
    })
    .catch(function(err)  {
      res.json(err)
    });
});

//post route to delete a note
router.post('/deleteNote', function(req,res){
  let {articleId, noteId} = req.body;
  db.Note
    .remove({_id: noteId})
    .then(function(result) {
      res.json(result)
    })
    .catch(function(err) {
      res.json(err)
    });
});


module.exports = router;
