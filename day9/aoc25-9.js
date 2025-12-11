/* Advent of Code 2025 Day 9: Movie theater */

import { readFileSync } from "fs";

// Part 1: given a list of coordinates, find the pair of coordinates with the
// largest area between them.

function areaTwixt(p0,p1) {
    return (Math.abs(p0[0] - p1[0]) + 1) * (Math.abs(p0[1] - p1[1]) + 1);
}

function part1(fileName) {
    const data = readFileSync(fileName,'utf8').split('\n').map(
        line => line.split(',').map(Number)
    )
    let maxArea = 0;
    for (let i = 0; i < data.length; i++) {
        for (let j = i+1; j < data.length; j++) {
            let area = areaTwixt(data[i],data[j]);
            area > maxArea ? maxArea = area : {}
        }
    }
    return maxArea;
}

// console.log(part1('input_test.txt')); // 50
// console.log(part1('input.txt')); // 4755429952

const min = (a,b) => a < b ? a : b;
const max = (a,b) => a > b ? a : b;

function crosses01(range0,wall1) {
    return (
            range0.min0 <= wall1.val0  && wall1.val0  <  range0.max0
        &&  wall1.min1  <= range0.val1 && range0.val1 <= wall1.max1
    )
}

function crosses10(range1,wall0) {
    return (
        range1.min1 <= wall0.val1  && wall0.val1  <  range1.max1
    &&  wall0.min0  <= range1.val0 && range1.val0 <= wall0.max0
    )
}

function getRectangleRanges(p0,p1) {
    let top0    = min(p0[0],p1[0]),
        bottom0 = max(p0[0],p1[0]),
        left1   = min(p0[1],p1[1]),
        right1  = max(p0[1],p1[1]);
    return {
        ranges0: [{
            val1: left1,
            min0: top0,
            max0: bottom0
        }, {
            val1: right1,
            min0: top0,
            max0: bottom0
        }],
        ranges1: [{
            val0: top0,
            min1: left1,
            max1: right1
        }, {
            val0: bottom0,
            min1: left1,
            max1: right1
        }]}
}

function direction(p0,p1) {
    if (p0[0] == p1[0]) {
        if (p0[1] < p1[1]) {
            return 'right';
        } else {
            return 'left';
        }
    } else {
        if (p0[0] < p1[0]) {
            return 'down';
        } else {
            return 'up';
        }
    }
}

function leftTurn(p0,p1,p2) {
    let dir2 = direction(p1,p2);
    switch (direction(p0,p1)) {
        case 'right':
            return dir2 == 'up';
        case 'left':
            return dir2 == 'down';
        case 'down':
            return dir2 == 'right';
        case 'up':
            return dir2 == 'left';
    }
}

function getWalls(pts) {
    let walls = {
        walls0: [],
        walls1: []
    }
    for (let i = 0; i < pts.length; i++) {
        let start = pts[i]
        let end = pts[(i+1) % pts.length]
        let prev = pts[(pts.length + i-1) % pts.length]
        let next = pts[(i+2) % pts.length]
        let startOffset = 0;
        let endOffset = 0;
        // left turn corrections
        if (leftTurn(prev,start,end)) {
            startOffset = 1;
        }
        if (leftTurn(start,end,next)) {
            endOffset = -1;
        }
        if (start[0] == end[0]) {
            // wall1
            if (start[1] < end[1]) {
                // going right
                walls.walls1.push({
                    val0: start[0]-1,
                    min1: start[1] + startOffset,
                    max1: end[1] + endOffset
                });
            } else {
                // going left
                walls.walls1.push({
                    val0: start[0],
                    min1: end[1] - endOffset,
                    max1: start[1] - startOffset
                });
            }
        } else {
            // wall0
            if (start[0] < end[0]) {
                // going down
                walls.walls0.push({
                    val1: start[1],
                    min0: start[0] + startOffset,
                    max0: end[0] + endOffset
                })
            } else {
                // going up
                walls.walls0.push({
                    val1: start[1]-1,
                    min0: end[0] - endOffset,
                    max0: start[0] - startOffset
                })
            }
        }
    }
    return walls;
}

function part2(fileName) {
    // Step 0. Read the data.
    const data = readFileSync(fileName,'utf8').split('\n').map(
        line => line.split(',').map(Number)
    ).map(pt => [pt[1],pt[0]]);
    let walls = getWalls(data), walls0 = walls.walls0, walls1 = walls.walls1;
    let maxArea = 0;
    for (let i = 0; i < data.length; i++) {
        for (let j = i+1; j < data.length; j++) {
            let area = areaTwixt(data[i],data[j]);
            pairIJ: if (area > maxArea) {
                let ranges = getRectangleRanges(data[i],data[j]);
                let ranges0 = ranges.ranges0, ranges1 = ranges.ranges1;
                for (let range0 of ranges0) {
                    for (let wall1 of walls1) {
                        if (crosses01(range0,wall1)) {
                            break pairIJ;
                        }
                    }
                }
                for (let range1 of ranges1) {
                    for (let wall0 of walls0) {
                        if (crosses10(range1,wall0)) {
                            break pairIJ;
                        }
                    }
                }
                maxArea = area;
            }
        }
    }
    return maxArea;
}

console.log(part2('input.txt')); // 1429596008
// I'm gonna be sick.
