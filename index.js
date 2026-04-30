const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
const PORT = 8080;

app.use(cors());
app.use(express.json());

mongoose
    .connect("mongodb://127.0.0.1:27017/postsDB")
    .then(() => console.log("MongoDB Connected"))
    .catch((err) => console.log(err));

const postSchema = new mongoose.Schema({
    username: String,
    content: String,
});

const Post = mongoose.model("Post", postSchema);


app.get("/posts", async(req, res) => {
    const posts = await Post.find();
    res.json(posts);
});


app.post("/posts", async(req, res) => {
    const newPost = new Post(req.body);
    await newPost.save();
    res.json(newPost);
});


app.put("/posts/:id", async(req, res) => {
    const updated = await Post.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
    });
    res.json(updated);
});


app.delete("/posts/:id", async(req, res) => {
    await Post.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted" });
});

app.listen(PORT, () => {
    console.log(`Server running on ${PORT}`);
});