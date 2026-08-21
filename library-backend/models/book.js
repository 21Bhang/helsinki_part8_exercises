const mongoose = require('mongoose')

const schema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    minlength: 5
  },
  published: {
    type: Number,
    required: true
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Author'
  },
  genres: [
    {
      type: String,
      minlength: 3
    }
  ]
})

module.exports = mongoose.model('Book', schema)