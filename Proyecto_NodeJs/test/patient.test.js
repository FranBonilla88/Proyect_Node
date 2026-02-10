const request = require('supertest');
const app = require('../index');

jest.mock('../services/patientService', () => ({
    getAllPatientsPaginated: jest.fn(),
    getPatientById: jest.fn(),
    getPatientByIdRelations: jest.fn(),
    createPatient: jest.fn(),
    updatePatient: jest.fn(),
    deletePatient: jest.fn(),
    getPatientsByDateRange: jest.fn(),
}));

const patientService = require('../services/patientService');

describe('Patient API', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('GET /api/patients', () => {
        test('devuelve paginación por defecto y estructura correcta', async () => {
            const payload = {
                pacientes: [
                    { id: 1, name: 'Juan', surname: 'Pérez', birth_date: '1990-05-12' },
                ],
                total: 1,
                totalPaginas: 1,
            };

            patientService.getAllPatientsPaginated.mockResolvedValue(payload);

            const res = await request(app).get('/api/patients');

            expect(res.status).toBe(200);
            expect(res.body.ok).toBe(true);
            expect(res.body.datos).toHaveProperty('pacientes');
            expect(Array.isArray(res.body.datos.pacientes)).toBe(true);
            expect(res.body.datos.total).toBe(1);
            expect(res.body.mensaje).toMatch(/página 1/);
        });

        test('acepta parámetros page y limit', async () => {
            const payload = { pacientes: [], total: 0, totalPaginas: 0 };
            patientService.getAllPatientsPaginated.mockResolvedValue(payload);

            const res = await request(app).get('/api/patients?page=2&limit=5');

            expect(res.status).toBe(200);
            expect(res.body.ok).toBe(true);
            expect(res.body.mensaje).toMatch(/página 2/);
        });
    });

    describe('GET /api/patients/:id', () => {
        test('devuelve paciente por id', async () => {
            const patient = { id: 1, name: 'Juan', surname: 'Pérez' };
            patientService.getPatientById.mockResolvedValue(patient);

            const res = await request(app).get('/api/patients/1');

            expect(res.status).toBe(200);
            expect(res.body.ok).toBe(true);
            expect(res.body.datos).toMatchObject({ id: 1, name: 'Juan' });
            expect(res.body.mensaje).toMatch(/Paciente recuperado/);
        });

        test('devuelve 404 si no existe', async () => {
            patientService.getPatientById.mockResolvedValue(null);

            const res = await request(app).get('/api/patients/999');

            expect(res.status).toBe(404);
            expect(res.body.ok).toBe(false);
            expect(res.body.mensaje).toMatch(/Paciente con id 999 no encontrado/);
        });

        test('devuelve paciente con relaciones cuando ?relations=true', async () => {
            const patient = { id: 1, name: 'Ana', doctor: { name: 'Dr. X' } };
            patientService.getPatientByIdRelations.mockResolvedValue(patient);

            const res = await request(app).get('/api/patients/1?relations=true');

            expect(res.status).toBe(200);
            expect(res.body.ok).toBe(true);
            expect(res.body.datos.doctor).toBeDefined();
            expect(res.body.mensaje).toMatch(/con su médico/);
        });
    });

    describe('POST /api/patients', () => {
        test('crea un paciente y devuelve 201', async () => {
            const payload = {
                name: 'Juan',
                surname: 'Pérez',
                birth_date: '1990-05-12',
                email: 'juan@example.com',
                phone: '600123123',
                doctor_id: 1,
            };

            const created = { id: 10, ...payload };
            patientService.createPatient.mockResolvedValue(created);

            const res = await request(app).post('/api/patients').send(payload);

            expect(res.status).toBe(201);
            expect(res.body.ok).toBe(true);
            expect(res.body.datos).toMatchObject({ id: 10, name: 'Juan' });
            expect(res.body.mensaje).toMatch(/Paciente creado correctamente/);
        });
    });

    describe('PUT /api/patients/:id', () => {
        test('actualiza paciente existente', async () => {
            const result = { ok: true, datos: null, mensaje: 'Paciente editado correctamente' };
            patientService.updatePatient.mockResolvedValue(result);

            const res = await request(app).put('/api/patients/1').send({ name: 'Nuevo' });

            expect(res.status).toBe(200);
            expect(res.body.ok).toBe(true);
            expect(res.body.mensaje).toMatch(/Paciente editado correctamente/);
        });

        test('devuelve 404 si no existe al actualizar', async () => {
            const result = { ok: false, datos: null, mensaje: 'Paciente con id 999 no encontrado' };
            patientService.updatePatient.mockResolvedValue(result);

            const res = await request(app).put('/api/patients/999').send({ name: 'No' });

            expect(res.status).toBe(404);
            expect(res.body.ok).toBe(false);
        });
    });

    describe('DELETE /api/patients/:id', () => {
        test('elimina y devuelve 204', async () => {
            patientService.deletePatient.mockResolvedValue(1);

            const res = await request(app).delete('/api/patients/1');

            expect(res.status).toBe(204);
            expect(res.text).toBe('');
        });

        test('devuelve 404 si no existe al eliminar', async () => {
            patientService.deletePatient.mockResolvedValue(0);

            const res = await request(app).delete('/api/patients/999');

            expect(res.status).toBe(404);
            expect(res.body.ok).toBe(false);
            expect(res.body.mensaje).toMatch(/Paciente con id 999 no encontrado/);
        });
    });

    describe('GET /api/patients/search-date', () => {
        test('devuelve pacientes dentro de rango de fechas', async () => {
            const data = [{ id: 1, birth_date: '1985-10-20' }];
            patientService.getPatientsByDateRange.mockResolvedValue(data);

            const res = await request(app).get('/api/patients/search-date?startDate=1980-01-01&endDate=1990-12-31');

            expect(res.status).toBe(200);
            expect(res.body.ok).toBe(true);
            expect(res.body.datos[0].birth_date).toBe('1985-10-20');
        });

        test('devuelve 400 si faltan parámetros', async () => {
            const res = await request(app).get('/api/patients/search-date?startDate=1980-01-01');

            expect(res.status).toBe(400);
            expect(res.body.ok).toBe(false);
        });

        test('devuelve 404 si no hay resultados', async () => {
            patientService.getPatientsByDateRange.mockResolvedValue([]);

            const res = await request(app).get('/api/patients/search-date?startDate=2100-01-01&endDate=2100-12-31');

            expect(res.status).toBe(404);
            expect(res.body.ok).toBe(false);
        });
    });
});
