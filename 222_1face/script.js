/*
       0  1
       2  3
      -----
 4  5| 8  9|12 13|16 17|
 6  7|10 11|14 15|18 19|
      -----
      20 21
      22 23
*/
class Cube {
    static initialFaces = "UUUULLLLFFFFRRRRBBBBDDDD".split("");

    static moveTable = {
        "F": [ 0,  1,  7,  5,   4, 20,  6, 21,  10,  8, 11,  9,   2, 13,  3, 15,  16, 17, 18, 19,  14, 12, 22, 23],
        "B": [13, 15,  2,  3,   1,  5,  0,  7,   8,  9, 10, 11,  12, 23, 14, 22,  18, 16, 19, 17,  20, 21,  4,  6],
        "R": [ 0,  9,  2, 11,   4,  5,  6,  7,   8, 21, 10, 23,  14, 12, 15, 13,   3, 17,  1, 19,  20, 18, 22, 16],
        "L": [19,  1, 17,  3,   6,  4,  7,  5,   0,  9,  2, 11,  12, 13, 14, 15,  16, 22, 18, 20,   8, 21, 10, 23],
        "U": [ 2,  0,  3,  1,   8,  9,  6,  7,  12, 13, 10, 11,  16, 17, 14, 15,   4,  5, 18, 19,  20, 21, 22, 23],
        "D": [ 0,  1,  2,  3,   4,  5, 18, 19,   8,  9,  6,  7,  12, 13, 10, 11,  16, 17, 14, 15,  22, 20, 23, 21],
    };

    static {
        const T = Cube.moveTable;

        function composite(X, Y) {
            const Z = Array(24);
            for (let i=0; i<24; i++) {
                Z[i] = X[Y[i]];
            }
            return Z;
        }

        for (const m of ["F", "B", "R", "L", "U", "D"]) {
            T[m+"2"] = composite(T[m], T[m]);
            T[m+"'"] = composite(T[m+"2"], T[m]);
        }
        T["x"] = composite(T["R"], T["L'"]);
        T["y"] = composite(T["U"], T["D'"]);
        T["z"] = composite(T["F"], T["B'"]);
        for (const m of ["x", "y", "z"]) {
            T[m+"2"] = composite(T[m], T[m]);
            T[m+"'"] = composite(T[m+"2"], T[m]);
        }
    }

    // コーナー。
    // U/D面から時計回り。
    static corners = [
        [ 0,  4, 17], [ 1, 16, 13], [ 3, 12,  9], [ 2,  8,  5],
        [20,  7, 10], [21, 11, 14], [23, 15, 18], [22, 19,  6],
    ];

    constructor() {
        this.faces = [...Cube.initialFaces];
        this.history = [];
    }

    move(m) {
        const tmp = [...this.faces];
        for (let i=0; i<24; i++) {
            this.faces[i] = tmp[Cube.moveTable[m][i]];
        }

        this.history.push(m);
    }

    undo() {
        const m = this.history.pop();

        const tmp = [...this.faces];
        for (let i=0; i<24; i++) {
            this.faces[Cube.moveTable[m][i]] = tmp[i];
        }
    }

    scramble(moves) {
        this.faces = [...Cube.initialFaces];

        for (const m of moves.split(" ")) {
            if (Cube.moveTable[m]) {
                if (Cube.moveTable[m]) {
                    this.move(m);
                }
            }
        }
    }

    random() {
        function rand(n) {
            return Math.random()*n|0;
        }

        const CP = Array(8);
        for (let i=0; i<8; i++) {
            CP[i] = i;
        }
        // DBLコーナーの位置は固定。
        for (let i=6; i>0; i--) {
            const r = rand(i+1);
            const t = CP[i];
            CP[i] = CP[r];
            CP[r] = t;
        }

        const CO = Array(8);
        let n = 0;
        // DBLコーナーの向きは固定。
        for (let i=0; i<6; i++) {
            CO[i] = rand(3);
            n += CO[i];
        }
        CO[6] = (3-n%3)%3;
        CO[7] = 0;

        for (let i=0; i<8; i++) {
            for (let j=0; j<3; j++) {
                this.faces[Cube.corners[i][j]] = Cube.initialFaces[Cube.corners[CP[i]][(CO[i]+j)%3]];
            }
        }
    }

