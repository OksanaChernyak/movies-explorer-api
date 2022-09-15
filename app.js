const cors = require('cors');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const { errors, celebrate, Joi } = require('celebrate');
const express = require('express');
const userRoute = require('./routes/users');
const movieRoute = require('./routes/movies');
const { login, createUser } = require('./controllers/users');
const auth = require('./middlewares/auth');
const errorsHandler = require('./middlewares/errors');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const NotFoundError = require('./utils/NotFoundError');
const { MDB_DEV } = require('./utils/constants');

const app = express();

const { PORT = 3000 } = process.env;
const { NODE_ENV, MDB_URL } = process.env;

require('dotenv').config();

mongoose.connect(NODE_ENV === 'production' ? MDB_URL : MDB_DEV, {
  useNewUrlParser: true,
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(cors());
app.use(requestLogger);

app.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
}), login);

app.post('/signup', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
    name: Joi.string().min(2).max(30),
  }),
}), createUser);

app.use('/users', auth, userRoute);
app.use('/movies', auth, movieRoute);
app.use('*', auth, () => {
  throw new NotFoundError('Страница  по этому адресу не найдена');
});
app.use(errorLogger);
app.use(errors());
app.use(errorsHandler);
app.listen(PORT);
