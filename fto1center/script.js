import FTO from "./fto.js";

function renderNet(canvas, fto) {
    const S = 20;

    const ctx = canvas.getContext("2d");
    const dpr = window.devicePixelRatio;
    canvas.width = 14*S*dpr;
    canvas.height = 7*S*dpr;
    ctx.scale(dpr, dpr);
    canvas.style.width = `${14*S}px`;
    canvas.style.height = `${7*S}px`;

    for (let f=0; f<8; f++) {
        for (let p=0; p<9; p++) {
            const P = [
                [[ 0,  0], [-1, -1], [ 1, -1]],
                [[ 1, -1], [ 0, -2], [ 2, -2]],
                [[ 0, -2], [ 1, -1], [-1, -1]],
                [[-1, -1], [-2, -2], [ 0, -2]],
                [[ 2, -2], [ 1, -3], [ 3, -3]],
                [[ 1, -3], [ 2, -2], [ 0, -2]],
                [[ 0, -2], [-1, -3], [ 1, -3]],
                [[-1, -3], [ 0, -2], [-2, -2]],
                [[-2, -2], [-3, -3], [-1, -3]],
            ][p];

            for (let i=0; i<3; i++) {
                P[i] = [
                    [ P[i][0],      P[i][1]-.25],
                    [-P[i][1]+.25,  P[i][0]   ],
                    [-P[i][0],     -P[i][1]+.25],
                    [ P[i][1]-.25, -P[i][0]   ],
                ][(f+(f/4|0)*2)%4];
                P[i][0] = (P[i][0]+(f/4|0)*7+3.5)*S;
                P[i][1] = (P[i][1]+3.5)*S;
            }

            ctx.beginPath();
            ctx.moveTo(P[0][0], P[0][1]);
            ctx.lineTo(P[1][0], P[1][1]);
            ctx.lineTo(P[2][0], P[2][1]);
            ctx.closePath();

            ctx.fillStyle = {
                "U": "#ffffff",
                "R": "#f80808",
                "F": "#08f808",
                "L": "#a008a0",
                "D": "#f8f808",
                "r": "#808080",
                "B": "#0808f8",
                "l": "#f88008",
            }[fto.faces[f*9+p]];
            ctx.fill();
            ctx.lineWidth = .5;
            ctx.stroke();
        }
    }
}

function render3D(canvas, fto) {
    const ctx = canvas.getContext("2d");
    const dpr = window.devicePixelRatio;
    canvas.width = 128*dpr;
    canvas.height = 128*dpr;
    ctx.scale(dpr, dpr);
    canvas.style.width = `${128}px`;
    canvas.style.height = `${128}px`;

    function rotate(x, y, z) {
        const th1 = 1.2;
        const x2 = x;
        const y2 = y*Math.cos(th1)-z*Math.sin(th1);
        const z2 = y*Math.sin(th1)+z*Math.cos(th1);

        const th2 = 0.35;
        const x3 = x2*Math.cos(th2)-z2*Math.sin(th2);
        const y3 = y2;
        const z3 = x2*Math.sin(th2)+z2*Math.cos(th2);

        const w = 55;
        const s = 0.2;
        const x4 = x3*(z3*s/2+1)*w+64;
        const y4 = -y3*(z3*s/2+1)*w+64;

        return [x4, y4];
    }

    for (const f of [4, 5, 6, 7, 0, 1, 2, 3]) { // D, BR, B, BL, U, R, F, L
        for (let p=0; p<9; p++) {
            const P = [
                [[ 0/3,  3/3,  0/3], [ 1/3,  2/3, -1/3], [-1/3,  2/3, -1/3]],
                [[ 1/3,  2/3, -1/3], [ 2/3,  1/3, -2/3], [ 0/3,  1/3, -2/3]],
                [[ 0/3,  1/3, -2/3], [-1/3,  2/3, -1/3], [ 1/3,  2/3, -1/3]],
                [[-1/3,  2/3, -1/3], [ 0/3,  1/3, -2/3], [-2/3,  1/3, -2/3]],
                [[ 2/3,  1/3, -2/3], [ 3/3,  0/3, -3/3], [ 1/3,  0/3, -3/3]],
                [[ 1/3,  0/3, -3/3], [ 0/3,  1/3, -2/3], [ 2/3,  1/3, -2/3]],
                [[ 0/3,  1/3, -2/3], [-1/3,  0/3, -3/3], [ 1/3,  0/3, -3/3]],
                [[-1/3,  0/3, -3/3], [-2/3,  1/3, -2/3], [ 0/3,  1/3, -2/3]],
                [[-2/3,  1/3, -2/3], [-1/3,  0/3, -3/3], [-3/3,  0/3, -3/3]],
            ][p];

            for (let i=0; i<3; i++) {
                P[i] = [
                    [ P[i][0],  P[i][1],  P[i][2]],
                    [-P[i][2],  P[i][1],  P[i][0]],
                    [-P[i][0],  P[i][1], -P[i][2]],
                    [ P[i][2],  P[i][1], -P[i][0]],
                    [-P[i][0], -P[i][1], -P[i][2]],
                    [ P[i][2], -P[i][1], -P[i][0]],
                    [ P[i][0], -P[i][1],  P[i][2]],
                    [-P[i][2], -P[i][1],  P[i][0]],
                ][f];
            }

            ctx.beginPath();
            ctx.moveTo(...rotate(...P[0]));
            ctx.lineTo(...rotate(...P[1]));
            ctx.lineTo(...rotate(...P[2]));
            ctx.closePath();

            ctx.fillStyle = {
                "U": "#ffffffc0",
                "R": "#f80808c0",
                "F": "#08f808c0",
                "L": "#a008a0c0",
                "D": "#f8f808c0",
                "r": "#404040c0",
                "B": "#0808f8c0",
                "l": "#f88008c0",
                ".": "#a0a0a0a0",
            }[fto.faces[f*9+p]];
            ctx.fill();
            ctx.lineWidth = .5;
            ctx.stroke();
        }
    }
}

