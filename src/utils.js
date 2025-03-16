import over from "./assets/over.wav";
import win from "./assets/win.wav";
import click from "./assets/click.wav";
import finalWin from "./assets/finalWin.wav";
import confetti from "canvas-confetti";

export const triggerShake = () => {
    const board = document.querySelector(".pokemonCards");
    board.classList.add("shake");
    setTimeout(() => board.classList.remove("shake"), 300);
};

export const triggerConfetti = () => {
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

export const errorAudio = new Audio(over);
export const winAudio = new Audio(win);
export const finalWinAudio = new Audio(finalWin);
errorAudio.load();

const audioContext = new (window.AudioContext || window.webkitAudioContext)();
let clickBuffer;

fetch(click)
    .then((response) => response.arrayBuffer())
    .then((arrayBuffer) => audioContext.decodeAudioData(arrayBuffer))
    .then((decodedData) => {
        clickBuffer = decodedData;
    });

export function playClickSound() {
    const source = audioContext.createBufferSource();
    source.buffer = clickBuffer;
    source.connect(audioContext.destination);
    source.start(0);
}
