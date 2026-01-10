// pacienteService.js
const pacienteModel = require('../models/pacienteModel');
const { logMensaje } = require('../utils/logger');

class PacienteService {

    async getAllPacientes() {
        try {
            const data = await pacienteModel.getAllPacientes();
            return data;
        } catch (err) {
            throw err;
        }
    }

    async getPacienteById(id) {
        try {
            const data = await pacienteModel.getPacienteById(id);
            return data;
        } catch (err) {
            throw err;
        }
    }

    async getPacienteByIdRelations(id) {
        try {
            const data = await pacienteModel.getPacienteByIdRelations(id);
            return data;
        } catch (err) {
            throw err;
        }
    }

    async createPaciente(pacienteData) {
        try {
            const data = await pacienteModel.createPaciente(pacienteData);
            return data;
        } catch (err) {
            throw err;
        }
    }

    async updatePaciente(id, pacienteData) {
        try {
            const data = await pacienteModel.updatePaciente(id, pacienteData);
            return data;
        } catch (err) {
            throw err;
        }
    }

    async deletePaciente(pacienteId) {
        try {
            const data = await pacienteModel.deletePaciente(pacienteId);
            return data;
        } catch (err) {
            throw err;
        }
    }
}

module.exports = new PacienteService();