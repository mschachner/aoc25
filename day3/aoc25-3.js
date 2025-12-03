/* Advent of Code 2025 Day 3: Joltage! */

/* Part 1: given a sequence of digit strings, find the largest two-digit substring
 * from each and sum them.
 */

import { readFileSync } from 'node:fs';

// Helper we'll be using a bunch:
function greatest(l,omit=0) {
    let omitted = omit ? l.slice(0,-omit) : l;
    let val = omitted.toSorted().at(-1)
    return {
        value: val,
        index: l.indexOf(val)
    };
}


// First, given a digit string, get the biggest joltage.

function joltage(digitString) {
    let tens = greatest(Array.from(digitString),1);
    let ones = greatest(Array.from(digitString).slice(tens.index+1));
    return parseInt(tens.value + ones.value);
}

//console.log(joltage("811111111111119")) // 89
//console.log(joltage("818181911112111")) // 92

// Next, read in a buncha strings and sum the joltages.

function sumJoltagesFromFile(joltager, fileName) {
    const digitStrings = readFileSync(fileName,'utf8').split("\n");
    return digitStrings.map(joltager).reduce((a,b) => a + b);
}

// console.log(sumJoltagesFromFile('input_test.txt')); // 357

console.log(sumJoltagesFromFile(joltage,'input.txt')); // 17092

/* Part 2: given a sequence of digit strings, find the largest 12-digit substring
 * from each and sum them.
 */

// For gigs let's do this more generally.

function joltageN(N,digitString) {
    let digits = [];
    let workingArray = Array.from(digitString);
    for (var i = 0; i < N; i++) {
        let digit = greatest(workingArray,N-1-i);
        digits.push(digit.value);
        workingArray = workingArray.slice(digit.index+1);
    }
    return parseInt(digits.join(""));
}

const joltage2 = (digitString) => joltageN(2,digitString);
const joltage12 = (digitString) => joltageN(12,digitString);

// console.log(sumJoltagesFromFile(joltage2,'input_test.txt')) // 357 again
// console.log(sumJoltagesFromFile(joltage12,'input_test.txt')) // 3121910778619

console.log(sumJoltagesFromFile(joltage12,'input.txt')); // 170147128753455