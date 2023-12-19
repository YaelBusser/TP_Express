const express = require('express');
const ejs = require('ejs');
const session = require('express-session');

const app = express();
const port = 8080;

app.set('view engine', 'ejs');
app.use(express.urlencoded({extended: true}));
app.use(session({secret: 'your-secret-key', resave: true, saveUninitialized: true}));

// Routes
app.get('/', (req, res) => res.render('index', {username: req.session.username}));
app.get('/login', (req, res) => res.render('login'));
app.post('/login', (req, res) => {
    const {username, password} = req.body;
    if (username === 'admin' && password === 'admin') {
        req.session.username = username;
        res.redirect('/');
    } else {
        res.redirect('/login');
    }
});
app.get('/admin', (req, res) => res.render('admin'));
app.get('/chapter/:id', (req, res) => res.render('chapter', {chapterId: req.params.id}));
app.get('/download', (req, res) => {
    // Code to handle file download
});
app.get('/404', (req, res) => res.render('error'));

// 404 Page
app.use((req, res) => {
    res.status(404).redirect('/404');
});

app.listen(port, () => console.log(`Server running on http://localhost:${port}`));
