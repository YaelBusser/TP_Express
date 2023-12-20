import express from "express";
import axios from "axios";
import * as readline from "readline";

const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const apiKey = '9f49de7ae4e7847f4cd272851ed07488';
        const language = "fr";
        const limitFilms = 10;
        const reqPopFilms = await axios.get(`https://api.themoviedb.org/3/movie/popular?api_key=${apiKey}&language=${language}`);

        const films = reqPopFilms.data.results.slice(0, limitFilms);
        const randomIndex = Math.floor(Math.random() * films.length);
        const randomFilm = films[randomIndex];

        const reqVideo = await axios.get(`https://api.themoviedb.org/3/movie/${randomFilm.id}/videos?api_key=${apiKey}&language=${language}`).then((data) => {
            if (data.data.results[0] && data.data.results[0].key) {
                return data.data.results[0];
            } else {
                return "https://youtu.be/77hwpuVHGps?si=kPE1qubhT4Xu7Tjp"
            }
        }).catch((err) => {
            console.log("Erreur: ", err);
        });
        res.render('Home', {username: req.session.username, film: randomFilm, filmVideo: reqVideo});
    } catch (err) {
        console.error(err);
    }
});
export default router;
