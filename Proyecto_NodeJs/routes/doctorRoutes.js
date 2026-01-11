// doctorRoutes.js
const express = require('express');
const router = express.Router();
const doctorController = require('../controllers/doctorController');

// GET /doctors 
// - Todos los médicos
// - Listado reducido con ?listado=true
router.get('/', doctorController.getAllDoctors);

// GET /doctors/:id  
// - Médico por ID
// - Médico + pacientes con ?relations=true
router.get('/:id', doctorController.getDoctorById);

// POST /doctors
router.post('/', doctorController.createDoctor);

// PUT /doctors/:id
router.put('/:id', doctorController.updateDoctor);

// DELETE /doctors/:id
router.delete('/:id', doctorController.deleteDoctor);

module.exports = router;