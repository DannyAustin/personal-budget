// Budget API

const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const port = 3000;

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

app.get('/budget', (req, res) => {
    res.json(budget);
});

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});