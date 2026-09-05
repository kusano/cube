let standalone = false;
if (typeof postMessage=="undefined") {
    postMessage = console.log;
    standalone = true;
}

// 要素が 0 から b-1 までの長さ n の配列。
function powerToIndex(P, n, b) {
    let index = 0;
    for (let i=0; i<n; i++) {
        index = index*b+P[i];
    }
    return index;
}

function indexToPower(index, n, b) {
    const P = Array(n);
    for (let i=n-1; i>=0; i--) {
        P[i] = index%b;
        index = index/b|0;
    }
    return P;
}

// 0 から n-1 までを並び替えた配列。
function permToIndex(P, n) {
    let index = 0;
    for (let i=0; i<n; i++) {
        let x = P[i];
        for (let j=0; j<i; j++) {
            if (P[j]<P[i]) {
                x--;
            }
        }
        index = index*(n-i)+x;
    }
    return index;
}

function indexToPerm(index, n) {
    const P = Array(n);
    for (let i=n-1; i>=0; i--) {
        P[i] = index%(n-i);
        index = index/(n-i)|0;
        for (let j=i+1; j<n; j++) {
            if (P[j]>=P[i]) {
                P[j]++;
            }
        }
    }
    return P;
}

// n 個中 m 個が 1 の配列。
function comb(n, m) {
    if (m>n) {
        return 0;
    }

    const F = [1, 1, 2, 6, 24, 120, 720, 5040, 40320, 362880, 3628800, 39916800, 479001600];
    return F[n]/F[m]/F[n-m];
}

function combToIndex(C, n, m) {
    let index = 0;
    for (let i=0; i<n; i++) {
        if (C[i]!=0) {
            index += comb(n-i-1, m);
            m--;
        }
    }
    return index;
}

function indexToComb(index, n, m) {
    const C = Array(n);
    for (let i=0; i<n; i++) {
        if (index<comb(n-i-1, m)) {
            C[i] = 0;
        } else {
            C[i] = 1;
            index -= comb(n-i-1, m);
            m -= 1;
        }
    }
    return C;
}

const MOVE_F1 =  0;
const MOVE_F2 =  1;
const MOVE_F3 =  2;
const MOVE_B1 =  3;
const MOVE_B2 =  4;
const MOVE_B3 =  5;
const MOVE_R1 =  6;
const MOVE_R2 =  7;
const MOVE_R3 =  8;
const MOVE_L1 =  9;
const MOVE_L2 = 10;
const MOVE_L3 = 11;
const MOVE_U1 = 12;
const MOVE_U2 = 13;
const MOVE_U3 = 14;
const MOVE_D1 = 15;
const MOVE_D2 = 16;
const MOVE_D3 = 17;

const moveNames = [
    "F", "F2", "F'",
    "B", "B2", "B'",
    "R", "R2", "R'",
    "L", "L2", "L'",
    "U", "U2", "U'",
    "D", "D2", "D'",
];

function reverseMove(move) {
    return move-move%3*2+2;
}

function reverseMoves(moves) {
    const result = Array(moves.length);
    for (let i=0; i<moves.length; i++) {
        result[moves.length-i-1] = reverseMove(moves[i]);
    }
    return result;
}

// axis を U/D の向きにする。
function changeAxis(moves, axis) {
    const table = {
        "U/D": {
            [MOVE_F1]: MOVE_F1,
            [MOVE_B1]: MOVE_B1,
            [MOVE_R1]: MOVE_R1,
            [MOVE_L1]: MOVE_L1,
            [MOVE_U1]: MOVE_U1,
            [MOVE_D1]: MOVE_D1,
        },
        "F/B": {
            [MOVE_F1]: MOVE_U1,
            [MOVE_B1]: MOVE_D1,
            [MOVE_R1]: MOVE_F1,
            [MOVE_L1]: MOVE_B1,
            [MOVE_U1]: MOVE_R1,
            [MOVE_D1]: MOVE_L1,
        },
        "R/L": {
            [MOVE_F1]: MOVE_R1,
            [MOVE_B1]: MOVE_L1,
            [MOVE_R1]: MOVE_U1,
            [MOVE_L1]: MOVE_D1,
            [MOVE_U1]: MOVE_F1,
            [MOVE_D1]: MOVE_B1,
        },
    };

    const result = [];
    for (const move of moves) {
        result.push(table[axis][move-move%3]+move%3);
    }
    return result;
}

// changeAxis を元に戻す。
function restoreAxis(moves, axis) {
    const table = {
        "U/D": {
            [MOVE_F1]: MOVE_F1,
            [MOVE_B1]: MOVE_B1,
            [MOVE_R1]: MOVE_R1,
            [MOVE_L1]: MOVE_L1,
            [MOVE_U1]: MOVE_U1,
            [MOVE_D1]: MOVE_D1,
        },
        "F/B": {
            [MOVE_F1]: MOVE_R1,
            [MOVE_B1]: MOVE_L1,
            [MOVE_R1]: MOVE_U1,
            [MOVE_L1]: MOVE_D1,
            [MOVE_U1]: MOVE_F1,
            [MOVE_D1]: MOVE_B1,
        },
        "R/L": {
            [MOVE_F1]: MOVE_U1,
            [MOVE_B1]: MOVE_D1,
            [MOVE_R1]: MOVE_F1,
            [MOVE_L1]: MOVE_B1,
            [MOVE_U1]: MOVE_R1,
            [MOVE_D1]: MOVE_L1,
        },
    };

    const result = [];
    for (const move of moves) {
        result.push(table[axis][move-move%3]+move%3);
    }
    return result;
}

