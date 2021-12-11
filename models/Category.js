const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const categoryShema = new Schema({
  name: {
    type: String,
    required: true
  },
  imageSrc: {
    type: String,
    default: ''
  },
  user: {
    ref: 'users',
    type: Schema.Types.ObjectId
  }
});

module.exports = mongoose.model('categories', categoryShema);
