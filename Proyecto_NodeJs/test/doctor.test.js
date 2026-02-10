const request = require('supertest');
const app = require('../index');

jest.mock('../services/doctorService', () => ({
    getAllDoctors: jest.fn(),
    getAllDoctorListSimple: jest.fn(),
    getDoctorById: jest.fn(),
    getDoctorByIdRelations: jest.fn(),
    createDoctor: jest.fn(),
    updateDoctor: jest.fn(),
    deleteDoctor: jest.fn(),
    findBySpecialty: jest.fn(),
    getDoctorsByAgeRange: jest.fn(),
    getDoctorsForGraph: jest.fn(),
}));

const doctorService = require('../services/doctorService');

describe('Doctor API', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('GET /api/doctors', () => {
        test('debe devolver todos los doctores', async () => {
            const doctors = [
                { id: 1, name: 'Ana', surname: 'Perez', age: 40, specialty: 'Cardiology' },
            ];
            doctorService.getAllDoctors.mockResolvedValue(doctors);

            const res = await request(app).get('/api/doctors');

            expect(res.status).toBe(200);
            expect(res.body.ok).toBe(true);
            expect(Array.isArray(res.body.datos)).toBe(true);
            expect(res.body.datos[0]).toMatchObject({ id: 1, name: 'Ana' });
        });

        test('debe devolver listado simple si se pasa ?listado=true', async () => {
            const simple = [{ id: 1, name: 'Ana', specialty: 'Cardiology' }];
            doctorService.getAllDoctorListSimple.mockResolvedValue(simple);

            const res = await request(app).get('/api/doctors?listado=true');

            expect(res.status).toBe(200);
            expect(res.body.ok).toBe(true);
            expect(res.body.datos[0]).toHaveProperty('specialty');
        });
    });

    describe('GET /api/doctors/:id', () => {
        test('debe devolver un doctor por id', async () => {
            const doc = { id: 1, name: 'Ana', surname: 'Perez' };
            doctorService.getDoctorById.mockResolvedValue(doc);

            const res = await request(app).get('/api/doctors/1');

            expect(res.status).toBe(200);
            expect(res.body.ok).toBe(true);
            expect(res.body.datos).toMatchObject({ id: 1, name: 'Ana' });
            expect(res.body.mensaje).toMatch(/Médico recuperado/);
        });

        test('debe devolver 404 si no existe', async () => {
            doctorService.getDoctorById.mockResolvedValue(null);

            const res = await request(app).get('/api/doctors/999');

            expect(res.status).toBe(404);
            expect(res.body.ok).toBe(false);
            expect(res.body.mensaje).toMatch(/Médico no encontrado/);
        });

        test('debe devolver doctor con relaciones cuando ?relations=true', async () => {
            const doc = { id: 1, name: 'Ana', patients: [{ id: 10 }] };
            doctorService.getDoctorByIdRelations.mockResolvedValue(doc);

            const res = await request(app).get('/api/doctors/1?relations=true');

            expect(res.status).toBe(200);
            expect(res.body.ok).toBe(true);
            expect(res.body.datos.patients).toBeDefined();
            expect(res.body.datos.patients.length).toBe(1);
            expect(res.body.mensaje).toMatch(/con pacientes/);
        });
    });

    describe('POST /api/doctors', () => {
        test('debe crear un doctor y devolver 201', async () => {
            const payload = {
                name: 'Dr. Francisco',
                surname: 'Gómez',
                specialty: 'Cardiology',
                email: 'f@x.com',
                phone: '600123',
                salary: 2500.5,
                active: true,
            };

            const created = { id: 5, ...payload };
            doctorService.createDoctor.mockResolvedValue(created);

            const res = await request(app).post('/api/doctors').send(payload);

            expect(res.status).toBe(201);
            expect(res.body.ok).toBe(true);
            expect(res.body.datos).toMatchObject({ id: 5, name: 'Dr. Francisco' });
        });
    });

    describe('PUT /api/doctors/:id', () => {
        test('debe actualizar un doctor existente', async () => {
            const result = { ok: true, datos: null, mensaje: 'Médico editado correctamente' };
            doctorService.updateDoctor.mockResolvedValue(result);

            const res = await request(app).put('/api/doctors/1').send({ name: 'Nuevo' });

            expect(res.status).toBe(200);
            expect(res.body.ok).toBe(true);
            expect(res.body.mensaje).toMatch(/editado/);
        });

        test('debe devolver 404 si no existe al actualizar', async () => {
            const result = { ok: false, datos: null, mensaje: 'Médico con id 999 no encontrado' };
            doctorService.updateDoctor.mockResolvedValue(result);

            const res = await request(app).put('/api/doctors/999').send({ name: 'No' });

            expect(res.status).toBe(404);
            expect(res.body.ok).toBe(false);
        });
    });

    describe('DELETE /api/doctors/:id', () => {
        test('debe eliminar y devolver 204', async () => {
            doctorService.deleteDoctor.mockResolvedValue(1);

            const res = await request(app).delete('/api/doctors/1');

            expect(res.status).toBe(204);
            expect(res.text).toBe('');
        });

        test('debe devolver 404 si no existe al eliminar', async () => {
            doctorService.deleteDoctor.mockResolvedValue(0);

            const res = await request(app).delete('/api/doctors/999');

            expect(res.status).toBe(404);
            expect(res.body.ok).toBe(false);
        });
    });

    describe('GET /api/doctors/search', () => {
        test('debe buscar por especialidad y devolver resultados', async () => {
            const data = [{ id: 1, specialty: 'Cardiology' }];
            doctorService.findBySpecialty.mockResolvedValue(data);

            const res = await request(app).get('/api/doctors/search?specialty=Cardiology');

            expect(res.status).toBe(200);
            expect(res.body.ok).toBe(true);
            expect(res.body.datos[0].specialty).toBe('Cardiology');
        });

        test('debe devolver 400 si falta el parámetro specialty', async () => {
            const res = await request(app).get('/api/doctors/search');

            expect(res.status).toBe(400);
            expect(res.body.ok).toBe(false);
        });

        test('debe devolver 404 si no hay resultados', async () => {
            doctorService.findBySpecialty.mockResolvedValue([]);

            const res = await request(app).get('/api/doctors/search?specialty=NoExiste');

            expect(res.status).toBe(404);
            expect(res.body.ok).toBe(false);
        });
    });

    describe('GET /api/doctors/search-age', () => {
        test('debe devolver médicos dentro de rango de edad', async () => {
            const data = [{ id: 1, age: 45 }];
            doctorService.getDoctorsByAgeRange.mockResolvedValue(data);

            const res = await request(app).get('/api/doctors/search-age?minAge=40&maxAge=50');

            expect(res.status).toBe(200);
            expect(res.body.ok).toBe(true);
            expect(res.body.datos[0].age).toBe(45);
        });

        test('debe devolver 400 si faltan parámetros', async () => {
            const res = await request(app).get('/api/doctors/search-age?minAge=40');

            expect(res.status).toBe(400);
            expect(res.body.ok).toBe(false);
        });

        test('debe devolver 400 si param no es numérico', async () => {
            const res = await request(app).get('/api/doctors/search-age?minAge=aa&maxAge=bb');

            expect(res.status).toBe(400);
            expect(res.body.ok).toBe(false);
        });

        test('debe devolver 404 si no hay resultados', async () => {
            doctorService.getDoctorsByAgeRange.mockResolvedValue([]);

            const res = await request(app).get('/api/doctors/search-age?minAge=100&maxAge=110');

            expect(res.status).toBe(404);
            expect(res.body.ok).toBe(false);
        });
    });

    describe('GET /api/doctors/graph', () => {
        test('debe devolver datos para la gráfica', async () => {
            const graph = [{ name: 'Ana Perez', value: 3 }];
            doctorService.getDoctorsForGraph.mockResolvedValue(graph);

            const res = await request(app).get('/api/doctors/graph');

            expect(res.status).toBe(200);
            expect(res.body.ok).toBe(true);
            expect(Array.isArray(res.body.datos)).toBe(true);
            expect(res.body.datos[0]).toMatchObject({ name: 'Ana Perez', value: 3 });
        });
    });
});