/*
     0----0----1
    /|        /|
   3 |       1 |
  /  8      /  9
 3----2----2   |
 |   |     |   |
 |   4----4|---5
11  /     10  /
 | 7       | 5
 |/        |/
 7----6----6
*/

// ステッカーの情報を持つ。
class Cube {
    static {
        const moveTable = Array(18);
        moveTable[MOVE_F1] = [ 0,  1,  2,  3,  4,  5, 17, 14, 11,   9, 10, 45, 12, 13, 46, 15, 16, 47,  24, 21, 18, 25, 22, 19, 26, 23, 20,   6, 28, 29,  7, 31, 32,  8, 34, 35,  36, 37, 38, 39, 40, 41, 42, 43, 44,  33, 30, 27, 48, 49, 50, 51, 52, 53];
        moveTable[MOVE_B1] = [29, 32, 35,  3,  4,  5,  6,  7,  8,   2, 10, 11,  1, 13, 14,  0, 16, 17,  18, 19, 20, 21, 22, 23, 24, 25, 26,  27, 28, 53, 30, 31, 52, 33, 34, 51,  42, 39, 36, 43, 40, 37, 44, 41, 38,  45, 46, 47, 48, 49, 50,  9, 12, 15];
        moveTable[MOVE_R1] = [ 0,  1, 20,  3,  4, 23,  6,  7, 26,   9, 10, 11, 12, 13, 14, 15, 16, 17,  18, 19, 47, 21, 22, 50, 24, 25, 53,  33, 30, 27, 34, 31, 28, 35, 32, 29,   8, 37, 38,  5, 40, 41,  2, 43, 44,  45, 46, 42, 48, 49, 39, 51, 52, 36];
        moveTable[MOVE_L1] = [44,  1,  2, 41,  4,  5, 38,  7,  8,  15, 12,  9, 16, 13, 10, 17, 14, 11,   0, 19, 20,  3, 22, 23,  6, 25, 26,  27, 28, 29, 30, 31, 32, 33, 34, 35,  36, 37, 51, 39, 40, 48, 42, 43, 45,  18, 46, 47, 21, 49, 50, 24, 52, 53];
        moveTable[MOVE_U1] = [ 6,  3,  0,  7,  4,  1,  8,  5,  2,  18, 19, 20, 12, 13, 14, 15, 16, 17,  27, 28, 29, 21, 22, 23, 24, 25, 26,  36, 37, 38, 30, 31, 32, 33, 34, 35,   9, 10, 11, 39, 40, 41, 42, 43, 44,  45, 46, 47, 48, 49, 50, 51, 52, 53];
        moveTable[MOVE_D1] = [ 0,  1,  2,  3,  4,  5,  6,  7,  8,   9, 10, 11, 12, 13, 14, 42, 43, 44,  18, 19, 20, 21, 22, 23, 15, 16, 17,  27, 28, 29, 30, 31, 32, 24, 25, 26,  36, 37, 38, 39, 40, 41, 33, 34, 35,  51, 48, 45, 52, 49, 46, 53, 50, 47];
        for (let move=0; move<18; move+=3) {
            moveTable[move+1] = Array(54);
            for (let f=0; f<54; f++) {
                moveTable[move+1][f] = moveTable[move][moveTable[move][f]];
            }
            moveTable[move+2] = Array(54);
            for (let f=0; f<54; f++) {
                moveTable[move+2][f] = moveTable[move][moveTable[move+1][f]];
            }
        }
        Cube.moveTable = moveTable;
    };

    constructor() {
        this.F = Array(54);
        for (let i=0; i<54; i++) {
            this.F[i] = "ULFRBD"[i/9|0];
        }

        this.history = [];
    }

    move(move) {
        const tmp = [...this.F];
        for (let i=0; i<54; i++) {
            this.F[i] = tmp[Cube.moveTable[move][i]];
        }

        this.history.push(move);
    }

    undo() {
        const move = reverseMove(this.history.pop());

        const tmp = [...this.F];
        for (let i=0; i<54; i++) {
            this.F[i] = tmp[Cube.moveTable[move][i]];
        }
    }
};

