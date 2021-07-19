"use strict";
var defSeed = [[45, 18], [30, 20], [40, 25], [35, 16], [38, 23], [34, 23], [38, 21], [44, 21], [35, 24], [40, 17], [41, 25], [40, 15], [40, 25], [45, 16], [38, 22], [37, 17], [41, 17], [44, 23], [34, 15], [40, 21], [45, 15], [40, 15], [45, 23], [39, 22], [37, 15], [48, 16], [40, 15], [49, 20], [44, 24], [30, 19]];
var defSeed2 = [[40, 24], [31, 23], [36, 25], [42, 22], [39, 22], [37, 22], [45, 23], [33, 22], [43, 16], [38, 22], [33, 25], [30, 25], [34, 24], [37, 15], [35, 17], [48, 18], [43, 17], [48, 21], [35, 20], [44, 23], [41, 19], [43, 18], [39, 23], [32, 18], [40, 23], [35, 15], [47, 23], [33, 15], [45, 18], [34, 15]];
window.onload = function () {
    var canvas = document.getElementById("canvas");
    var ctx = canvas.getContext("2d");
    var _a = create(defSeed), currentGeneration = _a[0], nextGeneration = _a[1];
    //let [currentGeneration, nextGeneration] = create(defSeed);
    var intervalId = setInterval(animate, 1000);
    var i = 0;
    function animate() {
        drawGame(ctx, currentGeneration);
        var alive = i % 2 === 0 ?
            createNextGeneration(currentGeneration, nextGeneration) :
            createNextGeneration(nextGeneration, currentGeneration);
        //i = (i+1) % 2;
        i++;
        if (alive <= 0) {
            clearInterval(intervalId);
        }
        console.log("generation", i, "alive", alive);
    }
};
function createNextGeneration(currentGeneration, nextGeneration) {
    function mod(a, n) {
        return a - n * Math.floor(a / n);
    }
    function nNeighbors(i, j) {
        return (currentGeneration[mod(i - 1, currentGeneration.length)][mod(j - 1, currentGeneration[i].length)] +
            currentGeneration[mod(i - 1, currentGeneration.length)][mod(j, currentGeneration[i].length)] +
            currentGeneration[mod(i - 1, currentGeneration.length)][mod(j + 1, currentGeneration[i].length)] +
            currentGeneration[mod(i, currentGeneration.length)][mod(j - 1, currentGeneration[i].length)] +
            currentGeneration[mod(i, currentGeneration.length)][mod(j + 1, currentGeneration[i].length)] +
            currentGeneration[mod(i + 1, currentGeneration.length)][mod(j - 1, currentGeneration[i].length)] +
            currentGeneration[mod(i + 1, currentGeneration.length)][mod(j, currentGeneration[i].length)] +
            currentGeneration[mod(i + 1, currentGeneration.length)][mod(j + 1, currentGeneration[i].length)]);
    }
    function decideValue(currentValue, nNeigbors) {
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
    var countAlive = 0;
    for (var i = 0; i < currentGeneration.length; i++) {
        for (var j = 0; j < currentGeneration[i].length; j++) {
            var nNeigbors = nNeighbors(i, j);
            nextGeneration[i][j] = decideValue(currentGeneration[i][j], nNeigbors);
            if (nextGeneration[i][j] === 1) {
                countAlive++;
            }
        }
    }
    return countAlive;
}
function create(seed) {
    if (seed === void 0) { seed = undefined; }
    var currentGeneration = [];
    for (var i = 0; i < 40; i++) {
        var row = [];
        for (var j = 0; j < 80; j++) {
            row.push(0);
        }
        currentGeneration.push(row);
    }
    populateWithSeed(currentGeneration, seed);
    var nextGeneration = Array(40);
    for (var i = 0; i < 40; i++) {
        nextGeneration[i] = currentGeneration[i].slice(0, 80);
    }
    return [currentGeneration, nextGeneration];
}
function populateWithSeed(game, seed) {
    if (seed === void 0) { seed = undefined; }
    function randomFromMiddle() {
        //x, y
        return [Math.floor(Math.random() * (50 - 30) + 30), Math.floor(Math.random() * (26 - 15) + 15)];
    }
    if (seed !== undefined) {
        for (var _i = 0, seed_1 = seed; _i < seed_1.length; _i++) {
            var _a = seed_1[_i], x = _a[0], y = _a[1];
            game[y][x] = 1;
        }
        console.log("initialized with seed", JSON.stringify(seed));
    }
    else {
        var seedValues = [];
        for (var i = 0; i < 30; i++) {
            var _b = randomFromMiddle(), x = _b[0], y = _b[1];
            seedValues.push([y, x]);
            game[y][x] = 1;
        }
        console.log("initilized with seed", JSON.stringify(seedValues));
    }
}
function drawGame(ctx, game) {
    ctx.clearRect(0, 0, 800, 400);
    for (var i = 0; i < game.length; i++) {
        for (var j = 0; j < game[i].length; j++) {
            if (game[i][j] === 1) {
                ctx.fillRect(j * 10, i * 10, 10, 10);
            }
        }
    }
}
