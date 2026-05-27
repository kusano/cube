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
    // undo 不可。
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

    isHTR() {
        // bad corners.
        for (let c of [20, 38, 24, 42]) {
            if (this.C[c]!=this.C[22] && this.C[c]!=this.C[40]) {
                return false;
            }
        }
        // bad edges.
        for (let e of [19, 25, 37, 43]) {
            if (this.C[e]!=this.C[22] && this.C[e]!=this.C[40]) {
                return false;
            }
        }
        // 1軸についてU/D solvedでパリティが偶数ならば良い。
        // U/D.
        let c = 0;
        for (let p of [[0, 51], [2, 53], [6, 45], [8, 47]]) {
            if (this.C[p[0]]==this.C[p[1]]) {
                c++;
            }
        }
        if (c!=0 && c!=4) {
            return false;
        }
        // parity.
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
            const f = this.C[CI[i][0]]+this.C[CI[i][1]]+this.C[CI[i][2]];
            C[i] = CF[f];
        }
        let p = 0;
        for (let i=0; i<8; i++) {
            for (let j=0; j<i; j++) {
                if (C[j]>C[i]) {
                    p ^= 1;
                }
            }
        }
        if (p!=0) {
            return false;
        }

        return true;
    }

    getFR() {
        // parity.
        let p = 0;

        const CI = [
            [ 0,  9, 38], [ 8, 27, 20], [45, 17, 24], [53, 35, 42],
        ];
        const CF = {
            "ULB": 0, "URF": 1, "DLF": 2, "DRB": 3,
        };
        const C = Array(4);
        for (let i=0; i<4; i++) {
            const f = this.C[CI[i][0]]+this.C[CI[i][1]]+this.C[CI[i][2]];
            C[i] = CF[f];
        }
        for (let i=0; i<4; i++) {
            for (let j=0; j<i; j++) {
                if (C[j]>C[i]) {
                    p ^= 1;
                }
            }
        }

        const EI = [
            [ 1, 37], [ 7, 19], [46, 25], [52, 43],
            [ 3, 10], [ 5, 28], [48, 16], [50, 34],
        ]
        const EF = {
            "UB": 0, "UF": 1, "DF": 2, "DB": 3,
            "UL": 4, "UR": 5, "DL": 6, "DR": 7,
        }
        const E = Array(8);
        for (let i=0; i<8; i++) {
            const f = this.C[EI[i][0]]+this.C[EI[i][1]];
            E[i] = EF[f];
        }
        for (let i=0; i<8; i++) {
            for (let j=0; j<i; j++) {
                if (E[j]>E[i]) {
                    p ^= 1;
                }
            }
        }

        if (p==0) {
            if (this.C[11]==this.C[17] && this.C[18]==this.C[24] &&
                this.C[19]==this.C[22] && this.C[22]==this.C[25] &&
                this.C[28]==this.C[31] && this.C[31]==this.C[34]) {
                return 0;
            } else {
                return 2;
            }
        } else {
            if ((this.C[11]!=this.C[17] || this.C[18]!=this.C[24]) &&
                this.C[19]!=this.C[25] && this.C[28]!=this.C[34]) {
                return 1;
            } else {
                return 3;
            }
        }
    }

    static BRSubsets = {
        "DB-DB-DB/DF-DF-DF/UB-UB-UB/UF-UF-UF": "4B0",
        "DB-UB-DB/DF-DF-DF/UB-DB-UB/UF-UF-UF": "2B3",
        "DB-UF-DB/DF-DF-DF/UB-UB-UB/UF-DB-UF": "2B3",
        "DB-DB-DB/DF-UF-DF/UB-UB-UB/UF-DF-UF": "2B3",
        "DB-DB-DB/DF-UB-DF/UB-DF-UB/UF-UF-UF": "2B3",
        "DB-DB-DB/DF-DF-DF/UB-UF-UB/UF-UB-UF": "2B3",
        "DB-DF-DB/DF-DB-DF/UB-UB-UB/UF-UF-UF": "2B3",
        "DB-DF-DB/DF-UB-DF/UB-DB-UB/UF-UF-UF": "1B4",
        "DB-DB-DB/DF-UF-DF/UB-DF-UB/UF-UB-UF": "1B4",
        "DB-UF-DB/DF-DB-DF/UB-UB-UB/UF-DF-UF": "1B4",
        "DB-UB-DB/DF-DF-DF/UB-UF-UB/UF-DB-UF": "1B4",
        "DB-UB-DB/DF-DB-DF/UB-DF-UB/UF-UF-UF": "1B4",
        "DB-UF-DB/DF-DF-DF/UB-DB-UB/UF-UB-UF": "1B4",
        "DB-DB-DB/DF-UB-DF/UB-UF-UB/UF-DF-UF": "1B4",
        "DB-DF-DB/DF-UF-DF/UB-UB-UB/UF-DB-UF": "1B4",
        "DB-DF-DB/DF-DB-DF/UB-UF-UB/UF-UB-UF": "HL2",
        "DB-UF-DB/DF-UB-DF/UB-DF-UB/UF-DB-UF": "HL2",
        "DB-UB-DB/DF-UF-DF/UB-DB-UB/UF-DF-UF": "HL2",
        "DB-DB-UB/DF-DF-UF/UB-UB-DB/UF-UF-DF": "4P4",
        "DB-UB-UB/DF-UF-UF/UB-DB-DB/UF-DF-DF": "4P4",
        "DB-DB-DF/DF-DF-DB/UB-UB-UF/UF-UF-UB": "4P4",
        "DB-DF-DF/DF-DB-DB/UB-UF-UF/UF-UB-UB": "4P4",
        "DB-UF-UF/DF-UB-UB/UB-DF-DF/UF-DB-DB": "4P4",
        "DB-DB-UF/DF-DF-UB/UB-UB-DF/UF-UF-DB": "4P4",
        "DB-DF-DF/DF-DB-DB/UB-UB-UF/UF-UF-UB": "4P1",
        "DB-UF-UF/DF-DF-UB/UB-UB-DF/UF-DB-DB": "4P1",
        "DB-DB-DF/DF-DF-DB/UB-UF-UF/UF-UB-UB": "4P1",
        "DB-DB-UF/DF-UB-UB/UB-DF-DF/UF-UF-DB": "4P1",
        "DB-DB-UB/DF-UF-UF/UB-UB-DB/UF-DF-DF": "4P1",
        "DB-UB-UB/DF-DF-UF/UB-DB-DB/UF-UF-DF": "4P1",
        "DB-DB-UB/DF-UB-UF/UB-DF-DB/UF-UF-DF": "2P3",
        "DB-UB-UB/DF-DB-UF/UB-UF-DB/UF-DF-DF": "2P3",
        "DB-UF-UF/DF-DB-UB/UB-DF-DF/UF-UB-DB": "2P3",
        "DB-DB-UF/DF-UF-UB/UB-UB-DF/UF-DF-DB": "2P3",
        "DB-DF-UB/DF-UF-UF/UB-DB-DB/UF-UB-DF": "2P3",
        "DB-UF-UB/DF-DF-UF/UB-UB-DB/UF-DB-DF": "2P3",
        "DB-UB-UF/DF-DF-UB/UB-DB-DF/UF-UF-DB": "2P3",
        "DB-DF-UF/DF-UB-UB/UB-UF-DF/UF-DB-DB": "2P3",
        "DB-UB-UB/DF-UF-UF/UB-DF-DB/UF-DB-DF": "2P3",
        "DB-DB-UB/DF-DF-UF/UB-UF-DB/UF-UB-DF": "2P3",
        "DB-UF-UB/DF-UB-UF/UB-DB-DB/UF-DF-DF": "2P3",
        "DB-DF-UB/DF-DB-UF/UB-UB-DB/UF-UF-DF": "2P3",
        "DB-UB-DF/DF-DF-DB/UB-DB-UF/UF-UF-UB": "2P3",
        "DB-UF-DF/DF-DB-DB/UB-DF-UF/UF-UB-UB": "2P3",
        "DB-DF-DF/DF-UB-DB/UB-UF-UF/UF-DB-UB": "2P3",
        "DB-DB-DF/DF-UF-DB/UB-UB-UF/UF-DF-UB": "2P3",
        "DB-UB-UF/DF-UF-UB/UB-DF-DF/UF-DB-DB": "2P3",
        "DB-DF-UF/DF-DB-UB/UB-UB-DF/UF-UF-DB": "2P3",
        "DB-UF-UF/DF-UB-UB/UB-DB-DF/UF-DF-DB": "2P3",
        "DB-DB-UF/DF-DF-UB/UB-UF-DF/UF-UB-DB": "2P3",
        "DB-DB-DF/DF-UB-DB/UB-DF-UF/UF-UF-UB": "2P3",
        "DB-DF-DF/DF-UF-DB/UB-DB-UF/UF-UB-UB": "2P3",
        "DB-UF-DF/DF-DF-DB/UB-UB-UF/UF-DB-UB": "2P3",
        "DB-UB-DF/DF-DB-DB/UB-UF-UF/UF-DF-UB": "2P3",
        "DB-UB-UF/DF-DB-UB/UB-DF-DF/UF-UF-DB": "2P2",
        "DB-UF-UB/DF-DB-UF/UB-UB-DB/UF-DF-DF": "2P2",
        "DB-DF-UF/DF-UF-UB/UB-UB-DF/UF-DB-DB": "2P2",
        "DB-DF-UB/DF-UB-UF/UB-DB-DB/UF-UF-DF": "2P2",
        "DB-UB-DF/DF-DF-DB/UB-UF-UF/UF-DB-UB": "2P2",
        "DB-UF-DF/DF-DB-DB/UB-UB-UF/UF-DF-UB": "2P2",
        "DB-UF-UB/DF-DF-UF/UB-DB-DB/UF-UB-DF": "2P2",
        "DB-DF-UB/DF-UF-UF/UB-UB-DB/UF-DB-DF": "2P2",
        "DB-UB-UB/DF-DF-UF/UB-UF-DB/UF-DB-DF": "2P2",
        "DB-UF-UF/DF-DF-UB/UB-DB-DF/UF-UB-DB": "2P2",
        "DB-DB-UF/DF-UB-UB/UB-UF-DF/UF-DF-DB": "2P2",
        "DB-DB-UB/DF-UF-UF/UB-DF-DB/UF-UB-DF": "2P2",
        "DB-DB-DF/DF-UF-DB/UB-DF-UF/UF-UB-UB": "2P2",
        "DB-DF-DF/DF-UB-DB/UB-DB-UF/UF-UF-UB": "2P2",
        "DB-DB-UB/DF-UB-UF/UB-UF-DB/UF-DF-DF": "2P2",
        "DB-UB-UB/DF-DB-UF/UB-DF-DB/UF-UF-DF": "2P2",
        "DB-DF-DF/DF-UF-DB/UB-UB-UF/UF-DB-UB": "2P2",
        "DB-DB-DF/DF-UB-DB/UB-UF-UF/UF-DF-UB": "2P2",
        "DB-DB-UF/DF-UF-UB/UB-DF-DF/UF-UB-DB": "2P2",
        "DB-UF-UF/DF-DB-UB/UB-UB-DF/UF-DF-DB": "2P2",
        "DB-UB-UF/DF-DF-UB/UB-UF-DF/UF-DB-DB": "2P2",
        "DB-UF-DF/DF-DF-DB/UB-DB-UF/UF-UB-UB": "2P2",
        "DB-DF-UF/DF-UB-UB/UB-DB-DF/UF-UF-DB": "2P2",
        "DB-UB-DF/DF-DB-DB/UB-DF-UF/UF-UF-UB": "2P2",
        "DB-UB-DF/DF-UF-DB/UB-DF-UF/UF-DB-UB": "0P3",
        "DB-UF-DF/DF-UB-DB/UB-DB-UF/UF-DF-UB": "0P3",
        "DB-DF-UF/DF-UF-UB/UB-DB-DF/UF-UB-DB": "0P3",
        "DB-UB-UF/DF-DB-UB/UB-UF-DF/UF-DF-DB": "0P3",
        "DB-DF-UB/DF-UB-UF/UB-UF-DB/UF-DB-DF": "0P3",
        "DB-UF-UB/DF-DB-UF/UB-DF-DB/UF-UB-DF": "0P3",
        "DB-UF-DB/DF-DB-DF/UB-DF-UB/UF-UB-UF": "HL3",
        "DB-UB-DB/DF-DB-DF/UB-UF-UB/UF-DF-UF": "HL3",
        "DB-DF-DB/DF-UB-DF/UB-UF-UB/UF-DB-UF": "HL3",
        "DB-DF-DB/DF-UF-DF/UB-DB-UB/UF-UB-UF": "HL3",
        "DB-UF-DB/DF-UB-DF/UB-DB-UB/UF-DF-UF": "HL3",
        "DB-UB-DB/DF-UF-DF/UB-DF-UB/UF-DB-UF": "HL3",
        "DB-UF-DF/DF-UB-DB/UB-DF-UF/UF-DB-UB": "0P4",
        "DB-DF-UB/DF-DB-UF/UB-UF-DB/UF-UB-DF": "0P4",
        "DB-UF-UB/DF-UB-UF/UB-DF-DB/UF-DB-DF": "0P4",
        "DB-UB-DF/DF-UF-DB/UB-DB-UF/UF-DF-UB": "0P4",
        "DB-DF-UF/DF-DB-UB/UB-UF-DF/UF-UB-DB": "0P4",
        "DB-UB-UF/DF-UF-UB/UB-DB-DF/UF-DF-DB": "0P4",
    };

    getBRSubsetFB() {
        const bars = [
            this.C[ 6]+this.C[18]+"-"+this.C[ 7]+this.C[19]+"-"+this.C[ 8]+this.C[20],
            this.C[47]+this.C[26]+"-"+this.C[46]+this.C[25]+"-"+this.C[45]+this.C[24],
            this.C[51]+this.C[44]+"-"+this.C[52]+this.C[43]+"-"+this.C[53]+this.C[42],
            this.C[ 2]+this.C[36]+"-"+this.C[ 1]+this.C[37]+"-"+this.C[ 0]+this.C[38],
        ];

        bars.sort();
        return Cube.BRSubsets[bars.join("/")];
    }

    getBRSubsetRL() {
        const bars = [
            this.C[ 8]+this.C[27]+"-"+this.C[ 5]+this.C[28]+"-"+this.C[ 2]+this.C[29],
            this.C[53]+this.C[35]+"-"+this.C[50]+this.C[34]+"-"+this.C[47]+this.C[33],
            this.C[45]+this.C[17]+"-"+this.C[48]+this.C[16]+"-"+this.C[51]+this.C[15],
            this.C[ 0]+this.C[ 9]+"-"+this.C[ 3]+this.C[10]+"-"+this.C[ 6]+this.C[11],
        ];

        bars.sort();
        return Cube.BRSubsets[bars.join("/").replaceAll("R", "F").replaceAll("L", "B")];
    }

    isLeaveSlice() {
        for (let i=0; i<9; i++) {
            if (this.C[i]!=this.C[4]) {
                return false;
            }
        }
        // センターずれはleave sliceではないことにしておく。
        for (let f=9; f<45; f+=9) {
            for (let i=0; i<3; i++) {
                if (this.C[f+i]!=this.C[f+4]) {
                    return false;
                }
            }
            for (let i=6; i<9; i++) {
                if (this.C[f+i]!=this.C[f+4]) {
                    return false;
                }
            }
        }
        for (let i=45; i<54; i++) {
            if (this.C[i]!=this.C[49]) {
                return false;
            }
        }
        return true;
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

const S = Array(20);
for (let i=0; i<20; i++) {
    S[i] = new Map();
}

const cube = new Cube();
cube.C[12] = cube.C[14] = cube.C[21] = cube.C[23] = cube.C[30] = cube.C[32] = cube.C[39] = cube.C[41] = ".";

S[0].set(cube.C.join(""), []);

console.log("generator\tBR (F/B)\tBR (R/L)\tFR\testimated\tactual");
console.log("\t0\t0\t0\t0\t0");

const C = Array(13);
for (let i=0; i<13; i++) {
    C[i] = Array(13);
    for (let j=0; j<13; j++) {
        C[i][j] = 0;
    }
}
C[0][0] = 1;

for (let d=0; d<19; d++) {
    for (const [c, gen] of S[d]) {
        for (let i=0; i<54; i++) {
            cube.C[i] = c[i];
        }

        for (const move of ["F2", "B2", "R2", "L2", "U2", "D2"]) {
            cube.move(move);
            const c2 = cube.C.join("");

            let found = false;
            for (let d2=0; d2<=d+1 && !found; d2++) {
                if (S[d2].has(c2)) {
                    found = true;
                }
            }
            if (!found) {
                const gen2 = [...gen, move];
                const fb = +cube.getBRSubsetFB()[2];
                const rl = +cube.getBRSubsetRL()[2];
                const fr = cube.getFR();

                console.log(`${gen2.join(" ")}\t${fb}\t${rl}\t${fr}\t${fb+rl+fr}\t${gen2.length}`);

                C[fb+rl+fr][gen2.length]++;

                S[d+1].set(c2, gen2);
            }

            cube.undo();
        }
    }
    //console.log(d, S[d+1].size);
}

for (let i=0; i<13; i++) {
    console.log(C[i].join("\t"));
}
