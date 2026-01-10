const medicoService = require('../services/medicoService');
const { logMensaje } = require('../utils/logger');
const Respuesta = require('../utils/respuesta');

class MedicoController {

    // GET /medicos
    async getAllMedicos(req, res) {
        const { listado } = req.query;

        try {
            if (listado) {
                // Devuelve un listado simple (por ejemplo para selects)
                const data = await medicoService.getAllMedicoListado();
                return res.json(
                    Respuesta.exito(data, 'Listado de médicos recuperado')
                );
            } else {
                // Devuelve todos los datos del médico
                const data = await medicoService.getAllMedico();
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
    async getMedicoById(req, res) {
        const { relations } = req.query;
        const medicoId = req.params.id;

        try {
            if (relations) {
                // Médico + pacientes
                const medico = await medicoService.getMedicoByIdRelations(medicoId);

                if (!medico) {
                    logMensaje('Médico no encontrado: ' + medicoId);
                    return res.status(404).json(
                        Respuesta.error(null, 'Médico no encontrado: ' + medicoId)
                    );
                }

                return res.json(
                    Respuesta.exito(medico, 'Médico recuperado con pacientes')
                );
            } else {
                // Solo médico
                const medico = await medicoService.getMedicoById(medicoId);

                if (!medico) {
                    return res.status(404).json(
                        Respuesta.error(null, 'Médico no encontrado: ' + medicoId)
                    );
                }

                return res.json(
                    Respuesta.exito(medico, 'Médico recuperado')
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
    async createMedico(req, res) {
        const medicoData = req.body;

        try {
            const result = await medicoService.createMedico(medicoData);

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
    async updateMedico(req, res) {
        const id = req.params.id;
        const medicoData = req.body;

        try {
            const result = await medicoService.updateMedico(id, medicoData);

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
    async deleteMedico(req, res) {
        const medicoId = req.params.id;

        try {
            const result = await medicoService.deleteMedico(medicoId);

            if (!result || result.affectedRows === 0) {
                return res.status(404).json(
                    Respuesta.error(
                        null,
                        `Médico con id ${medicoId} no encontrado`
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

module.exports = new MedicoController();
