/*
              0  1  2
              3  4  5
              6  7  8
     9 10 11|18 19 20|27 28 29|36 37 38
    12 13 14|21 22 23|30 31 32|39 40 41
    15 16 17|24 25 26|33 34 35|42 43 44
             45 46 47
             48 49 50
             51 52 53
*/
class Cube {
    static moveTable = {
        " ": [ 0,  1,  2,  3,  4,  5,  6,  7,  8,   9, 10, 11, 12, 13, 14, 15, 16, 17,  18, 19, 20, 21, 22, 23, 24, 25, 26,  27, 28, 29, 30, 31, 32, 33, 34, 35,  36, 37, 38, 39, 40, 41, 42, 43, 44,  45, 46, 47, 48, 49, 50, 51, 52, 53],
        "F": [ 0,  1,  2,  3,  4,  5, 17, 14, 11,   9, 10, 45, 12, 13, 46, 15, 16, 47,  24, 21, 18, 25, 22, 19, 26, 23, 20,   6, 28, 29,  7, 31, 32,  8, 34, 35,  36, 37, 38, 39, 40, 41, 42, 43, 44,  33, 30, 27, 48, 49, 50, 51, 52, 53],
        "B": [29, 32, 35,  3,  4,  5,  6,  7,  8,   2, 10, 11,  1, 13, 14,  0, 16, 17,  18, 19, 20, 21, 22, 23, 24, 25, 26,  27, 28, 53, 30, 31, 52, 33, 34, 51,  42, 39, 36, 43, 40, 37, 44, 41, 38,  45, 46, 47, 48, 49, 50,  9, 12, 15],
        "R": [ 0,  1, 20,  3,  4, 23,  6,  7, 26,   9, 10, 11, 12, 13, 14, 15, 16, 17,  18, 19, 47, 21, 22, 50, 24, 25, 53,  33, 30, 27, 34, 31, 28, 35, 32, 29,   8, 37, 38,  5, 40, 41,  2, 43, 44,  45, 46, 42, 48, 49, 39, 51, 52, 36],
        "L": [44,  1,  2, 41,  4,  5, 38,  7,  8,  15, 12,  9, 16, 13, 10, 17, 14, 11,   0, 19, 20,  3, 22, 23,  6, 25, 26,  27, 28, 29, 30, 31, 32, 33, 34, 35,  36, 37, 51, 39, 40, 48, 42, 43, 45,  18, 46, 47, 21, 49, 50, 24, 52, 53],
        "U": [ 6,  3,  0,  7,  4,  1,  8,  5,  2,  18, 19, 20, 12, 13, 14, 15, 16, 17,  27, 28, 29, 21, 22, 23, 24, 25, 26,  36, 37, 38, 30, 31, 32, 33, 34, 35,   9, 10, 11, 39, 40, 41, 42, 43, 44,  45, 46, 47, 48, 49, 50, 51, 52, 53],
        "D": [ 0,  1,  2,  3,  4,  5,  6,  7,  8,   9, 10, 11, 12, 13, 14, 42, 43, 44,  18, 19, 20, 21, 22, 23, 15, 16, 17,  27, 28, 29, 30, 31, 32, 24, 25, 26,  36, 37, 38, 39, 40, 41, 33, 34, 35,  51, 48, 45, 52, 49, 46, 53, 50, 47],
        "M": [ 0, 43,  2,  3, 40,  5,  6, 37,  8,   9, 10, 11, 12, 13, 14, 15, 16, 17,  18,  1, 20, 21,  4, 23, 24,  7, 26,  27, 28, 29, 30, 31, 32, 33, 34, 35,  36, 52, 38, 39, 49, 41, 42, 46, 44,  45, 19, 47, 48, 22, 50, 51, 25, 53],
        "E": [ 0,  1,  2,  3,  4,  5,  6,  7,  8,   9, 10, 11, 39, 40, 41, 15, 16, 17,  18, 19, 20, 12, 13, 14, 24, 25, 26,  27, 28, 29, 21, 22, 23, 33, 34, 35,  36, 37, 38, 30, 31, 32, 42, 43, 44,  45, 46, 47, 48, 49, 50, 51, 52, 53],
        "S": [ 0,  1,  2, 16, 13, 10,  6,  7,  8,   9, 48, 11, 12, 49, 14, 15, 50, 17,  18, 19, 20, 21, 22, 23, 24, 25, 26,  27,  3, 29, 30,  4, 32, 33,  5, 35,  36, 37, 38, 39, 40, 41, 42, 43, 44,  45, 46, 47, 34, 31, 28, 51, 52, 53],
    };

    static invTable = {}

    static {
        function composite(T) {
            const S = Array(54);
            for (let i=0; i<54; i++) {
                S[i] = i;
            }

            for (let t of T) {
                const P = [...S];
                for (let i=0; i<54; i++) {
                    S[i] = P[t[i]];
                }
            }

            return S;
        }

        const T = this.moveTable;
        for (let m of ["F", "B", "R", "L", "U", "D", "M", "E", "S"]) {
            T[m+"2"] = composite([T[m], T[m]]);
            T[m+"'"] = composite([T[m], T[m+"2"]]);
        }

        T["x"] = composite([T["R"], T["M'"], T["L'"]]);
        T["y"] = composite([T["U"], T["E'"], T["D'"]]);
        T["z"] = composite([T["F"], T["S"], T["B'"]]);

        for (let m of ["x", "y", "z"]) {
            T[m+"2"] = composite([T[m], T[m]]);
            T[m+"'"] = composite([T[m], T[m+"2"]]);
        }

        this.invTable[" "] = " ";
        for (let m of ["F", "B", "R", "L", "U", "D", "M", "E", "S", "x", "y", "z"]) {
            this.invTable[m] = m+"'";
            this.invTable[m+"2"] = m+"2";
            this.invTable[m+"'"] = m;
        }
    }

