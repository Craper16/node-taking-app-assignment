const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = require('../models/user');

const errorFormatter = ({ msg, param, value }) => {
  return {
    message: msg,
    param,
    value,
  };
};

exports.signup = async (req, res, next) => {
  try {
    const errors = validationResult(req).formatWith(errorFormatter);
    console.log(errors);
    if (!errors.isEmpty()) {
      const error = new Error({ errors: errors.array() });
      error.statusCode = 422;
      error.data = errors.array();
      throw error;
    }

    const { username, password } = req.body;

    const hashedPw = await bcrypt.hash(password, 12);
    const user = new User({
      username: username,
      password: hashedPw,
    });
    const result = await user.save();
    res.status(201).json({
      message: 'User created',
      username: username,
      userId: result._id,
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.login = async (req, res, next) => {
  // const errors = validationResult(req).formatWith(errorFormatter);
  // console.log(errors);
  // if (!errors.isEmpty()) {
  //   const error = new Error({ errors: errors.array() });
  //   error.statusCode = 422;
  //   error.data = errors.array();
  //   throw error;
  // }

  const { username, password } = req.body;

  let loadedUser;
  try {
    const user = await User.findOne({ username: username });
    if (!user) {
      const error = new Error('Please check your login credentials');
      error.statusCode = 401;
      throw error;
    }
    loadedUser = user;
    const isEqual = await bcrypt.compare(password, user.password);
    if (!isEqual) {
      const error = new Error('Please check your login credentials');
      error.statusCode = 401;
      throw error;
    }
    const token = jwt.sign(
      {
        username: loadedUser.username,
        userId: loadedUser._id.toString(),
      },
      'tokensecret',
      { expiresIn: '1h' }
    );
    res.status(200).json({ accessToken: token, username: loadedUser.username });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};
