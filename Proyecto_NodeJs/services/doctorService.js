// doctorService.js (refactorizado a async/await)
const doctorModel = require('../models/doctorModel');
const { logMensaje } = require('../utils/logger');

class DoctorService {

    // Listado completo o reducido de doctores
    // (id, name, surname, specialty)
    async getAllDoctors() {
        try {
            const data = await doctorModel.getAllDoctors();
            return data;
        } catch (err) {
            throw err;
        }
    }

    // Listado reducido de médicos (id, nombre, especialidad)
    async getAllDoctorListSimple() {
        try {
            const data = await doctorModel.getAllDoctorListSimple();
            return data;
        } catch (err) {
            throw err;
        }
    }

    async getDoctorByIdRelations(id) {
        try {
            const data = await doctorModel.getDoctorByIdRelations(id);
            return data;
        } catch (err) {
            throw err;
        }
    }

    async createDoctor(doctorData) {
        try {
            const result = await doctorModel.createDoctor(doctorData);
            return result;
        } catch (err) {
            throw err;
        }
    }

    async updateDoctor(id, doctorData) {
        try {
            const result = await doctorModel.updateDoctor(id, doctorData);
            return result;
        } catch (err) {
            throw err;
        }
    }

    async deleteDoctor(doctorId) {
        try {
            const result = await doctorModel.deleteDoctor(doctorId);
            return result;
        } catch (err) {
            throw err;
        }
    }

}

module.exports = new DoctorService();
