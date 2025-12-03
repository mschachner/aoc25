/* Advent of Code 2025 Day 2: ID Filtering */

/* Part 1: given a sequence of ranges, identify all invalid numbers and sum them. 
 * A number is invalid if it's a concatenation of some number with itself.
 */

import { readFileSync } from 'node:fs';

// First, just check if a number is invalid.
// We'll be given the data as a string, but we'll need to parse it as ranges first,
// so we might as well assume the number is an honest-to-goodness number.

function isInvalid(num) {
    let numStr = String(num);
    let len = numStr.length;
    if (len % 2 == 1) {
        return false; // odd-length numbers are always valid
    }
    else {
        let len = numStr.length;
        let firstHalf = numStr.slice(0,len/2);
        let secondHalf = numStr.slice(len/2);
        return firstHalf == secondHalf; // no cheeky patterns
    }
}

// console.log(isInvalid(233234)); // false
// console.log(isInvalid(233233)); // true

function sumInvalids(range,invalidTest) {
    let total = 0;
    for (var n = range[0]; n <= range[1]; n++) {
        if (invalidTest(n)) {
            total += n;
        }
    }
    return total;
}

// console.log(sumInvalids([998,1012],isInvalid)); // 1010
// console.log(sumInvalids([1698522,1698528],isInvalid)); // 0


// On to parsing.

function parseRanges(data) {
    let rangeStrings = data.split(",")
    let ranges = [];
    for (var str of rangeStrings) {
        let nums = str.split("-");
        ranges.push([parseInt(nums[0]),parseInt(nums[1])]);
    }
    return ranges;
}

// console.log(parseRanges("11-22,95-115,998-1012")); // [[11,22],[95,115],[998,1012]]

function sumInvalidsFromFile(fileName, invalidTest) {
    const data = readFileSync(fileName,'utf8');
    const ranges = parseRanges(data);
    let total = 0;
    for (var range of ranges) {
        total += sumInvalids(range,invalidTest);
    }
    return total;
}

console.log(sumInvalidsFromFile('input.txt',isInvalid)); // 12850231731

/* Part 2: same as before except now we want to forbid multiples like 101101101.
 */

function isInvalidMult(num) {
    let numStr = String(num);
    let len = numStr.length;
    for (var i = 1; i < len; i++) {
        if (len % i != 0) {
            continue;
        } else {
            let filter = new Array(len / i).fill(numStr.slice(0,i)).join("");
            if (numStr == filter) {
                return true; // busted!
            }
        }
    }
    return false; // okay, you pass this time...
}

// console.log(isInvalidMult(234234223)); // false
// console.log(isInvalidMult(234234234)); // true

// Now part 2 is easy.

console.log(sumInvalidsFromFile('input.txt',isInvalidMult)); // 24774350322
