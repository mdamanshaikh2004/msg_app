const mongoose = require("mongoose");

const postSchema = new mongoose.Schema({
    username: String,
    content: String,
});

module.exports = mongoose.model("Post", postSchema);