// CO, EO, EPのうちE層のエッジかどうかを持つ。
class CubePhase1 {
    static {
        const tableCO = Array(18);
        for (let move=0; move<18; move++) {
            tableCO[move] = new Uint16Array(6561); // 3^8
        }
        for (let co=0; co<6561; co++) {
            const CO = indexToPower(co, 8, 3);
            tableCO[MOVE_F1][co] = powerToIndex([CO[0], CO[1], (CO[3]+1)%3, (CO[7]+2)%3, CO[4], CO[5], (CO[2]+2)%3, (CO[6]+1)%3], 8, 3);
            tableCO[MOVE_B1][co] = powerToIndex([(CO[1]+1)%3, (CO[5]+2)%3, CO[2], CO[3], (CO[0]+2)%3, (CO[4]+1)%3, CO[6], CO[7]], 8, 3);
            tableCO[MOVE_R1][co] = powerToIndex([CO[0], (CO[2]+1)%3, (CO[6]+2)%3, CO[3], CO[4], (CO[1]+2)%3, (CO[5]+1)%3, CO[7]], 8, 3);
            tableCO[MOVE_L1][co] = powerToIndex([(CO[4]+2)%3, CO[1], CO[2], (CO[0]+1)%3, (CO[7]+1)%3, CO[5], CO[6], (CO[3]+2)%3], 8, 3);
            tableCO[MOVE_U1][co] = powerToIndex([CO[3], CO[0], CO[1], CO[2], CO[4], CO[5], CO[6], CO[7]], 8, 3);
            tableCO[MOVE_D1][co] = powerToIndex([CO[0], CO[1], CO[2], CO[3], CO[5], CO[6], CO[7], CO[4]], 8, 3);
        }
        for (let move=0; move<18; move+=3) {
            for (let co=0; co<6561; co++) {
                tableCO[move+1][co] = tableCO[move][tableCO[move][co]];
                tableCO[move+2][co] = tableCO[move][tableCO[move][tableCO[move][co]]];
            }
        }
        CubePhase1.tableCO = tableCO;

        const tableEO = Array(18);
        for (let move=0; move<18; move++) {
            tableEO[move] = new Uint16Array(4096); // 2^12
        }
        for (let eo=0; eo<4096; eo++) {
            const EO = indexToPower(eo, 12, 2);
            tableEO[MOVE_F1][eo] = powerToIndex([EO[0], EO[1], EO[11]^1, EO[3], EO[4], EO[5], EO[10]^1, EO[7], EO[8], EO[9], EO[2]^1, EO[6]^1], 12, 2);
            tableEO[MOVE_B1][eo] = powerToIndex([EO[9]^1, EO[1], EO[2], EO[3], EO[8]^1, EO[5], EO[6], EO[7], EO[0]^1, EO[4]^1, EO[10], EO[11]], 12, 2);
            tableEO[MOVE_R1][eo] = powerToIndex([EO[0], EO[10], EO[2], EO[3], EO[4], EO[9], EO[6], EO[7], EO[8], EO[1], EO[5], EO[11]], 12, 2);
            tableEO[MOVE_L1][eo] = powerToIndex([EO[0], EO[1], EO[2], EO[8], EO[4], EO[5], EO[6], EO[11], EO[7], EO[9], EO[10], EO[3]], 12, 2);
            tableEO[MOVE_U1][eo] = powerToIndex([EO[3], EO[0], EO[1], EO[2], EO[4], EO[5], EO[6], EO[7], EO[8], EO[9], EO[10], EO[11]], 12, 2);
            tableEO[MOVE_D1][eo] = powerToIndex([EO[0], EO[1], EO[2], EO[3], EO[5], EO[6], EO[7], EO[4], EO[8], EO[9], EO[10], EO[11]], 12, 2);
        }
        for (let move=0; move<18; move+=3) {
            for (let eo=0; eo<4096; eo++) {
                tableEO[move+1][eo] = tableEO[move][tableEO[move][eo]];
                tableEO[move+2][eo] = tableEO[move][tableEO[move][tableEO[move][eo]]];
            }
        }
        CubePhase1.tableEO = tableEO;

        const tableEP = Array(18);
        for (let move=0; move<18; move++) {
            tableEP[move] = new Uint16Array(495); // C(12, 4)
        }
        for (let ep=0; ep<495; ep++) {
            const EP = indexToComb(ep, 12, 4);
            tableEP[MOVE_F1][ep] = combToIndex([EP[0], EP[1], EP[11], EP[3], EP[4], EP[5], EP[10], EP[7], EP[8], EP[9], EP[2], EP[6]], 12, 4);
            tableEP[MOVE_B1][ep] = combToIndex([EP[9], EP[1], EP[2], EP[3], EP[8], EP[5], EP[6], EP[7], EP[0], EP[4], EP[10], EP[11]], 12, 4);
            tableEP[MOVE_R1][ep] = combToIndex([EP[0], EP[10], EP[2], EP[3], EP[4], EP[9], EP[6], EP[7], EP[8], EP[1], EP[5], EP[11]], 12, 4);
            tableEP[MOVE_L1][ep] = combToIndex([EP[0], EP[1], EP[2], EP[8], EP[4], EP[5], EP[6], EP[11], EP[7], EP[9], EP[10], EP[3]], 12, 4);
            tableEP[MOVE_U1][ep] = combToIndex([EP[3], EP[0], EP[1], EP[2], EP[4], EP[5], EP[6], EP[7], EP[8], EP[9], EP[10], EP[11]], 12, 4);
            tableEP[MOVE_D1][ep] = combToIndex([EP[0], EP[1], EP[2], EP[3], EP[5], EP[6], EP[7], EP[4], EP[8], EP[9], EP[10], EP[11]], 12, 4);
        }
        for (let move=0; move<18; move+=3) {
            for (let ep=0; ep<495; ep++) {
                tableEP[move+1][ep] = tableEP[move][tableEP[move][ep]];
                tableEP[move+2][ep] = tableEP[move][tableEP[move][tableEP[move][ep]]];
            }
        }
        CubePhase1.tableEP = tableEP;
    }

