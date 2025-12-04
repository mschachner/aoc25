/* Advent of Code 2025 Day 4: The Printing Department */

import { readFileSync } from "fs";

// Went with an object-oriented approach to this one.
class Grid {
    constructor(fileName) {
        const lines = readFileSync(fileName,'utf8').split("\n");
        this.rows = lines.length;
        this.columns = lines[0].length;
        this.grid = new Array(this.rows);
        this.rolls = new Set();
        for (let i=0; i < this.rows; i++) {
            this.grid[i] = new Array(this.columns);
            for (let j=0; j < this.columns; j++) {
                if (lines[i][j] == '@') {
                    this.grid[i][j] = 1;
                    this.rolls.add([i,j]);
                } else {
                    this.grid[i][j] = 0;
                }
            }
        }
    }

    rowRange = () => [...Array(this.rows).keys()];
    colRange = () => [...Array(this.columns).keys()];

    neighborhoodSum(cell) {
        let i = cell[0];
        let j = cell[1];
        return [
            [i-1,j-1],[i-1,j],[i-1,j+1],
            [i  ,j-1],        [i  ,j+1],
            [i+1,j-1],[i+1,j],[i+1,j+1]
        ].filter((c) => (
            this.rowRange().includes(c[0]) && this.colRange().includes(c[1])
        )).map(c => this.grid[c[0]][c[1]]).reduce((a,b) => a+b);
    }

    isMovable = (roll) => (this.neighborhoodSum(roll) < 4)

    deleteRolls(toRemove) {
        toRemove.forEach(c => {
            this.grid[c[0]][c[1]] = 0;
        })
        this.rolls = this.rolls.difference(toRemove);
        return toRemove;
    }

    move() {
        let moved = new Set();
        this.rolls.forEach(roll => {
            if (this.isMovable(roll)) {
                moved.add(roll);
            }
        })
        return this.deleteRolls(moved);
    }

    moveAllMovables() {
        let total = 0;
        let done = false;
        do {
            done = true;
            for (let cell of this.rolls) {
                if (this.isMovable(cell)) {
                    done = false;
                    this.deleteRolls(new Set([cell]));
                    total++;
                }
            }
        } while (!done);
        return total;
    }
}

//console.log(new Grid('input_test.txt').move().size); // 13
console.log(new Grid('input.txt').move().size); // 1320

//console.log(new Grid('input_test.txt').moveAllMovables()); // 43
console.log(new Grid('input.txt').moveAllMovables()); // 8354

