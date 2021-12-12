const express = require('express');
const passport = require('passport');
const controller = require('../controllers/position');
const router = express.Router();

// localhost:5000/api/position/login
router.get('/:categoryId', passport.authenticate('jwt', {session: false}), controller.getByCategoryID);

router.post('/', passport.authenticate('jwt', {session: false}), controller.create);

router.patch('/:id', passport.authenticate('jwt', {session: false}), controller.update);

router.delete('/:id', passport.authenticate('jwt', {session: false}), controller.remove);
module.exports = router;