    constructor() {
        this.C = Array(54);
        for (let i=0; i<54; i++) {
            this.C[i] = "ULFRBD"[i/9|0];
        }

        this.tmp = Array(54);
        this.history = [];
    }

    move(m) {
        for (let i=0; i<54; i++) {
            this.tmp[i] = this.C[i];
        }
        for (let i=0; i<54; i++) {
            this.C[i] = this.tmp[Cube.moveTable[m][i]];
        }

        this.history.push(m);
    }

    undo() {
        const m = Cube.invTable[this.history.pop()];

        for (let i=0; i<54; i++) {
            this.tmp[i] = this.C[i];
        }
        for (let i=0; i<54; i++) {
            this.C[i] = this.tmp[Cube.moveTable[m][i]];
        }
    }

    toString() {
        const C = this.C;
        return `   ${C[ 0]}${C[ 1]}${C[ 2]}
   ${C[ 3]}${C[ 4]}${C[ 5]}
   ${C[ 6]}${C[ 7]}${C[ 8]}
${C[ 9]}${C[10]}${C[11]}${C[18]}${C[19]}${C[20]}${C[27]}${C[28]}${C[29]}${C[36]}${C[37]}${C[38]}
${C[12]}${C[13]}${C[14]}${C[21]}${C[22]}${C[23]}${C[30]}${C[31]}${C[32]}${C[39]}${C[40]}${C[41]}
${C[15]}${C[16]}${C[17]}${C[24]}${C[25]}${C[26]}${C[33]}${C[34]}${C[35]}${C[42]}${C[43]}${C[44]}
   ${C[45]}${C[46]}${C[47]}
   ${C[48]}${C[49]}${C[50]}
   ${C[51]}${C[52]}${C[53]}
`;
    }

    eoBadEdge(axis) {
        this.move({"F/B": " ", "R/L": "y", "U/D": "x"}[axis]);

        let n = 0;
        for (let e of [
            [ 1, 37], [ 5, 28], [ 7, 19], [ 3, 10],
            [21, 14], [23, 30], [39, 32], [41, 12],
            [46, 25], [50, 34], [52, 43], [48, 16],
        ]) {
            if (this.C[e[0]]==this.C[31] || this.C[e[0]]==this.C[13] || this.C[e[1]]==this.C[4] || this.C[e[1]]==this.C[49]) {
                n++;
            }
        }

        this.undo();

        return n;
    }

    drBadCorner(axis) {
        this.move({"U/D": " ", "F/B": "x", "R/L": "z"}[axis]);

        let n = 0;
        for (let c of [ 0,  2,  8,  6, 45, 47, 53, 51]) {
            if (this.C[c]!=this.C[4] && this.C[c]!=this.C[49]) {
                n++;
            }
        }

        this.undo();

        return n;
    }

    drBadEdge(axis) {
        this.move({"U/D": " ", "F/B": "x", "R/L": "z"}[axis]);

        let n = 0;
        for (let e of [ 1,  5,  7,  3, 46, 50, 52, 48]) {
            if (this.C[e]!=this.C[4] && this.C[e]!=this.C[49]) {
                n++;
            }
        }
        for (let e of [21, 14, 23, 30, 39, 32, 41, 12]) {
            if (this.C[e]==this.C[4] || this.C[e]==this.C[49]) {
                n++;
            }
        }

        this.undo();

        return n;
    }

    isSolved() {
        for (let i=0; i<54; i++) {
            if (this.C[i]!="ULFRBD"[i/9|0]) {
                return false;
            }
        }
        return true;
    }

    // EOでの状態が同一ならば等しくなる文字列を返す。
    // 各エッジの向きが正しいかどうか。
    extractEO(axis) {
        this.move({"F/B": " ", "R/L": "y", "U/D": "x"}[axis]);

        let s = ""
        for (let e of [
            [ 1, 37], [ 5, 28], [ 7, 19], [ 3, 10],
            [21, 14], [23, 30], [39, 32], [41, 12],
            [46, 25], [50, 34], [52, 43], [48, 16],
        ]) {
            s += this.C[e[0]]==this.C[31] || this.C[e[0]]==this.C[13] || this.C[e[1]]==this.C[4] || this.C[e[1]]==this.C[49] ? "x" : "o";
        }

        this.undo();

        return s;
    }

    // extractEO の返り値が eo になるような状態にする。
    unextractEO(eo) {
        this.setCenter();

        const I = [
            [ 1, 37], [ 5, 28], [ 7, 19], [ 3, 10],
            [21, 14], [23, 30], [39, 32], [41, 12],
            [46, 25], [50, 34], [52, 43], [48, 16],
        ];
        const F = [
            "UB", "UR", "UF", "UL",
            "FL", "FR", "BR", "BL",
            "DF", "DR", "DB", "DL",
        ];
        for (let i=0; i<12; i++) {
            if (eo[i]=="o") {
                this.C[I[i][0]] = F[i][0];
                this.C[I[i][1]] = F[i][1];
            } else {
                this.C[I[i][0]] = F[i][1];
                this.C[I[i][1]] = F[i][0];
            }
        }
    }

