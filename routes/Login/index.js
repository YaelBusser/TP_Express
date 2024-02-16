import express from "express";
import passport from "passport";
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
            password: "admin",
            isAdmin: true
        },
        {
            username: "Yaël",
            password: "yael",
            isAdmin: false
        },
        {
            username: "Clément",
            password: "clément",
            isAdmin: false
        },
    ];
    const foundUser = users.find(user => user.username.toLowerCase() === username.toLowerCase() && user.password === password);

    if (foundUser) {
        req.session.username = foundUser.username;
        req.session.isAdmin = foundUser.isAdmin;
        console.log(foundUser);
        console.log(req.session.isAdmin);
        res.redirect('/');
    } else {
        const error = "Identifiant ou mot de passe incorrect.";
        res.render('Login', {error: error,});
    }
});
export default router;
