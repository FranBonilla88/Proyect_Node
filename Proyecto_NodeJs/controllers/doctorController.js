const doctorService = require('../services/doctorService');
const { logMensaje } = require('../utils/logger');
const Respuesta = require('../utils/respuesta');

class DoctorController {

    // GET /medicos
    async getAllDoctors(req, res) {
        const { listado } = req.query;

        try {
            if (listado) {
                // Devuelve un listado simple (por ejemplo para selects)
                const data = await doctorService.getAllDoctorListSimple();
                return res.json(
                    Respuesta.exito(data, 'Listado de médicos recuperado')
                );
            } else {
                // Devuelve todos los datos del médico
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
    // GET /medicos/:id?relations=true
    async getDoctorById(req, res) {
        const { relations } = req.query;
        const doctorId = req.params.id;

        try {
            if (relations) {
                // Médico + pacientes
                const doctor = await doctorService.getDoctorByIdRelations(doctorId);

                if (!doctor) {
                    logMensaje('Médico no encontrado: ' + doctorId);
                    return res.status(404).json(
                        Respuesta.error(null, 'Médico no encontrado: ' + doctorId)
                    );
                }

                return res.json(
                    Respuesta.exito(doctor, 'Médico recuperado con pacientes')
                );
            } else {
                // Solo médico
                const doctor = await doctorService.getDoctorById(doctorId);

                if (!doctor) {
                    return res.status(404).json(
                        Respuesta.error(null, 'Médico no encontrado: ' + doctorId)
                    );
                }

                return res.json(
                    Respuesta.exito(doctor, 'Médico recuperado')
                );
            }
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
            const result = await doctorService.createDoctor(doctorData);

            return res.status(201).json(
                Respuesta.exito(
                    { insertId: result.insertId },
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
            const result = await doctorService.updateDoctor(id, doctorData);

            if (!result || result.affectedRows === 0) {
                return res.status(404).json(
                    Respuesta.error(null, `Médico con id ${id} no encontrado`)
                );
            }

            return res.json(
                Respuesta.exito(result, 'Médico actualizado correctamente')
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
            const result = await doctorService.deleteDoctor(doctorId);

            if (!result || result.affectedRows === 0) {
                return res.status(404).json(
                    Respuesta.error(
                        null,
                        `Médico con id ${doctorId} no encontrado`
                    )
                );
            }

            // Eliminado correctamente, sin contenido
            return res.status(204).end();

        } catch (err) {
            return res.status(500).json(
                Respuesta.error(err, 'Error interno del servidor')
            );
        }
    }
}

module.exports = new DoctorController();
