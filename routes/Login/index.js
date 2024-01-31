import express from "express";
const router = express.Router();

router.get('/', (req, res) => {
    if (req.session.username) {
        res.redirect("/");
    } else {
        res.render('Login');
    }
});

router.post('/', (req, res) => {
    const {username, password} = req.body;
    const users = [
        {
            username: "admin",
            password: "admin"
        },
        {
            username: "yael",
            password: "yael"
        },
        {
            username: "clément",
            password: "clément"
        },
    ];
    const userExists = users.some(user => user.username === username && user.password === password);

    if (userExists) {
        req.session.username = username;
        res.redirect('/');
    } else {
        const error = "Identifiant ou mot de passe incorrect.";
        res.render('Login', {error: error,});
    }
});

export default router;
