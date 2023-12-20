import express from "express";

const router = express.Router();

router.get('/', (req, res) => {
    res.status(404).render('Error/404', { username: req.session.username });
});

export default router;
