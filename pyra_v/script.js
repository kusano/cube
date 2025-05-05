class Pyra {
    /*
 0  1  2  3  4    9   18 19 20 21 22
    5  6  7   10 11 12   23 24 25
       8   13 14 15 16 17   26

           27 28 29 30 31
              32 33 34
                 35
    */
    constructor() {
        this.F = "LLLLLLLLLFFFFFFFFFRRRRRRRRRDDDDDDDDD".split("");
        this.Ftmp = Array(36);
        this.history = [];
    }

    toString() {
        const F = this.F;
        return `${F[ 0]}${F[ 1]}${F[ 2]}${F[ 3]}${F[ 4]} ${F[ 9]} ${F[18]}${F[19]}${F[20]}${F[21]}${F[22]}
 ${F[ 5]}${F[ 6]}${F[ 7]} ${F[10]}${F[11]}${F[12]} ${F[23]}${F[24]}${F[25]}
  ${F[ 8]} ${F[13]}${F[14]}${F[15]}${F[16]}${F[17]} ${F[26]}
    ${F[27]}${F[28]}${F[29]}${F[30]}${F[31]}
     ${F[32]}${F[33]}${F[34]}
      ${F[35]}`;
    }

    static makeMoveTable() {
        const T = Array(36);

        function rotate(x, y, z) {
            const t = T[z];
            T[z] = T[y];
            T[y] = T[x];
            T[x] = t;
        }

        function R0() {
            rotate(17, 26, 31);
        }

        function R1() {
            rotate(12, 25, 29);
            rotate(16, 24, 30);
            rotate(15, 23, 34);
        }

        function R2() {
            rotate( 9, 22, 27);
            rotate(11, 21, 28);
            rotate(10, 20, 32);
            rotate(14, 19, 33);
            rotate(13, 18, 35);

            rotate( 0,  8,  4);
            rotate( 5,  7,  2);
            rotate( 1,  6,  3);
        }

        function L0() {
            rotate( 8, 13, 27);
        }

        function L1() {
            rotate( 5, 10, 29);
            rotate( 6, 14, 28);
            rotate( 7, 15, 32);
        }

        function L2() {
            rotate( 0,  9, 31);
            rotate( 1, 11, 30);
            rotate( 2, 12, 34);
            rotate( 3, 16, 33);
            rotate( 4, 17, 35);

            rotate(18, 26, 22);
            rotate(23, 25, 20);
            rotate(19, 24, 21);
        }

        function U0() {
            rotate( 4, 18, 9);
        }

        function U1() {
            rotate( 2, 23, 10);
            rotate( 3, 19, 11);
            rotate( 7, 20, 12);
        }

        function U2() {
            rotate( 0, 26, 13);
            rotate( 1, 24, 14);
            rotate( 5, 25, 15);
            rotate( 6, 21, 16);
            rotate( 8, 22, 17);

            rotate(27, 35, 31);
            rotate(32, 34, 29);
            rotate(28, 33, 30);
        }

        function B0() {
            rotate( 0, 35, 22);
        }

        function B1() {
            rotate( 5, 34, 20);
            rotate( 1, 33, 21);
            rotate( 2, 32, 25);
        }

        function B2() {
            rotate( 8, 31, 18);
            rotate( 6, 30, 19);
            rotate( 7, 29, 23);
            rotate( 3, 28, 24);
            rotate( 4, 27, 26);

            rotate( 9, 13, 17);
            rotate(10, 15, 12);
            rotate(11, 14, 16);
        }

        function init() {
            for (let i=0; i<36; i++) {
                T[i] = i;
            }
        }

        const moveTable = {};

        init();
        R0();
        moveTable["r"] = [...T];
        R1();
        moveTable["R"] = [...T];
        R2();
        moveTable["Rw"] = [...T];

        init();
        L0();
        moveTable["l"] = [...T];
        L1();
        moveTable["L"] = [...T];
        L2();
        moveTable["Lw"] = [...T];

        init();
        U0();
        moveTable["u"] = [...T];
        U1();
        moveTable["U"] = [...T];
        U2();
        moveTable["Uw"] = [...T];

        init();
        B0();
        moveTable["b"] = [...T];
        B1();
        moveTable["B"] = [...T];
        B2();
        moveTable["Bw"] = [...T];

        const M = [];
        for (let m in moveTable) {
            M.push(m);
        }

        for (let m of M) {
            const T2 = [];
            for (let i=0; i<36; i++) {
                T2.push(moveTable[m][moveTable[m][i]]);
            }
            moveTable[m+"'"] = T2;
        }

        return moveTable;
    }

    static moveTable = {
        "r":   [ 0,  1,  2,  3,  4,  5,  6,  7,  8,  9, 10, 11, 12, 13, 14, 15, 16, 31, 18, 19, 20, 21, 22, 23, 24, 25, 17, 27, 28, 29, 30, 26, 32, 33, 34, 35],
        "R":   [ 0,  1,  2,  3,  4,  5,  6,  7,  8,  9, 10, 11, 29, 13, 14, 34, 30, 31, 18, 19, 20, 21, 22, 15, 16, 12, 17, 27, 28, 25, 24, 26, 32, 33, 23, 35],
        "Rw":  [ 4,  3,  7,  6,  8,  2,  1,  5,  0, 27, 32, 28, 29, 35, 33, 34, 30, 31, 13, 14, 10, 11,  9, 15, 16, 12, 17, 22, 21, 25, 24, 26, 20, 19, 23, 18],
        "l":   [ 0,  1,  2,  3,  4,  5,  6,  7, 27,  9, 10, 11, 12,  8, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 13, 28, 29, 30, 31, 32, 33, 34, 35],
        "L":   [ 0,  1,  2,  3,  4, 29, 28, 32, 27,  9,  5, 11, 12,  8,  6,  7, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 13, 14, 10, 30, 31, 15, 33, 34, 35],
        "Lw":  [31, 30, 34, 33, 35, 29, 28, 32, 27,  0,  5,  1,  2,  8,  6,  7,  3,  4, 22, 21, 25, 24, 26, 20, 19, 23, 18, 13, 14, 10, 11,  9, 15, 16, 12, 17],
        "u":   [ 0,  1,  2,  3,  9,  5,  6,  7,  8, 18, 10, 11, 12, 13, 14, 15, 16, 17,  4, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35],
        "U":   [ 0,  1, 10, 11,  9,  5,  6, 12,  8, 18, 23, 19, 20, 13, 14, 15, 16, 17,  4,  3,  7, 21, 22,  2, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35],
        "Uw":  [13, 14, 10, 11,  9, 15, 16, 12, 17, 18, 23, 19, 20, 26, 24, 25, 21, 22,  4,  3,  7,  6,  8,  2,  1,  5,  0, 31, 30, 34, 33, 35, 29, 28, 32, 27],
        "b":   [22,  1,  2,  3,  4,  5,  6,  7,  8,  9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 35, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34,  0],
        "B":   [22, 21, 25,  3,  4, 20,  6,  7,  8,  9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 34, 33, 35, 23, 24, 32, 26, 27, 28, 29, 30, 31,  2,  1,  5,  0],
        "Bw":  [22, 21, 25, 24, 26, 20, 19, 23, 18, 17, 12, 16, 15,  9, 11, 10, 14, 13, 31, 30, 34, 33, 35, 29, 28, 32, 27,  4,  3,  7,  6,  8,  2,  1,  5,  0],
        "r'":  [ 0,  1,  2,  3,  4,  5,  6,  7,  8,  9, 10, 11, 12, 13, 14, 15, 16, 26, 18, 19, 20, 21, 22, 23, 24, 25, 31, 27, 28, 29, 30, 17, 32, 33, 34, 35],
        "R'":  [ 0,  1,  2,  3,  4,  5,  6,  7,  8,  9, 10, 11, 25, 13, 14, 23, 24, 26, 18, 19, 20, 21, 22, 34, 30, 29, 31, 27, 28, 12, 16, 17, 32, 33, 15, 35],
        "Rw'": [ 8,  6,  5,  1,  0,  7,  3,  2,  4, 22, 20, 21, 25, 18, 19, 23, 24, 26, 35, 33, 32, 28, 27, 34, 30, 29, 31,  9, 11, 12, 16, 17, 10, 14, 15, 13],
        "l'":  [ 0,  1,  2,  3,  4,  5,  6,  7, 13,  9, 10, 11, 12, 27, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26,  8, 28, 29, 30, 31, 32, 33, 34, 35],
        "L'":  [ 0,  1,  2,  3,  4, 10, 14, 15, 13,  9, 29, 11, 12, 27, 28, 32, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 8,  6,  5, 30, 31,  7, 33, 34, 35],
        "Lw'": [ 9, 11, 12, 16, 17, 10, 14, 15, 13, 31, 29, 30, 34, 27, 28, 32, 33, 35, 26, 24, 23, 19, 18, 25, 21, 20, 22, 8,  6,  5,  1,  0,  7,  3,  2,  4],
        "u'":  [ 0,  1,  2,  3, 18,  5,  6,  7,  8,  4, 10, 11, 12, 13, 14, 15, 16, 17,  9, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35],
        "U'":  [ 0,  1, 23, 19, 18,  5,  6, 20,  8,  4,  2,  3,  7, 13, 14, 15, 16, 17,  9, 11, 12, 21, 22, 10, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35],
        "Uw'": [26, 24, 23, 19, 18, 25, 21, 20, 22,  4,  2,  3,  7,  0,  1,  5,  6,  8,  9, 11, 12, 16, 17, 10, 14, 15, 13, 35, 33, 32, 28, 27, 34, 30, 29, 31],
        "b'":  [35,  1,  2,  3,  4,  5,  6,  7,  8,  9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21,  0, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 22],
        "B'":  [35, 33, 32,  3,  4, 34,  6,  7,  8,  9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19,  5,  1,  0, 23, 24,  2, 26, 27, 28, 29, 30, 31, 25, 21, 20, 22],
        "Bw'": [35, 33, 32, 28, 27, 34, 30, 29, 31, 13, 15, 14, 10, 17, 16, 12, 11,  9,  8,  6,  5,  1,  0,  7,  3,  2,  4, 26, 24, 23, 19, 18, 25, 21, 20, 22]
    };

    move(m) {
        for (let i=0; i<36; i++) {
            this.Ftmp[i] = this.F[i];
        }
        for (let i=0; i<36; i++) {
            this.F[i] = this.Ftmp[Pyra.moveTable[m][i]];
        }

        this.history.push(m);
    }

    undo() {
        let m = this.history.pop();
        if (m.length==1) {
            m += "'";
        } else {
            m = m[0];
        }

        for (let i=0; i<36; i++) {
            this.Ftmp[i] = this.F[i];
        }
        for (let i=0; i<36; i++) {
            this.F[i] = this.Ftmp[Pyra.moveTable[m][i]];
        }
    }

    // 頂点以外の添え字。
    static withoutCorner = [
         1,  2,  3,  5,  6,  7,
        10, 11, 12, 14, 15, 16,
        19, 20, 21, 23, 24, 25,
        28, 29, 30, 32, 33, 34,
    ];

    // 頂点以外を抽出して文字列にする。
    extract() {
        let s = "";
        for (let i of Pyra.withoutCorner) {
            s += this.F[i];
        }
        return s;
    }

    unextract(s) {
        for (let i=0; i<24; i++) {
            this.F[Pyra.withoutCorner[i]] = s[i];
        }
    }

    // 頂点以外について、各ステッカーが f かどうかを抽出して文字列にする。
    extractF(f) {
        let s = "";
        for (let i of Pyra.withoutCorner) {
            s += this.F[i]==f?"o":"x";
        }
        return s;
    }

    unextractF(f, s) {
        for (let i=0; i<24; i++) {
            this.F[Pyra.withoutCorner[i]] = s[i]=="o"?f:".";
        }
    }
};

