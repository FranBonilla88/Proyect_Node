const patientService = require('../services/patientService');
const { logMensaje } = require('../utils/logger');
const Respuesta = require('../utils/respuesta');

class PatientController {

    // GET /patients
    async getAllPatients(req, res) {
        try {
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 10;

            const data = await patientService.getAllPatientsPaginated(page, limit);

            return res.json(
                Respuesta.exito(
                    data,
                    `Listado de pacientes recuperado (página ${page})`
                )
            );

        } catch (err) {
            return res.status(500).json(
                Respuesta.error(
                    err,
                    'Error al recuperar los pacientes: ' + req.originalUrl
                )
            );
        }
    }

    // GET /patients/:id
    async getPatientById(req, res) {
        const id = req.params.id;
        const { relations } = req.query;

        try {
            let patient;

            if (relations) {
                // Paciente + su médico
                patient = await patientService.getPatientByIdRelations(id);
            } else {
                // Solo paciente
                patient = await patientService.getPatientById(id);
            }

            if (!patient) {
                return res.status(404).json(
                    Respuesta.error(null, `Paciente con id ${id} no encontrado`)
                );
            }

            return res.json(
                Respuesta.exito(
                    patient,
                    relations
                        ? 'Paciente recuperado con su médico'
                        : 'Paciente recuperado'
                )
            );

        } catch (err) {
            return res.status(500).json(
                Respuesta.error(
                    err,
                    'Error al recuperar el paciente: ' + req.originalUrl
                )
            );
        }
    }

    // POST /patients
    async createPatient(req, res) {
        const patientData = req.body;

        try {
            // Sequelize devuelve el objeto creado
            const patient = await patientService.createPatient(patientData);

            return res.status(201).json(
                Respuesta.exito(
                    patient,
                    'Paciente creado correctamente'
                )
            );
        } catch (err) {
            return res.status(500).json(
                Respuesta.error(
                    err,
                    'Error al crear el paciente'
                )
            );
        }
    }

    // PUT /patients/:id
    async updatePatient(req, res) {
        const id = req.params.id;
        const patientData = req.body;

        try {
            const resultado = await patientService.updatePatient(id, patientData);

            if (!resultado.ok) {
                return res.status(404).json(resultado);
            }

            return res.json(resultado);

        } catch (err) {
            return res.status(500).json(
                Respuesta.error(
                    err,
                    'Error al actualizar el paciente'
                )
            );
        }
    }

    // DELETE /patients/:id
    async deletePatient(req, res) {
        const id = req.params.id;

        try {
            // Sequelize devuelve un número simple
            const deleted = await patientService.deletePatient(id);

            if (deleted === 0) {
                return res.status(404).json(
                    Respuesta.error(null, `Paciente con id ${id} no encontrado`)
                );
            }

            return res.status(204).end();

        } catch (err) {
            return res.status(500).json(
                Respuesta.error(
                    err,
                    'Error al eliminar el paciente'
                )
            );
        }
    }

    async getPatientsByDateRange(req, res) {
        const { startDate, endDate } = req.query;

        try {
            if (!startDate || !endDate) {
                return res.status(400).json(
                    Respuesta.error(null, "Debe indicar startDate y endDate")
                );
            }

            const data = await patientService.getPatientsByDateRange(startDate, endDate);

            if (!data || data.length === 0) {
                return res.status(404).json(
                    Respuesta.error(null, `No se encontraron pacientes entre ${startDate} y ${endDate}`)
                );
            }

            return res.json(
                Respuesta.exito(
                    data,
                    `Pacientes entre ${startDate} y ${endDate} recuperados correctamente`
                )
            );

        } catch (err) {
            return res.status(500).json(
                Respuesta.error(err, "Error al buscar pacientes por rango de fechas")
            );
        }
    }
}

module.exports = new PatientController();