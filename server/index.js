require('dotenv').config();
const express = require('express');
const connectDB = require('./config/db');

const app = express();
const PORT = process.env.PORT || 5000;

connectDB();

app.get('/', (req,res) => {
    res.json({message: 'TaskNest API is running' });
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});