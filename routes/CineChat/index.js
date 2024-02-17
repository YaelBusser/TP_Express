import express from "express";
import moment from "moment/moment.js";

const router = express.Router();
const setupCineChatRoutes = (io) => {
    const rooms = ['Accueil'];
    const error = "";

    const filterBadWords = (message) => {
        const badWords = ['merde'];
        badWords.forEach(word => {
            const regex = new RegExp('\\b' + word + '\\b', 'gi');
            message = message.replace(regex, (match) => {
                return match.charAt(0) + '*'.repeat(match.length - 1);
            });
        });
        return message;
    }

    const chatHistories = {};

    io.on('connection', (socket) => {
        socket.emit('available rooms', rooms);
        let username;
        let currentRoom;

        socket.on('set username', (user) => {
            username = user;
            currentRoom && addToHistory(currentRoom, `${username} a rejoint le salon.`, 'system', "Système");
            io.to(currentRoom).emit('chat message', {
                type: 'system',
                message: `${username} a rejoint le salon.`,
                date: moment().calendar(null, {
                    sameDay: '[Aujourd’hui à] HH:mm',
                    lastDay: '[Hier à] HH:mm',
                    lastWeek: 'DD/MM/YYYY HH:mm',
                    sameElse: 'DD/MM/YYYY HH:mm',
                }),
                userMessage: 'Système',
            });
        });

        socket.on('disconnect', () => {
            if (username) {
                currentRoom && addToHistory(currentRoom, `${username} a quitté le salon.`, 'system', "Système");
                io.to(currentRoom).emit('chat message', {
                    type: 'system',
                    message: `${username} a quitté le salon.`,
                    date: moment().calendar(null, {
                        sameDay: '[Aujourd’hui à] HH:mm',
                        lastDay: '[Hier à] HH:mm',
                        lastWeek: 'DD/MM/YYYY HH:mm',
                        sameElse: 'DD/MM/YYYY HH:mm',
                    }),
                    userMessage: 'Système',
                });
            }
        });

        socket.on('get history', () => {
            currentRoom && socket.emit('chat history', chatHistories[currentRoom] || []);
        });

        socket.on('join room', (room) => {
            socket.join(room);
            currentRoom = room;

            if (!chatHistories[currentRoom]) {
                chatHistories[currentRoom] = [];
            }

            socket.emit('chat history', chatHistories[currentRoom]);
        });

        socket.on('chat message', (data) => {
            let {message} = data;
            message = filterBadWords(message);
            let date = moment().calendar(null, {
                sameDay: '[Aujourd’hui à] HH:mm',
                lastDay: '[Hier à] HH:mm',
                lastWeek: 'DD/MM/YYYY HH:mm',
                sameElse: 'DD/MM/YYYY HH:mm',
            });
            let userMessage = username;
            let picture = "op";
            currentRoom && addToHistory(currentRoom, message, 'user', userMessage);

            io.to(currentRoom).emit('chat message', {
                type: 'user',
                message: message,
                date: date,
                userMessage: userMessage,
            });
        });

        function addToHistory(room, message, messageType, user) {
            const date = moment().calendar(null, {
                sameDay: '[Aujourd’hui à] HH:mm',
                lastDay: '[Hier à] HH:mm',
                lastWeek: 'DD/MM/YYYY HH:mm',
                sameElse: 'DD/MM/YYYY HH:mm',
            });

            chatHistories[room].push({
                type: messageType,
                message: message,
                date: date,
                userMessage: user,
            });
        }
    });


    router.get('/', (req, res) => {
        if (req.session.username) {
            res.render('Rooms', {
                username: req.session.username,
                isAdmin: req.session.isAdmin,
                rooms: rooms,
                error: error
            });
        } else {
            res.redirect("/login");
        }
    });
    router.get('/:room', (req, res) => {
        const room = req.params.room;
        if (req.session.username) {
            res.render('CineChat', {
                username: req.session.username,
                isAdmin: req.session.isAdmin,
                rooms: rooms,
                error: error,
                room: room
            });
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
            res.render('Rooms', {
                username: req.session.username,
                isAdmin: req.session.isAdmin,
                rooms: rooms,
                error: 'Le nom du salon existe déjà.'
            });
        }
    });
    return router;
}

export default setupCineChatRoutes;