    toString() {
        const F = this.faces;
        return (
            `    ${F[ 0]} ${F[ 1]}\n`+
            `    ${F[ 2]} ${F[ 3]}\n`+
            `${F[ 4]} ${F[ 5]} ${F[ 8]} ${F[ 9]} ${F[12]} ${F[13]} ${F[16]} ${F[17]}\n`+
            `${F[ 6]} ${F[ 7]} ${F[10]} ${F[11]} ${F[14]} ${F[15]} ${F[18]} ${F[19]}\n`+
            `    ${F[20]} ${F[21]}\n`+
            `    ${F[22]} ${F[23]}\n`);
    }
};

const solveTable = new Map();
const solveTableDepth = 4;

function makeSolveTable() {
    const cube = new Cube();

    const faces = cube.faces.join("");
    solveTable.set(faces, 0);
    let F = [];
    F.push(faces);

    for (let depth=0; depth<solveTableDepth; depth++) {
        const F2 = [];
        for (let f of F) {
            cube.faces = f.split("");
            for (let move of [
                "R", "R2", "R'",
                "U", "U2", "U'",
                "F", "F2", "F'",
            ]) {
                cube.move(move);
                const f2 = cube.faces.join("");
                if (!solveTable.has(f2)) {
                    solveTable.set(f2, depth+1);
                    F2.push(f2);
                }
                cube.undo();
            }
        }
        F = F2;
    }

    console.log("solveTable", solveTable.size);
}

function solve(cube) {
    let solution = [];
    cube.history = [];

    function search(depth, maxDepth, prevMove) {
        if (depth==maxDepth) {
            let ok = true;
            for (let i=0; i<24 && ok; i++) {
                if (cube.faces[i]!=Cube.initialFaces[i]) {
                    ok = false;
                }
            }
            if (ok) {
                solution = [...cube.history];
                return true;
            }
            return false;
        }

        let h = solveTableDepth+1;
        const f = cube.faces.join("");
        if (solveTable.has(f)) {
            h = solveTable.get(f);
        }
        if (depth+h>maxDepth) {
            return false;
        }

        for (const move of [
            "R", "R2", "R'",
            "U", "U2", "U'",
            "F", "F2", "F'",
        ]) {
            if (prevMove && move[0]==prevMove[0]) {
                continue;
            }

            cube.move(move);
            const solved = search(depth+1, maxDepth, move);
            cube.undo();

            if (solved) {
                return true;
            }
        }
    }

    for (let depth=0; ; depth++) {
        if (search(0, depth, "")) {
            break;
        }
    }

    return solution;
}

const solveFaceTable = new Map();
const solveFaceTableDepth = 4;

function extractFaces(cube, color) {
    let faces = "";
    for (const f of cube.faces) {
        if (f==color) {
            faces += "#";
        } else {
            faces += ".";
        }
    }
    return faces;
}

function makeSolveFaceTable() {
    const cube = new Cube();

    const faces = "...."+"...."+"...."+"...."+"...."+"####";
    solveTable.set(faces, 0);
    let F = [];
    F.push(faces);

    for (let depth=0; depth<solveFaceTableDepth; depth++) {
        const F2 = [];
        for (let f of F) {
            cube.faces = f.split("");
            for (let move of [
                "F", "F2", "F'",
                // Bは使わない。
                "R", "R2", "R'",
                "L", "L2", "L'",
                "U", "U2", "U'",
                "D", "D2", "D'",
            ]) {
                cube.move(move);
                const f2 = cube.faces.join("");
                if (!solveFaceTable.has(f2)) {
                    solveFaceTable.set(f2, depth+1);
                    F2.push(f2);
                }
                cube.undo();
            }
        }
        F = F2;
    }

    console.log("solveFaceTable", solveFaceTable.size);
}

