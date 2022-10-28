const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const sendgridTransport = require('nodemailer-sendgrid-transport');

const User = require('../models/user');

const transporter = nodemailer.createTransport(
  sendgridTransport({
    auth: {
      api_key:
        ' INSERT OWN API KEY ',
    },
  })
);

exports.signup = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const errors = new Error('Signup failed');
      error.statusCode = 422;
      error.data = errors.array();
      throw error;
    }
  
    const email = req.body.email;
    const password = req.body.password;
    const name = req.body.name;
    const hashedPw = await bcrypt.hash(password, 12);
      const user = new User({
      email: email,
      password: hashedPw,
      name: name
    });
    const result = await user.save();
    res.status(201).json({ message: 'User created', userId: result._id});
    await transporter.sendMail({
      to: email,
      from: ' INSERT EMAIL HERE ',
      subject: 'Signup successful',
      html: '<h1>You have successfully signed up</h1> <p>Signup Successful, Welcome!</p>'
    });
} catch (err) {
    if(!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.login = async (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  let loadedUser;
  try {
    const user = await User.findOne({ email: email });
    if (!user) {
      const error = new Error('A user with this email could not be found.');
      error.statusCode = 401;
      throw error;
    }
    loadedUser = user;
    const isEqual = await bcrypt.compare(password, user.password);
    if (!isEqual) {
      const error = new Error('Wrong password!');
      error.statusCode = 401;
      throw error;
    }
    const token = jwt.sign(
      {
        email: loadedUser.email,
        userId: loadedUser._id.toString()
      },
      'tokensecret',
      { expiresIn: '1h' }
    );
    res.status(200).json({ token: token, userId: loadedUser._id.toString() });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};
