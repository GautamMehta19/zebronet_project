const dotenv = require('dotenv');
const express = require('express');
const mongoose = require('mongoose');
const authRoutes = require('./routes/authRoutes');
const courseRoutes = require('./routes/courseRoutes');
const lessonRoutes = require('./routes/lessonRoutes');

dotenv.config();

const app = express();

// Middleware
app.use(express.json());

// Connect to Database

mongoose.connect(process.env.MONGO_URI)
    .then(res => console.log('MongoDB Successfully Connected'))
    .catch(err => console.log(err))


// Routes
app.use('/api/auth', authRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/lessons', lessonRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
