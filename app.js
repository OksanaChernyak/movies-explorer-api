const cors = require('cors');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const { errors, celebrate, Joi } = require('celebrate');
const userRoute = require('./routes/users');
const movieRoute = require('./routes/movies');
const { login, createUser } = require('./controllers/users');
const auth = require('./middlewares/auth');
const errorsHandler = require('./middlewares/errors');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const NotFoundError = require('./utils/NotFoundError');
const express = require("express");

const { PORT = 3000 } = process.env;
const app = express();
require('dotenv').config();

mongoose.connect('mongodb://127.0.0.1:27017/mestodb', {
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
app.use('/*', () => {
    throw new NotFoundError('Страница  по этому адресу не найдена');
});
app.use(errorLogger);
app.use(errors());
app.use(errorsHandler);
app.listen(PORT);