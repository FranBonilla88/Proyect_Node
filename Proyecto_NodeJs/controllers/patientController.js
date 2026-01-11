const patientService = require('../services/patientService');
const { logMensaje } = require('../utils/logger');
const Respuesta = require('../utils/respuesta');

class PatientController {

    // GET /patients
    async getAllPatients(req, res) {
        try {
            // Recuperar todos los pacientes
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
            if (relations) {
                // Paciente + su médico
                const data = await patientService.getPatientByIdRelations(id);

                if (!data || (Array.isArray(data) && data.length === 0)) {
                    return res.status(404).json(
                        Respuesta.error(null, `Paciente con id ${id} no encontrado`)
                    );
                }

                return res.json(
                    Respuesta.exito(
                        data,
                        'Paciente recuperado con su médico'
                    )
                );
            } else {
                // Solo paciente
                const data = await patientService.getPatientById(id);

                if (!data || (Array.isArray(data) && data.length === 0)) {
                    return res.status(404).json(
                        Respuesta.error(null, `Paciente con id ${id} no encontrado`)
                    );
                }

                return res.json(
                    Respuesta.exito(
                        data[0] || data,
                        'Paciente recuperado'
                    )
                );
            }
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
            // Crear un nuevo paciente
            const result = await patientService.createPatient(patientData);

            return res.status(201).json(
                Respuesta.exito(
                    { insertId: result.insertId },
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
            // Actualizar paciente existente
            const result = await patientService.updatePatient(id, patientData);

            if (result.affectedRows === 0) {
                return res.status(404).json(
                    Respuesta.error(null, `Paciente con id ${id} no encontrado`)
                );
            }

            return res.json(
                Respuesta.exito(
                    result,
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
            // Eliminar paciente
            const result = await patientService.deletePatient(id);

            if (result.affectedRows === 0) {
                return res.status(404).json(
                    Respuesta.error(null, `Paciente con id ${id} no encontrado`)
                );
            }

            return res.json(
                Respuesta.exito(
                    result,
                    'Paciente eliminado correctamente'
                )
            );
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