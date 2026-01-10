// medicoRoutes.js
const express = require('express');
const router = express.Router();
const medicoController = require('../controllers/medicoController');

// GET /medicos  
// - Todos los médicos
// - Listado reducido con ?listado=true
router.get('/', medicoController.getAllMedicos);

// GET /medicos/:id  
// - Médico por ID
// - Médico + pacientes con ?relations=true
router.get('/:id', medicoController.getMedicoById);

// POST /medicos
router.post('/', medicoController.createMedico);

// PUT /medicos/:id
router.put('/:id', medicoController.updateMedico);

// DELETE /medicos/:id
router.delete('/:id', medicoController.deleteMedico);

module.exports = router;