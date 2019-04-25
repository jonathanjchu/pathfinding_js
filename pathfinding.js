// assumes var world is 2D array of map

var wall = 2;   // value in the world map that is considered the "wall"

var path;

// get next coords to move closer to target
//  target_x, target_y = coords of destination
//  current_x, current_y = coords of origin
function getCoordsTowardsTarget(target_x, target_y, current_x, current_y) {
    path = [];

    // find shortest path from all nodes to the target, save in 'path'
    findPaths(target_x, target_y);

    // find current x, y within 'path'
    var idx = findCellInPath(current_x, current_y);

    // find which cell is the next step to move towards target
    var nextCell = findAdjacentCellThatsCloser(path[idx].x, path[idx].y, path[idx].d);

    // return as {x, y} object
    return ({
        x: nextCell.x,
        y: nextCell.y
    })
}

function findPaths(end_x, end_y) {
    path = [];

    // add destination cell
    path.push({
        x: end_x,
        y: end_y,
        d: 0
    });

    // go through every cell in path (path will grow while traversing)
    for (var i = 0; i < path.length; i++) {
        // if a path has been found, stop running
        // if (path[i].x == start_x && path[i] == start_y) {
        //     break;
        // }

        checkNextCells(path[i].x, path[i].y, path[i].d);
    }
}

// check adjacent cells, add them to 'path' if they have not been visited
//  and the cell is valid
function checkNextCells(x, y, d) {
    // get array of adjacent cells
    let openCells = getOpenAdjacentCells(x, y);

    // go through array of open cells
    for (var i = 0; i < openCells.length; i++) {
        if (!isCellAlreadyInPath(openCells[i].x, openCells[i].y, d + 1)) {
            path.push({
                x: openCells[i].x,
                y: openCells[i].y,
                d: d + 1
            });
        }
    }
}

function isCellAlreadyInPath(x, y, d) {
    for (var i = 0; i < path.length; i++) {
        if (path[i].x == x && path[i].y == y && path[i].d <= d) {
            return true;
        }
    }
    return false;
}

// find cells adjacent to x, y that are not walls
// @returns an array with all adjacent cells that aren't wall
function getOpenAdjacentCells(x, y) {
    let openCells = [];

    // console.log("x: " + x + ", y: " + y);

    if (world[y + 1][x] != wall) {   // down
        openCells.push({
            x: x,
            y: (y + 1)
        });
    }

    if (world[y - 1][x] != wall) {   // up
        openCells.push({
            x: x,
            y: (y - 1)
        });
    }

    if (world[y][x - 1] != wall) {   // left
        openCells.push({
            x: (x - 1),
            y: y
        });
    }

    if (world[y][x + 1] != wall) {   // right
        openCells.push({
            x: (x + 1),
            y: y
        });
    }

    return openCells;
}

// get the index in path that contains the coordinates x, y
function findCellInPath(x, y) {
    for (var i = 0; i < path.length; i++) {
        if (path[i].x == x && path[i].y == y) {
            return i;
        }
    }
}

// get an array of all the cells on the shortest path (mainly for debugging)
function getPathToTarget(x, y) {
    var shortestPath = [];
    var i = findCellInPath(x, y);
    var dist = path[i].d;

    shortestPath.push({
        x: x,
        y: y,
        d: dist
    })

    // console.log("x: " + path[i].x + ", y: " + path[i].y + ", d: " + path[i].d);

    while (dist > 0) {
        i = findAdjacentCellThatsCloser(path[i].x, path[i].y, path[i].d);

        shortestPath.push({
            x: path[i].x,
            y: path[i].y,
            d: path[i].d
        });

        dist = path[i].d;
    }

    return shortestPath;
}

function findAdjacentCellThatsCloser(x, y, d) {
    let adjCells = getOpenAdjacentCells(x, y);

    // console.log(adjCells);

    for (var i = 0; i < path.length; i++) {
        for (var j = 0; j < adjCells.length; j++) {
            if (path[i].x == adjCells[j].x
                && path[i].y == adjCells[j].y
                && path[i].d == d - 1) {
                return path[i];
            }
        }
    }
}