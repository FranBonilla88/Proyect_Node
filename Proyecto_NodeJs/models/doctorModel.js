const db = require('../config/dbConfig');
const { logErrorSQL, logMensaje } = require('../utils/logger');

class DoctorModel {

    // Recuperar todos los doctores
    async getAllDoctors() {
        const query = 'SELECT * FROM doctor';
        try {
            const rows = await db.query(query);
            return rows;
        } catch (err) {
            logErrorSQL(err);
            throw err;
        }
    }

    // Listado simple para selects (solo datos básicos)
    async getAllDoctorListSimple() {
        const query = `
            SELECT 
                id AS doctor_id,
                name,
                surname,
                specialty
            FROM doctor
        `;
        try {
            const rows = await db.query(query);
            return rows;
        } catch (err) {
            logErrorSQL(err);
            throw err;
        }
    }

    // Recupera un doctor y todos sus pacientes (relación 1:N)
    // Se devuelve una fila por paciente; si no tiene pacientes, estos serán null
    async getDoctorByIdRelations(id) {
        const query = `
            SELECT 
                d.id AS doctor_id,
                d.name AS doctor_name,
                d.surname AS doctor_surname,
                d.specialty,
                d.email AS doctor_email,
                d.phone AS doctor_phone,

                p.id AS patient_id,
                p.name AS patient_name,
                p.surname AS patient_surname,
                p.birth_date,
                p.email AS patient_email,
                p.phone AS patient_phone

            FROM doctor d
            LEFT JOIN patient p ON d.id = p.doctor_id
            WHERE d.id = ?
        `;
        try {
            return await db.query(query, [id]);
        } catch (err) {
            logErrorSQL(err);
            throw err;
        }
    }

    // Crear doctor
    async createDoctor(doctorData) {
        const query = `
            INSERT INTO doctor (name, surname, specialty, email, phone)
            VALUES (?, ?, ?, ?, ?)
        `;
        const values = [
            doctorData.name,
            doctorData.surname,
            doctorData.specialty,
            doctorData.email,
            doctorData.phone
        ];

        try {
            const result = await db.query(query, values);
            return result; // OkPacket
        } catch (err) {
            logErrorSQL(err);
            throw err;
        }
    }

    // Actualizar doctor
    async updateDoctor(id, doctorData) {
        const query = `
            UPDATE doctor 
            SET name = ?, surname = ?, specialty = ?, email = ?, phone = ?
            WHERE id = ?
        `;

        const values = [
            doctorData.name,
            doctorData.surname,
            doctorData.specialty,
            doctorData.email,
            doctorData.phone,
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

    // Eliminar doctor
    async deleteDoctor(id) {
        const query = 'DELETE FROM doctor WHERE id = ?';
        try {
            const result = await db.query(query, [id]);
            return result; // OkPacket
        } catch (err) {
            logErrorSQL(err);
            throw err;
        }
    }
}

module.exports = new DoctorModel();