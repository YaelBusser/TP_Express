import express from "express";
import Ville from "../../../models/Ville.js";
import Artiste from "../../../models/Artiste.js";
import Style from "../../../models/Style.js";

const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const villes = await Ville.findAll();
        const artistes = await Artiste.findAll();
        const styles = await Style.findAll();
        console.log(artistes);
        res.render('Api', {username: req.session.username, isAdmin: req.session.isAdmin, villes: villes, artistes: artistes, styles: styles});
    } catch (err) {
        res.status(500).message(err);
    }
});

export default router;
