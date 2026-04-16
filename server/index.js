const express = require('express');
const cors = require('cors');
require('dotenv').config();

process.on('unhandledRejection', (reason, promise) => {
    console.error('❌ Unhandled Rejection at:', promise, 'reason:', reason);
});

process.on('uncaughtException', (err) => {
    console.error('❌ Uncaught Exception:', err);
});

const authRoutes = require('./routes/auth');
const todoRoutes = require('./routes/todos');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/todos', todoRoutes);

app.get('/', (req, res) => {
    res.send('Task Manager API is running...');
});

app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server is successfully running on port ${PORT}`);
    console.log(`Healthcheck endpoint available at http://0.0.0.0:${PORT}/`);
});
