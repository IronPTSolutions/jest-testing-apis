const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
  text: String,
  event: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Event',
    required: true
  }
}, {
  timestamps: true,
  toJSON: {
    virtuals: true,
    transform: (doc, ret) => {
      ret.id = doc._id;
      delete ret._id;
      delete ret.__v;
      return ret;
    }
  }
})

const Comment = mongoose.model('Comment', commentSchema);

module.exports = Comment;
