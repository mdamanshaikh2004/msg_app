require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const Post = require("./models/Post.js");

const app = express();

// middleware
app.use(cors());
app.use(express.json());

// test route
app.get("/", (req, res) => {
    res.send("Backend is running");
});

// MongoDB connect
mongoose
    .connect(process.env.MONGO_URI)
    .then(() => console.log("MongoDB Connected"))
    .catch((err) => console.log("Mongo Error:", err));

// GET all posts
app.get("/posts", async(req, res) => {
    try {
        const posts = await Post.find();
        return res.json(posts);
    } catch (err) {
        console.log("GET ERROR:", err);
        return res.status(500).json({ error: err.message });
    }
});

// CREATE post
app.post("/posts", async(req, res) => {
    try {
        const post = new Post(req.body);
        await post.save();
        return res.json(post);
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
});

// UPDATE post
app.put("/posts/:id", async(req, res) => {
    try {
        const updated = await Post.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
        });
        return res.json(updated);
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
});

// DELETE post
app.delete("/posts/:id", async(req, res) => {
    try {
        await Post.findByIdAndDelete(req.params.id);
        return res.json({ message: "Deleted" });
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
});

const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
    console.log("Server running on port", PORT);
});