// pacienteService.js
const patientModel = require('../models/patientModel');
const { logMensaje } = require('../utils/logger');

class PatientService {

    async getAllPatients() {
        try {
            const data = await patientModel.getAllPatients();
            return data;
        } catch (err) {
            throw err;
        }
    }

    async getPatientById(id) {
        try {
            const data = await patientModel.getPatientById(id);
            return data;
        } catch (err) {
            throw err;
        }
    }

    async getPatientByIdRelations(id) {
        try {
            const data = await patientModel.getPatientByIdRelations(id);
            return data;
        } catch (err) {
            throw err;
        }
    }

    async createPatient(patientData) {
        try {
            const data = await patientModel.createPatient(patientData);
            return data;
        } catch (err) {
            throw err;
        }
    }

    async updatePatient(id, patientData) {
        try {
            const data = await patientModel.updatePatient(id, patientData);
            return data;
        } catch (err) {
            throw err;
        }
    }

    async deletePatient(patientId) {
        try {
            const data = await patientModel.deletePatient(patientId);
            return data;
        } catch (err) {
            throw err;
        }
    }
}

module.exports = new PatientService();