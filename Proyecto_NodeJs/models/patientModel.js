const db = require('../config/dbConfig');
const { logErrorSQL, logMensaje } = require('../utils/logger');

class PatientModel {

    // Recuperar todos los pacientes
    async getAllPatients() {
        const query = 'SELECT * FROM patient';
        try {
            const rows = await db.query(query);
            return rows;
        } catch (err) {
            logErrorSQL(err);
            throw err;
        }
    }

    // No hace falta un listado simple de pacientes porque no tendría sentido;
    // lo suyo es que cada paciente vaya con su médico asociado

    /**
     * Obtiene un paciente por su id sin cargar datos del médico.
     * Devuelve únicamente la información propia del paciente.
     */
    async getPatientById(id) {
        const query = 'SELECT * FROM patient WHERE id = ?';
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
    async getPatientByIdRelations(id) {
        const query = `
            SELECT 
                p.id AS patient_id,
                p.name AS patient_name,
                p.surname AS patient_surname,
                p.birth_date,
                p.email AS patient_email,
                p.phone AS patient_phone,
                p.doctor_id,

                d.id AS doctor_id,
                d.name AS doctor_name,
                d.surname AS doctor_surname,
                d.specialty AS doctor_specialty,
                d.email AS doctor_email,
                d.phone AS doctor_phone

            FROM patient p
            LEFT JOIN doctor d ON p.doctor_id = d.id
            WHERE p.id = ?
        `;
        try {
            const rows = await db.query(query, [id]);
            return rows.length ? rows[0] : null;
        } catch (err) {
            logErrorSQL(err);
            throw err;
        }
    }

    // Crear paciente
    async createPatient(patientData) {
        const query = `
            INSERT INTO patient (name, surname, birth_date, email, phone, doctor_id)
            VALUES (?, ?, ?, ?, ?, ?)
        `;
        const values = [
            patientData.name,
            patientData.surname,
            patientData.birth_date,
            patientData.email,
            patientData.phone,
            patientData.doctor_id
        ];
        try {
            const result = await db.query(query, values);
            return result; // OkPacket
        } catch (err) {
            logErrorSQL(err);
            throw err;
        }
    }

    // Actualizar paciente
    async updatePatient(id, patientData) {
        const query = `
            UPDATE patient
            SET name = ?, surname = ?, birth_date = ?, email = ?, phone = ?, doctor_id = ?
            WHERE id = ?
        `;
        const values = [
            patientData.name,
            patientData.surname,
            patientData.birth_date,
            patientData.email,
            patientData.phone,
            patientData.doctor_id,
            id
        ];
        try {
            const result = await db.query(query, values);
            return result; // OkPacket
        } catch (err) {
            logErrorSQL(err);
            throw err;
        }
    }

    // Eliminar paciente
    async deletePatient(id) {
        const query = 'DELETE FROM patient WHERE id = ?';
        try {
            const result = await db.query(query, [id]);
            return result; // OkPacket
        } catch (err) {
            logErrorSQL(err);
            throw err;
        }
    }
}

module.exports = new PatientModel();