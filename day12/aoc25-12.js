/* Advent of Code 2025 Day 12: Christmas Tree Farm */

const colors = {
    "red": "\x1b[1;38;2;255;0;0m",
    "crimson": "\x1b[1;38;2;220;20;60m",
    "orange": "\x1b[1;38;2;255;140;0m",
    "amber": "\x1b[1;38;2;255;191;0m",
    "gold": "\x1b[1;38;2;255;215;0m",
    "yellow": "\x1b[1;38;2;255;255;0m",
    "chartreuse": "\x1b[1;38;2;127;255;0m",
    "lime": "\x1b[1;38;2;50;255;50m",
    "green": "\x1b[1;38;2;0;255;0m",
    "teal": "\x1b[1;38;2;0;200;200m",
    "aqua": "\x1b[1;38;2;0;255;255m",
    "cyan": "\x1b[1;38;2;0;255;255m",
    "turquoise": "\x1b[1;38;2;64;224;208m",
    "blue": "\x1b[1;38;2;0;0;255m",
    "indigo": "\x1b[1;38;2;75;0;130m",
    "violet": "\x1b[1;38;2;148;0;211m",
    "lavender": "\x1b[1;38;2;181;126;220m",
    "magenta": "\x1b[1;38;2;255;0;255m",
    "pink": "\x1b[1;38;2;255;20;147m",
    "coral": "\x1b[1;38;2;255;127;80m",
    "white": "\x1b[97m",
    "reset": "\x1b[0m"
}

function colorPad(text, color, pad=0) {
    let padded = text;
    if (text.length < pad) {
        padded = padded + ' '.repeat(pad - text.length);
    }
    
    return `${colors[color]}${padded}${colors.reset}`
}

function randomColor() {
    let possibilities = Object.keys(colors).filter(k => k !== "white" && k !== "reset");
    return possibilities[Math.floor(Math.random() * possibilities.length)]
}

function colorGrid(grid, colorData) {
    let coloredGrid = new Array(grid.length);
    for (let i = 0; i < grid.length; i++) {
        coloredGrid[i] = new Array(grid[i].length);
        for (let j = 0; j < grid[i].length; j++) {
            coloredGrid[i][j] = colorPad(grid[i][j], colorData[i][j]);
        }
    }
    return coloredGrid;
}

function activeCells(schematic) {
    let cells = []
    for (let i = 0; i < schematic.length; i++) {
        for (let j = 0; j < schematic[0].length; j++) {
            if (schematic[i][j]) {
                cells.push([i,j]);
            }
        }
    }
    return cells;
}



class Region {
    constructor(height, width, presents=[]) {
        this.height = height;
        this.width = width;
        this.grid = new Array(height);
        this.colorData = new Array(height);
        for (let i = 0; i < height; i++) {
            this.grid[i] = new Array(width).fill(0);
            this.colorData[i] = new Array(width).fill("white");
        }
        this.presents = presents;
        this.placements = [];
    }

    toString() {
        let p = String(this.height).length;
        return `${this.height} by ${this.width} gift region\n`
                + "~".repeat(this.width*3) + "\n    "
                + ' '.repeat(p-1) + [...Array(this.width).keys()].map(n => colorPad(n,"blue")).join(" ") + '\n'
                +`${' '.repeat(p+1)}+${"-".repeat(this.width*2+1)}+\n`
                + colorGrid(this.grid, this.colorData)
                    .map((row,index) => `${colorPad(String(index),"blue",2)} | ` + row.join(' '))
                    .join(" |\n") + " |\n"
                +`${' '.repeat(p+1)}+${"-".repeat(this.width*2+1)}+`
    }

    disp() {
        console.log(this.toString());
    }

    getSubregion(origin, subregionHeight, subregionWidth) {
        let [r,c] = origin;
        if (r + subregionHeight > this.height) {
            throw new Error("subregion height too high")
        } else if (c + subregionWidth > this.width) {
            throw new Error("subregion width too wide")
        } else {
            let subregion = new Array(subregionHeight);
            for (let i = 0; i < subregionHeight; i++) {
                subregion[i] = new Array(subregionWidth)
                for (let j = 0; j < subregionWidth; j++) {
                    subregion[i][j] = this.grid[r+i][c+j]
                }
            }
            return subregion;
        }
    }

    getPresent(id) {
        return this.presents.find(p => p.id == id);
    }

    getSchematic(placement) {
        return this.getPresent(placement.id).schematics[placement.schematic];
    }

    nextPair(pair,bufferHeight,bufferWidth) {
        let [r,c] = pair;
        if (c < this.width - bufferWidth) {
            return [r,c+1]
        } else if (r < this.height - bufferHeight) {
            return [r+1,0]
        } else {
            return null;
        }
    }

    generatePresentList(counts) {
        let presents = [];
        for (let i = 0; i < counts.length; i++) {
            for (let j = 0; j < counts[i]; j++) {
                presents.push(this.presents[i])
            }
        }
        return presents;
    }

    isValidPlacement(placement) {
        let [r0,c0] = placement.origin;
        let schematic = this.getSchematic(placement)
        for (let [r,c] of activeCells(schematic)) {
            if (this.colorData[r0+r][c0+c] != "white") return false;
        }
        return true;
    }

    doPlacement(placement) {
        if (placement == null) {
            throw new Error(
                `Error: placement is null`
            )
        }
        if (!this.isValidPlacement(placement)) {
            throw new Error(
                `Error: invalid placement`
            )
        }
        let [r0,c0] = placement.origin,
            schematic = this.getSchematic(placement);

        for (let [r,c] of activeCells(schematic)) {
            this.grid[r0 + r][c0 + c] = placement.id;
            this.colorData[r0 + r][c0 + c] = placement.color;
        }

        this.placements.push(placement);

    }