    // DRでの状態が同一ならば等しくなる文字列を返す。
    // エッジはU/Dエッジかどうか、コーナーはU/Dステッカーの位置。
    // DRはEOムーブのみで行うので、EO軸も受け取る。
    extractDR(eoAxis, drAxis) {
        const moves = {
            "F/BU/D": [" ", " "],
            "F/BR/L": ["z", " "],
            "R/LF/B": ["y", "z"],
            "R/LU/D": ["y", " "],
            "U/DR/L": ["x", "z"],
            "U/DF/B": ["x", " "],
        }[eoAxis+drAxis];
        this.move(moves[0]);
        this.move(moves[1]);

        let s = "";

        const E = [
             1,  5,  7,  3,
            21, 23, 39, 41,
            46, 50, 52, 48,
        ];
        for (let e of E) {
            if (this.C[e]==this.C[4] || this.C[e]==this.C[49]) {
                s += "o";
            } else {
                s += "x";
            }
        }

        const C = [
            [ 0,  9, 38], [ 2, 36, 29], [ 8, 27, 20], [ 6, 18, 11],
            [45, 17, 24], [47, 26, 33], [53, 35, 42], [51, 44, 15],
        ];
        for (let i=0; i<8; i++) {
            for (let j=0; j<3; j++) {
                if (this.C[C[i][j]]==this.C[4] || this.C[C[i][j]]==this.C[49]) {
                    s += "012"[j];
                }
            }
        }

        this.undo();
        this.undo();

        return s;
    }

     // extractDR の返り値が finish になるような状態にする。
    unextractDR(dr) {
        for (let i=0; i<54; i++) {
            this.C[i] = "F";
        }
        this.setCenter();

        const E = [
            1,  5,  7,  3,
           21, 23, 39, 41,
           46, 50, 52, 48,
       ];
        for (let i=0; i<12; i++) {
            if (dr[i]=="o") {
                this.C[E[i]] = this.C[4];
            }
        }

        const C = [
            [ 0,  9, 38], [ 2, 36, 29], [ 8, 27, 20], [ 6, 18, 11],
            [45, 17, 24], [47, 26, 33], [53, 35, 42], [51, 44, 15],
        ];
        for (let i=0; i<8; i++) {
            this.C[C[i][+dr[12+i]]] = this.C[4];
        }
    }

    // finishでの状態が同一ならば等しくなる文字列を返す。
    // finishはDRムーブのみで行うので、DR軸も受け取る。
    extractFinish(axis) {
        this.move({"U/D": " ", "F/B": "x", "R/L": "z"}[axis]);

        const T = {
            [this.C[ 4]]: "U",
            [this.C[13]]: "L",
            [this.C[22]]: "F",
            [this.C[31]]: "R",
            [this.C[40]]: "B",
            [this.C[49]]: "D",
        };

        let s = "";
        for (let c of this.C) {
            s += T[c];
        }

        this.undo();

        return s;
    }

    // extractFinish の返り値が dr になるような状態にする。
    unextractFinish(finish) {
        for (let i=0; i<54; i++) {
            this.C[i] = finish[i];
        }
    }

    extractFinishCorner(axis) {
        this.move({"U/D": " ", "F/B": "x", "R/L": "z"}[axis]);

        const T = {
            [this.C[ 4]]: "U",
            [this.C[13]]: "L",
            [this.C[22]]: "F",
            [this.C[31]]: "R",
            [this.C[40]]: "B",
            [this.C[49]]: "D",
        };

        const P = [
            [11, 18], [20, 27], [29, 36], [38,  9],
            [24, 17], [33, 26], [42, 35], [15, 44],
        ];
        const F = {
            "LF": "0", "FR": "1", "RB": "2", "BL": "3",
            "FL": "4", "RF": "5", "BR": "6", "LB": "7",
        };

        let s = "";
        for (let p of P) {
            s += F[T[this.C[p[0]]]+T[this.C[p[1]]]];
        }

        this.undo();

        return s;
    }

    unextractFinishCorner(corner) {
        this.setCenter();

        const P = [
            [11, 18], [20, 27], [29, 36], [38,  9],
            [24, 17], [33, 26], [42, 35], [15, 44],
        ];
        const F = [
            "LF", "FR", "RB", "BL",
            "FL", "RF", "BR", "LB",
        ];

        for (let i=0; i<8; i++) {
            this.C[P[i][0]] = F[+corner[i]][0];
            this.C[P[i][1]] = F[+corner[i]][1];
        }
    }

    extractFinishEdge(axis) {
        this.move({"U/D": " ", "F/B": "x", "R/L": "z"}[axis]);

        const T = {
            [this.C[ 4]]: "U",
            [this.C[13]]: "L",
            [this.C[22]]: "F",
            [this.C[31]]: "R",
            [this.C[40]]: "B",
            [this.C[49]]: "D",
        };

        let s = "";
        {
            const P = [
                [ 1, 37], [ 5, 28], [ 7, 19], [ 3, 10],
                [46, 25], [50, 34], [52, 43], [48, 16],
            ];
            const F = {
                "UB": "0", "UR": "1", "UF": "2", "UL": "3",
                "DF": "4", "DR": "5", "DB": "6", "DL": "7",
            };

            for (let p of P) {
                s += F[T[this.C[p[0]]]+T[this.C[p[1]]]];
            }
        }
        if (false) {
            const P = [
                [21, 14], [23, 30], [39, 32], [41, 12],
            ];
            const F = {
                "FL": "0", "FR": "1", "BR": "2", "BL": "3",
            };

            for (let p of P) {
                s += F[T[this.C[p[0]]]+T[this.C[p[1]]]];
            }
        }

        this.undo();

        return s;
    }

    unextractFinishEdge(edge) {
        this.setCenter();

        {
            const P = [
                [ 1, 37], [ 5, 28], [ 7, 19], [ 3, 10],
                [46, 25], [50, 34], [52, 43], [48, 16],
            ];
            const F = [
                "UB", "UR", "UF", "UL",
                "DF", "DR", "DB", "DL",
            ];

            for (let i=0; i<8; i++) {
                this.C[P[i][0]] = F[+edge[i]][0];
                this.C[P[i][1]] = F[+edge[i]][1];
            }
        }
        if (false) {
            const P = [
                [21, 14], [23, 30], [39, 32], [41, 12],
            ];
            const F = [
                "FL", "FR", "BR", "BL",
            ];

            for (let i=0; i<4; i++) {
                this.C[P[i][0]] = F[+edge[8+i]][0];
                this.C[P[i][1]] = F[+edge[8+i]][1];
            }
        }
    }

