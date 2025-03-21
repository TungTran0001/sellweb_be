
const express = require('express');

const locationRouter = express.Router();

// require
const locationController = require('../controllers/locationController');

locationRouter.get('/provinces', locationController.getProvinces);
locationRouter.get('/districts/:provinceId', locationController.getDistricts);
locationRouter.get('/wards/:districtId', locationController.getWards);

module.exports = locationRouter;