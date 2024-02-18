import {DataTypes, sequelize} from "../sequelize.js";
import Artiste from "./Artiste.js";
import Concert from "./Concert.js";

const Realise = () => {
    const RealiseModel = sequelize.define('Realise', {
        IdArtiste: {
            type: DataTypes.INTEGER.UNSIGNED,
            allowNull: false,
            primaryKey: true,
            references: {
                model: 'Artiste',
                key: 'IdArtiste'
            }
        },
        idConcert: {
            type: DataTypes.INTEGER.UNSIGNED,
            allowNull: false,
            primaryKey: true,
            references: {
                model: 'Concert',
                key: 'idConcert'
            }
        }
    }, {
        sequelize,
        tableName: 'Realise',
        timestamps: false,
        indexes: [
            {
                name: "PRIMARY",
                unique: true,
                using: "BTREE",
                fields: [
                    {name: "IdArtiste"},
                    {name: "idConcert"},
                ]
            },
            {
                name: "idConcert",
                using: "BTREE",
                fields: [
                    {name: "idConcert"},
                ]
            },
        ]
    });
    RealiseModel.belongsTo(Concert, {foreignKey: 'idConcert', as: 'Concert'});
    RealiseModel.belongsTo(Artiste, {foreignKey: 'IdArtiste', as: 'Artiste'});

    return RealiseModel;
};
export default Realise();