const router = require('express').Router();
const { validateMovieInfo, validateMovieId } = require('../middlewares/validators');
const { getMovies, saveMovie, deleteMovie } = require('../controllers/films');

router.get('/', getMovies);
router.post('/', validateMovieInfo, saveMovie);
router.delete('/:movieId', validateMovieId, deleteMovie);

module.exports = router;