    popPlacement() {
        let placement = this.placements.pop();
        let [r0,c0] = placement.origin,
            schematic = this.getSchematic(placement);

        for (let [r,c] of activeCells(schematic)) {
            this.grid[r0 + r][c0 + c] = 0;
            this.colorData[r0+r][c0+c] = "white"
        }
    }

    findPlacement(present,startOrigin,startSchematic) {
        let placement = {
            id: present.id,
            color: randomColor()
        }
        for (let og = startOrigin; og != null; og = this.nextPair(og,present.height,present.width)) {
            placement.origin = og;
            for (let sch = startSchematic; sch < present.schematics.length; sch++) {
                placement.schematic = sch;
                if (this.isValidPlacement(placement)) {
                    return placement;
                }
            }
        }
        return null;
    }

    findPlacements(presents,startOrigin=[0,0],depth) {
        if (presents.length == 0) {
            return []
        }
        let present = presents[0]
        let placement = null;
        for (let og = startOrigin; og != null; og = this.nextPair(og,present.height,present.width)) {
            for (let sch = 0; sch < present.schematics.length; sch++) {
                placement = this.findPlacement(present,og,sch);
                if (placement != null) {
                    this.doPlacement(placement);
                    if (depth < 4) {
                        this.disp()
                        console.log(`Trying piece ${depth} in position ${og}...`)
                    }
                    let nextOrigin = [0,0]
                    if (presents.length > 1 && presents[1].id == present.id) {
                        nextOrigin = this.nextPair(og,present.height,present.width);
                    }
                    let remainingPlacements = this.findPlacements(presents.slice(1),nextOrigin,depth+1);
                    if (remainingPlacements != null) {
                        // success!
                        return [placement].concat(remainingPlacements); 
                    }
                    // Otherwise, we've failed and need to pop off the placement.
                    this.popPlacement();
                }
            }
        }
    }
}


class Present {
    constructor(id,schematics) {
        this.height = schematics[0].length;
        this.width = schematics[0][0].length;
        this.id = id;
        this.schematics = schematics;
        this.color = randomColor();
        }

    toString() {
        let sampleSchematic = this.schematics[0];
        let colorData = sampleSchematic.map(row => row.map(element => element == 0 ? "white" : this.color))
        let coloredGrid = colorGrid(sampleSchematic,colorData)
        return `Present: ${this.id}\nSample schematic:\n${coloredGrid.map(row => row.join(' ')).join('\n')}`
    }

    disp() {
        console.log(this.toString());
    }
}

// testing

let present0 = new Present(0,
    [[[1,1,1],
      [1,1,0],
      [1,1,0]],
     [[1,1,1],
      [1,1,1],
      [0,0,1]],
     [[0,1,1],
      [0,1,1],
      [1,1,1]],
     [[1,0,0],
      [1,1,1],
      [1,1,1]],
     [[1,1,1],
      [0,1,1],
      [0,1,1]],
     [[0,0,1],
      [1,1,1],
      [1,1,1]],
     [[1,1,0],
      [1,1,0],
      [1,1,1]],
     [[1,1,1],
      [1,1,1],
      [1,0,0]],]
);

let present1 = new Present(1,
    [[[1,1,1],
      [1,1,0],
      [0,1,1]],
     [[0,1,1],
      [1,1,1],
      [1,0,1]],
     [[1,1,0],
      [0,1,1],
      [1,1,1]],
     [[1,0,1],
      [1,1,1],
      [1,1,0]],
     [[1,1,1],
      [0,1,1],
      [1,1,0]],
     [[1,0,1],
      [1,1,1],
      [0,1,1]],
     [[0,1,1],
      [1,1,0],
      [1,1,1]],
     [[1,1,0],
      [1,1,1],
      [1,0,1]],]
);

let present2 = new Present(2,
    [[[0,1,1],
      [1,1,1],
      [1,1,0]],
     [[1,1,0],
      [1,1,1],
      [0,1,1]],]
);

let present3 = new Present(3,
    [[[1,1,0],
      [1,1,1],
      [1,1,0]],
     [[1,1,1],
      [1,1,1],
      [0,1,0]],
     [[0,1,1],
      [1,1,1],
      [0,1,1]],
     [[0,1,0],
      [1,1,1],
      [1,1,1]]]
);

let present4 = new Present(4,
    [[[1,1,1],
      [1,0,0],
      [1,1,1]],
     [[1,1,1],
      [1,0,1],
      [1,0,1]],
     [[1,1,1],
      [0,0,1],
      [1,1,1]],
     [[1,0,1],
      [1,0,1],
      [1,1,1]]]
);

let present5 = new Present(5,
    [[[1,1,1],
      [0,1,0],
      [1,1,1]],
     [[1,0,1],
      [1,1,1],
      [1,0,1]]]
);

let presents = [present0,present1,present2,present3,present4,present5]
let region0 = new Region(4,4,presents);
let region1 = new Region(12,5,presents);


let plist0 = region0.generatePresentList([0,0,0,0,2,0]);
let plist1 = region1.generatePresentList([1,0,1,0,3,2]);



region0.findPlacements(plist0);
region0.disp();

region1.findPlacements(plist1,[0,0],0);
region1.disp();


/*
4x4: 0 0 0 0 2 0
12x5: 1 0 1 0 2 2
12x5: 1 0 1 0 3 2
*/