function elem(id) {
    return document.getElementById(id);
}

const history = [];
let historyPosition = 0;

function generateScramble() {
    const scramble = [];
    for (let i=0; i<30; i++) {
        while (true) {
            const r = Math.random()*8|0;
            if (0<=r && r<8) {
                const move = ["U", "R", "F", "L", "D", "BR", "B", "BL"][r];
                if (scramble.length==0) {
                    scramble.push(move);
                    break;
                } else {
                    const last = scramble[scramble.length-1];
                    if (move!=last &&
                        (move!="U" || last!="D") &&
                        (move!="R" || last!="BR") &&
                        (move!="F" || last!="B") &&
                        (move!="L" || last!="BL")) {
                        scramble.push(move);
                        break;
                    }
                }
            }
        }
    }

    for (let i=0; i<scramble.length; i++) {
        if (Math.random()<.5) {
            scramble[i] += "'";
        }
    }

    return scramble.join(" ");
}

function getCenter(fto) {
    const P = [];
    for (const t of FTO.triangles) {
        if (fto.faces[t]=="U") {
            P.push(t);
        }
    }
    for (const e of [0, 1, 2]) {
        for (let i=0; i<FTO.edges.length; i++) {
            if (fto.faces[FTO.edges[i][0]]==FTO.initialFaces[FTO.edges[e][1]] &&
                fto.faces[FTO.edges[i][1]]==FTO.initialFaces[FTO.edges[e][0]]) {
                P.push(i);
            }
        }
    }
    return P.map(x => ""+x).join("_");
}

function setCenter(fto, center) {
    for (let f=0; f<72; f++) {
        fto.faces[f] = ".";
    }

    const P = center.split("_").map(x => +x);
    for (let i=0; i<3; i++) {
        fto.faces[P[i]] = "U";
    }
    for (let i=0; i<3; i++) {
        fto.faces[FTO.edges[P[i+3]][0]] = FTO.initialFaces[FTO.edges[i][1]];
        fto.faces[FTO.edges[P[i+3]][1]] = FTO.initialFaces[FTO.edges[i][0]];
    }
}

const HCenter = new Map();
const HCenterDepth = 4;
{
    const fto = new FTO();
    for (let f=0; f<72; f++) {
        fto.faces[f] = ".";
    }
    fto.faces[28] = "U";
    fto.faces[29] = "U";
    fto.faces[30] = "U";
    fto.faces[32] = "U";
    fto.faces[33] = "U";
    fto.faces[34] = "U";
    fto.faces[ 3] = "R";
    fto.faces[19] = "L";
    fto.faces[69] = "B";

    HCenter.set(getCenter(fto), 0);
    fto.move("L");
    HCenter.set(getCenter(fto), 0);
    fto.move("L");
    HCenter.set(getCenter(fto), 0);
    console.log(0, HCenter.size);

    for (let d=0; d<HCenterDepth; d++) {
        let n = 0;
        for (const center of HCenter.keys()) {
            if (HCenter.get(center)==d) {
                setCenter(fto, center);
                for (const move of [
                    "U", "U'", "R", "R'", "F", "F'", "L", "L'",
                    "D", "D'", "BR", "BR'", "B", "B'", "BL", "BL'",
                ]) {
                    fto.move(move);

                    const center2 = getCenter(fto);
                    if (!HCenter.has(center2)) {
                        HCenter.set(center2, d+1);
                        n++;
                    }
                    fto.undo();
                }
            }
        }
        console.log(d+1, n);
    }
}

