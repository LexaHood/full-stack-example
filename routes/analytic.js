const express = require('express');
const controller = require('../controllers/analytic');
const router = express.Router();

// localhost:5000/api/analytic/login
router.get('/overview', controller.overview);

router.get('/analytic', controller.analytic);
module.exports = router;
