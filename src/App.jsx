import { useEffect, useState } from "react";
import "./App.css";

async function fetchPokemonList(count) {
    const maxPokemon = 100;
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

function PokemonCards({ score, setScore, setBestScore }) {
    const [pokemonList, setPokemonList] = useState([]);
    const [vis, setVis] = useState(new Set());

    const handleClick = (e) => {
        const target = e.target.closest(".card").querySelector("div");

        if (vis.has(target.textContent)) {
            setScore(() => 0);
            setBestScore((prevScore) => {
                return prevScore > score ? prevScore : score;
            });
            setVis(new Set());
            alert("game over");
            fetchPokemonList(12).then((pokemonList) => setPokemonList(pokemonList));
            return;
        }

        setScore((score) => score + 1);

        setVis(vis.add(target.textContent));
        fetchPokemonList(12).then((pokemonList) => setPokemonList(pokemonList));
    };

    useEffect(() => {
        fetchPokemonList(12).then((pokemonList) => setPokemonList(pokemonList));
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

    return (
        <>
            <div className="header">
                <div className="heading">
                    <h1>Pokemon Memory Game</h1>
                    <p>
                        Get points by clicking on an image, but don't click on
                        any more than once!
                    </p>
                </div>
                <div className="scoreBoard">
                    <h2>Score: {score}</h2>
                    <h2>Best Score: {bestScore}</h2>
                </div>
            </div>
            <PokemonCards
                score={score}
                setScore={setScore}
                setBestScore={setBestScore}
            ></PokemonCards>
        </>
    );
}

export default App;
