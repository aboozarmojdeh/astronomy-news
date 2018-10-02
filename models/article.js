const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const articleSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  link: {
    type: String,
    required: true
  },
  description:{
    type: String,
    required:true
  },
// `image` is required and of type String
  img:{
    type: String,
    required:true
  },
  saved: {
    type: Boolean,
    default: false
  },
  // `note` is an object that stores a Note id
  // The ref property links the ObjectId to the Note model
  // This allows us to populate the Article with an associated Note
  notes: [
  {
    type: Schema.Types.ObjectId,
    ref: "Note"
  }]

  
});

const Article = mongoose.model("Article", articleSchema);

// Export the Article model
module.exports = Article;
// const Article = module.exports = mongoose.model('Article', articleSchema);
