import {DataTypes, sequelize} from "../sequelize.js";

const Ville = () => {
    return sequelize.define('Ville', {
        idVille: {
            autoIncrement: true,
            type: DataTypes.INTEGER.UNSIGNED,
            allowNull: false,
            primaryKey: true
        },
        nom: {
            type: DataTypes.STRING(50),
            allowNull: true
        },
        coordonnees: {
            type: DataTypes.TEXT,
            allowNull: true
        }
    }, {
        sequelize,
        tableName: 'Ville',
        timestamps: false,
        indexes: [
            {
                name: "PRIMARY",
                unique: true,
                using: "BTREE",
                fields: [
                    {name: "idVille"},
                ]
            },
        ]
    });
};

export default Ville();