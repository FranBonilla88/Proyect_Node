module.exports = function (sequelize, DataTypes) {
    return sequelize.define(
        "doctor",
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
            specialty: {
                type: DataTypes.STRING(100),
                allowNull: false,
            },
            email: {
                type: DataTypes.STRING(150),
                allowNull: false,
            },
            phone: {
                type: DataTypes.STRING(20),
                allowNull: false,
            }
        },
        {
            sequelize,
            tableName: "doctor",
            timestamps: false,
        }
    );
};