    setCenter() {
        this.C[ 4] = "U";
        this.C[13] = "L";
        this.C[22] = "F";
        this.C[31] = "R";
        this.C[40] = "B";
        this.C[49] = "D";
    }
};

function perm2index8(P) {
    let index = 0;
    for (let i=0; i<8; i++) {
        let x = P[i];
        for (let j=0; j<i; j++) {
            if (P[j]<P[i]) {
                x--;
            }
        }
        index = index*(8-i)+x;
    }
    return index;
}

function index2perm8(index) {
    const P = Array(8);
    for (let i=7; i>=0; i--) {
        P[i] = index%(8-i);
        index = index/(8-i)|0;
        for (let j=i+1; j<8; j++) {
            if (P[j]>=P[i]) {
                P[j]++;
            }
        }
    }
    return P;
}

function perm2index4(P) {
    let index = 0;
    for (let i=0; i<4; i++) {
        let x = P[i];
        for (let j=0; j<i; j++) {
            if (P[j]<P[i]) {
                x--;
            }
        }
        index = index*(4-i)+x;
    }
    return index;
}

function index2perm4(index) {
    const P = Array(4);
    for (let i=3; i>=0; i--) {
        P[i] = index%(4-i);
        index = index/(4-i)|0;
        for (let j=i+1; j<4; j++) {
            if (P[j]>=P[i]) {
                P[j]++;
            }
        }
    }
    return P;
}

// ピースの位置のみを持つ軽量版。
class Cube2 {
    static cornerTable = {};
    static edge1Table = {};
    static edge2Table = {};

    static invTable = {}

    static {
        /*
                  0  8  1
                  9  U 10
                  2 11  3
         0  9  2| 2 11  3| 3 10  1| 1  8  0
        16  L 17|17  F 18|18  R 19|19  B 16
         6 13  4| 4 12  5| 5 14  7| 7 15  6
                  4 12  5
                 13  D 14
                  6 15  7
        */
        const T = {
            " ": [ 0,  1,  2,  3,   4,  5,  6,  7,   8,  9, 10, 11,  12, 13, 14, 15,  16, 17, 18, 19],
            "F": [ 0,  1,  4,  2,   5,  3,  6,  7,   8,  9, 10, 17,  18, 13, 14, 15,  16, 12, 11, 19],
            "B": [ 1,  7,  2,  3,   4,  5,  0,  6,  19,  9, 10, 11,  12, 13, 14, 16,   8, 17, 18, 15],
            "R": [ 0,  3,  2,  5,   4,  7,  6,  1,   8,  9, 18, 11,  12, 13, 19, 15,  16, 17, 14, 10],
            "L": [ 6,  1,  0,  3,   2,  5,  4,  7,   8, 16, 10, 11,  12, 17, 14, 15,  13,  9, 18, 19],
            "U": [ 2,  0,  3,  1,   4,  5,  6,  7,   9, 11,  8, 10,  12, 13, 14, 15,  16, 17, 18, 19],
            "D": [ 0,  1,  2,  3,   6,  4,  7,  5,   8,  9, 10, 11,  13, 15, 12, 14,  16, 17, 18, 19],
            "M": [ 0,  1,  2,  3,   4,  5,  6,  7,  15,  9, 10,  8,  11, 13, 14, 12,  16, 17, 18, 19],
            "E": [ 0,  1,  2,  3,   4,  5,  6,  7,   8,  9, 10, 11,  12, 13, 14, 15,  19, 16, 17, 18],
            "S": [ 0,  1,  2,  3,   4,  5,  6,  7,   8, 13,  9, 11,  12, 14, 10, 15,  16, 17, 18, 19],
        };

        function composite(T) {
            const S = Array(20);
            for (let i=0; i<20; i++) {
                S[i] = i;
            }

            for (let t of T) {
                const P = [...S];
                for (let i=0; i<20; i++) {
                    S[i] = P[t[i]];
                }
            }

            return S;
        }

        for (let m of ["F", "B", "R", "L", "U", "D", "M", "E", "S"]) {
            T[m+"2"] = composite([T[m], T[m]]);
            T[m+"'"] = composite([T[m], T[m+"2"]]);
        }

        for (let m1 of "FBRLUD") {
            for (let m2 of ["", "2", "'"]) {
                if (m1!="U" && m1!="D" && m2!="2") {
                    continue;
                }

                const m = m1+m2;

                Cube2.cornerTable[m] = Array(40320);
                Cube2.edge1Table[m] = Array(40320);

                for (let p=0; p<40320; p++) {
                    const CT = index2perm8(p);
                    const E1T = index2perm8(p);
                    const C1 = Array(16);
                    for (let i=0; i<8; i++) {
                        C1[i] = CT[i];
                    }
                    for (let i=0; i<8; i++) {
                        C1[i+8] = E1T[i]+8;
                    }

                    const C2 = Array(16);
                    for (let i=0; i<16; i++) {
                        C2[i] = C1[T[m][i]];
                    }

                    for (let i=0; i<8; i++) {
                        CT[i] = C2[i];
                    }
                    for (let i=0; i<8; i++) {
                        E1T[i] = C2[i+8]-8;
                    }

                    Cube2.cornerTable[m][p] = perm2index8(CT);
                    Cube2.edge1Table[m][p] = perm2index8(E1T);
                }

                Cube2.edge2Table[m] = Array(24);

                for (let p=0; p<24; p++) {
                    const E2T = index2perm4(p);
                    const C1 = Array(20);
                    for (let i=0; i<4; i++) {
                        C1[i+16] = E2T[i]+16;
                    }

                    const C2 = Array(20);
                    for (let i=16; i<20; i++) {
                        C2[i] = C1[T[m][i]];
                    }

                    for (let i=0; i<4; i++) {
                        E2T[i] = C2[i+16]-16;
                    }

                    Cube2.edge2Table[m][p] = perm2index4(E2T);
                }
            }
        }

        this.invTable[" "] = " ";
        for (let m of ["F", "B", "R", "L", "U", "D", "M", "E", "S", "x", "y", "z"]) {
            this.invTable[m] = m+"'";
            this.invTable[m+"2"] = m+"2";
            this.invTable[m+"'"] = m;
        }
    }

