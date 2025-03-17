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

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});