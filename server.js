// Budget API

const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const port = 3000;

const mongoose = require('mongoose');
const BudgetModel = require('./models/budget');

app.use('/', express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const budgetFilePath = path.join(__dirname, 'budgetdata.json');

app.get('/budget', (req, res) => {
    fs.readFile(budgetFilePath, 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading budget data:', err);
            return res.status(500).json({ error: 'Failed to load budget data' });
        }
        res.json(JSON.parse(data));
    });
});
    

app.get('/hello', (req, res) => {
    res.send('Hello World!');
});

mongoose.connect("mongodb://localhost:27017/personal-budget", {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => console.log("MongoDB Connected"))
  .catch(err => console.error("MongoDB Connection Error:", err));

app.get('/budget', async (req, res) => {
    try {
        const budgetData = await BudgetModel.find();
        res.json({ myBudget: budgetData });
    } catch (err) {
        console.error("Error fetching budget data:", err);
        res.status(500).json({ error: "Failed to fetch budget data" });
    }
});

app.post('/budget', async (req, res) => {
    console.log("🔍 Received POST request:", req.body);

    try {
        const { title, value, color } = req.body;

        if (!title || !value || !color) {
            console.log("❌ Validation Error: Missing fields");
            return res.status(400).json({ error: "All fields (title, value, color) are required" });
        }

        const hexColorRegex = /^#([0-9A-Fa-f]{6})$/;
        if (!hexColorRegex.test(color)) {
            console.log("Validation Error: Invalid color format");
            return res.status(400).json({ error: "Color format must be a valid 6-digit hex code (e.g., #FF5733)" });
        }

        const newBudget = new BudgetModel({ title, value, color });
        await newBudget.save();
        console.log("New budget entry added:", newBudget);

        res.status(201).json({ message: "Budget added successfully", data: newBudget });
    } catch (err) {
        console.error("Server Error:", err);
        res.status(500).json({ error: "Failed to add budget entry" });
    }
});

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});