    constructor(cube) {
        /*
        this.C = Array(20);
        for (let i=0; i<20; i++) {
            this.C[i] = i;
        }

        this.tmp = Array(20);
        */
        if (cube) {
            // cube のU/D軸DRが完了していることが前提。
            const CI = [
                [ 0,  9, 38], [ 2, 36, 29], [ 6, 18, 11], [ 8, 27, 20],
                [45, 17, 24], [47, 26, 33], [51, 44, 15], [53, 35, 42],
            ];
            const CF = {
                "ULB": 0, "UBR": 1, "UFL": 2, "URF": 3,
                "DLF": 4, "DFR": 5, "DBL": 6, "DRB": 7,
            };
            const C = Array(8);
            for (let i=0; i<8; i++) {
                const f = cube.C[CI[i][0]]+cube.C[CI[i][1]]+cube.C[CI[i][2]];
                C[i] = CF[f];
            }
            this.C = perm2index8(C);

            const E1I = [
                [ 1, 37], [ 3, 10], [ 5, 28], [ 7, 19],
                [46, 25], [48, 16], [50, 34], [52, 43],
            ];
            const E1F = {
                "UB": 0, "UL": 1, "UR": 2, "UF": 3,
                "DF": 4, "DL": 5, "DR": 6, "DB": 7,
            };
            const E1 = Array(8);
            for (let i=0; i<8; i++) {
                const f = cube.C[E1I[i][0]]+cube.C[E1I[i][1]];
                E1[i] = E1F[f];
            }
            this.E1 = perm2index8(E1);

            const E2I = [
                [41, 12], [21, 14], [23, 30], [39, 32],
            ];
            const E2F = {
                "BL": 0, "FL": 1, "FR": 2, "BR": 3,
            };
            const E2 = Array(4);
            for (let i=0; i<4; i++) {
                const f = cube.C[E2I[i][0]]+cube.C[E2I[i][1]];
                E2[i] = E2F[f];
            }
            this.E2 = perm2index4(E2);
        } else {
            this.C = 0;
            this.E1 = 0;
            this.E2 = 0;
        }

        this.history = [];
    }

    move(m) {
        /*
        for (let i=0; i<20; i++) {
            this.tmp[i] = this.C[i];
        }
        for (let i=0; i<20; i++) {
            this.C[i] = this.tmp[Cube2.moveTable[m][i]];
        }
        */
        this.C = Cube2.cornerTable[m][this.C];
        this.E1 = Cube2.edge1Table[m][this.E1];
        this.E2 = Cube2.edge2Table[m][this.E2];

        this.history.push(m);
    }

    undo() {
        const m = Cube2.invTable[this.history.pop()];

        /*
        for (let i=0; i<20; i++) {
            this.tmp[i] = this.C[i];
        }
        for (let i=0; i<20; i++) {
            this.C[i] = this.tmp[Cube2.moveTable[m][i]];
        }
        */
        this.C = Cube2.cornerTable[m][this.C];
        this.E1 = Cube2.edge1Table[m][this.E1];
        this.E2 = Cube2.edge2Table[m][this.E2];
    }

    isSolved() {
        /*
        for (let i=0; i<20; i++) {
            if (this.C[i]!=i) {
                return false;
            }
        }
        return true;
        */
        return this.C==0 && this.E1==0 && this.E2==0;
    }

    // finishでの状態が同一ならば等しくなる文字列を返す。
    // finishはDRムーブのみで行うので、DR軸も受け取る。
    extractFinish(axis) {
        /*
        this.move({"U/D": " ", "F/B": "x", "R/L": "z"}[axis]);

        const T = {
            "U/D": [ 0,  1,  2,  3,   4,  5,  6,  7,   8,  9, 10, 11,  12, 13, 14, 15,  16, 17, 18, 19],
            // x'
            "F/B": [ 6,  7,  0,  1,   2,  3,  4,  5,  15, 16, 19,  8,  11, 17, 18, 12,  13,  9, 10, 14],
            // z'
            "R/L": [ 1,  7,  3,  5,   2,  4,  0,  6,  19, 10, 14, 18,  17, 9,  13, 16,   8, 11, 12, 15],
        }[axis];

        let s = "";
        for (let i=0; i<8; i++) {
            s += "01234567"[T[this.C[i]]];
        }
        // エッジとコーナーは入れ替わらない。
        for (let i=8; i<16; i++) {
            s += "01234567"[T[this.C[i]]-8];
        }
        // DRムーブでは、中層のエッジとU/D面のエッジは入れ替わらない。
        for (let i=16; i<20; i++) {
            s += "0123"[T[this.C[i]]-16];
        }

        this.undo();

        return s;
        */

        const s = `${this.C}_${this.E1}_${this.E2}`;
        return s;
    }

    // extractFinish の返り値が finish になるような状態にする。
    unextractFinish(finish) {
        /*
        for (let i=0; i<8; i++) {
            this.C[i] = +finish[i];
        }
        for (let i=8; i<16; i++) {
            this.C[i] = +finish[i]+8;
        }
        for (let i=16; i<20; i++) {
            this.C[i] = +finish[i]+16;
        }
        */
        [this.C, this.E1, this.E2] = finish.split("_").map(x => +x);
    }

