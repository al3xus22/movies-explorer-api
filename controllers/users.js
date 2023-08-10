const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const BadRequest = require('../errors/bad-request');
const ConflictRequest = require('../errors/conflict-request');

const { NODE_ENV, JWT_SECRET } = process.env;

const login = (req, res, next) => {
  const { email, password } = req.body;
  User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret', { expiresIn: '7d' });
      res.cookie('jwt', token, {
        maxAge: 3600 * 24 * 7, httpOnly: true, sameSite: 'none', secure: true,
      }).send({ user });
    })
    .catch(next);
};

const createUser = (req, res, next) => {
  const { name, email, password } = req.body;
  bcrypt.hash(password, 10)
    .then((hash) => User.create({ name, email, password: hash }))
    .then((data) => {
      res.status(201).send({ name: data.name, email: data.email });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequest(err.message));
      } else if (err.code === 11000) {
        next(new ConflictRequest('Такой пользователь уже существует!'));
      } else {
        next(err);
      }
    });
};

const updateUser = (req, res, next) => {
  User.findByIdAndUpdate(req.user._id, req.body, { new: true, runValidators: true })
    .then((user) => {
      res.send(user);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequest('Что-то пошло не так'));
      } else {
        next(err);
      }
    });
};

const logOut = (req, res) => {
  res.clearCookie('jwt').send({ message: 'Выход' });
  res.end();
};

const getAuthUser = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => {
      res.send(user);
    })
    .catch(next);
};

module.exports = {
  login,
  createUser,
  updateUser,
  logOut,
  getAuthUser,
};
