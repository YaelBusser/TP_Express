import express from "express";
import Concert from "../../../../models/Concert.js";
const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const concerts = await Concert.findAll();
        return res.json(concerts);
    } catch (error) {
        console.log(error);
    }
});

export default router;
