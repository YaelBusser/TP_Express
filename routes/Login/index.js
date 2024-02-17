import express from "express";
const getRoutesLogin = (usersData) => {
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
        const foundUser = usersData.users.find(user => user.username.toLowerCase() === username.toLowerCase() && user.password === password);

        if (foundUser) {
            req.session.username = foundUser.username;
            req.session.isAdmin = foundUser.isAdmin;
            req.session.picture = "/images/profile-picture-default.png";
            res.redirect('/');
        } else {
            const error = "Identifiant ou mot de passe incorrect.";
            res.render('Login', {error: error,});
        }
    });
    return router;
}

export default getRoutesLogin;