    constructor() {
        this.CO = 0;
        this.EO = 0;
        this.EP = 0; // 000000001111

        this.history = [];
    }

    move(move) {
        this.CO = CubePhase1.tableCO[move][this.CO];
        this.EO = CubePhase1.tableEO[move][this.EO];
        this.EP = CubePhase1.tableEP[move][this.EP];

        this.history.push(move);
    }

    undo() {
        const move = reverseMove(this.history.pop());

        this.CO = CubePhase1.tableCO[move][this.CO];
        this.EO = CubePhase1.tableEO[move][this.EO];
        this.EP = CubePhase1.tableEP[move][this.EP];
    }
};

// CPと、U/DエッジのEP、E層エッジのEPを持つ。
class CubePhase2 {
    static allowedMoves = [
                 MOVE_F2,
                 MOVE_B2,
                 MOVE_R2,
                 MOVE_L2,
        MOVE_U1, MOVE_U2, MOVE_U3,
        MOVE_D1, MOVE_D2, MOVE_D3,
    ];

    static {
        const tableCP = Array(18);
        for (const move of CubePhase2.allowedMoves) {
            tableCP[move] = new Uint16Array(40320); // 8!
        }
        for (let cp=0; cp<40320; cp++) {
            const CP = indexToPerm(cp, 8);
            tableCP[MOVE_F2][cp] = permToIndex([CP[0], CP[1], CP[7], CP[6], CP[4], CP[5], CP[3], CP[2]], 8);
            tableCP[MOVE_B2][cp] = permToIndex([CP[5], CP[4], CP[2], CP[3], CP[1], CP[0], CP[6], CP[7]], 8);
            tableCP[MOVE_R2][cp] = permToIndex([CP[0], CP[6], CP[5], CP[3], CP[4], CP[2], CP[1], CP[7]], 8);
            tableCP[MOVE_L2][cp] = permToIndex([CP[7], CP[1], CP[2], CP[4], CP[3], CP[5], CP[6], CP[0]], 8);
            tableCP[MOVE_U1][cp] = permToIndex([CP[3], CP[0], CP[1], CP[2], CP[4], CP[5], CP[6], CP[7]], 8);
            tableCP[MOVE_D1][cp] = permToIndex([CP[0], CP[1], CP[2], CP[3], CP[5], CP[6], CP[7], CP[4]], 8);
        }
        for (const move of [MOVE_U1, MOVE_D1]) {
            for (let cp=0; cp<40320; cp++) {
                tableCP[move+1][cp] = tableCP[move][tableCP[move][cp]];
                tableCP[move+2][cp] = tableCP[move][tableCP[move][tableCP[move][cp]]];
            }
        }
        CubePhase2.tableCP = tableCP;

        const tableEP1 = Array(18);
        for (const move of CubePhase2.allowedMoves) {
            tableEP1[move] = new Uint16Array(40320); // 8!
        }
        for (let ep=0; ep<40320; ep++) {
            const EP = indexToPerm(ep, 8);
            tableEP1[MOVE_F2][ep] = permToIndex([EP[0], EP[1], EP[6], EP[3], EP[4], EP[5], EP[2], EP[7]], 8);
            tableEP1[MOVE_B2][ep] = permToIndex([EP[4], EP[1], EP[2], EP[3], EP[0], EP[5], EP[6], EP[7]], 8);
            tableEP1[MOVE_R2][ep] = permToIndex([EP[0], EP[5], EP[2], EP[3], EP[4], EP[1], EP[6], EP[7]], 8);
            tableEP1[MOVE_L2][ep] = permToIndex([EP[0], EP[1], EP[2], EP[7], EP[4], EP[5], EP[6], EP[3]], 8);
            tableEP1[MOVE_U1][ep] = permToIndex([EP[3], EP[0], EP[1], EP[2], EP[4], EP[5], EP[6], EP[7]], 8);
            tableEP1[MOVE_D1][ep] = permToIndex([EP[0], EP[1], EP[2], EP[3], EP[5], EP[6], EP[7], EP[4]], 8);
        }
        for (const move of [MOVE_U1, MOVE_D1]) {
            for (let ep=0; ep<40320; ep++) {
                tableEP1[move+1][ep] = tableEP1[move][tableEP1[move][ep]];
                tableEP1[move+2][ep] = tableEP1[move][tableEP1[move][tableEP1[move][ep]]];
            }
        }
        CubePhase2.tableEP1 = tableEP1;

        const tableEP2 = Array(18);
        for (const move of CubePhase2.allowedMoves) {
            tableEP2[move] = new Uint16Array(24); // 4!
        }
        for (let ep=0; ep<24; ep++) {
            const EP = indexToPerm(ep, 4);
            tableEP2[MOVE_F2][ep] = permToIndex([EP[0], EP[1], EP[3], EP[2]], 4);
            tableEP2[MOVE_B2][ep] = permToIndex([EP[1], EP[0], EP[2], EP[3]], 4);
            tableEP2[MOVE_R2][ep] = permToIndex([EP[0], EP[2], EP[1], EP[3]], 4);
            tableEP2[MOVE_L2][ep] = permToIndex([EP[3], EP[1], EP[2], EP[0]], 4);
            tableEP2[MOVE_U1][ep] = permToIndex([EP[0], EP[1], EP[2], EP[3]], 4);
            tableEP2[MOVE_D1][ep] = permToIndex([EP[0], EP[1], EP[2], EP[3]], 4);
        }
        for (const move of [MOVE_U1, MOVE_D1]) {
            for (let ep=0; ep<24; ep++) {
                tableEP2[move+1][ep] = tableEP2[move][tableEP2[move][ep]];
                tableEP2[move+2][ep] = tableEP2[move][tableEP2[move][tableEP2[move][ep]]];
            }
        }
        CubePhase2.tableEP2 = tableEP2;
    }

