// 手、手順を逆にする。
function reverse(m) {
    if (typeof m=="string") {
        if (m==" ") {
            return " ";
        }
        if (m.length==1) {
            return m+"'";
        }
        if (m[1]=="2") {
            return m;
        }
        if (m[1]=="'") {
            return m[0];
        }
    } else {
        let r = [];
        for (let i=m.length-1; i>=0; i--) {
            r.push(reverse(m[i]));
        }
        return r;
    }
}

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

    static composite(T) {
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

    static {
        const T = this.moveTable;
        for (let m of ["F", "B", "R", "L", "U", "D", "M", "E", "S"]) {
            T[m+"2"] = Cube.composite([T[m], T[m]]);
            T[m+"'"] = Cube.composite([T[m], T[m+"2"]]);
        }

        T["x"] = Cube.composite([T["R"], T["M'"], T["L'"]]);
        T["y"] = Cube.composite([T["U"], T["E'"], T["D'"]]);
        T["z"] = Cube.composite([T["F"], T["S"], T["B'"]]);

        for (let m of ["x", "y", "z"]) {
            T[m+"2"] = Cube.composite([T[m], T[m]]);
            T[m+"'"] = Cube.composite([T[m], T[m+"2"]]);
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

    // 手順を軽量に適用できるテーブルを作成する。
    static makeTable(moves) {
        const A = [];
        for (let m of moves) {
            A.push(Cube.moveTable[m]);
        }
        return Cube.composite(A);
    }

    // makeTable で作成したテーブルを適用。
    moveTable(T) {
        for (let i=0; i<54; i++) {
            this.tmp[i] = this.C[i];
        }
        for (let i=0; i<54; i++) {
            this.C[i] = this.tmp[T[i]];
        }
    }

    undo() {
        const m = reverse(this.history.pop());

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

        for (let m of ["F", "B", "R", "L", "U", "D"]) {
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
    }

    constructor(cube) {
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
        this.C = Cube2.cornerTable[m][this.C];
        this.E1 = Cube2.edge1Table[m][this.E1];
        this.E2 = Cube2.edge2Table[m][this.E2];

        this.history.push(m);
    }

    undo() {
        const m = reverse(this.history.pop());

        this.C = Cube2.cornerTable[m][this.C];
        this.E1 = Cube2.edge1Table[m][this.E1];
        this.E2 = Cube2.edge2Table[m][this.E2];
    }

    isSolved() {
        return this.C==0 && this.E1==0 && this.E2==0;
    }

    // finishでの状態が同一ならば等しくなる値を返す。
    extractFinish() {
        return ""+this.C+"_"+this.E1+"_"+this.E2;
    }

    // extractFinish の返り値が finish になるような状態にする。
    unextractFinish(finish) {
        [this.C, this.E1, this.E2] = finish.split("_").map(x=>+x);
    }

    extractFinishCorner() {
        // E層のパリティも追加。
        const eParity = [
            0, 1, 1, 0, 0, 1,
            1, 0, 0, 1, 1, 0,
            0, 1, 1, 0, 0, 1,
            1, 0, 0, 1, 1, 0,
        ];
        return this.C<<1|eParity[this.E2];
    }

    unextractFinishCorner(corner) {
        this.C = corner>>1;
        this.E2 = corner&1;
    }
};

class EO {
    constructor(axis, normal, inverse) {
        this.axis = axis;
        this.normal = [...normal];
        this.inverse = [...inverse];
    }

    toString() {
        let s = "";
        if (this.inverse.length>0) {
            s += `(${this.inverse.join(" ")})`;
        }
        if (this.normal.length>0) {
            if (s!="") {
                s += " ";
            }
            s += `${this.normal.join(" ")}`;
        }
        s += ` // EO (${this.axis})`;
        return s;
    }
};

const eoTable = new Map();
{
    const cube = new Cube();

    eoTable.set(cube.extractEO("F/B"), 0);
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
                if (!eoTable.has(eo2)) {
                    eoTable.set(eo2, d);
                    P2.push(eo2);
                }

                cube.undo();
            }
        }

        P = P2;
    }

    console.log("EO table constructed:", eoTable.size);
}

