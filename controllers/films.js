const Movie = require('../models/film');
const BadRequest = require('../errors/bad-request');
const Forbidden = require('../errors/forbidden');
const NotFoundError = require('../errors/not-found-err');

// Получить сохраненные фильмы пользователя--------------------------------
const getMovies = (req, res, next) => {
  Movie.find({ owner: req.user._id })
    .then((savedMovies) => {
      res.send(savedMovies);
    })
    .catch((err) => {
      next(err);
    });
};

// Сохранить фильм----------------------------------------------------------
const saveMovie = (req, res, next) => {
  const {
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    thumbnail,
    nameRU,
    nameEN,
    movieId,
  } = req.body;

  const newMovie = new Movie({
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    nameRU,
    nameEN,
    thumbnail,
    movieId,
    owner: req.user._id,
  });

  newMovie.save()
    .then((savedMovie) => {
      res.send(savedMovie);
    })
    .catch((err) => {
      next(err);
    });
};

// Удалить фильм----------------------------------------------------------
const deleteMovie = (req, res, next) => {
  const { movieId } = req.params;
  Movie.findById(movieId)
    .orFail(new NotFoundError('Фильм не найден'))
    .then((movie) => {
      if (!movie.owner.equals(req.user._id)) {
        return next(new Forbidden('Нельзя удалить чужой фильм'));
      }
      return movie.deleteOne()
        .then(() => res.send(movie));
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequest('Некорректный Id фильма'));
      } else {
        next(err);
      }
    });
};

module.exports = {
  getMovies,
  saveMovie,
  deleteMovie,
};
