/* Advent of Code 2025 Day 1: Safecracking
 * Task: given a file consisting of lines of the form "(R|L)N" where N is a
 * natural number, convert "RN" to N and "LN" to -N, then calculate how many
 * times the partial sum of the resulting integer sequence vanishes modulo 100.
 */

import { readFile } from 'node:fs';

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

// Next, read in the file and do the do.

function crackSafe() {
    readFile('doc.txt', 'utf8', (err, data) => {
        let integerized = [];
        let instructions = data.split("\n");
        for (var i of instructions) {
            let num = parseInt(i.slice(1));
            let signedNum = i[0] == "R" ? num : -num;
            integerized.push(signedNum);
        }
        console.log(zeroPartials(integerized));
        return;
    });
}

crackSafe();

