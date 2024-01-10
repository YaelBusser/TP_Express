import express from "express";
import ejs from "ejs";
import session from "express-session";

import http from "http";
import {Server} from "socket.io";
import moment from "moment";

const app = express();
const port = 8080;
const server = http.createServer(app);
const chatHistory = [];
const rooms = ['Accueil'];
const error = "";
const io = new Server(server);

function filterBadWords(message) {
    const badWords = ['merde'];
    badWords.forEach(word => {
        const regex = new RegExp('\\b' + word + '\\b', 'gi');
        message = message.replace(regex, (match) => {
            return match.charAt(0) + '*'.repeat(match.length - 1);
        });
    });
    return message;
}

io.on('connection', (socket) => {
    socket.emit('available rooms', rooms);
    let username;
    let currentRoom;
    socket.on('set username', (user) => {
        username = user;
    });
    socket.on('get history', () => {
        socket.emit('chat history', chatHistory);
    });
    socket.on('join room', (room) => {
        socket.join(room);
        currentRoom = room;
        socket.emit('chat history', chatHistory.filter(entry => entry.room === currentRoom));
    });
    socket.on('chat message', (data) => {
        let {message} = data;
        message = filterBadWords(message);
        const formattedMessage = `[${moment().format('HH:mm:ss')}] ${username}: ${message}`;
        chatHistory.push({message: formattedMessage, user: username, room: currentRoom});
        // io.emit('chat message', {message: formattedMessage, user: username});
        io.to(currentRoom).emit('chat message', {message: formattedMessage, user: username});
    });
    socket.on('disconnect', () => {
        console.log('User disconnected');
    });
    socket.on('set username', (username) => {
        console.log(`User connected: ${username}`);
    });
});

import RouterHome from "./routes/Home/index.js";
import RouterLogin from "./routes/Login/index.js";
import RouterProfile from "./routes/Profile/index.js";
import RouterLogout from "./routes/Logout/index.js";
import RouterAdmin from "./routes/Admin/index.js";
import RouterContact from "./routes/Contact/index.js";
import RouterFilms from "./routes/Films/index.js";
import RouterFilm from "./routes/Film/index.js";
import setupCineChatRoutes from "./routes/CineChat/index.js";
import Router404 from "./routes/Error/404/index.js";

// setupCineChatRoutes(io, rooms);
app.set('view engine', 'ejs');
app.set('views', './views');
app.use(express.urlencoded({extended: true}));

app.use(session({
    secret: 'mon-code-secret',
    resave: true,
    saveUninitialized: true
}));
app.use(express.static('public'));


app.use('/', RouterHome);
app.use('/admin', RouterAdmin);
app.use('/contact', RouterContact);
app.use('/films', RouterFilms);
app.use('/film', RouterFilm);
app.use('/profile', RouterProfile);
app.use('/cineChat', setupCineChatRoutes(io, rooms, error));
app.use('/logout', RouterLogout);
app.use('/login', RouterLogin);


app.use('/404', Router404);
app.use((req, res) => {
    res.status(404).redirect('/404');
});

server.listen(port, () => console.log(`Server running on http://localhost:${port}`));