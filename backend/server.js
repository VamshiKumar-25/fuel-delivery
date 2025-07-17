const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');

// Import all routes
const userRoutes = require('./routes/userRoutes');
const fuelTypeRoutes = require('./routes/fuelTypeRoutes');
const orderRoutes = require('./routes/orderRoutes'); // This is the new line

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

// Initialize express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// A simple test route
app.get('/', (req, res) => {
  res.send('API is running...');
});

// Use all the routes
app.use('/api/users', userRoutes);
app.use('/api/fueltypes', fuelTypeRoutes);
app.use('/api/orders', orderRoutes); // This is the new line

const PORT = process.env.PORT || 5001;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});