    constructor(cube) {
        if (cube===undefined) {
            this.CP = permToIndex([0, 1, 2, 3, 4, 5, 6, 7], 8);
            this.EP1 = permToIndex([0, 1, 2, 3, 4, 5, 6, 7], 8);
            this.EP2 = permToIndex([0, 1, 2, 3], 4);
        } else {
            const CI = [
                [ 0,  9, 38], [ 2, 36, 29], [ 8, 27, 20], [ 6, 18, 11],
                [51, 44, 15], [53, 35, 42], [47, 26, 33], [45, 17, 24],
            ];
            const CP = Array(8);
            for (let i=0; i<8; i++) {
                for (let j=0; j<8; j++) {
                    if (cube.F[CI[i][0]]=="ULFRBD"[CI[j][0]/9|0] &&
                        cube.F[CI[i][1]]=="ULFRBD"[CI[j][1]/9|0] &&
                        cube.F[CI[i][2]]=="ULFRBD"[CI[j][2]/9|0]) {
                        CP[i] = j;
                    }
                }
            }
            this.CP = permToIndex(CP, 8);

            const EI1 = [
                [ 1, 37], [ 5, 28], [ 7, 19], [ 3, 10],
                [52, 43], [50, 34], [46, 25], [48, 16],
            ];
            const EP1 = Array(8);
            for (let i=0; i<8; i++) {
                for (let j=0; j<8; j++) {
                    if (cube.F[EI1[i][0]]=="ULFRBD"[EI1[j][0]/9|0] &&
                        cube.F[EI1[i][1]]=="ULFRBD"[EI1[j][1]/9|0]) {
                        EP1[i] = j;
                    }
                }
            }
            this.EP1 = permToIndex(EP1, 8);

            const EI2 = [
                [41, 12], [39, 32], [23, 30], [21, 14],
            ];
            const EP2 = Array(4);
            for (let i=0; i<4; i++) {
                for (let j=0; j<4; j++) {
                    if (cube.F[EI2[i][0]]=="ULFRBD"[EI2[j][0]/9|0] &&
                        cube.F[EI2[i][1]]=="ULFRBD"[EI2[j][1]/9|0]) {
                        EP2[i] = j;
                    }
                }
            }
            this.EP2 = permToIndex(EP2, 4);
        }

        this.history = [];
    }

    move(move) {
        this.CP = CubePhase2.tableCP[move][this.CP];
        this.EP1 = CubePhase2.tableEP1[move][this.EP1];
        this.EP2 = CubePhase2.tableEP2[move][this.EP2];

        this.history.push(move);
    }

    undo() {
        const move = reverseMove(this.history.pop());

        this.CP = CubePhase2.tableCP[move][this.CP];
        this.EP1 = CubePhase2.tableEP1[move][this.EP1];
        this.EP2 = CubePhase2.tableEP2[move][this.EP2];
    }
};

let phase1Nodes = 0;
let phase2Nodes = 0;

const phase1HCO = new Uint8Array(6561);
{
    for (let co=0; co<6561; co++) {
        phase1HCO[co] = 255;
    }

    const cube = new CubePhase1();
    phase1HCO[cube.CO] = 0;
    for (let d=0; ; d++) {
        let n = 0;
        let update = false;
        for (let co=0; co<6561; co++) {
            if (phase1HCO[co]==d) {
                cube.CO = co;
                for (let move=0; move<18; move++) {
                    cube.move(move);
                    if (phase1HCO[cube.CO]==255) {
                        phase1HCO[cube.CO] = d+1;
                        n++;
                        update = true;
                    }
                    cube.undo();
                }
            }
        }
        //console.log(d+1, n);
        if (!update) {
            break;
        }
    }
}

const phase1HE = new Uint8Array(4096*495);
{
    for (let e=0; e<4096*495; e++) {
        phase1HE[e] = 255;
    }

    const cube = new CubePhase1();
    phase1HE[cube.EO+cube.EP*4096] = 0;
    for (let d=0; ; d++) {
        let n = 0;
        let update = false;
        for (let e=0; e<4096*495; e++) {
            if (phase1HE[e]==d) {
                cube.EO = e%4096;
                cube.EP = e/4096|0;
                for (let move=0; move<18; move++) {
                    cube.move(move);
                    const e2 = cube.EO+cube.EP*4096;
                    if (phase1HE[e2]==255) {
                        phase1HE[e2] = d+1;
                        n++;
                        update = true;
                    }
                    cube.undo();
                }
            }
        }
        //console.log(d+1, n);
        if (!update) {
            break;
        }
    }
}

