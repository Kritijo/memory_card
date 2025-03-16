import { useEffect, useState } from "react";
import "./App.css";
import { errorAudio, winAudio, playClickSound } from "./audio.js";
import confetti from "canvas-confetti";

const triggerShake = () => {
    const board = document.querySelector(".pokemonCards");
    board.classList.add("shake");
    setTimeout(() => board.classList.remove("shake"), 300);
};

const triggerConfetti = () => {
    confetti({
        particleCount: 300,
        angle: 60,
        spread: 200,
        origin: { x: 0, y: 0.5 },
    });

    confetti({
        particleCount: 300,
        angle: 120,
        spread: 200,
        origin: { x: 1, y: 0.5 },
    });
};

function shuffleArray(arr) {
    let currIdx = arr.length;
    while (currIdx != 0) {
        let randomIdx = Math.floor(Math.random() * currIdx);
        currIdx--;
        [arr[currIdx], arr[randomIdx]] = [arr[randomIdx], arr[currIdx]];
    }
}

async function fetchPokemonList(count) {
    const maxPokemon = 1025;
    const ids = new Set();

    while (ids.size < count) {
        ids.add(Math.floor(Math.random() * maxPokemon) + 1);
    }

    const promises = Array.from(ids).map(async (id) => {
        const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
        const data = await response.json();
        return { name: data.name, img: data.sprites.front_default };
    });

    return Promise.all(promises);
}

function PokemonCards({ setScore, setBestScore, setRound }) {
    const [pokemonList, setPokemonList] = useState([]);
    const [vis, setVis] = useState(new Set());

    const handleRestart = (finalScore) => {
        setBestScore((prevScore) => Math.max(finalScore, prevScore));
        setVis(new Set());
        fetchPokemonList(
            `${
                finalScore === pokemonList.length
                    ? pokemonList.length + 6
                    : pokemonList.length
            }`
        ).then((pokemonList) => setPokemonList(pokemonList));
        setScore(() => 0);
    };

    const handleClick = (e) => {
        playClickSound();

        const target = e.target.closest(".card").querySelector("div");

        if (vis.has(target.textContent)) {
            errorAudio.play();
            triggerShake();
            handleRestart(vis.size);
            return;
        }

        setVis(vis.add(target.textContent));
        setScore(vis.size);

        if (vis.size === pokemonList.length) {
            setRound((prevRound) => prevRound + 1);
            triggerConfetti();
            winAudio.play();
            handleRestart(vis.size);
        } else shuffleArray(pokemonList);
    };

    useEffect(() => {
        fetchPokemonList(18).then((pokemonList) => setPokemonList(pokemonList));
    }, []);

    return (
        <div className="pokemonCards">
            {pokemonList.map((pokemon, idx) => (
                <div
                    key={idx}
                    className="card"
                    id={`card-${idx}`}
                    onClick={handleClick}
                >
                    <img src={pokemon.img} />
                    <div>{pokemon.name}</div>
                </div>
            ))}
        </div>
    );
}

function App() {
    const [score, setScore] = useState(0);
    const [bestScore, setBestScore] = useState(0);
    const [round, setRound] = useState(0);

    return (
        <>
            <div className="heading">
                <h1>Pokemon Memory Game</h1>
                <p>
                    Get points by clicking on an image, but don't click on any
                    more than once!
                </p>
            </div>
            <div className="scoreBoard">
                <h2>Score: {score}</h2>
                <h2>Best Score: {bestScore}</h2>
                <h2>Round: {round}</h2>
            </div>

            <PokemonCards
                score={score}
                setScore={setScore}
                setBestScore={setBestScore}
                setRound={setRound}
            ></PokemonCards>
        </>
    );
}

export default App;
