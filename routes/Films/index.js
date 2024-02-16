import express from "express";
import axios from "axios";
import moment from "moment";
import path from "path";
import * as fs from "fs";
import {fileURLToPath} from 'url';

const router = express.Router();
const apiKey = '9f49de7ae4e7847f4cd272851ed07488';
const language = "fr";
const limitFilms = 10;
const tmdbResponse = await axios.get(`https://api.themoviedb.org/3/movie/popular?api_key=${apiKey}&language=${language}`);
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
router.get('/', async (req, res) => {
    try {

        const films = tmdbResponse.data.results.slice(0, limitFilms);
        moment.locale("fr");

        const genreResponse = await axios.get(`https://api.themoviedb.org/3/genre/movie/list?api_key=${apiKey}&language=${language}`);
        const genres = genreResponse.data.genres;

        films.forEach(film => {
            film.release_date_formatted = moment(film.release_date).format('LL');
            film.genres = film.genre_ids.map(genreId => genres.find(genre => genre.id === genreId).name);
            film.avis = (film.vote_average / 2).toFixed(1);
        });
        res.status(200).render('Films', {films: films, username: req.session.username, isAdmin: req.session.isAdmin});
    } catch (err) {
        console.error(err);
        res.status(500).send('Erreur lors de la récupération des films.');
    }
});
router.get('/download', async (req, res) => {
    try {
        const limitFilms = 10;
        const tmdbResponse = await axios.get(`https://api.themoviedb.org/3/movie/popular?api_key=${apiKey}&language=${language}`);

        const films = tmdbResponse.data.results.slice(0, limitFilms);
        moment.locale("fr");
        const textContent = films.map(film => `${film.title} - ${moment(film.release_date).format('LL')}`).join('\n');
        const filePath = path.join(__dirname, `${moment().format('YYYYMMDD_HHmmss')}.txt`);
        fs.writeFileSync(filePath, textContent);
        res.download(filePath, `Top10Film_${moment().format('YYYYMMDD_HHmmss')}.txt`, (err) => {
            fs.unlinkSync(filePath);
        });
    } catch (err) {
        console.error(err);
        res.status(500).send('Erreur lors de la génération du fichier.');
    }
});


export default router;