function solvePhase1(scramble, DRMaxNumber) {
    const cube = new CubePhase1();

    let DRNumber = 0;
    const movesI = [];
    const movesN = [];

    function searchN(depth, maxDepthN, reverse, axis, lastMove) {
        phase1Nodes++;
        sendNodes();

        if (depth==maxDepthN) {
            if (cube.CO==0 && cube.EO==0 && cube.EP==0) {
                if (!reverse) {
                    solvePhase2(changeAxis(scramble, axis), movesN, reverseMoves(movesI), axis);
                } else {
                    solvePhase2(changeAxis(scramble, axis), reverseMoves(movesI), movesN, axis);
                }
                DRNumber++;
                if (DRNumber>=DRMaxNumber) {
                    return true;
                }

            }
            return false;
        }

        const hCO = phase1HCO[cube.CO];
        const hE = phase1HE[cube.EO+cube.EP*4096];
        if (depth+Math.max(hCO, hE)>maxDepthN) {
            return false;
        }

        for (let move=0; move<18; move++) {
            // 直前の手とは面が異なる。
            // また、同じ軸の動きは、F→B、R→L、U→Dの順番に限る。
            if (lastMove>=0 &&
                !((move/3|0)!=(lastMove/3|0) &&
                  ((move/3|0)!=0 || (lastMove/3|0)!=1) &&
                  ((move/3|0)!=2 || (lastMove/3|0)!=3) &&
                  ((move/3|0)!=4 || (lastMove/3|0)!=5))) {
                continue;
            }
            // 最後の1手は非DRムーブ。
            // また、反時計回りは、時計回り＋180度回転なので、省く。
            if (depth+1==maxDepthN &&
                !(move==MOVE_R1 ||
                  move==MOVE_L1 ||
                  move==MOVE_F1 ||
                  move==MOVE_B1)) {
                continue;
            }
            // 最後の1手と直前の手が同じ軸ならば、直前の手も非DRムーブに限る。
            if (depth+1==maxDepthN &&
                lastMove>=0 &&
                (move/6|0)==(lastMove/6|0) &&
                !(lastMove==MOVE_R1 ||
                  lastMove==MOVE_L1 ||
                  lastMove==MOVE_F1 ||
                  lastMove==MOVE_B1)) {
                continue;
            }

            cube.move(move);
            movesN.push(move);

            const result = searchN(depth+1, maxDepthN, reverse, axis, move);

            cube.undo();
            movesN.pop();

            if (result) {
                return true;
            }
        }
        return false;
    }

    function searchI(depth, maxDepthI, maxDepthN, reverse, axis, lastMove) {
        phase1Nodes++;
        sendNodes();

        if (depth==maxDepthI) {
            if (!reverse) {
                for (const move of changeAxis(scramble, axis)) {
                    cube.move(move);
                }
            } else {
                for (const move of reverseMoves(changeAxis(scramble, axis))) {
                    cube.move(move);
                }
            }

            const result = searchN(0, maxDepthN, reverse, axis, -1);

            for (const _ of scramble) {
                cube.undo();
            }

            return result;
        }

        for (let move=0; move<18; move++) {
            // 直前の手とは面が異なる。
            // また、同じ軸の動きは、F→B、R→L、U→Dの順番に限る。
            // moveI は逆転させて使うことので、制約も逆にする。
            if (lastMove>=0 &&
                !((move/3|0)!=(lastMove/3|0) &&
                  ((move/3|0)!=1 || (lastMove/3|0)!=0) &&
                  ((move/3|0)!=3 || (lastMove/3|0)!=2) &&
                  ((move/3|0)!=5 || (lastMove/3|0)!=4))) {
                continue;
            }
            // 最後の1手は非DRムーブ。
            // また、反時計回りは、時計回り＋180度回転なので、省く。
            if (depth==0 &&
                !(move==MOVE_R3 ||
                  move==MOVE_L3 ||
                  move==MOVE_F3 ||
                  move==MOVE_B3)) {
                continue;
            }
            // 最後の1手と直前の手が同じ軸ならば、直前の手も非DRムーブに限る。
            if (depth==1 &&
                (move/6|0)==(lastMove/6|0) &&
                !(move==MOVE_R3 ||
                  move==MOVE_L3 ||
                  move==MOVE_F3 ||
                  move==MOVE_B3)) {
                continue;
            }

            cube.move(move);
            movesI.push(move);

            const result = searchI(depth+1, maxDepthI, maxDepthN, reverse, axis, move);

            cube.undo();
            movesI.pop();

            if (result) {
                return true;
            }
        }
        return false;
    }

    for (let maxDepth=0; ; maxDepth++) {
        postMessage({
            type: "dr_depth",
            depth: maxDepth,
        });

        for (let maxDepthI=0; maxDepthI<=maxDepth; maxDepthI++) {
            const maxDepthN = maxDepth-maxDepthI;

            for (const axis of ["U/D", "F/B", "R/L"]) {
                // ヒューリスティックを活用するため、インバースのほうが長ければ、逆に探索して最後に元に戻す。
                let result;
                if (maxDepthI<maxDepthN) {
                    result = searchI(0, maxDepthI, maxDepthN, false, axis, -1);
                } else {
                    result = searchI(0, maxDepthN, maxDepthI, true, axis, -1);
                }
                if (result) {
                    return;
                }
            }
        }
    }
}

// const phase2HCP = new Uint8Array(40320);
// {
//     for (let cp=0; cp<40320; cp++) {
//         phase2HCP[cp] = 255;
//     }

