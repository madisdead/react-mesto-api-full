const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const { errors } = require('celebrate');
const { celebrate, Joi } = require('celebrate');
const routerUsers = require('./routes/users.js');
const routerCards = require('./routes/cards.js');
const { createUser, login } = require('./controllers/user');
const auth = require('./middlewares/auth');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const NotFoundError = require('./errors/not-found-err.js');

const whiteList = [
  'https://tarakanov.students.nomoreparties.space',
  'http://tarakanov.students.nomoreparties.space',
  'https://www.tarakanov.students.nomoreparties.space',
  'http://www.tarakanov.students.nomoreparties.space',
  'http://localhost:3000',
];
const corsOptions = {
  origin: (origin, callback) => {
    if (whiteList.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
};
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

app.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().min(2),
    password: Joi.string().required().min(6),
  }),
}), login);
app.post('/signup', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().min(2),
    password: Joi.string().required().min(6).pattern(/[0-9a-zA-Z!@#$%^&*]{6,}/),
  }),
}), createUser);

app.use('/users', auth, routerUsers);
app.use('/cards', auth, routerCards);

app.use(cors(corsOptions));

app.use('*', (req, res, next) => {
  const error = new NotFoundError('Запрашиваемый ресурс не найден');

  next(error);
});

app.use(errorLogger);

app.use(errors());

// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
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
