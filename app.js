const express = require('express');
const mongoose = require('mongoose');

const { PORT = 3000 } = process.env;
const app = express();

app.use(express.json());

mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
});

app.use((req, res, next) => {
  req.user = {
    _id: '6383641b779afb18f7581315',
  };

  next();
});

app.use('/users', require('./routes/users'));

app.use('/cards', require('./routes/cards'));

app.use('/*', (req, res) => {
  res.status(404).send({ message: 'Страница не найдена' });
});

app.listen(PORT);
