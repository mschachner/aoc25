/* Advent of Code 2025 Day 12: Christmas Tree Farm */

const colors = {
    "red": "\x1b[1;91m",
    "green": "\x1b[1;92m",
    "yellow": "\x1b[1;93m",
    "blue": "\x1b[1;94m",
    "magenta": "\x1b[1;95m",
    "cyan": "\x1b[1;96m",
    "white": "\x1b[97m",
    "orange": "\x1b[1;38;2;255;140;0m",
    "pink": "\x1b[1;38;2;255;20;147m",
    "reset": "\x1b[0m"
}

function color(text, color) {
    return `${colors[color]}${text}${colors.reset}`
}

function randomColor() {
    let possibilities = ["green", "yellow", "magenta", "red"]
    return possibilities[Math.floor(Math.random() * 4)]
}

function colorGrid(grid, colorData) {
    let coloredGrid = new Array(grid.length);
    for (let i = 0; i < grid.length; i++) {
        coloredGrid[i] = new Array(grid[i].length);
        for (let j = 0; j < grid[i].length; j++) {
            coloredGrid[i][j] = color(grid[i][j], colorData[i][j]);
        }
    }
    return coloredGrid;
}

function gridsCollide(grid0,grid1) {
    if (grid0.length != grid1.length || grid0[0].length != grid1[0].length) {
        throw new Error("Error: grids must be same size")
    }
    for (let i = 0; i < grid0.length; i++) {
        for (let j = 0; j < grid0[0].length; j++) {
            if (grid0[i][j] == 1) {
                if (grid1[i][j] == 1) {
                    return true;
                }
            }
        }
    }
    return false;
}



class Region {
    constructor(height, width) {
        this.height = height;
        this.width = width;
        this.grid = new Array(height);
        this.colorData = new Array(height);
        for (let i = 0; i < height; i++) {
            this.grid[i] = new Array(width).fill(0);
            this.colorData[i] = new Array(width).fill("white");
        }
        this.placements = []
    }

    toString() {
        return `${this.height} by ${this.width} gift region\n`
                + "~".repeat(this.width*3) + "\n    "
                + [...Array(this.width).keys()].map(n => color(n,"blue")).join(" ") + '\n'
                +`  +${"-".repeat(this.width*2+1)}+\n`
                + colorGrid(this.grid, this.colorData)
                    .map((row,index) => `${color(index,"blue")} | ` + row.join(' '))
                    .join(" |\n") + " |\n"
                +`  +${"-".repeat(this.width*2+1)}+`
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

    canPlace(placement) {
        let subregion;
        let origin = placement.origin,
            present = placement.present;
        try {
            subregion = this.getSubregion(origin,present.height,present.width)
        } catch (e) {
            console.error(
                `Subregion out of bounds error when attempting to place present ${present.id} at (${origin})`
            )
            return false;
        }
        return (!gridsCollide(subregion,present.schematic));
    }

    doPlacement(placement) {
        if (placement == null) {
            throw new Error(
                `Error: placement is null`
            )
        }
        if (!this.canPlace(placement)) {
            throw new Error(
                `Error: could not place present ${present.id} at (${r0},${c0})`
                )
        }
        let [r0,c0] = placement.origin,
            present = placement.present;

        for (let [r,c] of present.activeCells) {
            this.grid[r0 + r][c0 + c] = 1;
            this.colorData[r0 + r][c0 + c] = present.color;
        }

        this.placements.push(placement);

    }

    popPlacement() {
        let placement = this.placements.pop();
        let [r0,c0] = placement.origin,
            present = placement.present;

        for (let [r,c] of present.activeCells) {
            this.grid[r0 + r][c0 + c] = 0;
            this.colorData[r0+r][c0+c] = "white"
        }
    }

    findPlacement(present,startOrigin) {
        let placement = {
            origin: startOrigin,
            present: present
        };
        while (!this.canPlace(placement)) {
            let next = this.nextPair(placement.origin,present.height,present.width);
            if (next == null) {
                return null;
            }
            placement.origin = next;
        }
        return placement;
    }

    findPlacements(presents,startOrigin=[0,0]) {
        if (presents.length == 0) {
            return []
        }
        let present = presents[0]
        while (true) {
            let placement = this.findPlacement(present,startOrigin);
            if (placement == null) {
                return null;
            }
            this.doPlacement(placement);
            let remainingPlacements = this.findPlacements(presents.slice(1),[0,0])
            if (remainingPlacements == null) {
                let poppedOrigin = this.popPlacement().origin
                startOrigin = this.nextPair(poppedOrigin,present.height,present.width)
            } else {
                return [placement].concat(remainingPlacements);
            }
        }
    }
}


class Present {
    constructor(id,schematic) {
        this.height = schematic.length;
        this.width = schematic[0].length;
        this.id = id;
        this.schematic = schematic;
        this.color = randomColor();
        this.activeCells = [];
        for (let i = 0; i < this.height; i++) {
            for (let j = 0; j < this.width; j++) {
                if (schematic[i][j]) {
                    this.activeCells.push([i,j]);
                }
            }
        }
    }

    toString() {
        let colorData = this.schematic.map(row => row.map(element => element == 0 ? "black" : this.color))
        let coloredGrid = colorGrid(this.schematic,colorData)
        return `Present ${this.id}:\n${coloredGrid.map(row => row.join(' ')).join('\n')}`
    }

    disp() {
        console.log(this.toString());
    }
}

// testing

let region = new Region(5,12);
let present0 = new Present(4,
    [[0,0,0],
     [0,1,0],
     [0,1,1]]
)
let present1 = new Present(5,
    [[0,0,0],
     [1,1,0],
     [0,1,1]]
)
region.findPlacements([present0,present1],[0,0]);
region.disp();
