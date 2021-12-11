const express = require('express');
const controller = require('../controllers/order');
const router = express.Router();

// localhost:5000/api/order/login
router.post('/', passport.authenticate('jwt', {session: false}), controller.getAll);

router.get('/', passport.authenticate('jwt', {session: false}), controller.create);
module.exports = router;
