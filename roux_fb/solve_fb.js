/*
          0  1  2
          3  4  5
          6  7  8
         --------
 9 10 11|18 19 20|27 28 29|36 37 38
12 13 14|21 22 23|30 31 32|39 40 41
15 16 17|24 25 26|33 34 35|42 43 44
         --------
         45 46 47
         48 49 50
         51 52 53
*/
class Cube {
    static initialFaces = "UUUUUUUUULLLLLLLLLFFFFFFFFFRRRRRRRRRBBBBBBBBBDDDDDDDDD".split("");

    static moveTable = {
        //   [ 0,  1,  2,  3,  4,  5,  6,  7,  8,   9, 10, 11, 12, 13, 14, 15, 16, 17,  18, 19, 20, 21, 22, 23, 24, 25, 26,  27, 28, 29, 30, 31, 32, 33, 34, 35,  36, 37, 38, 39, 40, 41, 42, 43, 44,  45, 46, 47, 48, 49, 50, 51, 52, 53],
        "F": [ 0,  1,  2,  3,  4,  5, 17, 14, 11,   9, 10, 45, 12, 13, 46, 15, 16, 47,  24, 21, 18, 25, 22, 19, 26, 23, 20,   6, 28, 29,  7, 31, 32,  8, 34, 35,  36, 37, 38, 39, 40, 41, 42, 43, 44,  33, 30, 27, 48, 49, 50, 51, 52, 53],
        "B": [29, 32, 35,  3,  4,  5,  6,  7,  8,   2, 10, 11,  1, 13, 14,  0, 16, 17,  18, 19, 20, 21, 22, 23, 24, 25, 26,  27, 28, 53, 30, 31, 52, 33, 34, 51,  42, 39, 36, 43, 40, 37, 44, 41, 38,  45, 46, 47, 48, 49, 50,  9, 12, 15],
        "R": [ 0,  1, 20,  3,  4, 23,  6,  7, 26,   9, 10, 11, 12, 13, 14, 15, 16, 17,  18, 19, 47, 21, 22, 50, 24, 25, 53,  33, 30, 27, 34, 31, 28, 35, 32, 29,   8, 37, 38,  5, 40, 41,  2, 43, 44,  45, 46, 42, 48, 49, 39, 51, 52, 36],
        "L": [44,  1,  2, 41,  4,  5, 38,  7,  8,  15, 12,  9, 16, 13, 10, 17, 14, 11,   0, 19, 20,  3, 22, 23,  6, 25, 26,  27, 28, 29, 30, 31, 32, 33, 34, 35,  36, 37, 51, 39, 40, 48, 42, 43, 45,  18, 46, 47, 21, 49, 50, 24, 52, 53],
        "U": [ 6,  3,  0,  7,  4,  1,  8,  5,  2,  18, 19, 20, 12, 13, 14, 15, 16, 17,  27, 28, 29, 21, 22, 23, 24, 25, 26,  36, 37, 38, 30, 31, 32, 33, 34, 35,   9, 10, 11, 39, 40, 41, 42, 43, 44,  45, 46, 47, 48, 49, 50, 51, 52, 53],
        "D": [ 0,  1,  2,  3,  4,  5,  6,  7,  8,   9, 10, 11, 12, 13, 14, 42, 43, 44,  18, 19, 20, 21, 22, 23, 15, 16, 17,  27, 28, 29, 30, 31, 32, 24, 25, 26,  36, 37, 38, 39, 40, 41, 33, 34, 35,  51, 48, 45, 52, 49, 46, 53, 50, 47],
        "S": [ 0,  1,  2, 16, 13, 10,  6,  7,  8,   9, 48, 11, 12, 49, 14, 15, 50, 17,  18, 19, 20, 21, 22, 23, 24, 25, 26,  27,  3, 29, 30,  4, 32, 33,  5, 35,  36, 37, 38, 39, 40, 41, 42, 43, 44,  45, 46, 47, 34, 31, 28, 51, 52, 53],
        "M": [ 0, 43,  2,  3, 40,  5,  6, 37,  8,   9, 10, 11, 12, 13, 14, 15, 16, 17,  18,  1, 20, 21,  4, 23, 24,  7, 26,  27, 28, 29, 30, 31, 32, 33, 34, 35,  36, 52, 38, 39, 49, 41, 42, 46, 44,  45, 19, 47, 48, 22, 50, 51, 25, 53],
        "E": [ 0,  1,  2,  3,  4,  5,  6,  7,  8,   9, 10, 11, 39, 40, 41, 15, 16, 17,  18, 19, 20, 12, 13, 14, 24, 25, 26,  27, 28, 29, 21, 22, 23, 33, 34, 35,  36, 37, 38, 30, 31, 32, 42, 43, 44,  45, 46, 47, 48, 49, 50, 51, 52, 53],
    };

