const express = require('express');
const { Sequelize, DataTypes } = require('sequelize');
const bodyParser = require('body-parser');
const cors = require('cors'); // Import the CORS package

const app = express();
const PORT = 3000;

// Middleware to enable CORS
app.use(cors()); // This will allow all origins. You can configure it as needed.

// Middleware to parse JSON request bodies
app.use(bodyParser.json());

// Sequelize setup (using SQLite in this example)
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: 'data/database.sqlite' // SQLite database file path
});

// Define the formData model
const FormData = sequelize.define('FormData', {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  mail: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      isEmail: true,
    },
  },
  mobile: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  adultCount: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  childernCount: {
    type: DataTypes.INTEGER,
    allowNull: true, // Assuming children count may be optional
  },
  currentDate: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  checkOutDate: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  roomCount: {
    type: DataTypes.INTEGER,
    allowNull: false,
  }
});

// Synchronize models with the database
sequelize.sync()
  .then(() => console.log('Database & tables created!'))
  .catch((error) => console.error('Error syncing database:', error));

// Route to handle form data submission (POST)
app.post('/order', async (req, res) => {
  try {
    const formData = await FormData.create(req.body);
    res.status(201).json({ message: 'Data stored successfully', data: formData });
  } catch (error) {
    console.error('Error saving form data:', error);
    res.status(500).json({ message: 'Error saving form data', error: error.message });
  }
});

// Route to get all form data (GET)
app.get('/orders', async (req, res) => {
  try {
    const orders = await FormData.findAll(); // Fetch all records
    res.status(200).json({ message: 'Orders fetched successfully', data: orders });
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ message: 'Error fetching orders', error: error.message });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
