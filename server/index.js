// server/index.js
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

var corsOptions = {
  origin: 'http://localhost:3000'
}

// Middleware
app.use(express.json());
app.use(cors(corsOptions));

// Database Connection
// Replace process.env.MONGO_URI with your actual connection string if not using .env
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/translatorDB')
  .then(() => console.log('Connected to NoSQL Database (MongoDB)'))
  .catch(err => console.error('Could not connect to MongoDB', err));

// Mongoose Schema (The NoSQL Structure)
const wordSchema = new mongoose.Schema({
  english: { type: String, required: true },
  georgian: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

const Word = mongoose.model('Word', wordSchema);

// Routes

// 1. Get all words (or search)
app.get('/api/words', async (req, res) => {
  try {
    const { search } = req.query;
    let query = {};
    
    if (search) {
      query = { english: { $regex: search, $options: 'i' } }; // Case insensitive search
    }
    
    // Sort by newest first
    const words = await Word.find(query).sort({ createdAt: -1 });
    res.json(words);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// 2. Add a new word
app.post('/api/words', async (req, res) => {
  try {
    const { english, georgian } = req.body;
    if (!english || !georgian) {
      return res.status(400).json({ message: "Both fields are required" });
    }

    const newWord = new Word({ english, georgian });
    await newWord.save();
    res.status(201).json(newWord);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// 3. Delete a word (Optional helper)
app.delete('/api/words/:id', async (req, res) => {
  try {
    await Word.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT} ${process.env.MONGO_URI}`));
