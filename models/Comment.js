const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//The schema for the comment model.
const commentSchema = new Schema({
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    authorUsername: {
        type: String,
        required: true
    },
    body: {
        type: String,
        required: true
    },
    parentPost: {
        type: Schema.Types.ObjectId,
        required: true
    },
    created: {
        type: Date,
        default: Date.now
    }
});

//Export the comment model.
module.exports = mongoose.model('Comment', commentSchema, 'comments');