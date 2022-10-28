const express = require('express');
const mongoose = require('mongoose');

const authRoutes = require('./controllers/auth');
const noteRoutes = require('./controllers/note');
const categoryRoutes = require('./controllers/category');

const app = express();

app.use(express.json());
app.use(express.urlencoded({extended: true}))

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
app.use('/note',noteRoutes);

app.use((error, req, res, next) => {
  console.log(error);
  const status = error.statusCode || 500;
  const message = error.message;
  const data = error.data;
  res.status(status).json({ message: message, data: data });
});

mongoose
  .connect(
    ' INSERT OWN DB URI '
  )
  .then((result) => {
    console.log('connected');
    app.listen(5000);
  })
  .catch((err) => console.log(err));
