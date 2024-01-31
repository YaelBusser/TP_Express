import {buildSchema} from 'graphql';

export default buildSchema(`
    type Ville {
        idVille: ID,
        nom: String,
        coordonnees: String
    }
    
    type Concert {
        idConcert: ID
        dateConcert: String
        nbrPlaceDisponible: Int
        ville: Ville
    }
    
    type Query {
        concertsParVille(idVille: ID!): [Concert]
    }
`);