function solve(fto) {
    let rotations1;
    {
        for (let f=0; f<72; f++) {
            if (fto.faces[f]=="U") {
                if ((f/9|0)==0 || (f/9|0)==2 || (f/9|0)==5 || (f/9|0)==7) {
                    rotations1 = [
                        ["T'"],
                        ["T"],
                        ["T", "Lo"],
                        ["T", "Ro'"],
                    ];
                } else {
                    rotations1 = [
                        [],
                        ["Ro"],
                        ["Ro'"],
                        ["L"],
                    ];
                }
                break;
            }
        }
    }

    let solution = [];
    let moves = [];
    let n = 0;
    function search(depth, maxDepth, lastMove) {
        n++;
        if (depth==maxDepth) {
            if (HCenter.get(getCenter(fto))==0) {
                solution = [...moves];
                return true;
            }
            return false;
        }

        for (const move of [
            "U", "U'", "R", "R'", "F", "F'", "L", "L'",
            "D", "D'", "BR", "BR'", "B", "B'", "BL", "BL'",
        ]) {
            const moveF = move.replace("'", "");
            const lastMoveF = lastMove.replace("'", "")
            if (moveF==lastMoveF ||
                moveF=="BR" && lastMoveF=="L" ||
                moveF=="BL" && lastMoveF=="R" ||
                moveF=="D" && lastMoveF=="U" ||
                moveF=="F" && lastMoveF=="B" ||
                depth+1==maxDepth && moveF!="U") {
                continue;
            }

            let h = HCenter.get(getCenter(fto));
            if (h===undefined) {
                h = HCenterDepth+1;
            }
            if (depth+h>maxDepth) {
                return false;
            }

            fto.move(move);
            moves.push(move);

            const result = search(depth+1, maxDepth, move);

            fto.undo();
            moves.pop();

            if (result) {
                return true;
            }
        }

        return false;
    }

    (function () {
        for (let maxDepth=0; ; maxDepth++) {
            n = 0;
            for (const rotation1 of rotations1) {
                for (const rotation2 of [[], ["Uo"], ["Uo'"]]) {
                    for (const move of [...rotation1, ...rotation2]) {
                        fto.move(move);
                        moves.push(move);
                    }

                    const result = search(0, maxDepth, "");

                    for (const _ of [...rotation1, ...rotation2]) {
                        fto.undo();
                        moves.pop();
                    }

                    if (result) {
                        return;
                    }
                }
            }
            //console.log(maxDepth, n);
        }
    })();

    return solution;
}

function update(scramble) {
    const fto = new FTO();
    for (const move of scramble.split(" ")) {
        if (move!="") {
            fto.move(move);
        }
    }
    renderNet(elem("visual"), fto);

    for (const color of ["U", "R", "F", "L", "D", "r", "B", "l"]) {
        const facesOld = [...fto.faces];

        for (let f=0; f<72; f++) {
            fto.faces[f] = {
                "U": {"U": "U", "R": "R", "F": "F", "L": "L", "D": "D", "r": "r", "B": "B", "l": "l"},
                "R": {"U": "L", "R": "U", "F": "R", "L": "F", "D": "r", "r": "B", "B": "l", "l": "D"},
                "F": {"U": "F", "R": "L", "F": "U", "L": "R", "D": "B", "r": "l", "B": "D", "l": "r"},
                "L": {"U": "R", "R": "F", "F": "L", "L": "U", "D": "l", "r": "D", "B": "r", "l": "B"},
                "D": {"U": "D", "R": "r", "F": "B", "L": "l", "D": "U", "r": "R", "B": "F", "l": "L"},
                "r": {"U": "r", "R": "B", "F": "l", "L": "D", "D": "L", "r": "U", "B": "R", "l": "F"},
                "B": {"U": "B", "R": "l", "F": "D", "L": "r", "D": "F", "r": "L", "B": "U", "l": "R"},
                "l": {"U": "l", "R": "D", "F": "r", "L": "B", "D": "R", "r": "F", "B": "L", "l": "U"},
            }[color][fto.faces[f]];
        }

        const solution = solve(fto);

        fto.faces = [...facesOld];

        const rotation = [];
        const solution2 = [];
        for (const move of solution) {
            if (move.includes("T") || move.includes("o")) {
                rotation.push(move);
            } else {
                solution2.push(move);
            }
        }

        for (const move of rotation) {
            fto.move(move);
        }

        for (const triangle of FTO.triangles) {
            if (fto.faces[triangle]!=color) {
                fto.faces[triangle] = ".";
            }
        }
        for (const edge of FTO.edges) {
            if (fto.faces[edge[0]]!=color &&
                fto.faces[edge[1]]!=color) {
                fto.faces[edge[0]] = ".";
                fto.faces[edge[1]] = ".";
            }
        }
        for (const corner of FTO.corners) {
            for (const f of corner) {
                fto.faces[f] = ".";
            }
        }

        render3D(elem(`visual_${color}`), fto);

        elem(`rotation_${color}`).textContent = rotation.join(" ");
        elem(`solution_${color}`).textContent = solution2.join(" ");
        elem(`steps_${color}`).textContent = `(${solution2.length})`;

        fto.faces = [...facesOld];
    }
}

function initialize() {
    const scramble = generateScramble();
    document.getElementById("scramble").value = scramble;
    history.push(scramble);
    update(history[historyPosition]);
}
initialize();

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
