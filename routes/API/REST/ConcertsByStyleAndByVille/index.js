import express from 'express';
import Concert from '../../../../models/Concert.js';
import Joue from '../../../../models/Joue.js';
import Ville from "../../../../models/Ville.js";

const router = express.Router();

router.get('/:idStyle/:idVille', async (req, res) => {
    const { idStyle, idVille } = req.params;

    try {
        const concerts = await Concert.findAll({
            include: [
                {
                    model: Joue,
                    as: 'Joue',
                    where: {
                        idStyle: idStyle,
                    },
                },
                {
                    model: Ville,
                    as: 'Ville',
                    where: {
                        idVille: idVille,
                    },
                },
            ],
        });

        if (!concerts || concerts.length === 0) {
            return res.status(404).json({ error: 'Aucun concert trouvé pour le style et la ville spécifiés.' });
        }
        console.log(concerts);
        res.json(concerts);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erreur lors de la récupération des concerts par style et ville.' });
    }
});

export default router;
