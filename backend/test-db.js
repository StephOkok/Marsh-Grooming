const { Pool } = require('pg');
require('dotenv').config();

// Create a new pool instance
const pool = new Pool({
    connectionString: process.env.DATABASE_URL
});

// Test connection
async function testConnection() {
    try {
        // First check if we can connect
        console.log('Testing database connection...');
        const client = await pool.connect();
        console.log('Successfully connected to database!');
        client.release();

        // Test creating a test table
        console.log('Creating test table...');
        await pool.query(`
            CREATE TABLE IF NOT EXISTS test_table (
                id SERIAL PRIMARY KEY,
                test_data VARCHAR(255)
            )
        `);
        console.log('Test table created successfully!');

        // Insert test data
        console.log('Inserting test data...');
        await pool.query(
            'INSERT INTO test_table (test_data) VALUES ($1)',
            ['Hello, database!']
        );
        console.log('Test data inserted successfully!');

        // Query test data
        console.log('Querying test data...');
        const result = await pool.query('SELECT * FROM test_table');
        console.log('Test data:', result.rows);

        console.log('\nDatabase connection test completed successfully!');
        console.log('If you see this message, your database is working properly.');
    } catch (error) {
        console.error('Database connection test failed:', error);
        process.exit(1);
    } finally {
        // Close the pool
        await pool.end();
    }
}

testConnection();