function solveFace(cube, color) {
    cube.history = [];
    const scrambleFaces = [...cube.faces];

    let solved = false;
    let solution = [];
    let solutionType = "";

    function search(depth, maxDepth, prevMove) {
        if (depth==maxDepth) {
            for (let i=0; i<4; i++) {
                if (cube.faces[20+i]!=color) {
                    return;
                }
            }

            function opposite(x, y) {
                return (
                    x=="F" && y=="B" ||
                    x=="B" && y=="F" ||
                    x=="R" && y=="L" ||
                    x=="L" && y=="R" ||
                    x=="U" && y=="D" ||
                    x=="D" && y=="U");
            }

            let type = "";
            if (cube.faces[6]==cube.faces[7] && cube.faces[10]==cube.faces[11]) {
                type = "solved";
            } else if (opposite(cube.faces[6], cube.faces[7]) && opposite(cube.faces[10], cube.faces[11])) {
                type = "diagonal";
            } else {
                // バーはDBのみ許す。
                if (cube.faces[18]!=cube.faces[19]) {
                    return;
                }
                type = "adjacent";
            }

            function score(moves) {
                let s = 0;
                for (const m of moves) {
                    if (m[0]=="D") {
                        s += 1000000;
                    }
                    if (m[0]=="F") {
                        s += 100;
                    }
                    if (m[0]=="L") {
                        s += 1;
                    }
                }

                const cube2 = new Cube();
                cube2.faces = [...scrambleFaces];
                for (const move of moves) {
                    if (move[0]=="x" || move[0]=="y" || move[0]=="z") {
                        cube2.move(move);
                    }
                }
                for (let i=20; i<24; i++) {
                    if (cube2.faces[i]==color) {
                        s -= 10000;
                    }
                }
                return s;
            }

            if (!solved || score(cube.history)<score(solution)) {
                solved = true;
                solution = [...cube.history];
                solutionType = type;
            }

            return;
        }

        let h = solveFaceTableDepth+1;
        const f = extractFaces(cube, color);
        if (solveFaceTable.has(f)) {
            h = solveFaceTable.get(f);
        }
        if (depth+h>maxDepth) {
            return false;
        }

        for (const move of [
            "F", "F2", "F'",
            // Bは使わない。
            "R", "R2", "R'",
            "L", "L2", "L'",
            "U", "U2", "U'",
            "D", "D2", "D'",
        ]) {
            if (prevMove && move[0]==prevMove[0]) {
                continue;
            }

            cube.move(move);
            search(depth+1, maxDepth, move);
            cube.undo();
        }
    }

    for (let depth=0; ; depth++) {
        for (const r1 of ["", "x", "x2", "x'", "z", "z'"]) {
            for (const r2 of ["", "y", "y2", "y'"]) {
                if (r1!="") {
                    cube.move(r1);
                }
                if (r2!="") {
                    cube.move(r2);
                }

                search(0, depth, "");

                if (r1!="") {
                    cube.undo();
                }
                if (r2!="") {
                    cube.undo();
                }
            }
        }
        if (solved) {
            break;
        }
    }

    return {
        moves: solution,
        type: solutionType,
    };
}

