/* Advent of Code 2025 Day 10: Factory */

// Part 1: Dijkstra's algorithm

var fs = require("fs");
var solver = require("javascript-lp-solver");

const min = (a,b) => a < b ? a : b;

function minBy(unvisited,distances) {
    let result = -1;
    let minimum = Infinity;
    for (let element of unvisited) {
        if (distances[element][1] < minimum) {
            minimum = distances[element][1]
            result = element
        }
    }
    return result
}

function dijkstraToggleStart(d) {
    let g = [...Array(2 ** d).keys()].map(a => [a,Infinity]);
    g[0][1] = 0;
    return g;
}

function dijkstraToggle(d, targetLights, buttons) {
    let target = targetLights.map(i => 2**i).reduce((a,b) => a+b);
    let distances = dijkstraToggleStart(d);
    let unvisited = new Set([...Array(2 ** d).keys()])
    let current;
    let moves = buttons.map(b => b.map(s => 2**s).reduce((a,b) => a+b));
    while (Array.from(unvisited).some(x => distances[x][1] != Infinity)) {
        current = minBy(unvisited,distances);
        for (let m of moves) {
            let neighbor = current ^ m;
            if (unvisited.has(neighbor)) {
                distances[neighbor][1] = min(distances[neighbor][1],distances[current][1] + 1)
            }
        }
        unvisited.delete(current);
    }
    return distances[target][1];
}

function minPressesToggle(machine,id) {
    let d = machine.dimension,
        targetLights = machine.targetLights,
        moves = machine.buttons;
    return dijkstraToggle(d,targetLights,moves);
}

function parseMachines(fileName) {
    const data = fs.readFileSync(fileName,'utf8').split('\n');
    let machines = [];
    for (let line of data) {
        let parts = line.split(' ');
        let targetLights = parts.shift().slice(1,-1).split("")
        let targetMask = targetLights.map((c,index) => (
            c == '#' ? index : null
        )).filter(n => (n != null));
        let dimension = targetLights.length;
        let buttonTuples = parts.slice(0,-1)
        let buttons = []
        for (let buttonTuple of buttonTuples) {
            buttons.push(buttonTuple.slice(1,-1).split(",").map(Number));
        }

        let joltages = parts.at(-1).slice(1,-1).split(",").map(Number);

        machines.push({
            dimension:dimension,
            targetLights: targetMask,
            buttons: buttons,
            joltages: joltages
        })
    }
    return machines;
}

function part1(fileName) {
    return parseMachines(fileName).map((m,idx) => minPressesToggle(m,idx)).reduce((a,b) => a+b);
}

console.log(part1('input.txt')); // 436

// Part 2: Linear programming

function buildLabels(n) {
    let labels = []
    for (let i = 0; i < n; i++) {
        labels.push("c" + i)
    }
    return labels;
}

function buildConstraints(model,target) {
    let constraintsObject = new Object();
    let labels = buildLabels(target.length)
    for (let i = 0; i < target.length; i++) {
        constraintsObject[labels[i]] = {
            "min": target[i],
            "max": target[i]
        };
    }
    model["constraints"] = constraintsObject;
    return;
}

function buildButtons(model, numConstraints, buttonArray) {
    let labels = buildLabels(numConstraints);
    buttonsObject = new Object();
    for (let i = 0; i < buttonArray.length; i++) {
        bObject = new Object;
        for (let j = 0; j < numConstraints; j++) {
            if (buttonArray[i].includes(j)) {
                bObject[labels[j]] = 1;
            }
            else {
                bObject[labels[j]] = 0;
            }
        }
        bObject["presses"] = 1;
        buttonsObject["button" + i] = bObject;
    }
    model["variables"] = buttonsObject;
}

function buildModel(target,buttons) {
    let model = {
        "optimize": "presses",
        "opType": "min"
    };
    let intsObject = {}
    for (let i = 0; i < buttons.length; i++) {
        intsObject["button" + i] = 1;
    }
    model["ints"] = intsObject;
    buildConstraints(model,target);
    buildButtons(model,target.length,buttons);
    return model;
}

function part2(fileName) {
    let machines = parseMachines(fileName);
    return machines.map(machine => {
        let model = buildModel(machine.joltages,machine.buttons);
        return solver.Solve(model).result;
    }).reduce((a,b) => a+b);
}

console.log(part2('input.txt')) // 14999
