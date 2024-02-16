import express from "express";

const router = express.Router();

router.get('/dashboard', (req, res) => {
    res.render('Admin', {username: req.session.username, isAdmin: req.session.isAdmin});
});

export default router;
