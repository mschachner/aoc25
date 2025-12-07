/* Advent of Code 2025 Day 6: The Trash Compactor */
 
/* Part 1: Cephalopod math.
 */

import { readFileSync } from "fs";

// Helper: transpose a matrix.

function transpose(m) {
    let transposed = [];
    for (let i = 0; i < m[0].length; i++) {
        transposed.push([]);
        for (let j = 0; j < m.length; j++) {
            transposed[i].push(m[j][i]);
        }
    }
    return transposed;
}

function doCephalopodMath(fileName) {
    const data = readFileSync(fileName,'utf8');
    const problems = transpose(data.split('\n').map(
        line => line.split(" ").filter(a => a)
    ));
    let total = 0;
    for (let problem of problems) {
        let op = problem.pop();
        op = op == '+' ? (a,b) => a+b : (a,b) => a*b;
        total += problem.map(Number).reduce(op);
    }
    return total;
}

// console.log(doCephalopodMath('input_test.txt')); // 4277556
console.log(doCephalopodMath('input.txt')); // 5322004718681

/* Part 2: turns out cephalopod math works a lot differently than we thought.
 */

function doCephalopodMathCorrectly(fileName) {
    const lines = transpose(readFileSync(fileName,'utf8').split('\n'));
    lines.push([' ']); // Add terminator for last problem
    let args = [], total = 0, op = null;
    for (let line of lines) {
        if (line.every(a => a == ' ')) {
            // Problem's over
            total += args.reduce(op);
            args = [];
            op = null;
            continue;
        }
        if (op == null) {
            // It's only just begun
            op = line.pop()
            op = op == '+' ? (a,b) => a+b : (a,b) => a*b;
        }
        args.push(Number(line.join("")));
    }
    return total;
}

//console.log(doCephalopodMathCorrectly('input_test.txt')); // 3263827
console.log(doCephalopodMathCorrectly('input.txt')); // 9876636978528