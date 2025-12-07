/* Advent of Code 2025 Day 7: The Laboratory */
 
import { readFileSync } from "fs";

/* Part 1: Count tachyon splits.
 */

/* One insight here is that the splitting process is very local.
 * The state of a cell only depends on the five cells above and around it.
 * That is: for each dot in the new row, its new value is a pipe if and only if 
 * at least one of the following holds:
 *   - pipe directly above;
 *   - caret on the left, pipe above that;
 *   - caret on the right, pipe above that.
 * 
 * As for counting splits, once we've propagated all the way down, the number of
 * splits is just the number of carets with a pipe above.
 * 
 */

function propagate(prevRow, row) {
    let newRow = new Array(row.length);
    for (let i = 0; i < row.length; i++) {
        if (row[i] != '.') {
            newRow[i] = row[i];
        }
        else if (   (prevRow[i] == '|')
            || (i > 0 && prevRow[i-1] == '|' && row[i-1] == '^')
            || (i < (row.length-1) && prevRow[i+1] == '|' && row[i+1] == '^')
            ) 
            newRow[i] = '|';
        else newRow[i] = '.';
    }  
    return newRow.join('');
}

function runTachyons(fileName) {
    const rows = readFileSync(fileName,'utf8').split('\n');
    rows[0] = rows[0].replace('S','|');
    for (let i = 1; i < rows.length; i++) {
        rows[i] = propagate(rows[i-1], rows[i]);
    }
    return rows;
}

function countSplits(fileName) {
    let total = 0;
    const finalState = runTachyons(fileName);
    for (let i = 0; i < finalState.length-1; i++) {
        for (let j=0; j < finalState[i].length;j++) {
            if (finalState[i][j] == '|' && finalState[i+1][j] == '^')
                total++;
        }
    }
    return total;
}

// console.log(countSplits('input_test.txt')); // 21
console.log(countSplits('input.txt')); // 1626

/* Part 2: getting quantum. */

function getChildLabels(manifold, label) {
    let left = null, right = null;
    let i0 = label[0], j0 = label[1];
    for (let i = i0+1; i < manifold.length; i++) {
        if (!left && j0 > 0 && manifold[i][j0-1] == '^') left = [i,j0-1];
        if (!right && j0 < manifold.length-1 && manifold[i][j0+1] == '^') right = [i,j0+1];
    }
    return [left,right].filter(a => a);
}

function evolveState(structure, state) {
    let newState = {
        exited: state.exited,
        inProgress: new Array(structure.length).fill(0)
    };
    for (let i = 0; i < structure.length; i++) {
        if (!state.inProgress[i]) continue;
        for (let room of structure[i]) {
            room == "done" ? newState.exited           += state.inProgress[i] 
                           : newState.inProgress[room] += state.inProgress[i];
        }
    }
    return newState;
}

function runStructure(structure) {
    let state = {
        exited: 0,
        inProgress: new Array(structure.length).fill(0)
    }
    state.inProgress[0] = 1;
    while (state.inProgress.some(n => n)) {
        state = evolveState(structure,state);
    }
    return state;
}

function runTachyonsQuantum(fileName) {
    let manifold = readFileSync(fileName,'utf8').split('\n');
    let table = [];
    for (let i = 0; i < manifold.length; i++) {
        for (let j = 0; j < manifold[0].length; j++) {
            if (manifold[i][j] == '^') {
                table.push([i,j]);
            }
        }
    }
    let structure = [];
    for (let i = 0; i < table.length; i++) {
        structure.push([]);
        for (let childLabel of getChildLabels(manifold,table[i])) {
            structure[i].push(
                table.findIndex(a => a.every((v,i) => v == childLabel[i]))
            );
        }
        while (structure[i].length < 2) structure[i].push("done");
    }
    return runStructure(structure).exited;
}

// console.log(runTachyonsQuantum('input_test.txt')); // 40
console.log(runTachyonsQuantum('input.txt')); // 48989920237096
