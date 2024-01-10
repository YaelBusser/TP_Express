import express from "express";
import axios from "axios";

const router = express.Router();
router.get('/:id', async (req, res) => {
    try {
        const apiKey = '9f49de7ae4e7847f4cd272851ed07488';
        const language = "fr";
        const filmId = req.params.id;
        const film = await axios.get(`https://api.themoviedb.org/3/movie/${filmId}?api_key=${apiKey}&language=${language}`).then((data) => {
            return data.data;
        }).catch((err) => {
            console.log("Erreur: ", err);
        });
        const reqVideo = await axios.get(`https://api.themoviedb.org/3/movie/${filmId}/videos?api_key=${apiKey}&language=${language}`).then((data) => {
            if (data.data.results[0] && data.data.results[0].key) {
                return data.data.results[0];
            } else {
                return "https://youtu.be/77hwpuVHGps?si=kPE1qubhT4Xu7Tjp"
            }
        }).catch((err) => {
            console.log("Erreur: ", err);
        });
        const reqCredits = await axios.get(`https://api.themoviedb.org/3/movie/${filmId}/credits?api_key=${apiKey}&language=${language}`).then((data) => {
            return data.data.cast;
        }).catch((err) => {
            console.log("Erreur: ", err);
        });
        console.log(reqCredits);
        res.status(200).render('Film', {
            film: film,
            filmVideo: reqVideo,
            username: req.session.username,
            credits: reqCredits
        });
    } catch (err) {
        console.error(err);
        res.status(500).send('Erreur lors de la récupération des détails du film.');
    }
});

export default router;