const solveTable = new Map();
const solveTableDepth = 5;
{
    const pyra = new Pyra();

    solveTable.set(pyra.extract(), 0);

    let P = [];
    P.push(pyra.extract());

    for (let d=0; d<solveTableDepth; d++) {
        const P2 = [];

        for (let p of P) {
            pyra.unextract(p);
            for (let m of ["R", "R'", "L", "L'", "U", "U'", "B", "B'"]) {
                pyra.move(m);
                const p2 = pyra.extract();
                if (!solveTable.has(p2)) {
                    solveTable.set(p2, d+1);
                    P2.push(p2);
                }
                pyra.undo();
            }
        }

        P = P2;
    }

    console.log("solveTable", solveTable.size);
}

const vTable = new Map();
const vTableDepth = 99;
{
    const pyra = new Pyra();

    let P = [];
    for (let l of [2, 7, 10, 12, 23, 20, 15, 29]) {
        for (let i=0; i<36; i++) {
            if (i==28 || i==30 || i==32 || i==33 || i==34 || i==l) {
                pyra.F[i] = "D";
            } else {
                pyra.F[i] = "F";
            }
        }

        vTable.set(pyra.extractF("D"), 0);
        P.push(pyra.extractF("D"));
    }

    for (let d=0; d<vTableDepth; d++) {
        const P2 = [];

        for (let p of P) {
            pyra.unextractF("D", p);
            for (let m of ["R", "R'", "L", "L'", "U", "U'", "B", "B'"]) {
                pyra.move(m);
                const p2 = pyra.extractF("D");
                if (!vTable.has(p2)) {
                    vTable.set(p2, d+1);
                    P2.push(p2);
                }
                pyra.undo();
            }
        }

        P = P2;
    }

    console.log("vTable", vTable.size);
}

