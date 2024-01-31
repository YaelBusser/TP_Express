# TP Express

## Instructions d'installation

1. Clonez le dépôt:

```bash
git clone https://github.com/YaelBusser/TP_Express.git
cd TP_Express
npm install

```

## Graphql

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