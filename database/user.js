const Mongoose = require('mongoose');

module.exports = Mongoose.model('Name', new Mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
}, {
  toJSON: {
    getters: true,
    virtuals: false,
  },
}));