function randInt(n) {
    while (true) {
        const r = Math.random()*n|0;
        if (0<=r && r<n) {
            return r;
        }
    }
}

function makeScramble() {
    // センターのステッカー。
    const CF = [
        [ 1, 21, 33],
        [ 3, 11, 19],
        [16, 24, 30],
        [ 6, 14, 28],
    ];
    // エッジのステッカー。
    // D面を含むエッジはD面を、FR、RL、LFはそれぞれF、R、Lを0番目にしている。
    // EOをこのように定義すると、UではEOが反転せず、R、L、Bでは2個のエッジのEOが反転する。
    const EF = [
        [29, 15],
        [34, 25],
        [32,  5],
        [12, 23],
        [20,  2],
        [ 7, 10],
    ];

    const CO = [];
    for (let i=0; i<4; i++) {
        CO[i] = randInt(3);
    }

    const EP = [];
    for (let i=0; i<6; i++) {
        EP.push(i);
    }
    for (let i=5; i>=2; i--) {
        const r = randInt(i);
        const t = EP[i];
        EP[i] = EP[r];
        EP[r] = t;
    }
    // EP[0] と EP[1] は偶置換になるようにする。
    let p = 0;
    for (let i=0; i<6; i++) {
        for (let j=0; j<i; j++) {
            if (EP[j]>EP[i]) {
                p ^= 1;
            }
        }
    }
    if (p!=0) {
        const t = EP[0];
        EP[0] = EP[1];
        EP[1] = t;
    }

    const EO = [];
    for (let i=0; i<5; i++) {
        EO[i] = randInt(2);
    }
    // EO[5] はEOの和が偶数になるようにする。
    p = 0;
    for (let i=0; i<5; i++) {
        p ^= EO[i];
    }
    EO[5] = p;

    const pyra = new Pyra();

    for (let i=0; i<4; i++) {
        for (let j=0; j<3; j++) {
            pyra.F[CF[i][j]] = "LFRD"[CF[i][(j+CO[i])%3]/9|0];
        }
    }

    for (let i=0; i<6; i++) {
        for (let j=0; j<2; j++) {
            pyra.F[EF[i][j]] = "LFRD"[EF[EP[i]][(j+EO[i])%2]/9|0];
        }
    }

    // 解いた手順をスクランブルとする。
    let scramble = [];

    for (let depth=0; ; depth++) {
        const moves = [];

        function f(d) {
            if (d==depth) {
                let ok = true;
                for (let i of Pyra.withoutCorner) {
                    if (pyra.F[i]!="LFRD"[i/9|0]) {
                        ok = false;
                        break;
                    }
                }
                if (ok) {
                    scramble = [...moves];
                    return true;
                }

                return false;
            }

            let h = solveTableDepth+1;
            const e = pyra.extract();
            if (solveTable.has(e)) {
                h = solveTable.get(e);
            }
            if (d+h>depth) {
                return false;
            }

            for (let m of ["R", "R'", "L", "L'", "U", "U'", "B", "B'"]) {
                pyra.move(m);
                moves.push(m);

                const res = f(d+1);

                pyra.undo();
                moves.pop();

                if (res) {
                    return true;
                }
            }
            return false;
        }

        if (f(0)) {
            break;
        }
    }

    for (let t of ["l", "r", "b", "u"]) {
        const n = randInt(3);
        if (n==1) {
            scramble.push(t);
        }
        if (n==2) {
            scramble.push(t+"'");
        }
    }

    return scramble.join(" ");
}

