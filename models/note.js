const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const noteSchema = new Schema({
  title: String,
  body: String
});


const Note = mongoose.model("Note", noteSchema);

// Export the Note model
module.exports = Note;
// const Note = module.exports = mongoose.model('Note', noteSchema);
