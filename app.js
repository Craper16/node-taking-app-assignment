const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

const authRoutes = require('./controllers/auth');
const noteRoutes = require('./controllers/note');
const categoryRoutes = require('./controllers/category');

const app = express();

app.use(express.json());
app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
    'Access-Control-Allow-Methods',
    'OPTIONS, GET, POST, PUT, PATCH, DELETE'
  );
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
});

app.use('/auth', authRoutes);
app.use('/category', categoryRoutes);
app.use('/note', noteRoutes);

app.use((error, req, res, next) => {
  // console.log(error);
  const status = error.statusCode || 500;
  const message = error.message;
  const data = error.data;
  res.status(status).json({ message: message, data: data });
});

mongoose
  .connect('mongodb+srv://mat:qxYMJX2SgV@cluster0.k5g1lmx.mongodb.net/test')
  .then(() => {
    console.log('Server running on port 5000');
    app.listen(5000);
  })
  .catch((err) => console.log(err));
