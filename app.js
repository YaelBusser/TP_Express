import express, {Router} from "express";
import ejs from "ejs";
import session from "express-session";
import http from "http";
import {Server} from "socket.io";
import moment from "moment";
import config from "./config/config.json" assert {type: "json"};
import {Sequelize} from "sequelize";
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
import {graphqlHTTP} from "express-graphql";
import bodyParser from "body-parser";
import schemaConcertsParVille from "./routes/API/Graphql/Concerts/schema.js";
import resolversConcertsParVille from "./routes/API/Graphql/Concerts/resolvers.js";
import RouterApiRestStyles from "./routes/API/REST/Styles/index.js";
import RouterApiRestConcerts from "./routes/API/REST/Concerts/index.js";
import RouterApiRest from "./routes/API/REST/index.js";
import passport from "passport";
import {Strategy as GoogleStrategy} from "passport-google-oauth20";


const router = Router();
const app = express();
const port = 8080;
const server = http.createServer(app);
const io = new Server(server);
const sequelize = new Sequelize(config.development);

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

(async () => {
    try {
        await sequelize.authenticate();
        console.log('Connexion à la base de données établie avec succès.');
    } catch (error) {
        console.error('Impossible de se connecter à la base de données:', error);
    }
})();

app.set('view engine', 'ejs');
app.set('views', './views');
app.use(express.urlencoded({extended: true}));

app.use(session({
    secret: 'mon-code-secret',
    resave: true,
    saveUninitialized: true
}));

app.use(passport.initialize());
app.use(passport.session());
passport.serializeUser((user, done) => {
    done(null, user.username);
});

passport.deserializeUser((username, done) => {
    const foundUser = users.find(user => user.username === username);
    if (foundUser) {
        done(null, foundUser);
    } else {
        done(new Error("L'utilisateur n'a pas été trouvé."));
    }
});
const users = [
    {
        username: "Admin",
        password: "admin",
        isAdmin: true,
        googleId: 0
    },
    {
        username: "Yaël",
        password: "yael",
        isAdmin: false,
        googleId: 0
    },
    {
        username: "Clément",
        password: "clément",
        isAdmin: false,
        googleId: 0
    },
];

passport.use(new GoogleStrategy({
    clientID: "1096595362566-g3odt7rjdmtb1fp3t8ks9svevccprbo3.apps.googleusercontent.com",
    clientSecret: "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",
    callbackURL: "/auth/google/callback"
}, (accessToken, refreshToken, profile, done) => {
        const newUser = {
            googleId: profile.id,
            username: profile.displayName,
            isAdmin: false
        };
        users.push(newUser);
        return done(null, newUser);
}));

app.use(express.static('public'));

app.use((req, res, next) => {
    res.locals.req = req;
    next();
});

// Routes de rendus
app.use('/', RouterHome);
app.use('/admin', RouterAdmin);
app.use('/contact', RouterContact);
app.use('/films', RouterFilms);
app.use('/film', RouterFilm);
app.use('/profile', RouterProfile);
app.use('/cineChat', setupCineChatRoutes(io));
app.use('/logout', RouterLogout);
app.use('/login', RouterLogin);
app.use('/graphql', RouterGraphql);
app.use('/api/rest', RouterApiRest);

// Routes de connexion avec google
app.get('/auth/google',
    passport.authenticate('google', {scope: ['profile', 'email']})
);
app.get('/auth/google/callback',
    passport.authenticate('google', {failureRedirect: '/login'}),
    (req, res) => {
        // Authentification réussie, redirigez l'utilisateur où vous le souhaitez.
        res.redirect('/');
    });

// Routes API

// GRAPHQL
app.use("/api/graphql/Concerts-par-ville", graphqlHTTP({
    schema: schemaConcertsParVille,
    rootValue: resolversConcertsParVille,
    graphiql: true,
}))

// REST
app.use('/api/rest/styles', RouterApiRestStyles);
app.use('/api/rest/concerts', RouterApiRestConcerts);

app.use('/404', Router404);
app.use((req, res) => {
    res.status(404).redirect('/404');
});

server.listen(port, () => console.log(`Server running on http://localhost:${port}`));