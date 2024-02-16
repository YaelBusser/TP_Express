import express from "express";

const router = express.Router();

router.get('/', (req, res) => {
    if (req.session.isAdmin) {
        res.render('Graphql', {username: req.session.username, isAdmin: req.session.isAdmin});
    } else {
        res.redirect("/");
    }
});

export default router;
