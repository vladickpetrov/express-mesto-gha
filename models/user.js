const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const valid = require('validator');
const IncorrectError = require('../errors/incorrect_error');

const userSchema = mongoose.Schema({
  name: {
    type: String,
    minlength: 2,
    maxlength: 30,
    role: { type: String, default: 'Жак-Ив Кусто' },
  },
  about: {
    type: String,
    minlength: 2,
    maxlength: 30,
    role: { type: String, default: 'Исследователь' },
  },
  avatar: {
    type: String,
    role: { type: String, default: 'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png' },
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: (text) => valid.isEmail(text),
  },
  password: {
    type: String,
    required: true,
    select: false,
  },
});

userSchema.statics.fingUserByLogin = function (email, password) {
  return this.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) Promise.reject(new IncorrectError('Неправильная почта или пароль'));
      return bcrypt.compare(password, user.password)
        .then((match) => {
          if (!match) Promise.reject(new IncorrectError('Неправильная почта или пароль'));
          return user;
        });
    });
};

module.exports = mongoose.model('user', userSchema);
