"use strict";
var State;
(function (State) {
    State[State["Dead"] = 0] = "Dead";
    State[State["Alive"] = 1] = "Alive";
})(State || (State = {}));
var WIDTH = 80;
var HEIGHT = 40;
var blockWidth = 10;
var blockHeight = 10;
var defSeed = [[22, 30], [25, 45], [17, 41], [22, 45], [21, 41], [18, 31], [23, 35], [24, 38], [15, 40], [18, 45], [21, 45], [17, 43], [22, 34], [16, 36], [20, 39], [21, 38], [25, 41], [25, 40], [20, 44], [23, 35], [17, 35], [16, 41], [17, 36], [24, 30], [19, 41], [15, 47], [22, 41], [20, 32], [19, 43], [25, 48]];
window.onload = function () {
    var canvas = document.getElementById("canvas");
    var ctx = canvas.getContext("2d");
    var currentGeneration = populateWithSeed(defSeed);
    var prevGeneration = [];
    var intervalId = setInterval(animate, 1000 / 60);
    var i = 0;
    function animate() {
        drawGame(ctx, prevGeneration, currentGeneration);
        var _a = createNextGeneration(currentGeneration), nextGeneration = _a[0], alive = _a[1];
        var temp = currentGeneration;
        currentGeneration = nextGeneration;
        prevGeneration = temp;
        //i = (i+1) % 2;
        i++;
        if (alive <= 0) {
            clearInterval(intervalId);
        }
        console.log("generation", i, "alive", alive);
    }
};
/**
 * Generates the next generation from current
 */
function createNextGeneration(currentGeneration) {
    /**
     * modulo wrapping from both sides of two dimensional space
     * -1, 4 -> 3
     * 4, 4 -> 0
     * if n === 0 -> inf
     */
    function mod(a, n) {
        return a - n * Math.floor(a / n);
    }
    function valueAt(i, j) {
        var value = currentGeneration.find(function (_a) {
            var y = _a[0], x = _a[1];
            return y === i && x === j;
        });
        if (value === undefined) {
            return State.Dead;
        }
        return State.Alive;
    }
    function nNeighbors(i, j) {
        return (valueAt(mod(i - 1, HEIGHT), mod(j - 1, WIDTH)) +
            valueAt(mod(i - 1, HEIGHT), mod(j, WIDTH)) +
            valueAt(mod(i - 1, HEIGHT), mod(j + 1, WIDTH)) +
            valueAt(mod(i, HEIGHT), mod(j - 1, WIDTH)) +
            valueAt(mod(i, HEIGHT), mod(j + 1, WIDTH)) +
            valueAt(mod(i + 1, HEIGHT), mod(j - 1, WIDTH)) +
            valueAt(mod(i + 1, HEIGHT), mod(j, WIDTH)) +
            valueAt(mod(i + 1, HEIGHT), mod(j + 1, WIDTH)));
    }
    /**
     * dedice if cell should remain alive or die
     */
    function decideValue(currentValue, nNeigbors) {
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
    var countAlive = 0;
    var nextGeneration = [];
    for (var i = 0; i < HEIGHT; i++) {
        for (var j = 0; j < WIDTH; j++) {
            var nNeigbors = nNeighbors(i, j);
            var value = decideValue(valueAt(i, j), nNeigbors);
            if (value === State.Alive) {
                nextGeneration.push([i, j]);
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
function populateWithSeed(seed) {
    if (seed === void 0) { seed = undefined; }
    if (seed !== undefined) {
        console.log("initialized with precomputed seed", JSON.stringify(seed));
        return seed;
    }
    function randomFromMiddle() {
        //y,x
        return [
            Math.floor(Math.random() * (26 - 15) + 15),
            Math.floor(Math.random() * (50 - 30) + 30)
        ];
    }
    var seedValues = [];
    for (var i = 0; i < 30; i++) {
        var _a = randomFromMiddle(), y = _a[0], x = _a[1];
        seedValues.push([y, x]);
    }
    console.log("initilized with seed", JSON.stringify(seedValues));
    return seedValues;
}
/**
 * Updates the canvas with given generations erasing previous one and adding new one
 */
function drawGame(ctx, prevGeneration, currentGeneration) {
    for (var _i = 0, prevGeneration_1 = prevGeneration; _i < prevGeneration_1.length; _i++) {
        var _a = prevGeneration_1[_i], y = _a[0], x = _a[1];
        ctx.clearRect(x * 10, y * 10, blockWidth, blockHeight);
    }
    for (var _b = 0, currentGeneration_1 = currentGeneration; _b < currentGeneration_1.length; _b++) {
        var _c = currentGeneration_1[_b], y = _c[0], x = _c[1];
        ctx.fillRect(x * 10, y * 10, blockWidth, blockHeight);
    }
}
