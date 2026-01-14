const doctorService = require('../services/doctorService');
const { logMensaje } = require('../utils/logger');
const Respuesta = require('../utils/respuesta');

class DoctorController {

    // GET /medicos
    async getAllDoctors(req, res) {
        const { listado } = req.query;

        try {
            if (listado) {
                // Listado simple (por ejemplo para selects)
                const data = await doctorService.getAllDoctorListSimple();
                return res.json(
                    Respuesta.exito(data, 'Listado de médicos recuperado')
                );
            } else {
                // Todos los datos del médico
                const data = await doctorService.getAllDoctors();
                return res.json(
                    Respuesta.exito(data, 'Datos de médicos recuperados')
                );
            }
        } catch (err) {
            return res.status(500).json(
                Respuesta.error(
                    err,
                    'Error al recuperar los médicos: ' + req.originalUrl
                )
            );
        }
    }

    // GET /medicos/:id
    async getDoctorById(req, res) {
        const { relations } = req.query;
        const doctorId = req.params.id;

        try {
            let doctor;

            if (relations) {
                // Médico + pacientes
                doctor = await doctorService.getDoctorByIdRelations(doctorId);
            } else {
                // Solo médico
                doctor = await doctorService.getDoctorById(doctorId);
            }

            if (!doctor) {
                logMensaje('Médico no encontrado: ' + doctorId);
                return res.status(404).json(
                    Respuesta.error(null, 'Médico no encontrado: ' + doctorId)
                );
            }

            return res.json(
                Respuesta.exito(
                    doctor,
                    relations
                        ? 'Médico recuperado con pacientes'
                        : 'Médico recuperado'
                )
            );

        } catch (err) {
            return res.status(500).json(
                Respuesta.error(
                    err,
                    'Error al recuperar el médico: ' + req.originalUrl
                )
            );
        }
    }

    // POST /medicos
    async createDoctor(req, res) {
        const doctorData = req.body;

        try {
            // Sequelize devuelve el objeto creado
            const doctor = await doctorService.createDoctor(doctorData);

            return res.status(201).json(
                Respuesta.exito(
                    doctor,
                    'Médico creado correctamente'
                )
            );
        } catch (err) {
            return res.status(500).json(
                Respuesta.error(
                    err,
                    'Error al crear el médico: ' + req.originalUrl
                )
            );
        }
    }

    // PUT /medicos/:id
    async updateDoctor(req, res) {
        const id = req.params.id;
        const doctorData = req.body;

        try {
            // Sequelize devuelve [numFilasActualizadas]
            const [updated] = await doctorService.updateDoctor(id, doctorData);

            if (updated === 0) {
                return res.status(404).json(
                    Respuesta.error(null, `Médico con id ${id} no encontrado`)
                );
            }

            return res.json(
                Respuesta.exito(null, 'Médico actualizado correctamente')
            );

        } catch (err) {
            return res.status(500).json(
                Respuesta.error(err, 'Error al actualizar el médico')
            );
        }
    }

    // DELETE /medicos/:id
    async deleteDoctor(req, res) {
        const doctorId = req.params.id;

        try {
            // Sequelize devuelve un número simple
            const deleted = await doctorService.deleteDoctor(doctorId);

            if (deleted === 0) {
                return res.status(404).json(
                    Respuesta.error(
                        null,
                        `Médico con id ${doctorId} no encontrado`
                    )
                );
            }

            return res.status(204).end();

        } catch (err) {
            return res.status(500).json(
                Respuesta.error(err, 'Error interno del servidor')
            );
        }
    }
}

module.exports = new DoctorController();