function solveV(scramble, df, maxNum) {
    const pyra = new Pyra();
    for (let m of scramble.split(" ")) {
        pyra.move(m);
    }

    const rotate = {
        "DF": [],
        "DR": ["Uw"],
        "DL": ["Uw'"],
        "RD": ["Rw"],
        "RF": ["Rw", "Uw"],
        "RL": ["Rw", "Uw'"],
        "FL": ["Lw"],
        "FR": ["Lw", "Uw"],
        "FD": ["Lw", "Uw'"],
        "LF": ["Bw"],
        "LD": ["Bw", "Uw"],
        "LR": ["Bw", "Uw'"],
    }[df];
    for (let m of rotate) {
        pyra.move(m);
    }

    for (let depth=0; ; depth++) {
        let solves = [];
        const moves = [...rotate];

        function f(d) {
            if (solves.length>=maxNum) {
                return;
            }

            if (d==depth) {
                if (pyra.F[28]==pyra.F[30] &&
                    pyra.F[30]==pyra.F[32] &&
                    pyra.F[32]==pyra.F[33] &&
                    pyra.F[33]==pyra.F[34] &&
                    pyra.F[ 5]==pyra.F[ 6] &&
                    pyra.F[21]==pyra.F[25]) {
                    if (solves.length<maxNum) {
                        solves.push(moves.join(" "));
                    }
                }
                return;
            }

            let h = vTableDepth+1;
            const e = pyra.extractF(df[0]);
            if (vTable.has(e)) {
                h = vTable.get(e);
            }
            if (d+h>depth) {
                return;
            }

            for (let m of ["R", "R'", "L", "L'", "U", "U'", "B", "B'"]) {
                pyra.move(m);
                moves.push(m);
                f(d+1);
                pyra.undo();
                moves.pop();

                if (solves.length>=maxNum) {
                    return;
                }
            }
        }
        f(0);
        if (solves.length>0) {
            return solves;
        }
    }
}

