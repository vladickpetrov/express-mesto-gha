const mongoose = require('mongoose');
const valid = require('validator');

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
    validate: (text) => text.match(/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\\+~#=]{1,}\.[a-zA-Z0-9()]{1,}\b([-a-zA-Z0-9()@:%_\\+.~#?&//=]*)/),
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
    select: true,
  },
});

module.exports = mongoose.model('user', userSchema);
