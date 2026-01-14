const { Op } = require("sequelize");
const initModels = require("../models/init-models.js").initModels;
const sequelize = require("../config/sequelize.js");
const models = initModels(sequelize);

const Doctor = models.doctor;
const Patient = models.patient;

class DoctorService {
    async getAllDoctors() {
        return await Doctor.findAll();
    }

    async getAllDoctorListSimple() {
        return await Doctor.findAll({
            attributes: ["id", "name", "surname", "specialty"],
        });
    }

    async getDoctorByIdRelations(id) {
        return await Doctor.findByPk(id, {
            include: [
                {
                    model: Patient,
                    as: "patients",
                },
            ],
        });
    }

    async createDoctor(doctorData) {
        return await Doctor.create(doctorData);
    }

    async updateDoctor(id, doctorData) {
        return await Doctor.update(doctorData, {
            where: { id: id },
        });
    }

    async deleteDoctor(id) {
        return await Doctor.destroy({
            where: { id: id },
        });
    }
}

module.exports = new DoctorService();