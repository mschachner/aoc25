/* Advent of Code 2025 Day 1: Safecracking */

/* Part 1: given a file consisting of lines of the form "(R|L)N" where N is a
 * natural number, convert "RN" to N and "LN" to -N, then calculate how many
 * times the partial sum of the resulting integer sequence vanishes modulo 100.
 */

import { readFileSync } from 'node:fs';

// First the easy part: given an integer sequence, count how many
// sums vanish modulo 100.

function zeroPartials(sequence) {
    let position = 50;
    let zeroes = 0;
    for (var entry of sequence) {
        position += entry;
        if (position % 100 == 0) {
            zeroes++;
        }
    }
    return zeroes;
}

// testSequence = [-68, -30, 48, -5, 60, -55, -1, -99, 14, -82];
// console.log(zeroPartials(testSequence)); // returns 3

// Read in doc.txt and output the integer sequence.

function integerize() {
    const data = readFileSync('doc.txt','utf8');
    let instructions = data.split("\n");
    let integerized = [];
    for (var i of instructions) {
        let num = parseInt(i.slice(1));
        let signedNum = i[0] == "R" ? num : -num;
        integerized.push(signedNum);
    }
    return integerized;
}

const instructions = integerize();

// Put em together

function crackSafe1() {
    return zeroPartials(instructions);
}

 console.log(crackSafe1()); // returns 1129.



/* Part 2: Now count how many times it sails past zero. */

// Silliest possible way to do this: convert to clicks

function toClicks(sequence) {
    let clicks = [];
    for (var entry of sequence) {
        let newClicks = new Array(Math.abs(entry));
        if (entry < 0) {
            newClicks.fill(-1);
        } else {
            newClicks.fill(1);
        }
        clicks = clicks.concat(newClicks);
    }
    return clicks;
}

function crackSafe2() {
    return zeroPartials(toClicks(instructions));
}

console.log(crackSafe2());