function render(canvas, cube, dColor) {
    const ctx = canvas.getContext("2d");
    const dpr = window.devicePixelRatio;
    canvas.width = 128*dpr;
    canvas.height = 128*dpr;
    ctx.scale(dpr, dpr);
    canvas.style.width = `${128}px`;
    canvas.style.height = `${128}px`;

    if (dColor=="U") {
        ctx.fillStyle = "rgb(192 192 192)";
        ctx.fillRect(0, 0, 128, 128);
    }

    function rotate(x, y, z) {
        const th1 = 0.6;
        const x2 = x*Math.cos(th1)-z*Math.sin(th1);
        const y2 = y;
        const z2 = x*Math.sin(th1)+z*Math.cos(th1);

        const th2 = 0.3;
        const x3 = x2;
        const y3 = y2*Math.cos(th2)-z2*Math.sin(th2);
        const z3 = y2*Math.sin(th2)+z2*Math.cos(th2);

        const w = 40;
        const s = 0.2;
        const x4 = x3*(z3*s/2+1)*w+64;
        const y4 = -y3*(z3*s/2+1)*w+64;

        return [x4, y4];
    }

    const FP = [
        [[-1,  1, -1], [ 1,  1, -1], [ 1,  1,  1], [-1,  1,  1]],
        [[-1,  1, -1], [-1,  1,  1], [-1, -1,  1], [-1, -1, -1]],
        [[-1,  1,  1], [ 1,  1,  1], [ 1, -1,  1], [-1, -1,  1]],
        [[ 1,  1,  1], [ 1,  1, -1], [ 1, -1, -1], [ 1, -1,  1]],
        [[ 1,  1, -1], [-1,  1, -1], [-1, -1, -1], [ 1, -1, -1]],
        [[-1, -1,  1], [ 1, -1,  1], [ 1, -1, -1], [-1, -1, -1]],
    ];

    // B, L, D, F, R, Uの順に描画。
    const I = [];
    for (let f of [16, 4, 20, 8, 12, 0]) {
        for (let i=0; i<4; i++) {
            I.push(f+i);
        }
    }

    // 不透明度。
    const A = Array(24);
    if (dColor) {
        for (const corner of Cube.corners) {
            let d = false;
            for (const c of corner) {
                if (cube.faces[c]==dColor) {
                    d = true;
                }
            }
            if (d) {
                for (const c of corner) {
                    if (cube.faces[c]==dColor) {
                        A[c] = 90;
                    } else {
                        A[c] = 0;
                    }
                }
            } else {
                for (let c of corner) {
                    A[c] = 0;
                }
            }
        }
    } else {
        for (let i=0; i<24; i++) {
            A[i] = 100;
        }
    }

    for (let i of I) {
        const fp = FP[i/4|0];
        const fx = i%4%2;
        const fy = i%4/2|0;

        ctx.beginPath();
        ctx.moveTo(...rotate(
            (fp[1][0]-fp[0][0])*fx/2+(fp[3][0]-fp[0][0])*fy/2+fp[0][0],
            (fp[1][1]-fp[0][1])*fx/2+(fp[3][1]-fp[0][1])*fy/2+fp[0][1],
            (fp[1][2]-fp[0][2])*fx/2+(fp[3][2]-fp[0][2])*fy/2+fp[0][2]));
        ctx.lineTo(...rotate(
            (fp[1][0]-fp[0][0])*(fx+1)/2+(fp[3][0]-fp[0][0])*fy/2+fp[0][0],
            (fp[1][1]-fp[0][1])*(fx+1)/2+(fp[3][1]-fp[0][1])*fy/2+fp[0][1],
            (fp[1][2]-fp[0][2])*(fx+1)/2+(fp[3][2]-fp[0][2])*fy/2+fp[0][2]));
        ctx.lineTo(...rotate(
            (fp[1][0]-fp[0][0])*(fx+1)/2+(fp[3][0]-fp[0][0])*(fy+1)/2+fp[0][0],
            (fp[1][1]-fp[0][1])*(fx+1)/2+(fp[3][1]-fp[0][1])*(fy+1)/2+fp[0][1],
            (fp[1][2]-fp[0][2])*(fx+1)/2+(fp[3][2]-fp[0][2])*(fy+1)/2+fp[0][2]));
        ctx.lineTo(...rotate(
            (fp[1][0]-fp[0][0])*fx/2+(fp[3][0]-fp[0][0])*(fy+1)/2+fp[0][0],
            (fp[1][1]-fp[0][1])*fx/2+(fp[3][1]-fp[0][1])*(fy+1)/2+fp[0][1],
            (fp[1][2]-fp[0][2])*fx/2+(fp[3][2]-fp[0][2])*(fy+1)/2+fp[0][2]));
        ctx.closePath();

        if (A[i]>0) {
            const rgb = {
                "F": "8 250 8",
                "B": "8 8 250",
                "R": "250 8 8",
                "L": "250 128 8",
                "U": "255 255 255",
                "D": "250 250 0",
            }[cube.faces[i]];
            ctx.fillStyle = `rgb(${rgb} / ${A[i]}%)`;
        } else {
            ctx.fillStyle = "rgb(192 192 192 / 60%)";
        }
        ctx.fill();
        ctx.lineWidth = .5;
        ctx.stroke();
    }
}