//     const cube = new CubePhase2();
//     phase2HCP[cube.CP] = 0;
//     for (let d=0; ; d++) {
//         let n = 0;
//         let update = false;
//         for (let cp=0; cp<40320; cp++) {
//             if (phase2HCP[cp]==d) {
//                 cube.CP = cp;
//                 for (const move of CubePhase2.allowedMoves) {
//                     cube.move(move);
//                     if (phase2HCP[cube.CP]==255) {
//                         phase2HCP[cube.CP] = d+1;
//                         n++;
//                         update = true;
//                     }
//                     cube.undo();
//                 }
//             }
//         }
//         console.log(d+1, n);
//         if (!update) {
//             break;
//         }
//     }
// }

const phase2HCPEP = new Uint8Array(40320*24);
{
    for (let cpep=0; cpep<40320*24; cpep++) {
        phase2HCPEP[cpep] = 255;
    }

    const cube = new CubePhase2();
    phase2HCPEP[cube.CP*24+cube.EP2] = 0;
    for (let d=0; ; d++) {
        let n = 0;
        let update = false;
        for (let cpep=0; cpep<40320*24; cpep++) {
            if (phase2HCPEP[cpep]==d) {
                cube.CP = cpep/24|0;
                cube.EP2 = cpep%24;
                for (const move of CubePhase2.allowedMoves) {
                    cube.move(move);
                    if (phase2HCPEP[cube.CP*24+cube.EP2]==255) {
                        phase2HCPEP[cube.CP*24+cube.EP2] = d+1;
                        n++;
                        update = true;
                    }
                    cube.undo();
                }
            }
        }
        //console.log(d+1, n);
        if (!update) {
            break;
        }
    }
}

const phase2HEP = new Uint8Array(40320*24);
{
    for (let ep=0; ep<40320*24; ep++) {
        phase2HEP[ep] = 255;
    }

    const cube = new CubePhase2();
    phase2HEP[cube.EP1*24+cube.EP2] = 0;
    for (let d=0; ; d++) {
        let n = 0;
        let update = false;
        for (let ep=0; ep<40320*24; ep++) {
            if (phase2HEP[ep]==d) {
                cube.EP1 = ep/24|0;
                cube.EP2 = ep%24;
                for (const move of CubePhase2.allowedMoves) {
                    cube.move(move);
                    const ep2 = cube.EP1*24+cube.EP2;
                    if (phase2HEP[ep2]==255) {
                        phase2HEP[ep2] = d+1;
                        n++;
                        update = true;
                    }
                    cube.undo();
                }
            }
        }
        //console.log(d+1, n);
        if (!update) {
            break;
        }
    }
}

const tableQT = Array(40320);
{
    for (let cp=0; cp<40320; cp++) {
        tableQT[cp] = 255;
    }

    const cube = new CubePhase2();
    tableQT[cube.CP] = 0;

    for (let qt=0; ; qt++) {
        while (true) {
            let update = false;
            for (let cp=0; cp<40320; cp++) {
                if (tableQT[cp]==qt) {
                    cube.CP = cp;
                    for (const move of [MOVE_F2, MOVE_B2, MOVE_R2, MOVE_L2, MOVE_U2, MOVE_D2]) {
                        cube.move(move);
                        if (tableQT[cube.CP]==255) {
                            tableQT[cube.CP] = qt;
                            update = true;
                        }
                        cube.undo();
                    }
                }
            }
            if (!update) {
                break;
            }
        }

        let update = false;
        for (let cp=0; cp<40320; cp++) {
            if (tableQT[cp]==qt) {
                cube.CP = cp;
                for (const move of [MOVE_U1, MOVE_U3, MOVE_D1, MOVE_D3]) {
                    cube.move(move);
                    if (tableQT[cube.CP]==255) {
                        tableQT[cube.CP] = qt+1;
                        update = true;
                    }
                    cube.undo();
                }
            }
        }
        if (!update) {
            break;
        }
    }

    // for (let qt=0; qt<7; qt++) {
    //     let n = 0;
    //     for (let cp=0; cp<40320; cp++) {
    //         if (tableQT[cp]==qt) {
    //             n++;
    //         }
    //     }
    //     console.log(qt, n);
    // }
}

function getSubset(scramble, normal, inverse) {
    const cubeFace = new Cube();
    for (const move of [...reverseMoves(inverse), ...scramble, ...normal]) {
        cubeFace.move(move);
    }
    const cube = new CubePhase2(cubeFace);

    const CP = indexToPerm(cube.CP, 8);
    const EP = indexToPerm(cube.EP1, 8);

    let C = "";
    let cn = 0;
    for (let i=0; i<8; i++) {
        if (([0, 2, 5, 7].indexOf(i)>=0)==([0, 2, 5, 7].indexOf(CP[i])>=0)) {
            C += "o";
        } else {
            C += "x";
            cn++;
        }
    }

    let en = 0;
    for (let i=0; i<8; i++) {
        if (i%2!=EP[i]%2) {
            en++;
        }
    }

    let subset;
    switch (cn) {
        case 0:
            subset = "0c";
            break;
        case 2:
            subset = "0c";
            break;
        case 4:
            // 上下の同じ位置のコーナーがバッドエッジかどうかが、全て一致していれば4a、そうでなければ4b。
            let n = 0;
            for (let i=0; i<4; i++) {
                if (C[i]==C[i+4]) {
                    n += 1;
                }
            }
            if (n==0 || n==4) {
                subset = "4a";
            } else {
                subset = "4b";
            }
            en = Math.min(en, 8-en);
            break;
        case 6:
            subset = "2c";
            en = 8-en;
            break;
        case 8:
            subset = "0c";
            en = 8-en;
            break;
    }
    subset += tableQT[cube.CP];

    // 4[ab][34] はinverseでaとbが切り替わるので、c表記。
    if (subset=="4a3" || subset=="4b3") {
        subset = "4c3";
    }
    if (subset=="4a4" || subset=="4b4") {
        subset = "4c4";
    }

    return [subset, en+"e"];
}

