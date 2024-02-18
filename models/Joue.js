import {DataTypes, sequelize} from "../sequelize.js";
import Concert from "./Concert.js";

const Joue = () => {
    const JoueModel = sequelize.define('Joue', {
        idConcert: {
            type: DataTypes.INTEGER.UNSIGNED,
            allowNull: false,
            primaryKey: true,
            references: {
                model: 'Concert',
                key: 'idConcert'
            }
        },
        idStyle: {
            type: DataTypes.INTEGER.UNSIGNED,
            allowNull: false,
            primaryKey: true,
            references: {
                model: 'Style',
                key: 'idStyle'
            }
        }
    }, {
        sequelize,
        tableName: 'Joue',
        timestamps: false,
        indexes: [
            {
                name: "PRIMARY",
                unique: true,
                using: "BTREE",
                fields: [
                    {name: "idConcert"},
                    {name: "idStyle"},
                ]
            },
            {
                name: "idStyle",
                using: "BTREE",
                fields: [
                    {name: "idStyle"},
                ]
            },
        ]
    });
    return JoueModel;
};

export default Joue();