    static eParity_ = {
        "0123": "0", "0132": "1", "0213": "1", "0231": "0", "0312": "0", "0321": "1",
        "1023": "1", "1032": "0", "1203": "0", "1230": "1", "1302": "1", "1320": "0",
        "2013": "0", "2031": "1", "2103": "1", "2130": "0", "2301": "0", "2310": "1",
        "3012": "1", "3021": "0", "3102": "0", "3120": "1", "3201": "1", "3210": "0",
    };
    static eParity = [
        0, 1, 1, 0, 0, 1,
        1, 0, 0, 1, 1, 0,
        0, 1, 1, 0, 0, 1,
        1, 0, 0, 1, 1, 0,
    ];

    extractFinishCorner(axis) {
        /*
        this.move({"U/D": " ", "F/B": "x", "R/L": "z"}[axis]);

        const T = {
            "U/D": [ 0,  1,  2,  3,   4,  5,  6,  7,   8,  9, 10, 11,  12, 13, 14, 15,  16, 17, 18, 19],
            "F/B": [ 6,  7,  0,  1,   2,  3,  4,  5,  15, 16, 19,  8,  11, 17, 18, 12,  13,  9, 10, 14],
            "R/L": [ 1,  7,  3,  5,   2,  4,  0,  6,  19, 10, 14, 18,  17, 9,  13, 16,   8, 11, 12, 15],
        }[axis];

        let s = "";
        for (let i=0; i<8; i++) {
            s += "01234567"[T[this.C[i]]];
        }

        // E層のパリティを追加。
        // let e = "";
        // for (let i=16; i<20; i++) {
        //     e += "0123"[T[this.C[i]]-16];
        // }
        // s += Cube2.eParity[e];

        // E層を追加
        for (let i=16; i<20; i++) {
            s += "0123"[T[this.C[i]]-16];
        }

        this.undo();

        return s;
        */
        return ""+this.C+"_"+Cube2.eParity[this.E2];
    }

    unextractFinishCorner(corner) {
        /*
        for (let i=0; i<8; i++) {
            this.C[i] = +corner[i];
        }

        // this.C[16] = 16;
        // this.C[17] = 17;
        // if (corner[8]=="0") {
        //     this.C[18] = 18;
        //     this.C[19] = 19;
        // } else {
        //     this.C[18] = 19;
        //     this.C[19] = 18;
        // }

        for (let i=16; i<20; i++) {
            this.C[i] = +corner[i-8]+16;
        }
        */
        this.C = +corner.split("_")[0];
        this.E2 = +corner.split("_")[1];
    }
};

class EO {
    constructor(axis, moves) {
        this.axis = axis;
        this.moves = [...moves];
    }

    toString() {
        return `${this.moves.join(" ")} (${this.axis})`;
    }
};

const eoTable = {};
{
    const cube = new Cube();

    eoTable[cube.extractEO("F/B")] = 0;
    let P = [cube.extractEO("F/B")];

    for (let d=1; d<=7; d++) {
        const P2 = [];

        for (let eo of P) {
            cube.unextractEO(eo);

            for (let m of [
                "F", "F2", "F'",
                "B", "B2", "B'",
                "R", "R2", "R'",
                "L", "L2", "L'",
                "U", "U2", "U'",
                "D", "D2", "D'",
            ]) {
                cube.move(m);

                const eo2 = cube.extractEO("F/B");
                if (eoTable[eo2]===undefined) {
                    eoTable[eo2] = d;
                    P2.push(eo2);
                }

                cube.undo();
            }
        }

        P = P2;
    }

    console.log("EO table constructed:", Object.keys(eoTable).length);
}

function searchEO(scramble, maxDepth) {
    const cube = new Cube();
    for (let m of scramble) {
        cube.move(m);
    }

    const eos = [];
    const moves = [];

    function f(depth, maxDepth) {
        if (depth==maxDepth) {
            // TODO: ... F' B のような手順では、2手前の動きも制約するべき。
            const last = moves.length==0 ? "" : moves[moves.length-1];
            if ((last=="" || last=="F" || last=="B") &&
                cube.eoBadEdge("F/B")==0) {
                const eo = new EO("F/B", moves);
                console.log(eo.toString());
                eos.push(eo);
            }
            if ((last=="" || last=="R" || last=="L") &&
                cube.eoBadEdge("R/L")==0) {
                const eo = new EO("R/L", moves);
                console.log(eo.toString());
                eos.push(eo);
            }
            if ((last=="" || last=="U" || last=="D") &&
                cube.eoBadEdge("U/D")==0) {
                const eo = new EO("U/D", moves);
                console.log(eo.toString());
                eos.push(eo);
            }
            return;
        }

        let h = 7;
        for (let axis of ["F/B", "R/L", "U/D"]) {
            const eo = cube.extractEO(axis);
            h = Math.min(h, eoTable[eo])
        }
        if (depth+h>maxDepth) {
            return;
        }

        for (let m of [
            "F", "F2", "F'",
            "B", "B2", "B'",
            "R", "R2", "R'",
            "L", "L2", "L'",
            "U", "U2", "U'",
            "D", "D2", "D'",
        ]) {
            if (moves.length>0) {
                const last = moves[moves.length-1];
                if (m[0]==last[0] ||
                    m[0]=="F" && last[0]=="B" ||
                    m[0]=="R" && last[0]=="L" ||
                    m[0]=="U" && last[0]=="D") {
                    continue;
                }
            }

            cube.move(m);
            moves.push(m);

            f(depth+1, maxDepth);

            cube.undo();
            moves.pop();
        }
    }

    for (let depth=0; depth<=maxDepth; depth++) {
        f(0, depth, "");
    }

    return eos;
}

