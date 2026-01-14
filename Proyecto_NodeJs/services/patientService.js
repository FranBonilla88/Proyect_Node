const { Op } = require("sequelize");
const initModels = require("../models/init-models.js").initModels;
const sequelize = require("../config/sequelize.js");
const models = initModels(sequelize);

const Patient = models.patient;
const Doctor = models.doctor;

class PatientService {
    async getAllPatients() {
        return await Patient.findAll();
    }

    async getPatientById(id) {
        return await Patient.findByPk(id);
    }

    async getPatientByIdRelations(id) {
        return await Patient.findByPk(id, {
            include: [
                {
                    model: Doctor,
                    as: "doctor",
                },
            ],
        });
    }

    async createPatient(patientData) {
        return await Patient.create(patientData);
    }

    async updatePatient(id, patientData) {
        return await Patient.update(patientData, {
            where: { id: id },
        });
    }

    async deletePatient(id) {
        return await Patient.destroy({
            where: { id: id },
        });
    }
}

module.exports = new PatientService();