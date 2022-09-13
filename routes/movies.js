const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');

const {
  getMovies, createMovie, deleteMovieById,
} = require('../controllers/movies');

router.get('/', getMovies);
router.delete('/:_id', celebrate({
  params: Joi.object().keys({
    _id: Joi.string().alphanum().length(24).hex(),
  }),
}), deleteMovieById);
router.post('/', celebrate({
  body: Joi.object().keys({
    country: Joi.string().required(),
    director: Joi.string().required(),
    duration: Joi.number().required(),
    year: Joi.string().required(),
    description: Joi.string().required(),
    image: Joi.string().required().uri(),
    trailerLink: Joi.string().required().uri(),
    thumbnail: Joi.string().required().uri(),
    owner: Joi.string().alphanum().length(24).hex(),
    movieId: Joi.number().required(),
    nameRU: Joi.string().required().regex(/^[а-яА-ЯёЁ\d\s]+$/mi),
    nameEN: Joi.string().required().regex(/^[\w\s]+$/mi),
  }),
}), createMovie);
module.exports = router;