/**
 * @author CallMeMrSam
 */
const { Schema, model } = require('mongoose');

const userSchema = Schema({
    _id: Schema.Types.ObjectId,
    
    userID: String,
    lang: String
});

module.exports = model("User", userSchema);