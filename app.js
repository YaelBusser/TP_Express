import express from "express";
import ejs from "ejs";
import session from "express-session";
import http from "http";
import { Server } from "socket.io";
import moment from "moment";
import { Sequelize } from "sequelize";
import bodyParser from "body-parser";
import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { graphqlHTTP } from "express-graphql";
import config from "./config/config.json" assert {type: 'json'};
import { config as configDotenv } from 'dotenv';

// Import des routes
import RouterHome from "./routes/Home/index.js";
import RouterLogin from "./routes/Login/index.js";
import RouterProfile from "./routes/Profile/index.js";
import RouterLogout from "./routes/Logout/index.js";
import RouterAdmin from "./routes/Admin/index.js";
import RouterContact from "./routes/Contact/index.js";
import RouterFilms from "./routes/Films/index.js";
import RouterFilm from "./routes/Film/index.js";
import setupCineChatRoutes from "./routes/CineChat/index.js";
import RouterGraphql from "./routes/Graphql/index.js";
import Router404 from "./routes/Error/404/index.js";
import schemaConcertsParVille from "./routes/API/Graphql/Concerts/schema.js";
import resolversConcertsParVille from "./routes/API/Graphql/Concerts/resolvers.js";
import RouterApiRestStyles from "./routes/API/REST/Styles/index.js";
import RouterApiRestConcerts from "./routes/API/REST/Concerts/index.js";
import RouterApiRest from "./routes/API/REST/index.js";
import usersData from "./users.json" assert {type: 'json'};

configDotenv();

// Configuration initiale
const app = express();
const port = 8080;
const server = http.createServer(app);
const io = new Server(server);
const sequelize = new Sequelize(config.development);

// Middleware
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(session({
    secret: 'mon-code-secret',
    resave: true,
    saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());

// Connexion à la base de données
(async () => {
    try {
        await sequelize.authenticate();
        console.log('Connexion à la base de données établie avec succès.');
    } catch (error) {
        console.error('Impossible de se connecter à la base de données:', error);
    }
})();

// Configuration de la stratégie Google OAuth avec Passport
passport.serializeUser((user, done) => {
    done(null, user.username);
});

passport.deserializeUser((username, done) => {
    const foundUser = usersData.users.find(user => user.username === username);
    if (foundUser) {
        done(null, foundUser);
    } else {
        done(new Error("L'utilisateur n'a pas été trouvé."));
    }
});

passport.use(new GoogleStrategy({
    clientID: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    callbackURL: "/auth/google/callback"
}, (accessToken, refreshToken, profile, done) => {
    const newUser = {
        googleId: profile.id,
        username: profile.displayName,
        isAdmin: true,
        email: profile.emails[0].value,
        picture: profile.photos[0].value
    };
    usersData.users.push(newUser);
    return done(null, newUser);
}));

// Configuration des vues
app.set('view engine', 'ejs');
app.set('views', './views');
app.use(express.urlencoded({ extended: true }));

// Middleware pour rendre les informations disponibles dans les vues
app.use((req, res, next) => {
    res.locals.req = req;
    next();
});

// Définition des fonctions middleware
const isAdmin = (req, res, next) => {
    if (req.session.isAdmin) {
        next();
    } else {
        res.redirect('/');
    }
};
const isAuthenticated = (req, res, next) => {
    if (req.session.username) {
        next();
    } else {
        res.redirect('/login');
    }
};

// Routes de rendus
app.use('/', RouterHome);
app.use('/admin', isAdmin, RouterAdmin);
app.use('/contact', RouterContact);
app.use('/films', RouterFilms);
app.use('/film', RouterFilm);
app.use('/profile', isAuthenticated, RouterProfile);
app.use('/logout', RouterLogout);
app.use('/login', RouterLogin(usersData));
app.use('/graphql', isAuthenticated, isAdmin, RouterGraphql);
app.use('/api/rest', isAuthenticated, isAdmin, RouterApiRest);
app.use('/cineChat', isAuthenticated, setupCineChatRoutes(io));

// Routes de connexion avec google
app.get('/auth/google',
    passport.authenticate('google', { scope: ['profile', 'email'] })
);

app.get('/auth/google/callback',
    passport.authenticate('google', { failureRedirect: '/login' }),
    (req, res) => {
        req.session.username = usersData.users[usersData.users.length - 1].username;
        req.session.isAdmin = usersData.users[usersData.users.length - 1].isAdmin;
        req.session.email = usersData.users[usersData.users.length - 1].email;
        req.session.picture = usersData.users[usersData.users.length - 1].picture;
        res.redirect('/');
    });

// Routes API
// GraphQL
app.use("/api/graphql/concerts-par-ville", isAuthenticated, isAdmin, graphqlHTTP({
    schema: schemaConcertsParVille,
    rootValue: resolversConcertsParVille,
    graphiql: true,
}));

// REST
app.use('/api/rest/styles', isAuthenticated, isAdmin, RouterApiRestStyles);
app.use('/api/rest/concerts', isAuthenticated, isAdmin, RouterApiRestConcerts);

// Gestion des erreurs et route 404
app.use('/404', Router404);
app.use((req, res) => {
    res.status(404).redirect('/404');
});

// Démarrage du serveur
server.listen(port, () => console.log(`Server running on http://localhost:${port}`));