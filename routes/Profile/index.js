import express from "express";

const router = express.Router();

router.get('/', (req, res) => {
    res.render('Profile', {
        username: req.session.username,
        email: req.session.email,
        picture: req.session.picture,
        isAdmin: req.session.isAdmin
    });
});

export default router;
