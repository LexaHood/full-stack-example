const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const keys = require('../config/keys');
const errorHandler = require('../utils/errorHandler');

module.exports.login = async function(req, res) {
  const condidate = await User.findOne({email: req.body.email});

  if (condidate) {
    // Проверка пароля
    const passwordResult = bcrypt.compareSync(req.body.password, condidate.password);

    if (passwordResult) {
      // Генерация токена
      const token = jwt.sign({
        email: condidate.email,
        userId: condidate._id
      }, keys.jwt, {expiresIn: 60 * 60});

      res.status(200).json({
        token: `Bearer ${token}`
      });
    } else {
      res.status(401).json({
        message: "Логин/пароль не совпали"
      });
    }
  } else {
    // Пользователя нет - ошибка
    res.status(404).json({
      message: "Пользователь не найден"
    });
  }
};

module.exports.register = async function(req, res) {
  const candidate = await User.findOne({email: req.body.email});

  if (candidate) {
    // Пользователь существует, нужно отдать ошибку
    res.status(409).json({
      message: "Пользователь уже существует"
    });
  } else {
    // Создаем пользователя
    const salt = bcrypt.genSaltSync(10);
    const password = req.body.password;
    const user = new User({
      email: req.body.email,
      password: bcrypt.hashSync(password, salt)
    });

    try {
      await user.save();
      res.status(201).json(user);
    } catch(err) {
      errorHandler(err);
    }
  }
};
