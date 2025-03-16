import over from "./assets/over.wav";
import win from "./assets/win.wav";
import click from "./assets/click.wav";

export const errorAudio = new Audio(over);
export const winAudio = new Audio(win);
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
