import express from "express";
import moment from "moment/moment.js";

const router = express.Router();
export default function setupCineChatRoutes(io) {
    const chatHistory = [];
    const rooms = ['Accueil'];
    const error = "";

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
    router.get('/', (req, res) => {
        if (req.session.username) {
            res.render('Rooms', {username: req.session.username, rooms: rooms, error: error});
        } else {
            res.redirect("/login");
        }
    });
    router.get('/:room', (req, res) => {
        const room = req.params.room;
        if (req.session.username) {
            res.render('CineChat', {username: req.session.username, rooms: rooms, error: error, room: room});
        } else {
            res.redirect("/login");
        }
    });
    router.post('/create', (req, res) => {
        const newRoomName = req.body.roomName;
        if (!rooms.includes(newRoomName)) {
            rooms.push(newRoomName);
            io.emit('Salons disponibles', rooms);
            res.redirect('/cineChat');
        } else {
            res.render('Rooms', {username: req.session.username, rooms: rooms, error: 'Le nom du salon existe déjà.'});
        }
    });
    return router;
}