/* Advent of Code 2025 Day 8: Playground */

import { readFileSync } from "fs";

class Playground {
    constructor(fileName) {
        this.locations = readFileSync(fileName,'utf8').split('\n').map(
            line => line.split(',').map(Number)
        )
        this.size = this.locations.length;
        this.pairs = []
        this.bookmark = 0;
        this.circuits = [];
        for (let b0 = 0; b0 < this.size; b0++) {
            this.circuits.push([b0]);
            for (let b1 = b0+1; b1 < this.locations.length; b1++) {
                this.pairs.push([b0,b1]);
            }
        }
        this.pairs.sort((p0,p1) => {
            let loc00 = this.locations[p0[0]],
                loc01 = this.locations[p0[1]],
                loc10 = this.locations[p1[0]],
                loc11 = this.locations[p1[1]];
            let d0 = Math.sqrt([0,1,2].map(i => (loc00[i] - loc01[i])**2).reduce((a,b) => a+b)),
                d1 = Math.sqrt([0,1,2].map(i => (loc10[i] - loc11[i])**2).reduce((a,b) => a+b));
            return d0-d1;
            })
    }

    connect(count = 1) {
        for (let i = 0; i < count; i++) {
            let c0 = this.circuits.findIndex(c => c.includes(this.pairs[this.bookmark][0])),
                c1 = this.circuits.findIndex(c => c.includes(this.pairs[this.bookmark][1]));
            this.bookmark++;
            if (c0 != c1) {
                this.circuits[c0] = this.circuits[c0].concat(this.circuits[c1]);
                this.circuits.splice(c1,1);
            };
        }
    }

    // Part 1: how many circuits?

    topThreeProduct() {
        let sortedLengths = this.circuits.map(c => c.length).toSorted((a,b) => b-a);
        return sortedLengths[0] * sortedLengths[1] * sortedLengths[2];
    }

    // Part 2: What's the last connection?

    finalXCoords() {
        while (this.circuits.length > 1) this.connect();
        return this.locations[this.pairs[this.bookmark-1][0]][0] 
            * this.locations[this.pairs[this.bookmark-1][1]][0]
    }
}

let playground = new Playground('input.txt');
//playground.connect(1000);
//console.log(playground.circuits);
//console.log(playground.topThreeProduct()); // 175500
console.log(playground.finalXCoords());