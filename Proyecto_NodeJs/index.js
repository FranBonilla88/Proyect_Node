// ============================================
// IMPORTACIONES
// ============================================
const express = require('express');
const cors = require('cors');

// Rutas
const medicoRoutes = require('./routes/medicoRoutes');
const pacienteRoutes = require('./routes/pacienteRoutes');

// ============================================
// INICIALIZACIÓN
// ============================================
const app = express();
const port = process.env.PORT || 3000;

// ============================================
// MIDDLEWARE
// ============================================
app.use(express.json());
app.use(cors());

// ============================================
// RUTAS - API REST
// ============================================
app.use('/api/medicos', medicoRoutes);
app.use('/api/pacientes', pacienteRoutes);

// ============================================
// SERVIDOR
// ============================================
app.listen(port, () => {
    console.log(`Servidor escuchando en el puerto ${port}`);
});
