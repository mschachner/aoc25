/* Advent of Code 2025 Day 11: Reactor */

import { readFileSync } from "fs";


// Part 1: Get paths through a DAG.

function clearClone(state, endpoint='out') {
    let newState = structuredClone(state);
    for (let [key,node] of newState) {
        if (key != endpoint) node.value = 0;
    }
    return newState
}

function advanceState(state, endpoint='out') {
    let newState = clearClone(state, endpoint)
    for (let [key, node] of state) {
        if (key == endpoint) continue;
        for (let child of node.children) {
            let childNode = newState.get(child);
            childNode.value += node.value
        }
    }
    return newState
}

function isComplete(state, endpoint='out') {
    for (let [key, node] of state) {
        if (key != endpoint && node.value > 0) {
            return false;
        }
    }
    return true;
}

let testState = new Map([
    ["a", {value: 1, children: ["b", "out"]}],
    ["b", {value: 0, children: ["out"]}],
    ["out", {value: 0, children: []}]
])

function runState(state, endpoint='out') {
    let newState = structuredClone(state);
    newState.get(endpoint).children = []
    while (!isComplete(newState,endpoint)) {
        newState = advanceState(newState,endpoint);
    }
    return newState;
}

function parseState(fileName) {
    let state = new Map();
    const data = readFileSync(fileName,'utf8').split('\n');
    for (let line of data) {
        let words = line.split(' ');
        let key = words.shift().slice(0,-1);
        let node = {value: 0, children: words};
        state.set(key,node);
    }
    state.set('out',{
        value: 0,
        children: []
    })
    return state;
}

function paths(state,startpoint='you',endpoint='out') {
    let newState = structuredClone(state);
    newState.get(startpoint).value=1
    newState = runState(newState,endpoint)
    return newState.get(endpoint).value;
}

function part1(fileName) {
    return paths(parseState(fileName));
}

// console.log(part1('input_test.txt')); // 5
console.log(part1('input.txt')); // 599

// Part 2: paths through given points.

function part2(fileName) {
    let state = parseState(fileName),
        a = paths(state,'svr','dac'),
        b = paths(state,'svr','fft'),
        c = paths(state,'dac','fft'),
        d = paths(state,'fft','dac'),
        e = paths(state,'fft','out'),
        f = paths(state,'dac','out');
    return a*c*e + b*d*f; 
}

console.log(part2('input_test.txt')) // 2
console.log(part2('input.txt')) // 393474305030400 (wow!)
