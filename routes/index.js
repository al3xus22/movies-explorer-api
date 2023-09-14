const router = require('express').Router();
const userRoutes = require('./users');
const movieRoutes = require('./films');
const NotFoundError = require('../errors/not-found-err');
const { validateUserInfo, validateAuthorize } = require('../middlewares/validators');
const auth = require('../middlewares/auth');
const { createUser, login, logOut } = require('../controllers/users');

router.post('/signup', validateUserInfo, createUser);
router.post('/signin', validateAuthorize, login);
router.get('/signout', logOut);
router.use('/users', auth, userRoutes);
router.use('/movies', auth, movieRoutes);

router.use('*', (req, res, next) => {
  next(new NotFoundError('Такой страницы не существует'));
});

module.exports = router;
