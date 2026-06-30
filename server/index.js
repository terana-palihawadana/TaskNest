require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const taskRoutes = require('./routes/taskRoutes');
const authRoutes = require('./routes/authRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

connectDB();

if (!process.env.JWT_SECRET) {
    console.error('JWT_SECRET is missing in .env');
    process.exit(1);
}

app.use(cors());
app.use(express.json());

app.get('/', (req,res) => {
    res.json({message: 'TaskNest API is running' });
});

app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});