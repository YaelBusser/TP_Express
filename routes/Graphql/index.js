import express from "express";

const router = express.Router();

router.get('/', (req, res) => {
    res.render('Graphql', {username: req.session.username});
});

export default router;
