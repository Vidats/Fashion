const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboard.controller');
const { authUser, authAdmin } = require('../middleware/authUser');

router.get('/stats', authUser, authAdmin, dashboardController.getStats);

module.exports = router;
