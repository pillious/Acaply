const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Bcrypt = require("bcryptjs");

const userSchema = new Schema({
    username: { type: String, required: true, unique: true },
    email: {type: String, default: ""},
    password: { type: String, required: true },
    badges: [String],
    bio: { type: String, default: ""},
    admin: { type: Boolean, required: true, default: false},
    sessionId: {type: String, default: ""}
}, {timestamps: true});

userSchema.pre("save", function(next) {
    if(!this.isModified("password")) {
        return next();
    }
    this.password = Bcrypt.hashSync(this.password, 10);
    next();
});

userSchema.methods.comparePassword = function(plaintext, callback) {
    return callback(null, Bcrypt.compareSync(plaintext, this.password));
};

//Export the user model.
module.exports = mongoose.model('User', userSchema, 'users');