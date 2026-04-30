require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const Post = require("./models/Post");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Test route
app.get("/", (req, res) => {
    res.send("Backend is running");
});

// MongoDB connect
mongoose
    .connect(process.env.MONGO_URI)
    .then(() => console.log("MongoDB Connected"))
    .catch((err) => console.log(err));

// GET all posts
app.get("/posts", async(req, res) => {
    try {
        const posts = await Post.find();
        res.json(posts);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// CREATE post
app.post("/posts", async(req, res) => {
    try {
        const post = new Post(req.body);
        await post.save();
        res.json(post);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// UPDATE post
app.put("/posts/:id", async(req, res) => {
    try {
        const updated = await Post.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
        });
        res.json(updated);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// DELETE post
app.delete("/posts/:id", async(req, res) => {
    try {
        await Post.findByIdAndDelete(req.params.id);
        res.json({ message: "Deleted Successfully" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Start server
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log("Server running on port " + PORT);
});