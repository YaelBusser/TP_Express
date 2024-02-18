import express from 'express';
import Visiteurs from '../../../../models/Visiteur.js';

const router = express.Router();

router.get('/:idVille', async (req, res) => {
    const {idVille} = req.params;

    try {
        if (idVille) {
            const concerts = await Visiteurs.findAll({
                where: {idVille: idVille},
            });
            res.json(concerts);
        } else {
            res.status(400).json({error: 'Paramètre idVille non défini dans l\'URL.'});
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({error: 'Erreur lors de la récupération des concerts par ville.'});
    }
});

export default router;