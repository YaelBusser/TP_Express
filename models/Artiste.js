import {DataTypes, sequelize} from "../sequelize.js";

const Artiste = () => {
  return sequelize.define('Artiste', {
    IdArtiste: {
      autoIncrement: true,
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      primaryKey: true
    },
    pseudo: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    idStyle: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: true,
      references: {
        model: 'Style',
        key: 'idStyle'
      }
    }
  }, {
    sequelize,
    tableName: 'Artiste',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "IdArtiste" },
        ]
      },
      {
        name: "idStyle",
        using: "BTREE",
        fields: [
          { name: "idStyle" },
        ]
      },
    ]
  });
};

export default Artiste();