    // エッジ。
    // U/D面が先、U/D面を含まないエッジはF/B面が先。
    static edges = [
        [ 1, 37], [ 5, 28], [ 7, 19], [ 3, 10],
        [21, 14], [23, 30], [39, 32], [41, 12],
        [46, 25], [50, 34], [52, 43], [48, 16],
    ];
    // コーナー。
    // U/D面から時計回り。
    static corners = [
        [ 0,  9, 38], [ 2, 36, 29], [ 8, 27, 20], [ 6, 18, 11],
        [45, 17, 24], [47, 26, 33], [53, 35, 42], [51, 44, 15],
    ];

    static {
        function comb(T0, T1) {
            const T2 = Array(54);
            for (let i=0; i<54; i++) {
                T2[i] = T0[T1[i]];
            }
            return T2;
        }

        // 180度回転と逆回転の追加。
        for (const m of ["F", "B", "R", "L", "U", "D", "S", "M", "E"]) {
            Cube.moveTable[m+"2"] = comb(Cube.moveTable[m], Cube.moveTable[m]);
            Cube.moveTable[m+"'"] = comb(Cube.moveTable[m+"2"], Cube.moveTable[m]);
        }

        // 2層回しと持ち替えの追加。
        Cube.moveTable["Fw"] = comb(Cube.moveTable["F"], Cube.moveTable["S"]);
        Cube.moveTable["Bw"] = comb(Cube.moveTable["B"], Cube.moveTable["S'"]);
        Cube.moveTable["Rw"] = comb(Cube.moveTable["R"], Cube.moveTable["M'"]);
        Cube.moveTable["Lw"] = comb(Cube.moveTable["L"], Cube.moveTable["M"]);
        Cube.moveTable["Uw"] = comb(Cube.moveTable["U"], Cube.moveTable["E'"]);
        Cube.moveTable["Dw"] = comb(Cube.moveTable["D"], Cube.moveTable["E"]);
        Cube.moveTable["x"] = comb(Cube.moveTable["Rw"], Cube.moveTable["L'"]);
        Cube.moveTable["y"] = comb(Cube.moveTable["Uw"], Cube.moveTable["D'"]);
        Cube.moveTable["z"] = comb(Cube.moveTable["Fw"], Cube.moveTable["B'"]);

        // 2層回しと持ち替えの、180度回転と逆回転の追加。
        for (const m of ["Fw", "Bw", "Rw", "Lw", "Uw", "Dw", "x", "y", "z"]) {
            Cube.moveTable[m+"2"] = comb(Cube.moveTable[m], Cube.moveTable[m]);
            Cube.moveTable[m+"'"] = comb(Cube.moveTable[m+"2"], Cube.moveTable[m]);
        }
    }

    constructor() {
        this.faces = [...Cube.initialFaces];
        this.history = [];
    }

    move(m) {
        const tmp = [...this.faces];
        for (let i=0; i<54; i++) {
            this.faces[i] = tmp[Cube.moveTable[m][i]];
        }

        this.history.push(m);
    }

    undo() {
        const m = this.history.pop();

        const tmp = [...this.faces];
        for (let i=0; i<54; i++) {
            this.faces[Cube.moveTable[m][i]] = tmp[i];
        }
    }
};

// FB以外を塗りつぶす。
function mask(cube) {
    for (let center of [4, 13, 22, 31, 40, 49]) {
        if (cube.faces[center]!="L") {
            cube.faces[center] = ".";
        }
    }

    for (let e1=0; e1<12; e1++) {
        for (let e2=0; e2<12; e2++) {
            for (let o=0; o<2; o++) {
                let ok = true;
                for (let i=0; i<2; i++) {
                    if (cube.faces[Cube.edges[e1][i]]!=Cube.initialFaces[Cube.edges[e2][(i+o)%2]]) {
                        ok = false;
                    }
                }
                if (ok) {
                    if (e2!=4 && e2!=7 && e2!=11) {
                        for (let i=0; i<2; i++) {
                            cube.faces[Cube.edges[e1][i]] = ".";
                        }
                    }
                }
            }
        }
    }

    for (let c1=0; c1<8; c1++) {
        for (let c2=0; c2<8; c2++) {
            for (let o=0; o<3; o++) {
                let ok = true;
                for (let i=0; i<3; i++) {
                    if (cube.faces[Cube.corners[c1][i]]!=Cube.initialFaces[Cube.corners[c2][(i+o)%3]]) {
                        ok = false;
                    }
                }
                if (ok) {
                    if (c2!=4 && c2!=7) {
                        for (let i=0; i<3; i++) {
                            cube.faces[Cube.corners[c1][i]] = ".";
                        }
                    }
                }
            }
        }
    }
}

