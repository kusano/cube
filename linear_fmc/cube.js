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
        "F": [ 0,  1,  2,  3,  4,  5, 17, 14, 11,   9, 10, 45, 12, 13, 46, 15, 16, 47,  24, 21, 18, 25, 22, 19, 26, 23, 20,   6, 28, 29,  7, 31, 32,  8, 34, 35,  36, 37, 38, 39, 40, 41, 42, 43, 44,  33, 30, 27, 48, 49, 50, 51, 52, 53],
        "B": [29, 32, 35,  3,  4,  5,  6,  7,  8,   2, 10, 11,  1, 13, 14,  0, 16, 17,  18, 19, 20, 21, 22, 23, 24, 25, 26,  27, 28, 53, 30, 31, 52, 33, 34, 51,  42, 39, 36, 43, 40, 37, 44, 41, 38,  45, 46, 47, 48, 49, 50,  9, 12, 15],
        "R": [ 0,  1, 20,  3,  4, 23,  6,  7, 26,   9, 10, 11, 12, 13, 14, 15, 16, 17,  18, 19, 47, 21, 22, 50, 24, 25, 53,  33, 30, 27, 34, 31, 28, 35, 32, 29,   8, 37, 38,  5, 40, 41,  2, 43, 44,  45, 46, 42, 48, 49, 39, 51, 52, 36],
        "L": [44,  1,  2, 41,  4,  5, 38,  7,  8,  15, 12,  9, 16, 13, 10, 17, 14, 11,   0, 19, 20,  3, 22, 23,  6, 25, 26,  27, 28, 29, 30, 31, 32, 33, 34, 35,  36, 37, 51, 39, 40, 48, 42, 43, 45,  18, 46, 47, 21, 49, 50, 24, 52, 53],
        "U": [ 6,  3,  0,  7,  4,  1,  8,  5,  2,  18, 19, 20, 12, 13, 14, 15, 16, 17,  27, 28, 29, 21, 22, 23, 24, 25, 26,  36, 37, 38, 30, 31, 32, 33, 34, 35,   9, 10, 11, 39, 40, 41, 42, 43, 44,  45, 46, 47, 48, 49, 50, 51, 52, 53],
        "D": [ 0,  1,  2,  3,  4,  5,  6,  7,  8,   9, 10, 11, 12, 13, 14, 42, 43, 44,  18, 19, 20, 21, 22, 23, 15, 16, 17,  27, 28, 29, 30, 31, 32, 24, 25, 26,  36, 37, 38, 39, 40, 41, 33, 34, 35,  51, 48, 45, 52, 49, 46, 53, 50, 47],
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
        // 180度回転と逆回転の追加。
        const T = Cube.moveTable;
        for (const m of ["F", "B", "R", "L", "U", "D"]) {
            T[m+"2"] = Array(54);
            for (let i=0; i<54; i++) {
                T[m+"2"][i] = T[m][T[m][i]];
            }
            T[m+"'"] = Array(54);
            for (let i=0; i<54; i++) {
                T[m+"'"][i] = T[m+"2"][T[m][i]];
            }
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

    scramble(moves) {
        this.reset();

        for (const m of moves.split(" ")) {
            if (Cube.moveTable[m]) {
                this.move(m);
            }
        }
    }

    reset() {
        this.faces = [...Cube.initialFaces];
    }

    random() {
        function rand(n) {
            return Math.random()*n|0;
        }

        const EP = Array(12);
        for (let i=0; i<12; i++) {
            EP[i] = i;
        }
        for (let i=11; i>0; i--) {
            const r = rand(i+1);
            const t = EP[i];
            EP[i] = EP[r];
            EP[r] = t;
        }

        const CP = Array(8);
        for (let i=0; i<8; i++) {
            CP[i] = i;
        }
        for (let i=7; i>1; i--) {
            const r = rand(i+1);
            const t = CP[i];
            CP[i] = CP[r];
            CP[r] = t;
        }
        // EP と CP の反転数の合計は偶数。
        let p = 0;
        for (let i=0; i<12; i++) {
            for (let j=0; j<i; j++) {
                if (EP[j]>EP[i]) {
                    p++;
                }
            }
        }
        for (let i=0; i<8; i++) {
            for (let j=0; j<i; j++) {
                if (CP[j]>CP[i]) {
                    p++;
                }
            }
        }
        if (p%2!=0) {
            const t = CP[0];
            CP[0] = CP[1];
            CP[1] = t;
        }

        const EO = Array(12);
        let n = 0;
        for (let i=0; i<11; i++) {
            EO[i] = rand(2);
            n += EO[i];
        }
        // EO の合計は偶数。
        EO[11] = n%2;

        const CO = Array(8);
        n = 0;
        for (let i=0; i<7; i++) {
            CO[i] = rand(3);
            n += CO[i];
        }
        // CO の合計は3の倍数。
        CO[7] = (3-n%3)%3;

        for (let i=0; i<12; i++) {
            for (let j=0; j<2; j++) {
                this.faces[Cube.edges[i][j]] = Cube.initialFaces[Cube.edges[EP[i]][(EO[i]+j)%2]];
            }
        }
        for (let i=0; i<8; i++) {
            for (let j=0; j<3; j++) {
                this.faces[Cube.corners[i][j]] = Cube.initialFaces[Cube.corners[CP[i]][(CO[i]+j)%3]];
            }
        }
    }

    // 検証に失敗したら理由を、成功したら空文字列を返す。
    validate() {
        const colorNames = {
            "G": "Green",
            "B": "Blue",
            "R": "Red",
            "O": "Orange",
            "W": "White",
            "Y": "Yellow",
        };

        const EP = Array(12);
        for (let i=0; i<12; i++) {
            EP[i] = -1;
        }
        const EO = Array(12);

        for (let i=0; i<12 && EP[i]==-1; i++) {
            for (let j=0; j<12; j++) {
                for (let k=0; k<2; k++) {
                    let ok = true;
                    for (let l=0; l<2; l++) {
                        if (Cube.initialFaces[Cube.edges[i][l]]!=this.faces[Cube.edges[j][(k+l)%2]]) {
                            ok = false;
                            break;
                        }
                    }
                    if (ok) {
                        EP[i] = j;
                        EO[i] = k;
                    }
                }
            }
        }

        let n = 0;
        for (let i=0; i<12; i++) {
            if (EP[i]==-1) {
                return `No ${Cube.edges[i].map(e => colorNames[Cube.initialFaces[e]]).join("-")} edge.`;
            }
            n += EO[i];
        }
        if (n%2!=0) {
            return `Sum of edge orientations is not even.`;
        }

        const CP = Array(8);
        for (let i=0; i<8; i++) {
            CP[i] = -1;
        }
        const CO = Array(8);

        for (let i=0; i<8 && CP[i]==-1; i++) {
            for (let j=0; j<8; j++) {
                for (let k=0; k<3; k++) {
                    let ok = true;
                    for (let l=0; l<3; l++) {
                        if (Cube.initialFaces[Cube.corners[i][l]]!=this.faces[Cube.corners[j][(k+l)%3]]) {
                            ok = false;
                            break;
                        }
                    }
                    if (ok) {
                        CP[i] = j;
                        CO[i] = k;
                    }
                }
            }
        }

        n = 0;
        for (let i=0; i<8; i++) {
            if (CP[i]==-1) {
                return `No ${Cube.corners[i].map(c => colorNames[Cube.initialFaces[c]]).join("-")} corner.`;
            }
            n += CO[i];
        }
        if (n%3!=0) {
            return `Sum of corner orientations is not multiple of 3.`;
        }

        let p = 0;
        for (let i=0; i<12; i++) {
            for (let j=0; j<i; j++) {
                if (EP[j]>EP[i]) {
                    p++;
                }
            }
        }
        for (let i=0; i<8; i++) {
            for (let j=0; j<i; j++) {
                if (CP[j]>CP[i]) {
                    p++;
                }
            }
        }
        if (p%2!=0) {
            return "Edges and corners parity do not match.";
        }

        return "";
    }
};
