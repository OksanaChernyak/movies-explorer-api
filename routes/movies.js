const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');

const {
    getMovies, createMovie, deleteMovieById,
} = require('../controllers/movies');

router.get('/', getMovies);
router.delete('/_id', celebrate({
    params: Joi.object().keys({
        _id: Joi.string().alphanum().length(24).hex(),
    }),
}), deleteMovieById);
router.post('/', celebrate({
    body: Joi.object().keys({
        country: Joi.string().required().error(new Error('country')),
        director: Joi.string().required().error(new Error('director')),
        duration: Joi.number().required().error(new Error('duration')),
        year: Joi.string().required().error(new Error('year')),
        description: Joi.string().required().error(new Error('description')),
        image: Joi.string().required().regex(/^https?:\/\/(www.)?([\da-z-]+\.)+\/?\S*/im).error(new Error('img')),
        trailerLink: Joi.string().required().regex(/^https?:\/\/(www.)?([\da-z-]+\.)+\/?\S*/im).error(new Error('trailer')),
        thumbnail: Joi.string().required().regex(/^https?:\/\/(www.)?([\da-z-]+\.)+\/?\S*/im).error(new Error('thumb')),
        owner: Joi.string().alphanum().length(24).hex().error(new Error('owner')),
        movieId: Joi.number().required().error(new Error('movieId')),
        nameRU: Joi.string().required().regex(/^[а-яА-ЯёЁ\d\s]+$/mi).error(new Error('nameRU')),
        nameEN: Joi.string().required().regex(/^[\w\s]+$/mi).error(new Error('nameEN')),
    }),
}), createMovie);
module.exports = router;