const express = require('express');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const cors = require('cors');

const { errorHandler } = require('./middleware/errorMiddleware');

dotenv.config();

const app = express();

app.use(cors());

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB Connected Successfully.');
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};


if (process.env.NODE_ENV !== 'test') {
  connectDB();
}

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// API Routes
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/buses', require('./routes/busRoutes'));


app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.get('/', (req, res) => {
  res.send('SafeTrack API is running...');
});

// 3. Only make the server 'listen' when NOT in 'test' mode
if (process.env.NODE_ENV !== 'test') {
    app.listen(PORT, () => {
        console.log(`Server is running successfully on PORT ${PORT}`);
    });
}

// Export the 'app' so that our test file can use it
module.exports = app;