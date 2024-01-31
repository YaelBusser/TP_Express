import express from "express";
import Style from "../../../../models/Style.js";
const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const styles = await Style.findAll();
        return res.json(styles);
    } catch (error) {
        console.log(error);
    }
});

export default router;
