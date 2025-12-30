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

function render(canvas, cube, transparent) {
    const ctx = canvas.getContext("2d");
    const dpr = window.devicePixelRatio;
    canvas.width = 128*dpr;
    canvas.height = 128*dpr;
    ctx.scale(dpr, dpr);
    canvas.style.width = `${128}px`;
    canvas.style.height = `${128}px`;

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
    for (let f of [36, 9, 45, 18, 27, 0]) {
        for (let i=0; i<9; i++) {
            I.push(f+i);
        }
    }

    for (let i of I) {
        const fp = FP[i/9|0];
        const fx = i%9%3;
        const fy = i%9/3|0;

        ctx.beginPath();
        ctx.moveTo(...rotate(
            (fp[1][0]-fp[0][0])*fx/3+(fp[3][0]-fp[0][0])*fy/3+fp[0][0],
            (fp[1][1]-fp[0][1])*fx/3+(fp[3][1]-fp[0][1])*fy/3+fp[0][1],
            (fp[1][2]-fp[0][2])*fx/3+(fp[3][2]-fp[0][2])*fy/3+fp[0][2]));
        ctx.lineTo(...rotate(
            (fp[1][0]-fp[0][0])*(fx+1)/3+(fp[3][0]-fp[0][0])*fy/3+fp[0][0],
            (fp[1][1]-fp[0][1])*(fx+1)/3+(fp[3][1]-fp[0][1])*fy/3+fp[0][1],
            (fp[1][2]-fp[0][2])*(fx+1)/3+(fp[3][2]-fp[0][2])*fy/3+fp[0][2]));
        ctx.lineTo(...rotate(
            (fp[1][0]-fp[0][0])*(fx+1)/3+(fp[3][0]-fp[0][0])*(fy+1)/3+fp[0][0],
            (fp[1][1]-fp[0][1])*(fx+1)/3+(fp[3][1]-fp[0][1])*(fy+1)/3+fp[0][1],
            (fp[1][2]-fp[0][2])*(fx+1)/3+(fp[3][2]-fp[0][2])*(fy+1)/3+fp[0][2]));
        ctx.lineTo(...rotate(
            (fp[1][0]-fp[0][0])*fx/3+(fp[3][0]-fp[0][0])*(fy+1)/3+fp[0][0],
            (fp[1][1]-fp[0][1])*fx/3+(fp[3][1]-fp[0][1])*(fy+1)/3+fp[0][1],
            (fp[1][2]-fp[0][2])*fx/3+(fp[3][2]-fp[0][2])*(fy+1)/3+fp[0][2]));
        ctx.closePath();

        if (cube.faces[i]!=".") {
            const rgb = {
                "F": "8 250 8",
                "B": "8 8 250",
                "R": "250 8 8",
                "L": "250 128 8",
                "U": "255 255 255",
                "D": "250 250 0",
            }[cube.faces[i]];
            ctx.fillStyle = `rgb(${rgb} / ${transparent?90:100}%)`;
        } else {
            ctx.fillStyle = "rgb(192 192 192 / 60%)";
        }
        ctx.fill();
        ctx.lineWidth = .5;
        ctx.stroke();
    }
}

function elem(id) {
    return document.getElementById(id);
}

const history = [];
let historyPosition = -1;

let worker;

function nextScramble() {
    elem("scramble").setAttribute("disabled", "");
    elem("next").setAttribute("disabled", "");
    elem("next").classList.add("is-loading");

    if (worker) {
        worker.terminate();
        worker = undefined;
    }

    worker = new Worker("scramble.js");
    worker.addEventListener("message", e => {
        const scramble = e.data;

        worker.terminate();
        worker = undefined;

        elem("scramble").removeAttribute("disabled");
        elem("next").removeAttribute("disabled");
        elem("next").classList.remove("is-loading");

        history.push(scramble);
        historyPosition++;
        elem("scramble").value = scramble;

        update();
    });
}
nextScramble();

function update() {
    const scramble = [];
    for (let move of elem("scramble").value.split(" ")) {
        if (move.match(/^((F|B|R|L|U|D)w?|S|M|E|x|y|z)('|2)?$/)) {
            scramble.push(move);
        }
    }

    const cube = new Cube();
    for (const move of scramble) {
        cube.move(move);
    }
    render(elem("visual"), cube, false);

    // TODO: clear

    if (worker) {
        worker.terminate();
        worker = undefined;
    }

    worker = new Worker("solve_fb.js");

    // TODO
    const moves = [];
    for (let m of ["U", "R", "L", "Rw", "D", "F"]) {
        for (let m2 of ["", "2", "'"]) {
            moves.push(m+m2);
        }
    }

    worker.postMessage({
        scramble,
        moves,
    });

    worker.addEventListener("message", e => {
        if (e.data.type=="solution") {
            const ld = e.data.ld;
            const rotation = [];
            const solution = [];
            for (const move of e.data.solution) {
                if (move[0]=="x" || move[0]=="y" || move[0]=="z") {
                    rotation.push(move);
                } else {
                    solution.push(move);
                }
            }

            const cube2 = new Cube();
            for (const move of scramble) {
                cube2.move(move);
            }
            for (const move of rotation) {
                cube2.move(move);
            }
            for (const move of solution) {
                cube2.move(move);
            }
            // FB以外を消す。
            const fb = new Set([12, 13, 14, 15, 16, 17, 21, 24, 41, 44, 45, 48, 51]);
            for (let i=0; i<54; i++) {
                if (!fb.has(i)) {
                    cube2.faces[i] = ".";
                }
            }
            // 持ち替え前まで戻す。
            for (const _ of solution) {
                cube2.undo();
            }

            render(elem(`visual_${ld}`), cube2, true);

            elem(`rotation_${ld}`).textContent = rotation.join(" ");
            elem(`solution_${ld}`).textContent = solution.join(" ");
        }
        if (e.data.type=="end") {
            worker.terminate();
            worker = undefined;
        }
    })
}
/*
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
*/

/*
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
*/