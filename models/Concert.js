import {DataTypes, sequelize} from "../sequelize.js";
import Ville from "./Ville.js";
import Joue from "./Joue.js";

const Concert = () => {
    const ConcertModel = sequelize.define('Concert', {
        idConcert: {
            autoIncrement: true,
            type: DataTypes.INTEGER.UNSIGNED,
            allowNull: false,
            primaryKey: true
        },
        dateConcert: {
            type: DataTypes.DATEONLY,
            allowNull: true
        },
        nbrPlaceDisponible: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        idVille: {
            type: DataTypes.INTEGER.UNSIGNED,
            allowNull: false,
            references: {
                model: 'Ville',
                key: 'idVille'
            }
        }
    }, {
        sequelize,
        tableName: 'Concert',
        timestamps: false,
        indexes: [
            {
                name: "PRIMARY",
                unique: true,
                using: "BTREE",
                fields: [
                    {name: "idConcert"},
                ]
            },
            {
                name: "idVille",
                using: "BTREE",
                fields: [
                    {name: "idVille"},
                ]
            },
        ]
    });

    ConcertModel.belongsTo(Ville, { foreignKey: 'idVille', as: 'Ville' });
    ConcertModel.hasMany(Joue, { foreignKey: 'idConcert', as: 'Joue' });

    return ConcertModel;
};

export default Concert();
