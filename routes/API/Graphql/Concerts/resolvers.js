import Concert from "../../../../models/Concert.js";
import Ville from "../../../../models/Ville.js";

export default {
    concertsParVille: async ({idVille}) => {
        try {
            return await Concert.findAll({
                where: {idVille},
                include: [{model: Ville, as: 'Ville', attributes: ['idVille', 'nom', 'coordonnees']}],
            });
        } catch (error) {
            console.error('Erreur lors de la récupération des Concerts par ville :', error);
            throw error;
        }
    },
};
