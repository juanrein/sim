"use strict";
/**
 * Game of life
 * https://en.wikipedia.org/wiki/Conway's_Game_of_Life
 */
type Point = [number, number];
type Generation = Point[];
enum State {
    Dead = 0,
    Alive = 1
}

const WIDTH = 80;
const HEIGHT = 40;
const blockWidth = 10;
const blockHeight = 10;
let defSeed:Generation = [[22,30],[25,45],[17,41],[22,45],[21,41],[18,31],[23,35],[24,38],[15,40],[18,45],[21,45],[17,43],[22,34],[16,36],[20,39],[21,38],[25,41],[25,40],[20,44],[23,35],[17,35],[16,41],[17,36],[24,30],[19,41],[15,47],[22,41],[20,32],[19,43],[25,48]]


window.onload = () => {
    let canvas = document.getElementById("canvas") as HTMLCanvasElement;
    let ctx = canvas.getContext("2d");
    let currentGeneration = populateWithSeed(defSeed);
    let prevGeneration = [];
    let intervalId = setInterval(animate, 1000/60);
    let i = 0;

    function animate() {
        drawGame(ctx, prevGeneration, currentGeneration);
        let [nextGeneration, alive] = createNextGeneration(currentGeneration);
        let temp = currentGeneration;
        currentGeneration = nextGeneration;
        prevGeneration = temp;        
        //i = (i+1) % 2;
        i++;
        if (alive <= 0) {
            clearInterval(intervalId);
        }
        console.log("generation", i, "alive", alive);

    }
}

/**
 * Generates the next generation from current
 */
function createNextGeneration(currentGeneration: Generation): [Generation,number] {
    /**
     * modulo wrapping from both sides of two dimensional space
     * -1, 4 -> 3
     * 4, 4 -> 0
     * if n === 0 -> inf
     */
    function mod(a: number, n: number): number {
        return a - n * Math.floor(a / n);
    }
    function valueAt(i: number, j: number): State {
        let value = currentGeneration.find(([y,x]) => y === i && x === j);
        if (value === undefined) {
            return State.Dead;
        }
        return State.Alive;
    }
    function nNeighbors(i: number, j: number): number {
        return (
            valueAt(mod(i - 1, HEIGHT), mod(j - 1, WIDTH)) +
            valueAt(mod(i - 1, HEIGHT), mod(j,     WIDTH)) +
            valueAt(mod(i - 1, HEIGHT), mod(j + 1, WIDTH)) +
            valueAt(mod(i,     HEIGHT), mod(j - 1, WIDTH)) +
            valueAt(mod(i,     HEIGHT), mod(j + 1, WIDTH)) +
            valueAt(mod(i + 1, HEIGHT), mod(j - 1, WIDTH)) +
            valueAt(mod(i + 1, HEIGHT), mod(j,     WIDTH)) +
            valueAt(mod(i + 1, HEIGHT), mod(j + 1, WIDTH))
        );
    }
    /**
     * dedice if cell should remain alive or die
     */
    function decideValue(currentValue: number, nNeigbors: number): State {
        if (currentValue === 1) {
            if (nNeigbors < 2) {
                return State.Dead;
            }
            else if (nNeigbors < 4) {
                return State.Alive;
            }
            else {
                return State.Dead;
            }
        }
        else {
            if (nNeigbors === 3) {
                return State.Alive;
            }
            else {
                return State.Dead;
            }
        }
    }
    let countAlive = 0;
    let nextGeneration: [number,number][] = [];
    for (let i = 0; i < HEIGHT; i++) {
        for (let j = 0; j < WIDTH; j++) {
            let nNeigbors = nNeighbors(i, j);
            let value = decideValue(valueAt(i, j), nNeigbors);
            if (value === State.Alive) {
                nextGeneration.push([i,j]);
                countAlive++;
            }
        }
    }
    return [nextGeneration, countAlive];
}

/**
 * Creates random seed of 30 points around the middle of the canvas
 * if seed given return it
 */
function populateWithSeed(seed: Generation = undefined): Generation {
    if (seed !== undefined) {
        console.log("initialized with precomputed seed", JSON.stringify(seed));
        return seed;
    }
    function randomFromMiddle() {
        //y,x
        return [
            Math.floor(Math.random() * (26 - 15) + 15),
            Math.floor(Math.random() * (50 - 30) + 30)
        ]
    }
    let seedValues = [];
    for (let i = 0; i < 30; i++) {
        let [y,x] = randomFromMiddle();
        seedValues.push([y,x]);
    }
    console.log("initilized with seed", JSON.stringify(seedValues));
    return seedValues;

}

/**
 * Updates the canvas with given generations erasing previous one and adding new one
 */
function drawGame(ctx: CanvasRenderingContext2D, prevGeneration: Generation, currentGeneration: Generation) {
    for (let [y,x] of prevGeneration) {
        ctx.clearRect(x*10,y*10,blockWidth,blockHeight);
    }
    for (let [y,x] of currentGeneration) {
        ctx.fillRect(x*10,y*10, blockWidth, blockHeight);
    }
}