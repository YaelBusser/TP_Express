import express from "express";

const router = express.Router();
export default function setupCineChatRoutes(io, rooms, error){
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