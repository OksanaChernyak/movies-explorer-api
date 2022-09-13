const Movie = require('../models/movie');
const NotFoundError = require('../utils/NotFoundError');
const BadRequestError = require('../utils/BadRequestError');
const ForbiddenError = require('../utils/ForbiddenError');

module.exports.getMovies = (req, res, next) => {
    Movie.find({})
        .then((movies) => res.send(movies))
        .catch(() => {
            next();
        });
};

module.exports.deleteMovieById = (req, res, next) => {
    Movie.findById(req.params._id).then((movie) => {
        if (movie) {
            const ownerId = movie.owner._id.toString();
            const userId = req.user._id;
            if (ownerId === userId) {
                Movie.findByIdAndRemove(req.params._id)
                    .then((deleted) => {
                        res.status(200).send(deleted);
                    })
                    .catch(() => {
                        next();
                    });
            } else {
                next(new ForbiddenError('Вы пытаетесь удалить чужой фильм'));
            }
        } else {
            next(new NotFoundError('Фильм с таким идентификатором не найден'));
        }
    })
        .catch((error) => {
            if (error.name === 'CastError') {
                next(new BadRequestError('Фильм с таким идентификатором не найден'));
            } else {
                next();
            }
        });
};

module.exports.createMovie = (req, res, next) => {
    const { country, director, duration, year, description, image, trailerLink, nameRU, nameEN, thumbnail, movieId } = req.body;
    Movie.create({ country, director, duration, year, description, image, trailerLink, nameRU, nameEN, thumbnail, movieId, owner: req.user._id })
        .then((movie) => res.send(movie))
        .catch((error) => {
            if (error.name === 'ValidationError') {
                next(new BadRequestError('Переданы некорректные данные при создании фильма'));
            } else {
                next();
            }
        });
};