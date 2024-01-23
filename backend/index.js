const mysql = require('mysql');

// Create a single connection pool
const pool = mysql.createPool({
    host: '127.0.0.1',
    user: 'company-login',
    password: 'Ssaha@11199',
    database: 'API',
    connectionLimit: 10,
});

// Function to dynamically change the database configuration
function changeDatabase(host, user, password, database) {
    console.log("database", database);
    pool.config.connectionConfig.host = host;
    pool.config.connectionConfig.user = user;
    pool.config.connectionConfig.password = password;
    pool.config.connectionConfig.database = database;
}

// Connect to the initial database
pool.getConnection((err, connection) => {
    if (err) {
        console.error('Error connecting to the initial database:', err.message);
        return;
      }
    
      console.log('Connected to the initial database!');
    
      // Perform database operations on the initial database
      connection.query('SELECT * FROM lookupTypes', (error, results, fields) => {
        if (error) {
          console.error('Error executing query for the initial database:', error);
        } else {
          console.log('Results from the initial database:', results);
        }
    
        // Change the database dynamically
        changeDatabase('127.0.0.1', 'API', 'Ssaha@11199', 'kng_db');
    
        // Release the connection back to the pool
        connection.release();
    
        // Use the connection for operations on the new database
        pool.query('SELECT * FROM lookupTypes', (newError, newResults, newFields) => {
          if (newError) {
            console.error('Error executing query for the new database:', newError);
          } else {
            console.log('Results from the new database:', newResults);
          }
    
          // Disconnect from the pool
          pool.end((disconnectError) => {
            if (disconnectError) {
              console.error('Error disconnecting from the pool:', disconnectError);
            } else {
              console.log('Disconnected from the pool.');
            }
          });
        });
      });
});