//console.dir(Pyra.makeMoveTable());

function render(canvas, pyra, mode) {
    const ctx = canvas.getContext("2d");
    const dpr = window.devicePixelRatio;
    canvas.width = 128*dpr;
    canvas.height = 128*dpr;
    ctx.scale(dpr, dpr);
    canvas.style.width = `${128}px`;
    canvas.style.height = `${128}px`;

    // [B, R, L]
    const F = [
        [[3, 0, 0], [2, 0, 0], [2, 0, 1]],
        [[2, 0, 0], [1, 0, 1], [2, 0, 1]],
        [[2, 0, 0], [1, 0, 0], [1, 0, 1]],
        [[1, 0, 0], [0, 0, 1], [1, 0, 1]],
        [[1, 0, 0], [0, 0, 0], [0, 0, 1]],
        [[2, 0, 1], [1, 0, 1], [1, 0, 2]],
        [[1, 0, 1], [0, 0, 2], [1, 0, 2]],
        [[1, 0, 1], [0, 0, 1], [0, 0, 2]],
        [[1, 0, 2], [0, 0, 2], [0, 0, 3]],

        [[0, 0, 0], [0, 1, 0], [0, 0, 1]],
        [[0, 0, 1], [0, 1, 1], [0, 0, 2]],
        [[0, 0, 1], [0, 1, 0], [0, 1, 1]],
        [[0, 1, 0], [0, 2, 0], [0, 1, 1]],
        [[0, 0, 2], [0, 1, 2], [0, 0, 3]],
        [[0, 0, 2], [0, 1, 1], [0, 1, 2]],
        [[0, 1, 1], [0, 2, 1], [0, 1, 2]],
        [[0, 1, 1], [0, 2, 0], [0, 2, 1]],
        [[0, 2, 0], [0, 3, 0], [0, 2, 1]],

        [[0, 0, 0], [1, 0, 0], [0, 1, 0]],
        [[1, 0, 0], [1, 1, 0], [0, 1, 0]],
        [[1, 0, 0], [2, 0, 0], [1, 1, 0]],
        [[2, 0, 0], [2, 1, 0], [1, 1, 0]],
        [[3, 0, 0], [2, 1, 0], [2, 0, 0]],
        [[0, 1, 0], [1, 1, 0], [0, 2, 0]],
        [[1, 1, 0], [1, 2, 0], [0, 2, 0]],
        [[2, 1, 0], [1, 2, 0], [1, 1, 0]],
        [[0, 2, 0], [1, 2, 0], [0, 3, 0]],

        [[0, 0, 3], [0, 1, 2], [1, 0, 2]],
        [[0, 1, 2], [1, 1, 1], [1, 0, 2]],
        [[0, 1, 2], [0, 2, 1], [1, 1, 1]],
        [[0, 2, 1], [1, 2, 0], [1, 1, 1]],
        [[0, 2, 1], [0, 3, 0], [1, 2, 0]],
        [[1, 0, 2], [1, 1, 1], [2, 0, 1]],
        [[1, 1, 1], [2, 1, 0], [2, 0, 1]],
        [[1, 1, 1], [1, 2, 0], [2, 1, 0]],
        [[2, 0, 1], [2, 1, 0], [3, 0, 0]],
    ];

    function rotate(x, y, z) {
        let th2;
        let th3;
        let scale;
        if (mode!="v") {
            th2 = 0.1;
            th3 = 0.3;
            scale = 120;
        } else {
            th2 = 0.0;
            th3 = 0.1;
            scale = 160;
        }

        const x2 = x*Math.cos(th2)-y*Math.sin(th2);
        const y2 = x*Math.sin(th2)+y*Math.cos(th2);
        const z2 = z;

        const x3 = x2;
        const y3 = y2*Math.cos(th3)-z2*Math.sin(th3);
        const z3 = y2*Math.sin(th3)+z2*Math.cos(th3);

        return [x3*scale+64, y3*scale+80];
    }

    const [Ux, Uy] = rotate(0, 0, Math.sqrt(2/3));
    const [Bx, By] = rotate(0, -1/Math.sqrt(3), 0);
    const [Rx, Ry] = rotate(1/2, 1/(2*Math.sqrt(3)), 0);
    const [Lx, Ly] = rotate(-1/2, 1/(2*Math.sqrt(3)), 0);

    // D, L, R, F の順に描画。
    const I = [];
    for (let f of [27, 0, 18, 9]) {
        for (let i=0; i<9; i++) {
            I.push(f+i);
        }
    }

    for (let i of I) {
        if (pyra.F[i]!=" .") {
            ctx.beginPath();
            for (let j=0; j<3; j++) {
                const x = ((Bx-Ux)*F[i][j][0]/3+(Rx-Ux)*F[i][j][1]/3+(Lx-Ux)*F[i][j][2]/3)+Ux;
                const y = ((By-Uy)*F[i][j][0]/3+(Ry-Uy)*F[i][j][1]/3+(Ly-Uy)*F[i][j][2]/3)+Uy;
                if (j==0) {
                    ctx.moveTo(x, y);
                } else {
                    ctx.lineTo(x, y);
                }
            }
            ctx.closePath();
            ctx.fillStyle = {
                "R": "#00F",
                "F": "#0F0",
                "L": "#F00",
                "D": "#FF0",
                " ": "rgba(192 192 192 / 70%)",
            }[pyra.F[i]];
            ctx.fill();
            ctx.lineWidth = 0.5;
            ctx.stroke();
        }
    }

    for (let l of [
        [[Ux, Uy], [Bx, By]],
        [[Ux, Uy], [Rx, Ry]],
        [[Ux, Uy], [Lx, Ly]],
        [[Bx, By], [Rx, Ry]],
        [[Rx, Ry], [Lx, Ly]],
        [[Lx, Ly], [Bx, By]],
    ]) {
        ctx.beginPath();
        ctx.moveTo(l[0][0], l[0][1]);
        ctx.lineTo(l[1][0], l[1][1]);
        ctx.closePath();
        ctx.lineWidth = 1;
        ctx.stroke();
    }
}

