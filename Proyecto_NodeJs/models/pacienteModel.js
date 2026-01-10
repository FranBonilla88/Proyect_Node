// pacienteModel.js (refactorizado a async/await usando el wrapper db.query)
const db = require('../config/dbConfig');
const { logErrorSQL, logMensaje } = require('../utils/logger');

class PacienteModel {
    async getAllPacientes() {
        const query = 'SELECT * FROM paciente';
        try {
            const rows = await db.query(query);
            return rows;
        } catch (err) {
            logErrorSQL(err);
            throw err;
        }
    }

    //No hace falta un listado de pacientes porque no tendria sentido, lo suyo es que vaya cada paciente con su medico asociado
    /**
    * Obtiene un paciente por su id sin cargar datos del médico.
    * Devuelve únicamente la información propia del paciente. */
    async getPacienteById(id) {
        const query = 'SELECT * FROM paciente WHERE idpaciente = ?';
        try {
            const rows = await db.query(query, [id]);
            return rows.length ? rows[0] : null;
        } catch (err) {
            logErrorSQL(err);
            throw err;
        }
    }

    /**
     * Obtiene un paciente por su id junto con la información
     * del médico que lo atiende (relación N:1).
     * Usa LEFT JOIN para permitir pacientes sin médico asignado.
     */
    async getPacienteByIdRelations(id) {
        const query = `SELECT p.*, m.nombre AS medico_nombre, m.especialidad
                        FROM paciente p
                        LEFT JOIN medico m ON p.idmedico = m.idmedico
                        WHERE p.idpaciente = ?`;
        try {
            const rows = await db.query(query, [id]);
            return rows.length ? rows[0] : null;
        } catch (err) {
            logErrorSQL(err);
            throw err;
        }
    }

    async createPaciente(pacienteData) {
        const query = 'INSERT INTO paciente (idpaciente, nombre, fecha_nacimiento, idmedico) VALUES (?, ?, ?, ?)';
        const values = [null, pacienteData.nombre, pacienteData.fecha_nacimiento, pacienteData.idmedico];
        try {
            const result = await db.query(query, values);
            return result; // OkPacket
        } catch (err) {
            logErrorSQL(err);
            throw err;
        }
    }

    async updatePaciente(id, pacienteData) {
        const query = 'UPDATE paciente SET ? WHERE idpaciente = ?';
        try {
            const result = await db.query(query, [pacienteData, id]);
            return result; // OkPacket
        } catch (err) {
            logErrorSQL(err);
            throw err;
        }
    }

    async deletePaciente(pacienteId) {
        const query = 'DELETE FROM paciente WHERE idpaciente = ?';
        try {
            const result = await db.query(query, [pacienteId]);
            return result; // OkPacket
        } catch (err) {
            logErrorSQL(err);
            throw err;
        }
    }
}

module.exports = new PacienteModel();