function makeTable(moves) {
    const cube = new Cube();
    mask(cube);

    const table = new Map();
    table.set(cube.faces.join(""), 0);
    let T = [cube.faces.join("")];

    for (let d=1; ; d++) {
        const P = T;
        T = [];
        let up = false;
        for (const faces of P) {
            cube.faces = faces.split("");
            for (const move of moves) {
                cube.move(move);
                const faces2 = cube.faces.join("");
                cube.undo();
                if (!table.has(faces2)) {
                    table.set(faces2, d);
                    T.push(faces2);
                    up = true;
                }
            }
        }
        if (!up || table.size>=20000) {
            break;
        }
    }
    return table;
}

function solve(cube, table, moves, maxDepth) {
    let solution = [];
    let solved = false;

    cube.history = [];

    let tableDepth = 0;
    for (let d of table.values()) {
        tableDepth = Math.max(tableDepth, d);
    }

    function search(depth, maxDepth, prevMove) {
        if (depth>=maxDepth) {
            let ok = true;
            for (let [p, f] of [
                [12, "L"],
                [13, "L"],
                [14, "L"],
                [15, "L"],
                [16, "L"],
                [17, "L"],
                [21, "F"],
                [24, "F"],
                [41, "B"],
                [44, "B"],
                [45, "D"],
                [48, "D"],
                [51, "D"],
            ]) {
                if (cube.faces[p]!=f) {
                    ok = false;
                    break;
                }
            }
            if (ok) {
                // 持ち替え以外の手数が短いものを優先、手数が同じなら回しにくい動きが少ないものを優先。
                function score(solution) {
                    const move2score = {
                        "F": 100,
                        "B": 100,
                        "R": 1,
                        "L": 1,
                        "U": 1,
                        "D": 100,
                        "S": 100,
                        "M": 1,
                        "E": 100,
                        "Fw": 100,
                        "Bw": 100,
                        "Rw": 1,
                        "Lw": 1,
                        "Uw": 100,
                        "Dw": 100,
                        "x": 0,
                        "y": 0,
                        "z": 0,
                    };

                    let s = 0;
                    for (const m of solution) {
                        s += move2score[m.replace("2","").replace("'","")];
                    }
                    return s;
                }

                if (!solved || score(cube.history)<score(solution)) {
                    solved = true;
                    solution = [...cube.history];
                }
            }
            return;
        }

        const faces = cube.faces.join("");
        let h = table.has(faces) ? table.get(faces) : tableDepth+1;
        if (depth+h>maxDepth) {
            return;
        }

        for (const move of moves) {
            if (prevMove!="") {
                const types = {
                    "F": ["z", 0],
                    "Fw": ["z", 1],
                    "S": ["z", 2],
                    "B": ["z", 3],
                    "Bw": ["z", 4],
                    "L": ["x", 0],
                    "Lw": ["x", 1],
                    "M": ["x", 2],
                    "R": ["x", 3],
                    "Rw": ["x", 4],
                    "U": ["y", 0],
                    "Uw": ["y", 1],
                    "E": ["y", 2],
                    "D": ["y", 3],
                    "Dw": ["y", 4],
                };
                const [tp, np] = types[prevMove.replace("2","").replace("'","")];
                const [tm, nm] = types[move.replace("2","").replace("'","")];
                if (tm==tp && nm<=np) {
                    continue;
                }
            }

            cube.move(move);
            const solved = search(depth+1, maxDepth, move);
            cube.undo();
        }
    }

    for (let rotate of [
        [],
        ["y"],
        ["y2"],
        ["y'"],
        ["x"],
        ["x", "y"],
        ["x", "y2"],
        ["x", "y'"],
        ["x2"],
        ["x2", "y"],
        ["x2", "y2"],
        ["x2", "y'"],
        ["x'"],
        ["x'", "y"],
        ["x'", "y2"],
        ["x'", "y'"],
        ["z"],
        ["z", "y"],
        ["z", "y2"],
        ["z", "y'"],
        ["z'"],
        ["z'", "y"],
        ["z'", "y2"],
        ["z'", "y'"],
    ]) {
        for (let move of rotate) {
            cube.move(move);
        }

        search(0, maxDepth, "");

        for (let _ of rotate) {
            cube.undo();
        }
    }

    if (solved) {
        return solution;
    } else {
        return false;
    }
}

