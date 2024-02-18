import express from "express";
import Artiste from "../../../../models/Artiste.js";
const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const artistes = await Artiste.findAll();
        return res.json(artistes);
    } catch (error) {
        console.log(error);
    }
});

export default router;
