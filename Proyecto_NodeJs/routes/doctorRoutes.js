// doctorRoutes.js
const express = require('express');
const router = express.Router();
const doctorController = require('../controllers/doctorController');

// PRIMERO LAS RUTAS ESPECÍFICAS
router.get('/search', doctorController.getDoctorsBySpecialty);
router.get('/search-age', doctorController.getDoctorsByAgeRange);
router.get('/graph', doctorController.getGraphData);

// LUEGO LAS GENERALES
router.get('/', doctorController.getAllDoctors);
router.get('/:id', doctorController.getDoctorById);
router.post('/', doctorController.createDoctor);
router.put('/:id', doctorController.updateDoctor);
router.delete('/:id', doctorController.deleteDoctor);

module.exports = router; 