/* Advent of Code 2025 Day 5: The Cafeteria */
 
/* Part 1: given a list of ranges and a list of numbers, determine which numbers
 * appear in at least one range.
 */

import { readFileSync } from "fs";


function parseRanges(rangeStrings) {
    let rgs = [];
    for (let rangeString of rangeStrings) {
        let bounds = rangeString.split("-").map(n => parseInt(n));
        rgs.push(bounds);
    }
    return rgs;
}

function inRange(id, rangeString) {
    let bounds = rangeString.split("-");
    bounds = bounds.map(n => parseInt(n));
    return bounds[0] <= id && id <= bounds[1];
}

function readDatabase(fileName) {
    const lines = readFileSync(fileName,'utf8').split("\n");
    const divider = lines.indexOf("");
    return {
        "rangeStrings": lines.toSpliced(divider),
        "ids": lines.toSpliced(0,divider+1).map(n => parseInt(n))
    }
}

function findFresh(fileName) {
    const data = readDatabase(fileName);
    let count = 0;
    for (let id of data.ids) {
        for (let rangeString of data.rangeStrings) {
            if (inRange(id,rangeString)) {
                count++;
                break;
            }
        }
    }
    return count;
}

//console.log(findFresh("input_test.txt")); // 3
//console.log(findFresh("input.txt")); // 635

/* Part 2: compute the size of a range.
 * Since the ranges are big, we're not going to brute force it. Rather, we'll
 * keep a list of ranges, and write a method for adding a new range.
 */

// This function is disgusting. I don't know how to make it better.
function addRange(ranges,newRange) {
    for (let range of ranges) {
        if (newRange[1] < range[0] || range[1] < newRange[0]) {
            continue;
        }
        if (range[0] <= newRange[0]) {
            if (range[1] < newRange[1]) {
                newRange[0] = range[1]+1;
                continue;
            }
            else return ranges;
        }
        if (range[1] <= newRange[1]) {
            ranges.splice(ranges.indexOf(range),1);
            continue;
        }
        else newRange[1] = range[0]-1;
    }
    if (newRange[1] < newRange[0]) return ranges;
    return ranges.push(newRange);
}

function collapseRanges(ranges) {
    let collapsed = [];
    for (let range of ranges) {
        addRange(collapsed,range);
    }
    return collapsed;
}
const rangesLength = (ranges) => ranges.map(rg => rg[1]-rg[0]+1).reduce((a,b) => a+b);

function countAllFreshes(fileName) {
    const data = readDatabase(fileName);
    return rangesLength(collapseRanges(parseRanges(data.rangeStrings)));
}

console.log(countAllFreshes("input_test.txt")); // 14
console.log(countAllFreshes("input.txt")); // 369761800782619