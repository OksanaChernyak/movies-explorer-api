const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const { BadRequestError } = require(../utils/BadRequestError);

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
        country: Joi.string().required().error(new BadRequestError('country')),
        director: Joi.string().required().error(new BadRequestError('director')),
        duration: Joi.number().required().error(new BadRequestError('duration')),
        year: Joi.string().required().error(new BadRequestError('year')),
        description: Joi.string().required().error(new BadRequestError('description')),
        image: Joi.string().required().regex(/^https?:\/\/(www.)?([\da-z-]+\.)+\/?\S*/im).error(new BadRequestError('img')),
        trailerLink: Joi.string().required().regex(/^https?:\/\/(www.)?([\da-z-]+\.)+\/?\S*/im).error(new BadRequestError('trailer')),
        thumbnail: Joi.string().required().regex(/^https?:\/\/(www.)?([\da-z-]+\.)+\/?\S*/im).error(new BadRequestError('thumb')),
        owner: Joi.string().alphanum().length(24).hex().error(new BadRequestError('owner')),
        movieId: Joi.number().required().error(new BadRequestError('movieId')),
        nameRU: Joi.string().required().regex(/^[а-яА-ЯёЁ\d\s]+$/mi).error(new BadRequestError('nameRU')),
        nameEN: Joi.string().required().regex(/^[\w\s]+$/mi).error(new BadRequestError('nameEN')),
    }),
}), createMovie);
module.exports = router;