function searchEO(scramble, maxDepth, niss) {
    const scrambleTable = Cube.makeTable(scramble);
    const inverseTable = Cube.makeTable(reverse(scramble));

    const cube = new Cube();

    const moves = [
        "F", "F2", "F'",
        "B", "B2", "B'",
        "R", "R2", "R'",
        "L", "L2", "L'",
        "U", "U2", "U'",
        "D", "D2", "D'",
    ];

    const eos = [];
    const normal = [];
    const inverse = [];

    function f2(depth, maxDepthN, rev) {
        if (depth==maxDepthN) {
            const first = inverse.length==0 ? "" : inverse[0];
            const last = normal.length==0 ? "" : normal[normal.length-1];

            for (let axis of ["F/B", "R/L", "U/D"]) {
                // Nissyは最後の2手がF' Bのようなものは除いている。
                // DR/finishで2手前のキャンセルするようにして、除くべき？
                if ((first=="" || first==axis[0]+"'" || first==axis[2]+"'") &&
                    (last=="" || last==axis[0] || last==axis[2]) &&
                    cube.eoBadEdge(axis)==0) {
                    const eo = !rev ? new EO(axis, normal, reverse(inverse)) : new EO(axis, reverse(inverse), normal);
                    console.log(eo.toString());
                    eos.push(eo);
                }
            }
            return;
        }

        let h = 7;
        for (let axis of ["F/B", "R/L", "U/D"]) {
            const eo = cube.extractEO(axis);
            h = Math.min(h, eoTable.get(eo))
        }
        if (depth+h>maxDepthN) {
            return;
        }

        for (let m of moves) {
            if (normal.length>0) {
                const last = normal[normal.length-1];
                if (m[0]==last[0] ||
                    m[0]=="F" && last[0]=="B" ||
                    m[0]=="R" && last[0]=="L" ||
                    m[0]=="U" && last[0]=="D") {
                    continue;
                }
            }

            cube.move(m);
            normal.push(m);

            f2(depth+1, maxDepthN, rev);

            cube.undo();
            normal.pop();
        }
    }

    function f1(depth, maxDepthN, maxDepthI, rev) {
        if (depth==maxDepthI) {
            if (!rev) {
                cube.moveTable(scrambleTable);
            } else {
                cube.moveTable(inverseTable);
            }

            f2(0, maxDepthN, rev)

            if (!rev) {
                cube.moveTable(inverseTable);
            } else {
                cube.moveTable(scrambleTable);
            }
            return;
        }

        for (let m of moves) {
            if (inverse.length>0) {
                const last = inverse[inverse.length-1];
                if (m[0]==last[0] ||
                    m[0]=="F" && last[0]=="B" ||
                    m[0]=="R" && last[0]=="L" ||
                    m[0]=="U" && last[0]=="D") {
                    continue;
                }
            }

            cube.move(m);
            inverse.push(m);

            f1(depth+1, maxDepthN, maxDepthI, rev);

            cube.undo();
            inverse.pop();
        }
    }

    for (let depth=0; depth<=maxDepth; depth++) {
        for (let depthI=0; depthI<=depth; depthI++) {
            const depthN = depth-depthI;
            if (niss=="never" && depthI>0 ||
                niss=="before" && depthN>0 && depthI>0) {
                continue;
            }

            // ヒューリスティックを有効に使うため、inverseのほうが手数が多ければ、逆向きに探索。
            if (depthN>=depthI) {
                f1(0, depthN, depthI, false);
            } else {
                f1(0, depthI, depthN, true);
            }
        }
    }

    return eos;
}

class DR {
    constructor(axis, normal, inverse) {
        this.axis = axis;
        this.normal = [...normal];
        this.inverse = [...inverse];
    }

    toString() {
        let s = "";
        if (this.inverse.length>0) {
            s += `(${this.inverse.join(" ")})`;
        }
        if (this.normal.length>0) {
            if (s!="") {
                s += " ";
            }
            s += `${this.normal.join(" ")}`;
        }
        s += ` // DR (${this.axis})`;
        return s;
    }
};

const drTableMax = 5;
const drTable = new Map();
{
    const cube = new Cube();

    drTable.set(cube.extractDR("F/B", "U/D"), 0);
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
                if (!drTable.has(dr2)) {
                    drTable.set(dr2, d);
                    P2.push(dr2);
                }

                cube.undo();
            }
        }

        P = P2;
    }

    console.log("DR table constructed:", drTable.size);
}

