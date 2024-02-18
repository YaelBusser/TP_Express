import express from 'express';
import Joue from '../../../../models/Joue.js';
import Style from "../../../../models/Style.js";
import { Sequelize } from 'sequelize';

const router = express.Router();

router.get('/:idVille', async (req, res) => {
    const { idVille } = req.params;

    try {
        const stylesProportion = await Style.findAll({
            attributes: [
                'idStyle',
                'libelle',
                [
                    Sequelize.literal('(SELECT COUNT(DISTINCT `Joue`.`idConcert`) FROM `Joue` JOIN `Concert` ON `Joue`.`idConcert` = `Concert`.`idConcert` WHERE `Joue`.`idStyle` = `Style`.`idStyle` AND `Concert`.`idVille` = :idVille)'),
                    'concertCount'
                ],
            ],
            raw: true,
            nest: true,
            replacements: { idVille: idVille },
        });

        if (!stylesProportion || stylesProportion.length === 0) {
            return res.status(404).json({ error: 'Aucune information de proportion trouvée pour la ville spécifiée.' });
        }

        console.log(stylesProportion);
        res.json(stylesProportion);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erreur lors de la récupération de la proportion des styles par ville.' });
    }
});

export default router;
