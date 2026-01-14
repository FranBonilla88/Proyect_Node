const patientService = require('../services/patientService');
const { logMensaje } = require('../utils/logger');
const Respuesta = require('../utils/respuesta');

class PatientController {

    // GET /patients
    async getAllPatients(req, res) {
        try {
            const data = await patientService.getAllPatients();
            return res.json(
                Respuesta.exito(data, 'Listado de pacientes recuperado')
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
            // Sequelize devuelve [numFilasActualizadas]
            const [updated] = await patientService.updatePatient(id, patientData);

            if (updated === 0) {
                return res.status(404).json(
                    Respuesta.error(null, `Paciente con id ${id} no encontrado`)
                );
            }

            return res.json(
                Respuesta.exito(
                    null,
                    'Paciente actualizado correctamente'
                )
            );

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
}

module.exports = new PatientController();