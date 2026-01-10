const pacienteService = require('../services/pacienteService');
const { logMensaje } = require('../utils/logger');
const Respuesta = require('../utils/respuesta');

class PacienteController {

    // GET /pacientes
    async getAllPaciente(req, res) {
        try {
            const data = await pacienteService.getAllPaciente();
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

    // GET /pacientes/:id
    // GET /pacientes/:id?relations=true
    async getPacienteById(req, res) {
        const id = req.params.id;
        const { relations } = req.query;

        try {
            if (relations) {
                // Paciente + su médico
                const data = await pacienteService.getPacienteByIdRelations(id);

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
                const data = await pacienteService.getPacienteById(id);

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

    // POST /pacientes
    async createPaciente(req, res) {
        const pacienteData = req.body;

        try {
            const result = await pacienteService.createPaciente(pacienteData);

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

    // PUT /pacientes/:id
    async updatePaciente(req, res) {
        const id = req.params.id;
        const pacienteData = req.body;

        try {
            const result = await pacienteService.updatePaciente(id, pacienteData);

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

    // DELETE /pacientes/:id
    async deletePaciente(req, res) {
        const id = req.params.id;

        try {
            const result = await pacienteService.deletePaciente(id);

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

module.exports = new PacienteController();
