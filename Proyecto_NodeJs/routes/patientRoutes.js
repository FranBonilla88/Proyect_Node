// patientRoutes.js
const express = require('express');
const router = express.Router();
const patientController = require('../controllers/patientController');

// GET /patients  
// - Todos los pacientes
// - Listado reducido con ?listado=true
router.get('/', patientController.getAllPatients);

// GET /patients/:id  
// - Paciente por ID
// - Paciente + médico con ?relations=true
router.get('/:id', patientController.getPatientById);

// POST /patients
router.post('/', patientController.createPatient);

// PUT /patients/:id
router.put('/:id', patientController.updatePatient);

// DELETE /patients/:id
router.delete('/:id', patientController.deletePatient);

module.exports = router;