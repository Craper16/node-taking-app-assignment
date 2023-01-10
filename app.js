require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const authRoutes = require('./routes/auth');
const noteRoutes = require('./routes/note');
const categoryRoutes = require('./routes/category');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.options('*', cors());

app.use('/auth', authRoutes);
app.use('/category', categoryRoutes);
app.use('/note', noteRoutes);

app.use('*', (req, res) => {
  return res.status(404).json({ message: 'Endpoint not found' });
});

app.use((error, req, res, next) => {
  // console.log(error);
  const status = error.statusCode || 500;
  const message = error.message;
  const data = error.data;
  res.status(status).json({ message: message, data: data });
});

mongoose
  .connect(process.env.DB_URI)
  .then(() => {
    console.log(`Server running on port ${process.env.PORT}`);
    app.listen(process.env.PORT || 8081);
  })
  .catch((err) => console.log(err));
