const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const path = require("path");

dotenv.config();

const app = express();

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

// MongoDB connection
let dbConnectionPromise = null;

async function connectDB() {
    if (mongoose.connection.readyState === 1) {
        return;
    }

    if (!dbConnectionPromise) {
        dbConnectionPromise = mongoose.connect(process.env.MONGO_URI, {
            serverSelectionTimeoutMS: 10000
        }).catch((error) => {
            dbConnectionPromise = null;
            throw error;
        });
    }

    await dbConnectionPromise;
}

// Project Schema
const projectSchema = new mongoose.Schema({
    name: String,
    description: String,
    technology: String
});

const Project = mongoose.model("Project", projectSchema);

// Home Page
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Get Projects
app.get("/api/projects", async (req, res) => {

    try {

        await connectDB();

        const projects = await Project.find();

        res.json(projects);

    } catch (error) {

        console.error("MongoDB/API Error:", error.message);

        res.status(500).json({
            message: "Error fetching projects"
        });
    }
});

// Start server
const PORT = process.env.PORT || 3000;

if (process.env.VERCEL !== "1") {
    app.listen(PORT, () => {
        console.log(`Server running at http://localhost:${PORT}`);
    });
}

module.exports = app;