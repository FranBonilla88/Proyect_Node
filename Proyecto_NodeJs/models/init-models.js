var DataTypes = require("sequelize").DataTypes;
var _doctor = require("./doctor");
var _patient = require("./patient");

function initModels(sequelize) {
    var doctor = _doctor(sequelize, DataTypes);
    var patient = _patient(sequelize, DataTypes);

    // RELACIÓN 1:N
    // Un doctor tiene muchos pacientes
    doctor.hasMany(patient, { as: "patients", foreignKey: "doctor_id" });

    // Un paciente pertenece a un doctor
    patient.belongsTo(doctor, { as: "doctor", foreignKey: "doctor_id" });

    return {
        doctor,
        patient,
    };
}

module.exports = initModels;
module.exports.initModels = initModels;
module.exports.default = initModels;