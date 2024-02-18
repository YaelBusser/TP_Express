import express from 'express';
import Realise from '../../../../models/Realise.js';
import Concert from "../../../../models/Concert.js";

const router = express.Router();

router.get('/:idArtiste', async (req, res) => {
    const { idArtiste } = req.params;

    try {
        const artisteConcerts = await Realise.findAll({
            where: { IdArtiste: idArtiste },
            include: [
                {
                    model: Concert,
                    as: 'Concert'
                }
            ],
        });

        if (!artisteConcerts) {
            return res.status(404).json({ error: 'Artiste non trouvé ou aucun concert associé.' });
        }

        const concerts = artisteConcerts.map(artisteConcert => artisteConcert.Concert);

        console.log(concerts);
        res.json(concerts);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erreur lors de la récupération des concerts par artiste.' });
    }
});

export default router;
