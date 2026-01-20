const { Op } = require("sequelize");
const initModels = require("../models/init-models.js").initModels;
const sequelize = require("../config/sequelize.js");
const models = initModels(sequelize);
const Respuesta = require("../utils/respuesta");

const Patient = models.patient;
const Doctor = models.doctor;

class PatientService {
    async getAllPatients() {
        return await Patient.findAll({
            include: {
                model: Doctor,
                as: "doctor",
                attributes: ["name"]
            }
        });
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
        const [filas] = await Patient.update(patientData, { where: { id } });

        if (filas === 0) {
            const existe = await Patient.findByPk(id);
            return existe
                ? Respuesta.exito(null, "Paciente editado correctamente (sin cambios)")
                : Respuesta.error(null, `Paciente con id ${id} no encontrado`);
        }

        return Respuesta.exito(null, "Paciente editado correctamente");
    }

    async deletePatient(id) {
        return await Patient.destroy({
            where: { id: id },
        });
    }

    async getPatientsByDateRange(startDate, endDate) {
        return await Patient.findAll({
            where: {
                birth_date: {
                    [Op.between]: [startDate, endDate]
                }
            },
            include: {
                model: Doctor,
                as: "doctor",
                attributes: ["name"]
            }
        });
    }

    async getAllPatientsPaginated(page = 1, limit = 10) {
        const offset = (page - 1) * limit;

        const { rows, count } = await Patient.findAndCountAll({
            limit,
            offset,
            include: {
                model: Doctor,
                as: "doctor",
                attributes: ["name"]
            },
            order: [["id", "ASC"]]
        });

        return {
            pacientes: rows,
            total: count,
            totalPaginas: Math.ceil(count / limit)
        };
    }
}

module.exports = new PatientService();