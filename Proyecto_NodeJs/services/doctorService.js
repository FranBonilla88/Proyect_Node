const { Op } = require("sequelize");
const initModels = require("../models/init-models.js").initModels;
const sequelize = require("../config/sequelize.js");
const models = initModels(sequelize);
const Respuesta = require("../utils/respuesta");

const Doctor = models.doctor;
const Patient = models.patient;

class DoctorService {
    async getAllDoctors() {
        return await Doctor.findAll();
    }

    async getDoctorById(id) {
        return await Doctor.findByPk(id);
    }

    async getAllDoctorListSimple() {
        return await Doctor.findAll({
            attributes: ["id", "name", "age", "surname", "specialty"],
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

    async getDoctorsByAgeRange(minAge, maxAge) {
        return await Doctor.findAll({
            where: {
                age: {
                    [Op.between]: [minAge, maxAge]
                }
            },
            attributes: [
                "id",
                "name",
                "surname",
                "age",
                "specialty",
                "email",
                "phone",
                "salary",
                "active"
            ]
        });
    }

    async createDoctor(doctorData) {
        return await Doctor.create(doctorData);
    }

    async updateDoctor(id, doctorData) {
        const [filas] = await Doctor.update(doctorData, { where: { id } });

        if (filas === 0) {
            const existe = await Doctor.findByPk(id);

            return existe
                ? Respuesta.exito(null, "Médico editado correctamente (sin cambios)")
                : Respuesta.error(null, `Médico con id ${id} no encontrado`);
        }
        return Respuesta.exito(null, "Médico editado correctamente");
    }

    async deleteDoctor(id) {
        return await Doctor.destroy({
            where: { id: id },
        });
    }

    async findBySpecialty(specialty) {
        return await Doctor.findAll({
            where: { specialty: specialty }
        });
    }
}

module.exports = new DoctorService();