/*
При подключение сертификата при выборе домена происходит ошибка: "An unexpected error occurred:
There were too many requests of a given type ::
Error creating new order :: too many certificates already issued for: nomoreparties.co:
see https://letsencrypt.org/docs/rate-limits/". Насколько я понимаю достигнут лимит на сертификаты nomoreparties.co.
Поэтому сделать сертификат сделать не удалось.
*/
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const { errors } = require('celebrate');
const routerUsers = require('./routes/users.js');
const routerCards = require('./routes/cards.js');
const { createUser, login } = require('./controllers/user');
const auth = require('./middlewares/auth');
const { requestLogger, errorLogger } = require('./middlewares/logger');

const { PORT = 3000 } = process.env;

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
});

app.use(requestLogger);

app.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Сервер сейчас упадёт');
  }, 0);
});

app.post('/signin', login);
app.post('/signup', createUser);

app.use('/users', auth, routerUsers);
app.use('/cards', auth, routerCards);

app.use('*', (req, res) => {
  res.status(404);
  res.send({ message: 'Запрашиваемый ресурс не найден' });
});

app.use(errorLogger);

app.use(errors());

app.use((err, req, res) => {
  const { statusCode = 500, message } = err;

  res
    .status(statusCode)
    .send({
      message: statusCode === 500
        ? 'На сервере произошла ошибка'
        : message,
    });
});

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
