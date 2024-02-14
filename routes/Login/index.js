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
            username: "Admin",
            password: "admin"
        },
        {
            username: "Yaël",
            password: "yael"
        },
        {
            username: "Clément",
            password: "clément"
        },
    ];
    const foundUser = users.find(user => user.username.toLowerCase() === username.toLowerCase() && user.password === password);

    if (foundUser) {
        req.session.username = foundUser.username;
        res.redirect('/');
    } else {
        const error = "Identifiant ou mot de passe incorrect.";
        res.render('Login', {error: error,});
    }
});

export default router;
