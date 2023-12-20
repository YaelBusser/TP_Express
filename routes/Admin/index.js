import express from "express";

const router = express.Router();

router.get('/dashboard', (req, res) => {
    res.render('Admin', {username: req.session.username});
});

export default router;