class DR {
};

const drTableMax = 5;
const drTable = {};
{
    const cube = new Cube();

    drTable[cube.extractDR("F/B", "U/D")] = 0;
    let P = [cube.extractDR("F/B", "U/D")];

    for (let d=1; d<=drTableMax; d++) {
        const P2 = [];

        for (let dr of P) {
            cube.unextractDR(dr);

            for (let m of [
                "F2",
                "B2",
                "R", "R2", "R'",
                "L", "L2", "L'",
                "U", "U2", "U'",
                "D", "D2", "D'",
            ]) {
                cube.move(m);

                const dr2 = cube.extractDR("F/B", "U/D");
                if (drTable[dr2]===undefined) {
                    drTable[dr2] = d;
                    P2.push(dr2);
                }

                cube.undo();
            }
        }

        P = P2;
    }

    console.log("DR table constructed:", Object.keys(drTable).length);
}

function searchDR(scramble, eos, maxDepth) {
    const cube = new Cube();
    for (let m of scramble) {
        cube.move(m);
    }

    const drs = [];
    const moves = [];

    const eoDepth = [];
    for (let d=0; d<=maxDepth; d++) {
        eoDepth[d] = [];
    }
    for (let eo of eos) {
        eoDepth[eo.moves.length].push(eo);
    }

    const moveCands = {
        "F/B": [
            "F2",
            "B2",
            "R", "R2", "R'",
            "L", "L2", "L'",
            "U", "U2", "U'",
            "D", "D2", "D'",
        ],
        "R/L": [
            "F", "F2", "F'",
            "B", "B2", "B'",
            "R2",
            "L2",
            "U", "U2", "U'",
            "D", "D2", "D'",
        ],
        "U/D": [
            "F", "F2", "F'",
            "B", "B2", "B'",
            "R", "R2", "R'",
            "L", "L2", "L'",
            "U2",
            "D2",
        ],
    };
    const axisCands = {
        "F/B": ["U/D", "R/L"],
        "R/L": ["F/B", "U/D"],
        "U/D": ["R/L", "F/B"],
    };

    function f(depth, maxDepth, eo) {
        if (depth==maxDepth) {
            for (let axis of axisCands[eo.axis]) {
                const last =
                    moves.length==0 ||
                    moves.length==1 && eo.moves.length>0 && moves[0][0]==eo.moves[eo.moves.length-1][0] ?
                    "" : moves[moves.length-1];

                const cands = {
                    "U/D": 0,
                    "F/B": 0,
                    "R/L": 0,
                };
                delete cands[eo.axis];
                delete cands[axis];
                let cand;
                for (let c in cands) {
                    cand = c;
                }
                if (last=="" || last==cand[0] || last==cand[1]) {
                    if (cube.drBadEdge(axis)==0 && cube.drBadCorner(axis)==0) {
                        console.log(eo.toString());
                        console.log(`${moves.join(" ")} (${axis})`);
                        const dr = new DR();
                        dr.axis = axis;
                        dr.moves = [...moves];
                        const finish = searchFinish(scramble, eo, dr);
                        console.log(finish.join(" "), finish.length);
                        console.log();
                    }
                }
            }
            return;
        }

        let h = drTableMax+1;
        for (let axis of axisCands[eo.axis]) {
            const dr = cube.extractDR(eo.axis, axis);
            if (drTable[dr]!==undefined) {
                h = Math.min(h, drTable[dr]);
            }
        }
        if (depth+h>maxDepth) {
            return;
        }

        for (let m of moveCands[eo.axis]) {
            if (moves.length>0) {
                const last = moves[moves.length-1];
                if (m[0]==last[0] ||
                    m[0]=="F" && last[0]=="B" ||
                    m[0]=="R" && last[0]=="L" ||
                    m[0]=="U" && last[0]=="D") {
                    continue;
                }
            }

            cube.move(m);
            moves.push(m);

            f(depth+1, maxDepth, eo);

            cube.undo();
            moves.pop();
        }
    }

    for (let depth=0; depth<=maxDepth; depth++) {
        for (let d=0; d<=depth; d++) {
            for (let eo of eoDepth[d]) {
                for (let m of eo.moves) {
                    cube.move(m);
                }

                f(d, depth, eo);

                // EOの最終手を逆回転。
                if (eo.moves.length>0) {
                    const t = eo.moves[eo.moves.length-1]+"2";
                    cube.move(t);
                    moves.push(t);

                    f(d, depth, eo);

                    cube.undo();
                    moves.pop();
                }

                for (let m of eo.moves) {
                    cube.undo();
                }
            }
        }
    }
}

const finishTableMax = 6;
const finishTable = {};
{
    const cube = new Cube2();

    finishTable[cube.extractFinish("U/D")] = 0;
    let P = [cube.extractFinish("U/D")];

    for (let d=1; d<=finishTableMax; d++) {
        const P2 = [];

        for (let finish of P) {
            cube.unextractFinish(finish);

            for (let m of [
                "F2",
                "B2",
                "R2",
                "L2",
                "U", "U2", "U'",
                "D", "D2", "D'",
            ]) {
                cube.move(m);

                const finish2 = cube.extractFinish("U/D");
                if (finishTable[finish2]===undefined) {
                    finishTable[finish2] = d;
                    P2.push(finish2);
                }

                cube.undo();
            }
        }

        P = P2;
    }

    console.log("Finish table constructed:", Object.keys(finishTable).length);
}