function searchDR(scramble, eos, maxDepth, niss) {
    const scrambleTable = Cube.makeTable(scramble);
    const inverseTable = Cube.makeTable(reverse(scramble));

    const eoDepth = [];
    for (let d=0; d<=maxDepth; d++) {
        eoDepth[d] = [];
    }
    for (let eo of eos) {
        eoDepth[eo.normal.length+eo.inverse.length].push(eo);
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

    const cube = new Cube();

    const normal = [];
    const inverse = [];

    function f2(depth, maxDepthN, rev, eo) {
        if (depth==maxDepthN) {
            for (let axis of axisCands[eo.axis]) {
                const first = inverse.length==0 ||
                    inverse.length==1 && eo.inverse.length>0 && inverse[0][0]==eo.inverse[eo.inverse.length-1][0] ?
                    "" : inverse[0];
                const last = normal.length==0 ||
                    normal.length==1 && eo.normal.length>0 && normal[0][0]==eo.normal[eo.normal.length-1][0] ?
                    "" : normal[normal.length-1];

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
                if ((first=="" || first==cand[0]+"'" || first==cand[2]+"'") &&
                    (last=="" || last==cand[0] || last==cand[2]) &&
                    cube.drBadEdge(axis)==0 && cube.drBadCorner(axis)==0) {
                        console.log(eo.toString());
                        const dr = !rev ? new DR(axis, normal, reverse(inverse)) : new DR(axis, reverse(inverse), normal);
                        console.log(dr.toString());
                        const finish = searchFinish(scramble, eo, dr);
                        console.log(finish.toString());
                        console.log();
                }
            }
            return;
        }

        let h = drTableMax+1;
        for (let axis of axisCands[eo.axis]) {
            const dr = cube.extractDR(eo.axis, axis);
            if (drTable.has(dr)) {
                h = Math.min(h, drTable.get(dr));
            }
        }
        if (depth+h>maxDepthN) {
            return;
        }

        for (let m of moveCands[eo.axis]) {
            if (normal.length>0) {
                const last = normal[normal.length-1];
                if (m[0]==last[0] ||
                    m[0]=="F" && last[0]=="B" ||
                    m[0]=="R" && last[0]=="L" ||
                    m[0]=="U" && last[0]=="D") {
                    continue;
                }
            }
            if (normal.length==0 && eo.normal.length>0 &&
                m[0]==eo.normal[eo.normal.length-1][0]) {
                continue;
            }

            cube.move(m);
            normal.push(m);

            f2(depth+1, maxDepthN, rev, eo);

            cube.undo();
            normal.pop();
        }
    }

    function f1(depth, maxDepthN, maxDepthI, rev, eo) {
        if (depth==maxDepthI) {
            // 最後の1手がEOの最後の1手と同じ面のものは弾く。
            // TODO: F -> B などと順番を固定していることと合わせて、漏れがあるはず。
            if (inverse.length>0 && eo.inverse.length>0 &&
                inverse[inverse.length-1][0]==eo.inverse[eo.inverse.length-1][0]) {
                return;
            }

            for (let revI=0; revI<2; revI++) {
                if (revI==1 && eo.inverse.length==0) {
                    continue;
                }
                for (let revN=0; revN<2; revN++) {
                    if (revN==1 && eo.normal.length==0) {
                        continue;
                    }

                    if (!rev) {
                        if (revI==1) {
                            const m = eo.inverse[eo.inverse.length-1][0]+"2";
                            cube.move(m);
                            inverse.push(m);
                        }
                        for (let m of reverse(eo.inverse)) {
                            cube.move(m);
                        }
                        cube.moveTable(scrambleTable);
                        for (let m of eo.normal) {
                            cube.move(m);
                        }
                        if (revN==1) {
                            const m = eo.normal[eo.normal.length-1][0]+"2";
                            cube.move(m);
                            normal.push(m);
                        }
                    } else {
                        if (revN==1) {
                            const m = eo.normal[eo.normal.length-1][0]+"2";
                            cube.move(m);
                            inverse.push(m);
                        }
                        for (let m of reverse(eo.normal)) {
                            cube.move(m);
                        }
                        cube.moveTable(inverseTable);
                        for (let m of eo.inverse) {
                            cube.move(m);
                        }
                        if (revI==1) {
                            const m = eo.inverse[eo.inverse.length-1][0]+"2";
                            cube.move(m);
                            normal.push(m);
                        }
                    }

                    f2(0, maxDepthN, rev, eo);

                    if (!rev) {
                        if (revN==1) {
                            cube.undo();
                            normal.pop();
                        }
                        for (let m of eo.normal) {
                            cube.undo();
                        }
                        cube.moveTable(inverseTable);
                        for (let m of reverse(eo.inverse)) {
                            cube.undo(m);
                        }
                        if (revI==1) {
                            cube.undo();
                            inverse.pop();
                        }
                    } else {
                        if (revI==1) {
                            cube.undo();
                            normal.pop();
                        }
                        for (let m of eo.inverse) {
                            cube.undo();
                        }
                        cube.moveTable(scrambleTable);
                        for (let m of reverse(eo.normal)) {
                            cube.undo();
                        }
                        if (revN==1) {
                            cube.undo();
                            inverse.pop();
                        }
                    }
                }
            }
            return;
        }

        for (let m of moveCands[eo.axis]) {
            if (inverse.length>0) {
                const last = inverse[inverse.length-1];
                if (m[0]==last[0] ||
                    m[0]=="F" && last[0]=="B" ||
                    m[0]=="R" && last[0]=="L" ||
                    m[0]=="U" && last[0]=="D") {
                    continue;
                }
            }

            cube.move(m);
            inverse.push(m);

            f1(depth+1, maxDepthN, maxDepthI, rev, eo);

            cube.undo();
            inverse.pop();
        }
    }

    for (let depth=0; depth<=maxDepth; depth++) {
        for (let d=0; d<=depth; d++) {
            for (let eo of eoDepth[d]) {
                const eoDepth = eo.normal.length+eo.inverse.length;
                for (let depthI=0; depthI<=depth-eoDepth; depthI++) {
                    const depthN = depth-eoDepth-depthI;
                    if (niss=="never" && depthI>0 ||
                        niss=="before" && depthN>0 && depthI>0) {
                        continue;
                    }

                    if (depthN>=depthI) {
                        f1(0, depthN, depthI, false, eo);
                    } else {
                        f1(0, depthI, depthN, true, eo);
                    }
                }
            }
        }
    }
}

class Finish {
    constructor(moves) {
        this.moves = [...moves];
    }

    toString() {
        return `${this.moves.join(" ")} // finish`;
    }
}

const finishTableMax = 6;
const finishTable = new Map();
{
    const cube = new Cube2();

    finishTable.set(cube.extractFinish(), 0);
    let P = [cube.extractFinish()];

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

                const finish2 = cube.extractFinish();
                if (!finishTable.has(finish2)) {
                    finishTable.set(finish2, d);
                    P2.push(finish2);
                }

                cube.undo();
            }
        }

        P = P2;
    }

    console.log("Finish table constructed:", finishTable.size);
}

