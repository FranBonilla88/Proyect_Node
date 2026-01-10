// medicoService.js (refactorizado a async/await)
const medicoModel = require('../models/medicoModel');
const { logMensaje } = require('../utils/logger');

class MedicoService {
    async getAllMedicos() {
        try {
            const data = await medicoModel.getAllMedicos();
            return data;
        } catch (err) {
            throw err;
        }
    }

    // Listado reducido de médicos (id, nombre, especialidad)
    async getAllMedicoListado() {
        try {
            const data = await medicoModel.getAllMedicoListado();
            return data;
        } catch (err) {
            throw err;
        }
    }

    async getMedicoByIdRelations(id) {
        try {
            const data = await medicoModel.getMedicoByIdRelations(id);
            return data;
        } catch (err) {
            throw err;
        }
    }

    async createMedico(medicoData) {
        try {
            const result = await medicoModel.createMedico(medicoData);
            return result;
        } catch (err) {
            throw err;
        }
    }

    async updateMedico(id, medicoData) {
        try {
            const result = await medicoModel.updateMedico(id, medicoData);
            return result;
        } catch (err) {
            throw err;
        }
    }

    async deleteMedico(medicoId) {
        try {
            const result = await medicoModel.deleteMedico(medicoId);
            return result;
        } catch (err) {
            throw err;
        }
    }

    // Otros métodos del servicio...
}

module.exports = new MedicoService();
