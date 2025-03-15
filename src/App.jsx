import { useEffect, useState } from "react";
import "./App.css";

function PokemonCards() {
    async function fetchPokemon() {
        const randomID = Math.floor(Math.random() * 12) + 1;
        const response = await fetch(
            `https://pokeapi.co/api/v2/pokemon/${randomID}`
        );
        const data = await response.json();

        const pokemon = { name: data.name, img: data.sprites.front_default };

        return pokemon;
    }

    const [pokemon, setPokemon] = useState({ name: "pikachu", img: null });
    useEffect(() => {
        fetchPokemon().then((result) => setPokemon(result));
    }, []);

    const pokemonArr = new Array(12).fill(pokemon);
    return (
        <div className="pokemonCards">
            {pokemonArr.map((pokemon, idx) => (
                <div key={idx} className="card">
                    <img src={pokemon.img} />
                    <div>{pokemon.name}</div>
                </div>
            ))}
        </div>
    );
}

function App() {
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
                    <h2>Score: </h2>
                    <h2>Best Score: </h2>
                </div>
            </div>
            <PokemonCards></PokemonCards>
        </>
    );
}

export default App;
