# TP Express

## Instructions d'installation

1. Clonez le dépôt:

```bash
git clone https://github.com/YaelBusser/TP_Express.git
cd TP_Express
npm install

```

## Choix technologies :

* ECMAScript 
  * nodesJS
* Framework serveur HTTP
  * Express
* ORM
  * Sequelize
* Base de données
    * [Docker](https://github.com/clemFormation/BDD-liveAddict)
* Moteur de documentation
  * 

## API

Pour avoir accès aux API de l'application, il faut soit se connecter avec un compte administrateur définis en local soit
se connecter avec google dans le formulaire de connexion directement. Sinon, cela bloquera votre accès à ces ressources.

Les appels sont sécurisés avec OAuth2, j'ai donc utilisé OAuth2 de google avec leur
outil [Google Developper Console](https://console.cloud.google.com/project).

### Graphql

Exemple de script permettant de retourner tous les concerts d'une ville par l'id de la ville en question

```bash
{
concertsParVille(idVille: "1"){
    idConcert,
    dateConcert,
    nbrPlaceDisponible,
    ville {
    idVille
    nom,
    coordonnees
    }
  }
}
```

### REST

Voici l'ensemble des données renvoyées par l'API REST :

* L'ensemble des styles
* L'ensemble des artistes
* L'ensemble des concerts d'une ville
* L'ensemble des visiteurs d'une ville
* L'ensemble des concerts d'un artiste
* L'ensemble des concerts d'un style pour une ville
* La proportion des styles écoutés par ville