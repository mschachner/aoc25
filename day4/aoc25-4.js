/* Advent of Code 2025 Day 4: The Printing Department */

import { readFileSync } from "fs";

// Went with an object-oriented approach to this one.
class Grid {
    constructor(fileName) {
        const lines = readFileSync(fileName,'utf8').split("\n");
        this.rows = lines.length;
        this.columns = lines[0].length;
        this.grid = new Array(this.rows);
        for (let i=0; i < this.rows; i++) {
            this.grid[i] = new Array(this.columns);
            for (let j=0; j < this.columns; j++) {
                this.grid[i][j] = (lines[i][j] == '@' ? 1 : 0);
            }
        }
    }

    rowRange = () => [...Array(this.rows).keys()];
    colRange = () => [...Array(this.columns).keys()];

    allCells = () => this.rowRange().map((i) => (
        this.colRange().map((j) => [i,j])
    )).flat();

    getValue = (cell) => this.grid[cell[0]][cell[1]];

    zeroValues(cells) {
        for (let cell of cells) {
            this.grid[cell[0]][cell[1]] = 0;
        }
    }

    inBounds = (cell) => (
        this.rowRange().includes(cell[0]) && this.colRange().includes(cell[1])
    );

    neighborhood(cell) {
        let i = cell[0];
        let j = cell[1];
        return [
            [i-1,j-1],[i-1,j],[i-1,j+1],
            [i  ,j-1],        [i  ,j+1],
            [i+1,j-1],[i+1,j],[i+1,j+1]
        ].filter(this.inBounds);
    };

    neighborhoodSum = (cell) => (
        this.neighborhood(cell).map(
            (cell) => this.getValue(cell)
        ).reduce((a,b) => a+b)
    )

    isMovable = (cell) => (this.neighborhoodSum(cell) < 4 && this.getValue(cell) == 1)
    getMovables = () => this.allCells().filter(this.isMovable);

    moveAllMovables() {
        let total = 0;
        let newMovables = [];
        do {
            newMovables = this.getMovables();
            this.zeroValues(newMovables);
            total += newMovables.length;
            console.log("moved " + newMovables.length + " rolls");
        } while (newMovables.length);
        return total;
    }
}

//console.log(new Grid('input_test.txt').getMovables().length); // 13
console.log(new Grid('input.txt').popMovables()); // 1320

//console.log(new Grid('input_test.txt').moveAllMovables()); // 43
console.log(new Grid('input.txt').moveAllMovables()); // 8354

