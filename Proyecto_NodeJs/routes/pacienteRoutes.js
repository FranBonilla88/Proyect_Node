// pacienteRoutes.js
const express = require('express');
const router = express.Router();
const pacienteController = require('../controllers/pacienteController');

// GET /pacientes  
// - Todos los pacientes
// - Listado reducido con ?listado=true
router.get('/', pacienteController.getAllPaciente);

// GET /pacientes/:id  
// - Paciente por ID
// - Paciente + médico con ?relations=true
router.get('/:id', pacienteController.getPacienteById);

// POST /pacientes
router.post('/', pacienteController.createPaciente);

// PUT /pacientes/:id
router.put('/:id', pacienteController.updatePaciente);

// DELETE /pacientes/:id
router.delete('/:id', pacienteController.deletePaciente);

module.exports = router;