const history = [];
let historyPosition = 0;

function generateScramble() {
    const cube = new Cube();
    cube.random();
    const solution = solve(cube);

    const scramble = [];
    for (let i=solution.length-1; i>=0; i--) {
        const move = solution[i];
        if (move.length==1) {
            scramble.push(move+"'");
        } else if (move[1]=="2") {
            scramble.push(move);
        } else {
            scramble.push(move[0]);
        }
    }
    return scramble.join(" ");
}

function update(scramble) {
    const cube = new Cube();

    for (const move of scramble.split(" ")) {
        if (move!="") {
            cube.move(move);
        }
    }
    render(document.getElementById("visual"), cube, "");

    let shortestLength = 99;
    let shortestColors = [];

    for (const color of ["D", "B", "L", "U", "F", "R"]) {
        const solution = solveFace(cube, color);

        const rotation = [];
        const solution2 = [];
        for (const move of solution.moves) {
            if (move[0]=="x" || move[0]=="y" || move[0]=="z") {
                rotation.push(move);
            } else {
                solution2.push(move);
            }
        }

        for (const move of rotation) {
            cube.move(move);
        }
        render(document.getElementById(`visual_${color}`), cube, color);
        for (const _ of rotation) {
            cube.undo();
        }

        document.getElementById(`rotation_${color}`).textContent = rotation.join(" ");
        document.getElementById(`solution_${color}`).textContent = solution2.join(" ");

        for (const type of ["solved", "diagonal", "adjacent"]) {
            document.getElementById(`${type}_${color}`).style.display = "none";
        }
        document.getElementById(`${solution.type}_${color}`).style.display = "inline-flex";

        if (solution2.length<shortestLength) {
            shortestLength = solution2.length;
            shortestColors = [];
        }
        if (solution2.length==shortestLength) {
            shortestColors.push(color);
        }
    }

    for (const color of ["D", "B", "L", "U", "F", "R"]) {
        document.getElementById(`box_${color}`).style.background = "#eee";
    }
    for (const color of shortestColors) {
        document.getElementById(`box_${color}`).style.removeProperty("background");
    }
}

document.addEventListener("DOMContentLoaded", () => {
    makeSolveTable();
    makeSolveFaceTable();

    const scramble = generateScramble();
    document.getElementById("scramble").value = scramble;
    history.push(scramble);
    update(history[historyPosition]);

    document.getElementById("scramble").addEventListener("input", () => {
        const scramble = document.getElementById("scramble").value.trim();
        if (scramble==history[historyPosition]) {
            return;
        }

        history.length = historyPosition+1;
        history.push(scramble);
        historyPosition++;

        document.getElementById("previous").removeAttribute("disabled");

        update(history[historyPosition]);
    });

    document.getElementById("scramble").addEventListener("focus", () => {
        document.getElementById("scramble").select();
    });

    document.getElementById("previous").addEventListener("click", () => {
        if (historyPosition==0) {
            return;
        }

        historyPosition--;
        document.getElementById("scramble").value = history[historyPosition];
        if (historyPosition==0) {
            document.getElementById("previous").setAttribute("disabled", "");
        }

        update(history[historyPosition]);
    });

    document.getElementById("next").addEventListener("click", () => {
        historyPosition++;
        while (history.length<=historyPosition) {
            history.push(generateScramble());
        }
        document.getElementById("scramble").value = history[historyPosition];
        document.getElementById("previous").removeAttribute("disabled");

        update(history[historyPosition]);
    });
});
