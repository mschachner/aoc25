/* Advent of Code 2025 Day 5: The Cafeteria */
 
/* Part 1: given a list of ranges and a list of numbers, determine which numbers
 * appear in at least one range.
 */

import { readFileSync } from "fs";

function readDatabase(fileName) {
    const lines = readFileSync(fileName,'utf8').split("\n");
    const divider = lines.indexOf("");
    return {
        "ranges": lines.toSpliced(divider).map(rStr => rStr.split("-").map(Number)),
        "ids": lines.toSpliced(0,divider+1).map(Number)
    }
}

function findFresh(fileName) {
    const data = readDatabase(fileName);
    let count = 0;
    for (let id of data.ids) {
        for (let range of data.ranges) {
            if (range[0] <= id && id <= range[1]) {
                count++;
                break;
            }
        }
    }
    return count;
}

//console.log(findFresh("input_test.txt")); // 3
console.log(findFresh("input.txt")); // 635

/* Part 2: compute the size of a range.
 * Since the ranges are big, we're not going to brute force it. Rather, we'll
 * keep a list of ranges, and write a method for adding a new range.
 */


// This function is disgusting. I don't know how to make it better.
function addRange(ranges,newRange) {
    for (let range of ranges) {
        if (newRange[1] < range[0] || range[1] < newRange[0]) continue;
        else if (range[0] <= newRange[0]) {
            if (range[1] < newRange[1]) {
                newRange[0] = range[1]+1;
            }
            else return ranges;
        }
        else if (range[1] <= newRange[1]) {
            ranges.splice(ranges.indexOf(range),1);
        }
        else newRange[1] = range[0]-1;
    }
    if (newRange[1] < newRange[0]) return ranges;
    return ranges.push(newRange);
}

function countAllFreshes(fileName) {
    let collapsed = [];
    readDatabase(fileName).ranges.forEach(
        rg => addRange(collapsed,rg)
    )
    return collapsed.map(rg => rg[1]-rg[0]+1).reduce((a,b) => a+b);
}

// console.log(countAllFreshes("input_test.txt")); // 14
console.log(countAllFreshes("input.txt")); // 369761800782619