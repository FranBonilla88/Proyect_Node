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
            console.error("ERROR en getAllDoctors:", err);
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
            console.error("ERROR en getDoctorById:", err);   // <-- AQUÍ
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
            const resultado = await doctorService.updateDoctor(id, doctorData);

            if (!resultado.ok) {
                return res.status(404).json(resultado);
            }
            return res.json(resultado);

        } catch (err) {
            console.error("ERROR en updateDoctor:", err);
            return res.status(500).json(
                Respuesta.error(
                    err,
                    'Error al recuperar el médico: ' + req.originalUrl
                )
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

    // GET /doctors/search?specialty=Traumatología
    async getDoctorsBySpecialty(req, res) {
        const { specialty } = req.query;

        try {
            if (!specialty) {
                return res.status(400).json(
                    Respuesta.error(
                        null,
                        'Debe indicar una especialidad para realizar la búsqueda'
                    )
                );
            }

            const data = await doctorService.findBySpecialty(specialty);

            if (!data || data.length === 0) {
                return res.status(404).json(
                    Respuesta.error(
                        null,
                        `No se encontraron médicos con la especialidad: ${specialty}`
                    )
                );
            }

            return res.json(
                Respuesta.exito(
                    data,
                    `Médicos con especialidad ${specialty} recuperados correctamente`
                )
            );

        } catch (err) {
            return res.status(500).json(
                Respuesta.error(
                    err,
                    'Error al buscar médicos por especialidad: ' + req.originalUrl
                )
            );
        }
    }

    // GET /doctors/search-age?minAge=30&maxAge=50
    async getDoctorsByAgeRange(req, res) {
        const { minAge, maxAge } = req.query;

        try {
            // Validación: ambos parámetros deben existir
            if (!minAge || !maxAge) {
                return res.status(400).json(
                    Respuesta.error(
                        null,
                        'Debe indicar minAge y maxAge para realizar la búsqueda'
                    )
                );
            }

            // Validación: deben ser números
            if (isNaN(minAge) || isNaN(maxAge)) {
                return res.status(400).json(
                    Respuesta.error(
                        null,
                        'Los valores de minAge y maxAge deben ser numéricos'
                    )
                );
            }

            // Llamada al servicio
            const data = await doctorService.getDoctorsByAgeRange(minAge, maxAge);

            // Si no hay resultados
            if (!data || data.length === 0) {
                return res.status(404).json(
                    Respuesta.error(
                        null,
                        `No se encontraron médicos entre ${minAge} y ${maxAge} años`
                    )
                );
            }

            // Respuesta correcta
            return res.json(
                Respuesta.exito(
                    data,
                    `Médicos entre ${minAge} y ${maxAge} años recuperados correctamente`
                )
            );

        } catch (err) {
            console.error("ERROR en getDoctorsByAgeRange:", err);
            return res.status(500).json(
                Respuesta.error(
                    err,
                    'Error al buscar médicos por rango de edad: ' + req.originalUrl
                )
            );
        }
    }
}

module.exports = new DoctorController();