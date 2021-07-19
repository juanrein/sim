"use strict";

const defSeed = [[45,18],[30,20],[40,25],[35,16],[38,23],[34,23],[38,21],[44,21],[35,24],[40,17],[41,25],[40,15],[40,25],[45,16],[38,22],[37,17],[41,17],[44,23],[34,15],[40,21],[45,15],[40,15],[45,23],[39,22],[37,15],[48,16],[40,15],[49,20],[44,24],[30,19]];
const defSeed2 = [[40,24],[31,23],[36,25],[42,22],[39,22],[37,22],[45,23],[33,22],[43,16],[38,22],[33,25],[30,25],[34,24],[37,15],[35,17],[48,18],[43,17],[48,21],[35,20],[44,23],[41,19],[43,18],[39,23],[32,18],[40,23],[35,15],[47,23],[33,15],[45,18],[34,15]];
window.onload = () => {
    let canvas = document.getElementById("canvas") as HTMLCanvasElement;
    let ctx = canvas.getContext("2d");
    let [currentGeneration, nextGeneration] = create(defSeed);
    //let [currentGeneration, nextGeneration] = create(defSeed);

    let intervalId = setInterval(animate, 1000);
    let i = 0;
    function animate() {
        drawGame(ctx, currentGeneration);
        let alive = i % 2 === 0 ?
            createNextGeneration(currentGeneration, nextGeneration) :
            createNextGeneration(nextGeneration, currentGeneration)
        //i = (i+1) % 2;
        i++;
        if (alive <= 0) {
            clearInterval(intervalId);
        }
        console.log("generation", i, "alive", alive);

    }
}

function createNextGeneration(currentGeneration: number[][], nextGeneration: number[][]) {
    function mod(a: number, n: number): number {
        return a - n * Math.floor(a / n);
    }
    function nNeighbors(i: number, j: number): number {
        return (
            currentGeneration[mod(i - 1, currentGeneration.length)][mod(j - 1, currentGeneration[i].length)] +
            currentGeneration[mod(i - 1, currentGeneration.length)][mod(j, currentGeneration[i].length)] +
            currentGeneration[mod(i - 1, currentGeneration.length)][mod(j + 1, currentGeneration[i].length)] +
            currentGeneration[mod(i, currentGeneration.length)][mod(j - 1, currentGeneration[i].length)] +
            currentGeneration[mod(i, currentGeneration.length)][mod(j + 1, currentGeneration[i].length)] +
            currentGeneration[mod(i + 1, currentGeneration.length)][mod(j - 1, currentGeneration[i].length)] +
            currentGeneration[mod(i + 1, currentGeneration.length)][mod(j, currentGeneration[i].length)] +
            currentGeneration[mod(i + 1, currentGeneration.length)][mod(j + 1, currentGeneration[i].length)]
        );
    }
    function decideValue(currentValue: number, nNeigbors: number): number {
        if (currentValue === 1) {
            if (nNeigbors < 2) {
                return 0;
            }
            else if (nNeigbors < 4) {
                return 1;
            }
            else {
                return 0;
            }
        }
        else {
            if (nNeigbors === 3) {
                return 1;
            }
            else {
                return 0;
            }
        }
    }
    let countAlive = 0;
    for (let i = 0; i < currentGeneration.length; i++) {
        for (let j = 0; j < currentGeneration[i].length; j++) {
            let nNeigbors = nNeighbors(i, j);
            nextGeneration[i][j] = decideValue(currentGeneration[i][j], nNeigbors);
            if (nextGeneration[i][j] === 1) {
                countAlive++;
            }
        }
    }
    return countAlive;
}

function create(seed: number[][] = undefined): number[][][] {
    let currentGeneration: number[][] = []
    for (let i = 0; i < 40; i++) {
        let row = []
        for (let j = 0; j < 80; j++) {
            row.push(0);
        }
        currentGeneration.push(row);
    }
    populateWithSeed(currentGeneration, seed);
    let nextGeneration = Array(40);
    for (let i = 0; i < 40; i++) {
        nextGeneration[i] = currentGeneration[i].slice(0, 80);
    }
    return [currentGeneration, nextGeneration];
}

function populateWithSeed(game: number[][], seed: number[][] = undefined) {
    function randomFromMiddle() {
        //x, y
        return [Math.floor(Math.random() * (50 - 30) + 30), Math.floor(Math.random() * (26 - 15) + 15)]
    }
    if (seed !== undefined) {
        for (let [x, y] of seed) {
            game[y][x] = 1;
        }
        console.log("initialized with seed", JSON.stringify(seed));
    }
    else {
        let seedValues = [];
        for (let i = 0; i < 30; i++) {
            let [x, y] = randomFromMiddle();
            seedValues.push([y,x]);
            game[y][x] = 1;
        }
        console.log("initilized with seed", JSON.stringify(seedValues));
    }


}


function drawGame(ctx: CanvasRenderingContext2D, game: number[][]) {
    ctx.clearRect(0, 0, 800, 400);
    for (let i = 0; i < game.length; i++) {
        for (let j = 0; j < game[i].length; j++) {
            if (game[i][j] === 1) {
                ctx.fillRect(j * 10, i * 10, 10, 10);
            }
        }
    }
}