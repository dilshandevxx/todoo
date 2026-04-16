const db = require('./config/db');

async function testPool() {
    try {
        console.log('Testing connection pool...');
        const [rows] = await db.query('SELECT 1 + 1 AS solution');
        console.log('✅ Connection pool is working! Solution:', rows[0].solution);
        process.exit(0);
    } catch (err) {
        console.error('❌ Connection pool failed:', err.message);
        process.exit(1);
    }
}

testPool();