const finishCornerTable = {};
{
    const cube = new Cube2();

    finishCornerTable[cube.extractFinishCorner("U/D")] = 0;
    let P = [cube.extractFinishCorner("U/D")];

    for (let d=1; d<=20; d++) {
        const P2 = [];

        for (let finish of P) {
            cube.unextractFinishCorner(finish);

            for (let m of [
                "F2",
                "B2",
                "R2",
                "L2",
                "U", "U2", "U'",
                "D", "D2", "D'",
            ]) {
                cube.move(m);

                const finish2 = cube.extractFinishCorner("U/D");
                if (finishCornerTable[finish2]===undefined) {
                    finishCornerTable[finish2] = d;
                    P2.push(finish2);
                }

                cube.undo();
            }
        }

        P = P2;
        //console.log(d, P2.length);
    }

    console.log("Finish corner table constructed:", Object.keys(finishCornerTable).length);
}

const finishEdgeTable = {};
if (false) {
    const cube = new Cube2();

    finishEdgeTable[cube.extractFinishEdge("U/D")] = 0;
    let P = [cube.extractFinishEdge("U/D")];

    for (let d=1; d<=12; d++) {
        const P2 = [];

        for (let edge of P) {
            cube.unextractFinishEdge(edge);

            for (let m of [
                "F2",
                "B2",
                "R2",
                "L2",
                "U", "U2", "U'",
                "D", "D2", "D'",
            ]) {
                cube.move(m);

                const edge2 = cube.extractFinishEdge("U/D");
                if (finishEdgeTable[edge2]===undefined) {
                    finishEdgeTable[edge2] = d;
                    P2.push(edge2);
                }

                cube.undo();
            }
        }

        P = P2;
    }

    console.log("Finish edge table constructed:", Object.keys(finishEdgeTable).length);
}

function searchFinish(scramble, eo, dr) {
    // 動きを axis 軸をU/Dに向けるように変更。
    function fixAxis(axis, m) {
        const T = {
            "U/D": {"F": "F", "B": "B", "R": "R", "L": "L", "U": "U", "D": "D"},
            "F/B": {"F": "U", "B": "D", "R": "R", "L": "L", "U": "B", "D": "F"},
            "R/L": {"F": "F", "B": "B", "R": "U", "L": "D", "U": "L", "D": "R"},
        }
        return T[axis][m[0]]+m.substr(1);
    }

    function unfixAxis(axis, m) {
        const T = {
            "U/D": {"F": "F", "B": "B", "R": "R", "L": "L", "U": "U", "D": "D"},
            "F/B": {"F": "D", "B": "U", "R": "R", "L": "L", "U": "F", "D": "B"},
            "R/L": {"F": "F", "B": "B", "R": "D", "L": "U", "U": "R", "D": "L"},
        }
        return T[axis][m[0]]+m.substr(1);
    }

    const cubeTemp = new Cube();
    for (let m of scramble) {
        cubeTemp.move(fixAxis(dr.axis, m));
    }
    let last = "";
    for (let m of eo.moves) {
        m = fixAxis(dr.axis, m);
        cubeTemp.move(m);
        last = m;
    }
    for (let m of dr.moves) {
        m = fixAxis(dr.axis, m);
        cubeTemp.move(m);
        last = m;
    }
    const cube = new Cube2(cubeTemp);

    const moves = [];

    function f(depth, maxDepth) {
        if (depth==maxDepth) {
            if (cube.isSolved()) {
                return moves.map(m => unfixAxis(dr.axis, m));
            }
            return false;
        }

        const finish = cube.extractFinish();
        const corner = cube.extractFinishCorner();
        //const corner = finish.substring(0, 8)+Cube2.eParity[finish.substring(16, 20)];
        //const edge = cube.extractFinishEdge(dr.axis);
        //const edge = finish.substring(8, 20);
        const h1 = finishTable[finish]===undefined ? finishTableMax+1 : finishTable[finish];
        const h2 = finishCornerTable[corner];
        //const h3 = finishEdgeTable[edge];
        if (depth+Math.max(h1, h2)>maxDepth) {
            return false;
        }

        for (let m of [
            "F2",
            "B2",
            "R2",
            "L2",
            "U", "U2", "U'",
            "D", "D2", "D'",
        ]) {
            if (moves.length>0) {
                const last = moves[moves.length-1];
                if (m[0]==last[0] ||
                    m[0]=="F" && last[0]=="B" ||
                    m[0]=="R" && last[0]=="L" ||
                    m[0]=="U" && last[0]=="D") {
                    continue;
                }
            } else {
                // 前のステップについては、同じ面の動きだけはしない。
                if (last!="" && m[0]==last[0]) {
                    continue;
                }
            }

            cube.move(m);
            moves.push(m);

            const res = f(depth+1, maxDepth);

            cube.undo();
            moves.pop();

            if (res!==false) {
                return res;
            }
        }
        return false;
    }

    for (let depth=0; ; depth++) {
        const res = f(0, depth);
        if (res!==false) {
            return res;
        }

        // EO、DRの最終手を逆回転。
        if (last!="") {
            const t = last[0]+"2";
            cube.move(t);
            moves.push(t);

            const res = f(0, depth);
            if (res!==false) {
                return res;
            }

            cube.undo();
            moves.pop();
        }
    }
}

//scramble = "L D L F2 R' D2 B2 R2 D2 U2 F2 L2 R' F' R' B' U2 B2 D R' U".split(" ");
scramble = "R' U' F L2 F' D2 F' D2 L2 B F2 D' R' F2 D U L' U R D2 L' B' R' U' F".split(" ")
//for (let m of "R2 B D F B U2 R' B' U L' F2 R2 F2 D2 L F2 R' F2 B2".split(" ")) {
//for (let m of "R U D R L2 F R' B' U R L' U2 L2 F2 U2 R F2 B2 D2".split(" ")) {

const eos = searchEO(scramble, 5);
searchDR(scramble, eos, 12);
