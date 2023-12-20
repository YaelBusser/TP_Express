import express from "express";
import axios from "axios";

const router = express.Router();
router.get('/', async (req, res) => {
    try {
        const apiKey = '9f49de7ae4e7847f4cd272851ed07488';
        const language = "fr";
        const limitFilms = 10;
        const tmdbResponse = await axios.get(`https://api.themoviedb.org/3/movie/popular?api_key=${apiKey}&language=${language}`);

        const films = tmdbResponse.data.results.slice(0, limitFilms);

        res.status(200).render('Films', {films: films, username: req.session.username});
    } catch (err) {
        console.error(err);
        res.status(500).send('Erreur lors de la récupération des films.');
    }
});

export default router;
