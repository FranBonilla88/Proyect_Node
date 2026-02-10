// ============================================
// IMPORTACIONES
// ============================================
const express = require('express');
const cors = require('cors');
const { logMensaje } = require('./utils/logger');

// Rutas
const doctorRoutes = require('./routes/doctorRoutes');
const patientRoutes = require('./routes/patientRoutes');

// ============================================
// INICIALIZACIÓN
// ============================================
const app = express();
const port = process.env.PORT || 3001;

// ============================================
// MIDDLEWARE
// ============================================
app.use(express.json());
app.use(cors());

// ============================================
// RUTAS - API REST
// ============================================
app.use('/api/doctors', doctorRoutes);
app.use('/api/patients', patientRoutes);

// RUTAS RAIZ (opcional)
app.get('/', (req, res) => {
    res.send('API REST funcionando correctamente');
});

// ============================================
// SERVIDOR
// ============================================
if (process.env.NODE_ENV !== 'test') {
    app.listen(port, () => {
        console.log(`Servidor escuchando en el puerto ${port}`);
    });
}

module.exports = app;