// scramble, normal, inverse は changeAxis 適用後。
function solvePhase2(scramble, normal, inverse, axis) {
    let cube;
    let moves = [];

    function search(depth, maxDepth, lastMove, normal, inverse) {
        phase2Nodes++;
        sendNodes();

        if (depth==maxDepth) {
            if (cube.CP==0 && cube.EP1==0 && cube.EP2==0) {
                const [subset, badEdges] = getSubset(scramble, normal, inverse);

                postMessage({
                    type: "dr",
                    DRNormal: restoreAxis(normal, axis).map(x => moveNames[x]),
                    DRInverse: restoreAxis(inverse, axis).map(x => moveNames[x]),
                    finish: restoreAxis(moves, axis).map(x => moveNames[x]),
                    axis,
                    subset,
                    badEdges,
                });
                return true;
            }
            return false;
        }

        const hCP = 0; //phase2HCP[cube.CP];
        const hCPEP = phase2HCPEP[cube.CP*24+cube.EP2];
        const hEP = phase2HEP[cube.EP1*24+cube.EP2];
        if (depth+Math.max(hCP, hCPEP, hEP)>maxDepth) {
            return false;
        }

        for (const move of CubePhase2.allowedMoves) {
            if (lastMove>=0 &&
                ((move/3|0)==(lastMove/3|0) ||
                 (move/3|0)==0 && (lastMove/3|0)==1 ||
                 (move/3|0)==2 && (lastMove/3|0)==3 ||
                 (move/3|0)==4 && (lastMove/3|0)==5)) {
                continue;
            }

            cube.move(move);
            moves.push(move);

            const result = search(depth+1, maxDepth, move, normal, inverse);

            cube.undo();
            moves.pop();

            if (result) {
                return true;
            }
        }
        return false;
    }

    for (let maxDepth=0; ; maxDepth++) {
        for (let flip=0; flip<16; flip++) {
            const flipN1 = flip&1;
            const flipN2 = flip>>1&1;
            const flipI1 = flip>>2&1;
            const flipI2 = flip>>3&1;

            if (flipN1==1 && normal.length==0) {
                continue;
            }
            // 2手前を逆にできるのは、normal の最後の2手が同じ軸の場合のみ。
            if (flipN2==1 && !(normal.length>=2 && (normal.at(-1)/6|0)==(normal.at(-2)/6|0))) {
                continue;
            }
            if (flipI1==1 && inverse.length==0) {
                continue;
            }
            // 2手前を逆にできるのは、inverse の最後の2手が同じ軸の場合のみ。
            if (flipI2==1 && !(inverse.length>=2 && (inverse.at(-2)/6|0)==(inverse.at(-1)/6|0))) {
                continue;
            }

            const normal2 = [...normal];
            const inverse2 = [...inverse];

            function flipMove(move) {
                return move-move%3*2+2;
            }

            if (flipN1) {
                normal2[normal2.length-1] = flipMove(normal2[normal2.length-1]);
            }
            if (flipN2) {
                normal2[normal2.length-2] = flipMove(normal2[normal2.length-2]);
            }
            if (flipI1) {
                inverse2[inverse2.length-1] = flipMove(inverse2[inverse2.length-1]);
            }
            if (flipI2) {
                inverse2[inverse2.length-2] = flipMove(inverse2[inverse2.length-2]);
            }

            const cubeFace = new Cube();
            for (const move of [...reverseMoves(inverse2), ...scramble, ...normal2]) {
                cubeFace.move(move);
            }

            cube = new CubePhase2(cubeFace);
            moves = [];

            if (search(0, maxDepth, -1, normal2, inverse2)) {
                return;
            }
        }
    }
}

function sendNodes() {
    if (!standalone) {
        if ((phase1Nodes+phase2Nodes)%1234567==0) {
            postMessage({
                type: "nodes",
                phase1: phase1Nodes,
                phase2: phase2Nodes,
            });
        }
    }
}

if (standalone) {
    const scramble = "R' U' F U' R2 F2 L2 R2 D' L2 F2 D' R2 B' R' D2 F' D R' B2 L F' D F2 R' U' F";
    solvePhase1(scramble.split(" ").map(x => moveNames.indexOf(x)));
}

onmessage = e => {
    const data = e.data;

    phase1Nodes = 0;
    phase2Nodes = 0;

    solvePhase1(
        data.scramble.map(x => moveNames.indexOf(x)),
        data.DRMaxNumber,
    );

    sendNodes();

    postMessage({
        type: "end",
    });
};
