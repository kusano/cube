// Refs.
// https://github.com/cs0x7f/cstimer/blob/13babe21f46ac3e4a8eb9dc3486f867bb92c955a/src/js/solver/ftocta.js
// https://github.com/thewca/tnoodle-lib/pull/52

import FTO from "./fto.js";

// Solve D center.
function solvePhase1(fto) {
    const allowedMoves = [
        "U", "U'",
        "R", "R'",
        "F", "F'",
        "L", "L'",
        "D", "D'",
        "BR", "BR'",
        "B", "B'",
        "BL", "BL'",
    ];

    function getCenter(fto) {
        const D = [];
        for (let f=0; f<72; f+=9) {
            for (const p of [1, 2, 3, 5, 6, 7]) {
                if (fto.faces[f+p]=="D") {
                    D.push(f+p);
                }
            }
        }
        return D.map(x=>""+x).join("_");
    }

    function setCenter(fto, D) {
        for (let f=0; f<72; f+=9) {
            for (const p of [1, 2, 3, 5, 6, 7]) {
                fto.faces[f+p] = ".";
            }
        }
        for (const p of D.split("_").map(x=>+x)) {
            fto.faces[p] = "D";
        }
    }

    const HCenterDepth = 4;
    const HCenter = new Map();
    {
        const fto = new FTO();
        HCenter.set(getCenter(fto), 0);

        for (let d=0; d<HCenterDepth; d++) {
            let n = 0;
            for (const center of HCenter.keys()) {
                if (HCenter.get(center)==d) {
                    setCenter(fto, center);
                    for (const move of allowedMoves) {
                        fto.move(move);
                        const center2 = getCenter(fto);
                        fto.undo();
                        if (!HCenter.has(center2)) {
                            HCenter.set(center2, d+1);
                            n++;
                        }
                    }
                }
            }
            console.log(d+1, n);
            if (n==0) {
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
            if (fto.faces[37]=="D" &&
                fto.faces[38]=="D" &&
                fto.faces[39]=="D" &&
                fto.faces[41]=="D" &&
                fto.faces[42]=="D" &&
                fto.faces[43]=="D" &&
                (fto.faces[48]=="r" && fto.faces[64]=="l" && fto.faces[24]=="F" ||
                 fto.faces[48]=="F" && fto.faces[64]=="r" && fto.faces[24]=="l" ||
                 fto.faces[48]=="l" && fto.faces[64]=="F" && fto.faces[24]=="r")) {
                solution = [...moves];
                return true;
            }
            return false;
        }

        for (const move of allowedMoves) {
            const moveF = move.replace("'", "");
            const lastMoveF = lastMove.replace("'", "")
            if (moveF==lastMoveF ||
                depth+1==maxDepth && (move=="U" || move=="R" || move=="L" || move=="D" || move=="B") ||
                moveF=="L" && lastMoveF=="BR" ||
                moveF=="R" && lastMoveF=="BL" ||
                moveF=="U" && lastMoveF=="D" ||
                moveF=="B" && lastMoveF=="F") {
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

    for (let maxDepth=0; ; maxDepth++) {
        n = 0;
        const result = search(0, maxDepth, "");
        console.log(maxDepth, n);
        if (result) {
            return solution;
        }
    }
}

// Solve R, L and B centers.
// U, F, BL, BR triangles are paired with corners.
function solvePhase2(fto) {
    const allowedMoves = [
        "U", "U'",
        "R", "R'",
        "L", "L'",
        "D", "D'",
        "B", "B'",
    ];

    function getCenters(fto) {
        return [
            10, 11, 12, 14, 15, 16,
            28, 29, 30, 32, 33, 34,
            55, 56, 57, 59, 60, 61,
        ].map(f => fto.faces[f]).join("");
    }

    function setCenters(fto, C) {
        for (let i=0; i<18; i++) {
            fto.faces[[
                10, 11, 12, 14, 15, 16,
                28, 29, 30, 32, 33, 34,
                55, 56, 57, 59, 60, 61,
            ][i]] = C[i];
        }
    }

    function getTriple(fto, c) {
        const T = [];
        for (const f of [0, 18, 45, 63]) {
            for (const p of [0, 2, 4, 5, 8, 7]) {
                if (fto.faces[f+p]==c) {
                    T.push(f+p);
                }
            }
        }
        return T.map(x => ""+x).join("_");
    }

    function setTriple(fto, T, c) {
        for (let i=0; i<72; i++) {
            fto.faces[i] = ".";
        }
        for (const p of T.split("_").map(x => +x)) {
            fto.faces[p] = c;
        }
    }

    const HDepth = 10;
    const HCenter = new Map();
    {
        const fto = new FTO();
        HCenter.set(getCenters(fto), 0);

        for (let d=0; d<HDepth; d++) {
            let n = 0;
            for (const center of HCenter.keys()) {
                if (HCenter.get(center)==d) {
                    setCenters(fto, center);
                    for (const move of allowedMoves) {
                        fto.move(move);
                        const center2 = getCenters(fto);
                        fto.undo();
                        if (!HCenter.has(center2)) {
                            HCenter.set(center2, d+1);
                            n++;
                        }
                    }
                }
            }
            console.log(d+1, n);
            if (n==0) {
                break;
            }
        }
    }

    const HTriple = new Map();
    {
        const fto = new FTO();
        HTriple.set(getTriple(fto, "U"), 0);
        while (true) {
            let update = false;
            for (const triangles of HTriple.keys()) {
                setTriple(fto, triangles, "U");
                for (const move of [
                    "R", "R'",
                    "L", "L'",
                    "D", "D'",
                    "B", "B'",
                ]) {
                    fto.move(move);
                    const triple2 = getTriple(fto, "U");
                    fto.undo();
                    if (!HTriple.has(triple2)) {
                        HTriple.set(triple2, 0);
                        update = true;
                    }
                }
            }
            if (!update) {
                break;
            }
        }
        console.log(0, HTriple.size);

        for (let d=0; ; d++) {
            let n = 0;
            for (const triple of HTriple.keys()) {
                if (HTriple.get(triple)==d) {
                    setTriple(fto, triple, "U");
                    for (const move of allowedMoves) {
                        fto.move(move);
                        const triple2 = getTriple(fto, "U");
                        fto.undo();
                        if (!HTriple.has(triple2)) {
                            HTriple.set(triple2, d+1);
                            n++;
                        }
                    }
                }
            }
            console.log(d+1, n);
            if (n==0) {
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
            if (fto.faces[10]=="R" &&
                fto.faces[11]=="R" &&
                fto.faces[12]=="R" &&
                fto.faces[14]=="R" &&
                fto.faces[15]=="R" &&
                fto.faces[16]=="R" &&
                (fto.faces[ 1]=="U" && fto.faces[51]=="r" && fto.faces[21]=="F" ||
                 fto.faces[ 1]=="F" && fto.faces[51]=="U" && fto.faces[21]=="r" ||
                 fto.faces[ 1]=="r" && fto.faces[51]=="F" && fto.faces[21]=="U") &&
                fto.faces[28]=="L" &&
                fto.faces[29]=="L" &&
                fto.faces[30]=="L" &&
                fto.faces[32]=="L" &&
                fto.faces[33]=="L" &&
                fto.faces[34]=="L" &&
                (fto.faces[ 3]=="U" && fto.faces[19]=="F" && fto.faces[69]=="l" ||
                 fto.faces[ 3]=="l" && fto.faces[19]=="U" && fto.faces[69]=="F" ||
                 fto.faces[ 3]=="F" && fto.faces[19]=="l" && fto.faces[69]=="U") &&
                fto.faces[55]=="B" &&
                fto.faces[56]=="B" &&
                fto.faces[57]=="B" &&
                fto.faces[59]=="B" &&
                fto.faces[60]=="B" &&
                fto.faces[61]=="B" &&
                (fto.faces[66]=="l" && fto.faces[46]=="r" && fto.faces[ 6]=="U" ||
                 fto.faces[66]=="U" && fto.faces[46]=="l" && fto.faces[ 6]=="r" ||
                 fto.faces[66]=="r" && fto.faces[46]=="U" && fto.faces[ 6]=="l") &&
                fto.faces[ 0]==fto.faces[ 2] && fto.faces[ 4]==fto.faces[ 5] && fto.faces[ 8]==fto.faces[ 7] && 
                fto.faces[18]==fto.faces[20] && fto.faces[22]==fto.faces[23] && fto.faces[26]==fto.faces[25] && 
                fto.faces[45]==fto.faces[47] && fto.faces[49]==fto.faces[50] && fto.faces[53]==fto.faces[52] && 
                fto.faces[63]==fto.faces[65] && fto.faces[67]==fto.faces[68] && fto.faces[71]==fto.faces[70]) {
                solution = [...moves];
                return true;
            }
            return false;
        }

        let h1 = HCenter.get(getCenters(fto));
        if (h1===undefined) {
            h1 = HDepth+1;
        }
        let h2 = Math.max(
            HTriple.get(getTriple(fto, "U")),
            HTriple.get(getTriple(fto, "F")),
            HTriple.get(getTriple(fto, "r")),
            HTriple.get(getTriple(fto, "l")),
        );

        if (depth+Math.max(h1, h2)>maxDepth) {
            return false;
        }

        for (const move of allowedMoves) {
            if (move.replace("'", "")==lastMove.replace("'", "") ||
                move[0]=="D" && lastMove[0]=="U") {
                continue;
            }
            if (depth==maxDepth-1 && move!="U" && move!="U'") {
                continue;
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

    for (let maxDepth=0; ; maxDepth++) {
        n = 0;
        const result = search(0, maxDepth, "");
        console.log(maxDepth, n);
        if (result) {
            return solution;
        }
    }
}

function solvePhase3(fto) {
    const allowedMoves = [
        "R", "R'",
        "L", "L'",
        "D", "D'",
        "B", "B'",
    ];

    const HDepth = 6;
    const H = new Map();
    {
        const fto = new FTO();
        H.set(fto.faces.join(""), 0);

        for (let d=0; d<HDepth; d++) {
            let n = 0;
            for (const faces of H.keys()) {
                if (H.get(faces)==d) {
                    fto.faces = faces.split("");
                    for (const move of allowedMoves) {
                        fto.move(move);
                        const faces2 = fto.faces.join("");
                        fto.undo();
                        if (!H.has(faces2)) {
                            H.set(faces2, d+1);
                            n++;
                        }
                    }
                }
            }
            console.log(d+1, n);
            if (n==0) {
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
            if (fto.faces.join()==FTO.initialFaces.join()) {
                solution = [...moves];
                return true;
            }
            return false;
        }

        let h = H.get(fto.faces.join(""));
        if (h===undefined) {
            h = HDepth+1;
        }

        if (depth+h>maxDepth) {
             return false;
        }

        for (const move of allowedMoves) {
            if (move.replace("'", "")==lastMove.replace("'", "")) {
                continue;
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

    for (let maxDepth=0; ; maxDepth++) {
        n = 0;
        const result = search(0, maxDepth, "");
        console.log(maxDepth, n);
        if (result) {
            return solution;
        }
    }
}

function solve(fto) {
    const solution1 = solvePhase1(fto);
    for (const move of solution1) {
        fto.move(move);
    }

    const solution2 = solvePhase2(fto);
    for (const move of solution2) {
        fto.move(move);
    }

    const solution3 = solvePhase3(fto);

    return [...solution1, ...solution2, ...solution3]
}

const fto = new FTO();

for (const move of "D' B D R B' R B L' BL' L D' R' BL' D R' B BL B' BL L BL L' F D BL' B D' L'".split(" ")) {
//for (const move of "D' R' D L B' D B BL D' BL' L R B' BL L' BL L' BL F L' D BR' F L' U".split(" ")) {
//for (const move of "D' B' L' D' L' D' R' L' F D' L F D F' D' L F' D' B R' D' U' L' BL F BR U' F'".split(" ")) {
    fto.move(move);
}
console.log(fto.toString());

const solution = solve(fto);
console.log(solution.join(" "));
