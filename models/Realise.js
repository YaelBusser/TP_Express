import {DataTypes, sequelize} from "../sequelize.js";

const Realise = () => {
  return sequelize.define('Realise', {
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
          { name: "IdArtiste" },
          { name: "idConcert" },
        ]
      },
      {
        name: "idConcert",
        using: "BTREE",
        fields: [
          { name: "idConcert" },
        ]
      },
    ]
  });
};

export default Realise();