const elScramble = document.getElementById("scramble");
const elError = document.getElementById("error");
const elPrevious = document.getElementById("previous");
const elNext = document.getElementById("next");

function solve(scramble) {
    const num = 4;

    const CF = [
        [ 1, 21, 33], // LRD
        [ 3, 11, 19], // LFR
        [16, 24, 30], // FRD
        [ 6, 14, 28], // LFD
    ];
    const EF = [
        [29, 15], // DF
        [34, 25], // DR
        [32,  5], // DL
        [12, 23], // FR
        [20,  2], // RL
        [ 7, 10], // LF
    ];

    const pyra = new Pyra();
    for (let m of scramble.split(" ")) {
        pyra.move(m);
    }
    render(document.getElementById("visual"), pyra);

    for (let d of ["D", "R", "F", "L"]) {
        for (let f of ["D", "R", "F", "L"]) {
            if (d!=f) {
                const df = d+f;

                const container = document.getElementById(`solve_${df.toLowerCase()}`);
                while (container.firstChild) {
                    container.removeChild(container.firstChild);
                }

                const solves = solveV(scramble, df, num+1);

                const pyra = new Pyra();

                for (let m of scramble.split(" ")) {
                    pyra.move(m);
                }
                for (let m of solves[0].split(" ")) {
                    if (m.includes("w")) {
                        pyra.move(m);
                    }
                }

                // Vを構成するピース以外を削除。
                for (let cf of CF) {
                    if (!(pyra.F[cf[0]]==d || pyra.F[cf[1]]==d || pyra.F[cf[2]]==d)) {
                        pyra.F[cf[0]] = " ";
                        pyra.F[cf[1]] = " ";
                        pyra.F[cf[2]] = " ";
                    }
                }
                for (let ef of EF) {
                    if (!((pyra.F[ef[0]]==d || pyra.F[ef[1]]==d) && pyra.F[ef[0]]!=f && pyra.F[ef[1]]!=f)) {
                        pyra.F[ef[0]] = " ";
                        pyra.F[ef[1]] = " ";
                    }
                }
                for (let f of [0, 4, 8, 9, 13, 17, 18, 22, 26, 27, 31, 35]) {
                    pyra.F[f] = " ";
                }

                render(document.getElementById(`visual_${df.toLocaleLowerCase()}`), pyra, "v");


                for (let i=0; i<solves.length; i++) {
                    const div = document.createElement("div");
                    container.appendChild(div);

                    if (i<num) {
                        const s1 = [];
                        const s2 = [];
                        for (let m of solves[i].split(" ")) {
                            if (m.includes("w")) {
                                s1.push(m);
                            } else {
                                s2.push(m);
                            }
                        }
                        if (s1.length>0) {
                            const span = document.createElement("span");
                            div.appendChild(span);

                            span.classList.add("has-text-grey-light");
                            span.textContent = s1.join(" ")+" ";
                        }

                        const text = document.createTextNode(s2.join(" "));
                        div.appendChild(text);
                    } else {
                        div.textContent = "...";
                    }
                }
            }
        }
    }
}

const history = [makeScramble()];
let position = 0;

elScramble.value = history[position];
solve(history[position]);

elNext.addEventListener("click", () => {
    position++;

    while (position>=history.length) {
        history.push(makeScramble());
    }

    elScramble.value = history[position];
    solve(history[position]);

    elPrevious.removeAttribute("disabled");
});

elPrevious.addEventListener("click", () => {
    if (position>0) {
        position--;

        elScramble.value = history[position];
        solve(history[position]);

        if (position==0) {
            elPrevious.setAttribute("disabled", "");
        }
    }
});

elScramble.addEventListener("input", () => {
    try {
        solve(elScramble.value);
        elError.style.display = "none";
    } catch {
        elError.style.display = "block";
    }
});
