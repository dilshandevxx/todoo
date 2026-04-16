const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

async function initDB() {
    const connection = await mysql.createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        port: process.env.DB_PORT || 3306,
        multipleStatements: true,
        ssl: {
            rejectUnauthorized: false
        }
    });

    console.log('Connected to Aiven MySQL. Initializing database...');

    try {
        const schema = fs.readFileSync(path.join(__dirname, 'schema.sql'), 'utf8');
        await connection.query(schema);
        console.log('✅ Database initialized successfully! Tables created.');
    } catch (err) {
        console.error('❌ Error initializing database:', err.message);
    } finally {
        await connection.end();
    }
}

initDB();
