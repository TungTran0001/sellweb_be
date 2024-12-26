
const express = require('express');

const locationRouter = express.Router();

// require
const locationController = require('../controllers/locationController');

locationRouter.get('/provinces', locationController.getProvinces);

module.exports = locationRouter;