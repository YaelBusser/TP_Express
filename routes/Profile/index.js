import express from "express";

const router = express.Router();

router.get('/', (req, res) => {
    if (req.session.username) {
        res.render('Profile', {username: req.session.username});
    } else {
        res.redirect("/login")
    }
});

export default router;
