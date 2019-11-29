const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const commentSchema = require('./Comment').schema

const postSchema = new Schema({
    title: { type: String, required: true },
    author: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    category: { type: String, required: true },
    score: { type: Number, default: 0 },
    votes: [{ user: Schema.Types.ObjectId, vote: Number, _id: false, default: 0 }],
    created: { type: Date, default: Date.now },
    views: { type: Number, default: 0 },
    subCategory: { type: String, required: true },
    text: { type: String, default: "" },
    keywords: [String],
});

//Export the post model.
module.exports = mongoose.model('Post', postSchema, 'posts');

