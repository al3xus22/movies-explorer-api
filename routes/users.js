const router = require('express').Router();
const { validateUpdateUser } = require('../middlewares/validators');
const { getAuthUser, updateUser } = require('../controllers/users');

router.get('/me', getAuthUser);
router.patch('/me', validateUpdateUser, updateUser);

module.exports = router;
