var DataTypes = require("sequelize").DataTypes;
var _Artiste = require("./Artiste");
var _Concert = require("./Concert");
var _Joue = require("./Joue");
var _Participe = require("./Participe");
var _Realise = require("./Realise");
var _Style = require("./Style");
var _Ville = require("./Ville");
var _Visiteur = require("./Visiteur");

function initModels(sequelize) {
  var Artiste = _Artiste(sequelize, DataTypes);
  var Concert = _Concert(sequelize, DataTypes);
  var Joue = _Joue(sequelize, DataTypes);
  var Participe = _Participe(sequelize, DataTypes);
  var Realise = _Realise(sequelize, DataTypes);
  var Style = _Style(sequelize, DataTypes);
  var Ville = _Ville(sequelize, DataTypes);
  var Visiteur = _Visiteur(sequelize, DataTypes);

  Artiste.belongsToMany(Concert, { as: 'idConcert_Concert_Realises', through: Realise, foreignKey: "IdArtiste", otherKey: "idConcert" });
  Concert.belongsToMany(Artiste, { as: 'IdArtiste_Artistes', through: Realise, foreignKey: "idConcert", otherKey: "IdArtiste" });
  Concert.belongsToMany(Style, { as: 'idStyle_Styles', through: Joue, foreignKey: "idConcert", otherKey: "idStyle" });
  Concert.belongsToMany(Visiteur, { as: 'idVisiteur_Visiteurs', through: Participe, foreignKey: "idConcert", otherKey: "idVisiteur" });
  Style.belongsToMany(Concert, { as: 'idConcert_Concerts', through: Joue, foreignKey: "idStyle", otherKey: "idConcert" });
  Visiteur.belongsToMany(Concert, { as: 'idConcert_Concert_Participes', through: Participe, foreignKey: "idVisiteur", otherKey: "idConcert" });
  Realise.belongsTo(Artiste, { as: "IdArtiste_Artiste", foreignKey: "IdArtiste"});
  Artiste.hasMany(Realise, { as: "Realises", foreignKey: "IdArtiste"});
  Joue.belongsTo(Concert, { as: "idConcert_Concert", foreignKey: "idConcert"});
  Concert.hasMany(Joue, { as: "Joues", foreignKey: "idConcert"});
  Participe.belongsTo(Concert, { as: "idConcert_Concert", foreignKey: "idConcert"});
  Concert.hasMany(Participe, { as: "Participes", foreignKey: "idConcert"});
  Realise.belongsTo(Concert, { as: "idConcert_Concert", foreignKey: "idConcert"});
  Concert.hasMany(Realise, { as: "Realises", foreignKey: "idConcert"});
  Artiste.belongsTo(Style, { as: "idStyle_Style", foreignKey: "idStyle"});
  Style.hasMany(Artiste, { as: "Artistes", foreignKey: "idStyle"});
  Joue.belongsTo(Style, { as: "idStyle_Style", foreignKey: "idStyle"});
  Style.hasMany(Joue, { as: "Joues", foreignKey: "idStyle"});
  Concert.belongsTo(Ville, { as: "idVille_Ville", foreignKey: "idVille"});
  Ville.hasMany(Concert, { as: "Concerts", foreignKey: "idVille"});
  Visiteur.belongsTo(Ville, { as: "idVille_Ville", foreignKey: "idVille"});
  Ville.hasMany(Visiteur, { as: "Visiteurs", foreignKey: "idVille"});
  Participe.belongsTo(Visiteur, { as: "idVisiteur_Visiteur", foreignKey: "idVisiteur"});
  Visiteur.hasMany(Participe, { as: "Participes", foreignKey: "idVisiteur"});
  Visiteur.belongsTo(Visiteur, { as: "idParrain_Visiteur", foreignKey: "idParrain"});
  Visiteur.hasMany(Visiteur, { as: "Visiteurs", foreignKey: "idParrain"});

  return {
    Artiste,
    Concert,
    Joue,
    Participe,
    Realise,
    Style,
    Ville,
    Visiteur,
  };
}
module.exports = initModels;
module.exports.initModels = initModels;
module.exports.default = initModels;
