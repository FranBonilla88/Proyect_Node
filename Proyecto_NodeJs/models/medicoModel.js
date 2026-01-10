// medicoModel.js (refactorizado a async/await usando el wrapper db.query)
const db = require('../config/dbConfig');
const { logErrorSQL, logMensaje } = require('../utils/logger');

class MedicoModel {
    async getAllMedicos() {
        const query = 'SELECT * FROM medico';
        try {
            const rows = await db.query(query);
            return rows;
        } catch (err) {
            logErrorSQL(err);
            throw err;
        }
    }

    async getAllMedicoListado() {
        const query = 'SELECT idmedico, nombre, especialidad FROM medico';
        try {
            const rows = await db.query(query);
            return rows;
        } catch (err) {
            logErrorSQL(err);
            throw err;
        }
    }
    // Recupera un médico y todos sus pacientes (relación 1:N).
    // Se devuelve una fila por paciente; si no tiene pacientes, estos serán null.
    async getMedicoByIdRelations(id) {
        const query = `
            SELECT m.idmedico, m.nombre, m.especialidad,
            p.idpaciente, p.nombre AS paciente_nombre, p.fecha_nacimiento
            FROM medico m
            LEFT JOIN paciente p ON m.idmedico = p.idmedico
            WHERE m.idmedico = ?
    `;
        try {
            return await db.query(query, [id]);
        } catch (err) {
            logErrorSQL(err);
            throw err;
        }
    }

    async createMedico(medicoData) {
        const query = 'INSERT INTO medico (idmedico, nombre, especialidad) VALUES (?, ?, ?)';
        const values = [null, medicoData.nombre, medicoData.especialidad];
        try {
            const result = await db.query(query, values);
            return result; // OkPacket
        } catch (err) {
            logErrorSQL(err);
            throw err;
        }
    }

    async updateMedico(id, medicoData) {
        const query = 'UPDATE medico SET ? WHERE idmedico = ?';
        try {
            const result = await db.query(query, [medicoData, id]);
            return result; // OkPacket
        } catch (err) {
            logErrorSQL(err);
            throw err;
        }
    }

    async deleteMedico(medicoId) {
        const query = 'DELETE FROM medico WHERE idmedico = ?';
        try {
            const result = await db.query(query, [medicoId]);
            return result; // OkPacket
        } catch (err) {
            logErrorSQL(err);
            throw err;
        }
    }
}

module.exports = new MedicoModel();