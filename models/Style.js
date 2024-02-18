import {DataTypes, sequelize} from "../sequelize.js";
import Joue from "./Joue.js";
import Ville from "./Ville.js";

const Style = () => {
    const StyleModel = sequelize.define('Style', {
        idStyle: {
            autoIncrement: true,
            type: DataTypes.INTEGER.UNSIGNED,
            allowNull: false,
            primaryKey: true
        },
        libelle: {
            type: DataTypes.STRING(50),
            allowNull: true
        },
        description: {
            type: DataTypes.STRING(5000),
            allowNull: true
        }
    }, {
        sequelize,
        tableName: 'Style',
        timestamps: false,
        indexes: [
            {
                name: "PRIMARY",
                unique: true,
                using: "BTREE",
                fields: [
                    {name: "idStyle"},
                ]
            },
        ]
    });

    StyleModel.hasMany(Joue, { foreignKey: 'idConcert', as: 'Joues' });

    return StyleModel;
};

export default Style();