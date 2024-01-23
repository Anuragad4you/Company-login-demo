const express = require('express');
const { Sequelize, DataTypes } = require('sequelize');

const app = express();

// Create a default Sequelize instance (initial database)
const sequelize = new Sequelize({
    dialect: 'mysql',
    host: '192.168.1.20',
    username: 'rr_web',
    password: 'PUVqF8fr',
    database: 'pmt-master-dev',
    connectionLimit: 10,
});

// Define a model for the initial database
const InitialModel = sequelize.define('lookupTypes', {
    id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
    },
    lookupTypeID: {
        type: DataTypes.INTEGER,
        required: true,
    },
    parentLookupTypeID: {
        type: DataTypes.INTEGER,
    },
    lookupTypeName: {
        type: DataTypes.STRING,
        required: true,
    },
    sortOrderID: {
        type: DataTypes.INTEGER,
        //required: true,
    },
    isDeleted: {
        type: DataTypes.BOOLEAN,
    },
    isActive: {
        type: DataTypes.BOOLEAN,
    },
    createdAt: {
        allowNull: false,
        type: DataTypes.DATE,
        defaultValue: new Date(),
    },
    updatedAt: {
        allowNull: true,
        type: DataTypes.DATE,
        defaultValue: null
    },
});
// Connect to the database
sequelize
    .authenticate()
    .then(() => {
        console.log('Connected to the database!');

        // Perform a SELECT query using findAll
        InitialModel.findAll().then((results) => {
            console.log('Query results:', results);

            // Do something with the results...
        });
    })
    .catch((error) => {
        console.error('Error connecting to the database:', error);
    });

// API route to connect to the new database
app.get('/connectToNewDatabase', (req, res) => {
    // Create a new Sequelize instance (new database)
    const newSequelize = new Sequelize({
        dialect: 'mysql',
        host: '192.168.1.20',
        username: 'rr_web',
        password: 'PUVqF8fr',
        database: 'sunanalyzer_Dev',
        connectionLimit: 10,
    });

    // Define a model for the new database
    const NewModel = newSequelize.define('lookupTypes', {
        id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: DataTypes.INTEGER,
        },
        lookupTypeID: {
            type: DataTypes.INTEGER,
            required: true,
        },
        parentLookupTypeID: {
            type: DataTypes.INTEGER,
        },
        lookupTypeName: {
            type: DataTypes.STRING,
            required: true,
        },
        sortOrderID: {
            type: DataTypes.INTEGER,
            //required: true,
        },
        isDeleted: {
            type: DataTypes.BOOLEAN,
        },
        isActive: {
            type: DataTypes.BOOLEAN,
        },
        createdAt: {
            allowNull: false,
            type: DataTypes.DATE,
            defaultValue: new Date(),
        },
        updatedAt: {
            allowNull: true,
            type: DataTypes.DATE,
            defaultValue: null
        },
    });

    // Connect to the new database
    newSequelize
        .authenticate()
        .then(() => {
            console.log('Connected to the new database!');

            // Perform database operations on the new database
            NewModel.findAll().then((results) => {
                console.log('Results from the new database:', results);
                res.send('Connected to the new database and fetched data.');
            });
        })
        .catch((newError) => {
            console.error('Error connecting to the new database:', newError);
            res.status(500).send('Internal Server Error');
        })
        .finally(() => {
            // Disconnect from the new database
            // newSequelize.close().then(() => {
            //     console.log('Disconnected from the new database!');
            // });
        });
});

// Start the Express server
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});