const finishCornerTable = new Map();
{
    const cube = new Cube2();

    finishCornerTable.set(cube.extractFinishCorner(), 0);
    let P = [cube.extractFinishCorner()];

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

                const finish2 = cube.extractFinishCorner();
                if (!finishCornerTable.has(finish2)) {
                    finishCornerTable.set(finish2, d);
                    P2.push(finish2);
                }

                cube.undo();
            }
        }

        P = P2;
        //console.log(d, P2.length);
    }

    console.log("Finish corner table constructed:", finishCornerTable.size);
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

    const normal = [];
    for (let m of eo.normal) {
        normal.push(fixAxis(dr.axis, m));
    }
    for (let m of dr.normal) {
        normal.push(fixAxis(dr.axis, m));
    }
    // 逆転済み。
    const inverse = [];
    for (let m of reverse(dr.inverse)) {
        inverse.push(fixAxis(dr.axis, m));
    }
    for (let m of reverse(eo.inverse)) {
        inverse.push(fixAxis(dr.axis, m));
    }

    const cubeTemp = new Cube();
    for (let m of inverse) {
        cubeTemp.move(m);
    }
    for (let m of scramble) {
        cubeTemp.move(fixAxis(dr.axis, m));
    }
    for (let m of normal) {
        cubeTemp.move(m);
    }

    const cube = new Cube2(cubeTemp);
    const moves = [];

    function f(depth, maxDepth) {
        if (depth==maxDepth) {
            if (cube.isSolved()) {
                return new Finish(moves.map(m => unfixAxis(dr.axis, m)));
            }

            if (inverse.length>0) {
                const m = inverse[0][0]+"2";
                cube.move(m);
                moves.push(m);

                if (cube.isSolved()) {
                    return new Finish(moves.map(m => unfixAxis(dr.axis, m)));
                }

                cube.undo();
                moves.pop();
            }
            return false;
        }

        const finish = cube.extractFinish();
        const corner = cube.extractFinishCorner();
        const h1 = finishTable.has(finish) ? finishTable.get(finish) : finishTableMax+1;
        const h2 = finishCornerTable.get(corner);
        // -1 は最後の逆回転分。
        if (depth+Math.max(h1, h2)-1>maxDepth) {
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
                if (normal.length>0 && m[0]==normal[normal.length-1][0]) {
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
        if (normal.length>0) {
            const t = normal[normal.length-1][0]+"2";
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

scramble = "L D L F2 R' D2 B2 R2 D2 U2 F2 L2 R' F' R' B' U2 B2 D R' U";
//scramble = "R' U' F L2 F' D2 F' D2 L2 B F2 D' R' F2 D U L' U R D2 L' B' R' U' F"
//for (let m of "R2 B D F B U2 R' B' U L' F2 R2 F2 D2 L F2 R' F2 B2".split(" ")) {
//for (let m of "R U D R L2 F R' B' U R L' U2 L2 F2 U2 R F2 B2 D2".split(" ")) {

console.log(scramble);

scramble = scramble.split(" ")
const eos = searchEO(scramble, 5, "always");
searchDR(scramble, eos, 10, "always");
