require('dotenv').config();
const cors = require('cors');
const helmet = require('helmet');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const { errors } = require('celebrate');
const express = require('express');
const indexRoutes = require('./routes/index');
const errorsHandler = require('./middlewares/errors');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const { MDB_DEV } = require('./utils/constants');

const app = express();

const { PORT = 3000 } = process.env;
const { NODE_ENV, MDB_URL } = process.env;

mongoose.connect(NODE_ENV === 'production' ? MDB_URL : MDB_DEV, {
  useNewUrlParser: true,
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(cors());
app.use(helmet());
app.use(requestLogger);

app.use('/', indexRoutes);

app.use(errorLogger);
app.use(errors());
app.use(errorsHandler);
app.listen(PORT);
