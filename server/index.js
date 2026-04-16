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

console.log('--- Environment Check ---');
console.log('DB_HOST:', process.env.DB_HOST ? '✅ Found' : '❌ Missing');
console.log('DB_PORT:', process.env.DB_PORT || 'Defaulting to 3306');
console.log('PORT Variable:', process.env.PORT);
console.log('-------------------------');

app.get('/', (req, res) => {
    res.status(200).send('API is healthy and running!');
});

app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server is successfully running on port ${PORT}`);
    console.log(`Healthcheck endpoint available at http://0.0.0.0:${PORT}/`);
});
