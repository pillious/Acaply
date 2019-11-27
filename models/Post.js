const mongoose = require('mongoose');
const Schema = mongoose.Schema;
// const commentSchema = require('./Comment')

const commentSchema = new Schema({
    author: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    body: { type: String, required: true },
    created: { type: Date, default: Date.now }
});

// const postSchema = new Schema({
//     title: { type: String, required: true },
//     url: { type: String },
//     author: { type: Schema.Types.ObjectId, ref: 'User', required: true },
//     category: { type: String, required: true },
//     score: { type: Number, default: 0 },
//     votes: [{ user: Schema.Types.ObjectId, vote: Number, _id: false, default: 0 }],
//     comments: [commentSchema],
//     created: { type: Date, default: Date.now },
//     views: { type: Number, default: 0 },
//     type: { type: String, default: 'link', required: true },
//     text: { type: String },
//     keywords: [String],
// });

const postSchema = new Schema({
    title: { type: String, required: true },
    author: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    category: { type: String, required: true },
    score: { type: Number, default: 0 },
    votes: [{ user: Schema.Types.ObjectId, vote: Number, _id: false, default: 0 }],
    comments: [commentSchema],
    created: { type: Date, default: Date.now },
    views: { type: Number, default: 0 },
    subCategory: { type: String, required: true }, //change to subcategory
    text: { type: String, default: "" },
    keywords: [String],
});

//Export the post model.
module.exports = mongoose.model('Post', postSchema, 'posts');

