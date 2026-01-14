module.exports = function (sequelize, DataTypes) {
    return sequelize.define(
        "patient",
        {
            id: {
                autoIncrement: true,
                type: DataTypes.INTEGER,
                allowNull: false,
                primaryKey: true,
            },
            name: {
                type: DataTypes.STRING(100),
                allowNull: false,
            },
            surname: {
                type: DataTypes.STRING(100),
                allowNull: false,
            },
            birth_date: {
                type: DataTypes.DATEONLY,
                allowNull: false,
            },
            email: {
                type: DataTypes.STRING(150),
                allowNull: false,
            },
            phone: {
                type: DataTypes.STRING(20),
                allowNull: false,
            },
            doctor_id: {
                type: DataTypes.INTEGER,
                allowNull: true,
                references: {
                    model: "doctor",
                    key: "id",
                },
            },
        },
        {
            sequelize,
            tableName: "patient",
            timestamps: false,
        }
    );
};