onmessage = e => {
    const moves = e.data.moves;
    const scramble = e.data.scramble;

    console.log(`Moves: ${moves}`);
    console.log(`Scramble: ${scramble}`);

    const table = makeTable(moves);
    console.log(`Table size: ${table.size}`);

    const lds = [
        "LD", "FD", "RD", "BD",
        "LU", "BU", "RU", "FU",
        "LB", "DB", "RB", "UB",
        "LF", "UF", "RF", "DF",
        "UL", "FL", "DL", "BL",
        "UR", "BR", "DR", "FR",
    ];

    const solved = new Set();

    for (let maxDepth=0; maxDepth<30 && solved.size<lds.length; maxDepth++) {
        for (const ld of lds) {
            if (solved.has(ld)) {
                continue;
            }

            const cube = new Cube();
            for (const move of scramble) {
                cube.move(move);
            }

            // LDが目的の色になるように塗り替える。
            const replaces = {
                "LD": {"F": "F", "B": "B", "R": "R", "L": "L", "U": "U", "D": "D"},
                "FD": {"F": "L", "B": "R", "R": "F", "L": "B", "U": "U", "D": "D"},
                "RD": {"F": "B", "B": "F", "R": "L", "L": "R", "U": "U", "D": "D"},
                "BD": {"F": "R", "B": "L", "R": "B", "L": "F", "U": "U", "D": "D"},
                "LU": {"F": "B", "B": "F", "R": "R", "L": "L", "U": "D", "D": "U"},
                "BU": {"F": "R", "B": "L", "R": "F", "L": "B", "U": "D", "D": "U"},
                "RU": {"F": "F", "B": "B", "R": "L", "L": "R", "U": "D", "D": "U"},
                "FU": {"F": "L", "B": "R", "R": "B", "L": "F", "U": "D", "D": "U"},
                "LB": {"F": "U", "B": "D", "R": "R", "L": "L", "U": "B", "D": "F"},
                "DB": {"F": "U", "B": "D", "R": "F", "L": "B", "U": "R", "D": "L"},
                "RB": {"F": "U", "B": "D", "R": "L", "L": "R", "U": "F", "D": "B"},
                "UB": {"F": "U", "B": "D", "R": "B", "L": "F", "U": "L", "D": "R"},
                "LF": {"F": "D", "B": "U", "R": "R", "L": "L", "U": "F", "D": "B"},
                "UF": {"F": "D", "B": "U", "R": "F", "L": "B", "U": "L", "D": "R"},
                "RF": {"F": "D", "B": "U", "R": "L", "L": "R", "U": "B", "D": "F"},
                "DF": {"F": "D", "B": "U", "R": "B", "L": "F", "U": "R", "D": "L"},
                "UL": {"F": "F", "B": "B", "R": "U", "L": "D", "U": "L", "D": "R"},
                "FL": {"F": "L", "B": "R", "R": "U", "L": "D", "U": "B", "D": "F"},
                "DL": {"F": "B", "B": "F", "R": "U", "L": "D", "U": "R", "D": "L"},
                "BL": {"F": "R", "B": "L", "R": "U", "L": "D", "U": "F", "D": "B"},
                "UR": {"F": "B", "B": "F", "R": "D", "L": "U", "U": "L", "D": "R"},
                "BR": {"F": "R", "B": "L", "R": "D", "L": "U", "U": "B", "D": "F"},
                "DR": {"F": "F", "B": "B", "R": "D", "L": "U", "U": "R", "D": "L"},
                "FR": {"F": "L", "B": "R", "R": "D", "L": "U", "U": "F", "D": "B"},
            };
            for (let i=0; i<54; i++) {
                cube.faces[i] = replaces[ld][cube.faces[i]];
            }

            mask(cube);

            const solution = solve(cube, table, moves, maxDepth);
            if (solution!==false) {
                solved.add(ld);

                postMessage({
                    type: "solution",
                    ld,
                    solution: solution,
                });
            }
        }
    }

    postMessage({
        type: "end",
    });
}
