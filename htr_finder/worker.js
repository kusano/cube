let standalone = false;
if (typeof postMessage=="undefined") {
    postMessage = console.log;
    standalone = true;
}

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

    htrBadCorner(axis) {
        this.move({"U/D": " ", "F/B": "x", "R/L": "z"}[axis]);

        let n = 0;
        for (let c of [18, 20, 24, 26, 36, 38, 42, 44]) {
            if (this.C[c]!=this.C[22] && this.C[c]!=this.C[40]) {
                n++;
            }
        }

        this.undo();

        return n;
    }

    htrBadEdge(axis) {
        this.move({"U/D": " ", "F/B": "x", "R/L": "z"}[axis]);

        let n = 0;
        for (let e of [19, 25, 37, 43]) {
            if (this.C[e]!=this.C[22] && this.C[e]!=this.C[40]) {
                n++;
            }
        }
        for (let e of [10, 16, 28, 34]) {
            if (this.C[e]!=this.C[13] && this.C[e]!=this.C[31]) {
                n++;
            }
        }

        this.undo();

        return n;
    }

    isHTR(axis) {
        this.move({"U/D": " ", "F/B": "x", "R/L": "z"}[axis]);

        const res = (() => {
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
        })();

        this.undo();

        return res;
    }

    // [hyperParity, htrSubset]
    hyperParity(axis) {
        this.move({"U/D": " ", "F/B": "x", "R/L": "z"}[axis]);

        function extractUD(C) {
            let ud = "";
            for (let c of [ 0,  2,  8,  6, 51, 53, 47, 45]) {
                if (C[c]==C[4]) {
                    ud += "o";
                } else {
                    ud += "x";
                }
            }
            return ud;
        }

        function extractFB(C) {
            let fb = "";
            for (let c of [38, 36, 20, 18, 44, 42, 26, 24]) {
                if (C[c]==C[22] || C[c]==C[40]) {
                    fb += "o";
                } else {
                    fb += "x";
                }
            }
            return fb;
        }

        const ud = extractUD(this.C);
        let n = 0;
        for (let i=0; i<4; i++) {
            if (ud[i]=="o") {
                n++;
            }
        }
        let udPattern = "";
        if (n==0 || n==4) {
            udPattern = "Solved";
        } else if (n==1 || n==3) {
            // Bars or Bar/Slash
            let u = -1;
            for (let i=0; i<4; i++) {
                if (ud[i]!=ud[(i+3)%4] && ud[i]!=ud[(i+1)%4]) {
                    u = i;
                }
            }

            let d = -1;
            for (let i=0; i<4; i++) {
                if (ud[i+4]!=ud[(i+3)%4+4] && ud[i+4]!=ud[(i+1)%4+4]) {
                    d = i;
                }
            }

            if ((u-d+4)%4==1 || (u-d+4)%4==3) {
                udPattern = "Bars";
            } else {
                udPattern = "Bar/Slash";
            }
        } else {
            // Slashes or Solved or Bars or Bar/Slash
            function f(F) {
                if (F[0]==F[1]) {return "bar1";}
                if (F[0]==F[3]) {return "bar2";}
                if (F[0]==F[2]) {return "slash";}
            }

            const u = f(ud.substring(0, 4));
            const d = f(ud.substring(4, 8));
            if (u=="slash" && d=="slash") {
                if (ud[0]==ud[4]) {
                    udPattern = "Solved";
                } else {
                    udPattern = "Slashes";
                }
            }
            if (u=="bar1" && d=="bar1" || u=="bar2" && d=="bar2") {
                udPattern = "Solved";
            }
            if (u=="bar1" && d=="bar2" || u=="bar2" && d=="bar1") {
                udPattern = "Bars";
            }
            if (u.substring(0, 3)=="bar" && d=="slash" || u=="slash" && d.substring(0, 3)=="bar") {
                udPattern = "Bar/Slash";
            }
        }

        const fb = extractFB(this.C);
        n = 0;
        for (let x of fb) {
            if (x=="o") {
                n++;
            }
        }
        let fbPattern;
        if (n==0 || n==8) {
            fbPattern = "Solved";
        }
        if (n==2 || n==6) {
            fbPattern = "One Bar";
        }
        if (n==4) {
            let n2 = 0;
            for (let i=0; i<4; i++) {
                if (fb[i]=="o") {
                    n2++;
                }
            }
            if (n2==0 || n2==4) {
                fbPattern = "One Face";
            }
            if (n2==1 || n2==3) {
                fbPattern = "Bars";
            }
            if (n2==2) {
                if ((fb[0]==fb[1])==(fb[4]==fb[5])) {
                    fbPattern = "One Face";
                } else {
                    fbPattern = "Bars";
                }
            }
        }

        let add = "";
        if (udPattern=="Solved" && fbPattern=="One Face") {
            let n = 0;
            for (let i=0; i<8; i++) {
                if (ud[i]=="o" && fb[i]=="o") {
                    n++;
                }
            }
            if (n==0 || n==4) {
                add = " (ST1)";
            } else if (n==2) {
                add = " (ST2)";
            } else {
                throw "error";
            }
        }
        if (udPattern=="Bars" && fbPattern=="Bars") {
            let n = 0;
            for (let i=0; i<8; i++) {
                if (ud[i]=="o" && fb[i]=="o") {
                    n++;
                }
            }
            if (n==0 || n==4) {
                add = " (BB2)";
            } else if (n==2) {
                for (let m of [" ", "F2", "R2"]) {
                    this.move(m);
                    const ud2 = extractUD(this.C);
                    const fb2 = extractFB(this.C);
                    this.undo();

                    let nud = 0;
                    let nfb = 0;
                    for (let i=0; i<4; i++) {
                        if (ud2[i]=="o") {
                            nud++;
                        }
                        if (fb2[i]=="o") {
                            nfb++;
                        }
                    }
                    if (nud==2) {
                        if (nfb==2) {
                            add = " (BB1)";
                        } else {
                            add = " (BB3)";
                        }
                        break;
                    }
                }
                if (add=="") {
                    throw "error";
                }
            } else {
                throw "error";
            }
        }
        if (udPattern=="Bar/Slash" && fbPattern=="One Bar") {
            // ランダムに回せば良いだろう。
            function rand(n) {
                const r = Math.random()*n|0;
                if (r<0 || n<=r) {
                    r = 0;
                }
                return r;
            }
            let mn = 0;
            for (let i=0; i<9999; i++) {
                this.move(["U2", "F2", "B2", "L2", "R2"][rand(5)])
                mn++;

                const ud2 = extractUD(this.C);
                let n = 0;
                for (let i=0; i<4; i++) {
                    if (ud2[i]=="o") {
                        n++;
                    }
                }
                const fb2 = extractFB(this.C);
                if (fb2[0]==fb2[1] && fb2[2]==fb2[3] && fb2[0]!=fb2[3] && n==2) {
                    if (ud2[0]==ud2[1] || ud2[4]==ud2[5]) {
                        add = " (BS1)";
                    } else {
                        add = " (BS2)";
                    }
                    break;
                }
            }
            if (add=="") {
                throw "error";
            }
            for (let i=0; i<mn; i++) {
                this.undo();
            }
        }

        const hyper = `${udPattern}+${fbPattern}${add}`;

        const CI = [
            [ 0,  9, 38], [ 2, 36, 29], [ 6, 18, 11], [ 8, 27, 20],
            [45, 17, 24], [47, 26, 33], [51, 44, 15], [53, 35, 42],
        ];

        const init = new Cube();
        init.move({"U/D": " ", "F/B": "x", "R/L": "z"}[axis]);
        const P = new Array(8);
        for (let i=0; i<8; i++) {
            for (let j=0; j<8; j++) {
                let ok = true;
                for (let k=0; k<3; k++) {
                    if (this.C[CI[i][k]]!=init.C[CI[j][k]]) {
                        ok = false;
                    }
                }
                if (ok) {
                    P[i] = j;
                    break;
                }
            }
        }

        let parity = 0;
        for (let i=0; i<8; i++) {
            for (let j=0; j<i; j++) {
                if (P[j]>P[i]) {
                    parity ^= 1;
                }
            }
        }

        let qt = -1;
        if (hyper=="Slashes+One Face"        && parity==0) {qt = 2;}
        if (hyper=="Slashes+One Face"        && parity==1) {qt = 1;}
        if (hyper=="Slashes+Bars"            && parity==0) {qt = 4;}
        if (hyper=="Slashes+Bars"            && parity==1) {qt = 3;}
        if (hyper=="Solved+Solved"           && parity==0) {qt = 0;}
        if (hyper=="Solved+Solved"           && parity==1) {qt = 3;}
        if (hyper=="Solved+One Face (ST1)"   && parity==0) {qt = 2;}
        if (hyper=="Solved+One Face (ST1)"   && parity==1) {qt = 1;}
        if (hyper=="Solved+One Face (ST2)"   && parity==0) {qt = 2;}
        if (hyper=="Solved+One Face (ST2)"   && parity==1) {qt = 3;}
        if (hyper=="Solved+Bars"             && parity==0) {qt = 2;}
        if (hyper=="Solved+Bars"             && parity==1) {qt = 3;}
        if (hyper=="Solved+One Bar"          && parity==0) {qt = 4;}
        if (hyper=="Solved+One Bar"          && parity==1) {qt = 5;}
        if (hyper=="Bars+Solved"             && parity==0) {qt = 4;}
        if (hyper=="Bars+Solved"             && parity==1) {qt = 3;}
        if (hyper=="Bars+One Face"           && parity==0) {qt = 4;}
        if (hyper=="Bars+One Face"           && parity==1) {qt = 1;}
        if (hyper=="Bars+Bars (BB1)"         && parity==0) {qt = 2;}
        if (hyper=="Bars+Bars (BB1)"         && parity==1) {qt = 3;}
        if (hyper=="Bars+Bars (BB2)"         && parity==0) {qt = 4;}
        if (hyper=="Bars+Bars (BB2)"         && parity==1) {qt = 3;}
        if (hyper=="Bars+Bars (BB3)"         && parity==0) {qt = 4;}
        if (hyper=="Bars+Bars (BB3)"         && parity==1) {qt = 5;}
        if (hyper=="Bars+One Bar"            && parity==0) {qt = 4;}
        if (hyper=="Bars+One Bar"            && parity==1) {qt = 3;}
        if (hyper=="Bar/Slash+One Face"      && parity==0) {qt = 4;}
        if (hyper=="Bar/Slash+One Face"      && parity==1) {qt = 3;}
        if (hyper=="Bar/Slash+Bars"          && parity==0) {qt = 2;}
        if (hyper=="Bar/Slash+Bars"          && parity==1) {qt = 5;}
        if (hyper=="Bar/Slash+One Bar (BS1)" && parity==0) {qt = 4;}
        if (hyper=="Bar/Slash+One Bar (BS1)" && parity==1) {qt = 3;}
        if (hyper=="Bar/Slash+One Bar (BS2)" && parity==0) {qt = 4;}
        if (hyper=="Bar/Slash+One Bar (BS2)" && parity==1) {qt = 5;}
        if (qt==-1) {
            throw "error";
        }

        const subset = {
            "Solved":   "0c",
            "One Face": "4a",
            "Bars":     "4b",
            "One Bar":  "2c",
        }[fbPattern]+qt;

        this.undo();

        return [hyper, subset];
    }

    isLeaveSlice(axis) {
        this.move({"U/D": " ", "F/B": "x", "R/L": "z"}[axis]);

        let res = () => {
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
        };

        this.undo();

        return res;
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

    // HTRでの状態が同一ならば等しくなる値を返す。
    // 各コーナーとエッジがどちらのグループのものかと、コーナーパリティ。
    // U/D面の状態は含まれていないが、ヒューリスティックに使うだけなので問題無い。
    extractHTR() {
        const GC = [0, 1, 1, 0, 0, 1, 1, 0];
        const C = index2perm8(this.C);
        let c = 0;
        let p = 0;
        for (let i=0; i<8; i++) {
            c |= GC[C[i]]<<i;
            for (let j=0; j<i; j++) {
                if (C[j]>C[i]) {
                    p ^= 1;
                }
            }
        }

        const GE = [0, 1, 1, 0, 0, 1, 1, 0];
        const E = index2perm8(this.E1);
        let e = 0;
        for (let i=0; i<8; i++) {
            e |= GE[E[i]]<<i;
        }

        return ""+c+"_"+e+"_"+p;
    }

    // extractHTR の返り値が htr になるような状態にする。
    unextractHTR(htr) {
        const [c, e, p] = htr.split("_").map(x=>+x);
        const GC0 = [0, 3, 4, 7];
        const GC1 = [1, 2, 5, 6];
        const C = Array(8);
        for (let i=0; i<8; i++) {
            if ((c>>i&1)==0) {
                C[i] = GC0.pop();
            } else {
                C[i] = GC1.pop();
            }
        }

        // パリティが一致していなければ、0と3を交換。
        let p2 = 0;
        for (let i=0; i<8; i++) {
            for (let j=0; j<i; j++) {
                if (C[j]>C[i]) {
                    p2 ^= 1;
                }
            }
        }
        if (p2!=p) {
            for (let i=0; i<8; i++) {
                if (C[i]==0) {
                    C[i] = 3;
                } else if (C[i]==3) {
                    C[i] = 0;
                }
            }
        }

        const GE0 = [0, 3, 4, 7];
        const GE1 = [1, 2, 5, 6];
        const E = Array(8);
        for (let i=0; i<8; i++) {
            if ((e>>i&1)==0) {
                E[i] = GE0.pop();
            } else {
                E[i] = GE1.pop();
            }
        }

        this.C = perm2index8(C);
        this.E1 = perm2index8(E);
    }

    isLeaveSlice() {
        return this.C==0 && this.E1==0;
    }

    isFinish() {
        return this.C==0 && this.E1==0 && this.E2==0;
    }

    // Leave sliceでの状態が同一ならば等しくなる値を返す。
    extractLeaveSlice() {
        return ""+this.C+"_"+this.E1;
    }

    // extractLeaveSlice の返り値が ls になるような状態にする。
    unextractLeaveSlice(ls) {
        [this.C, this.E1] = ls.split("_").map(x=>+x);
    }

    // Leave sliceでのコーナーの状態が同一ならば等しくなる値を返す。
    extractLeaveSliceCorner() {
        return ""+this.C;
    }

    // extractLeaveSliceCorner の返り値が ls になるような状態にする。
    unextractLeaveSliceCorner(ls) {
        this.C = +ls;
    }

    // 状態が同一ならば等しくなる値を返す。
    extractFinish() {
        return ""+this.C+"_"+this.E1+"_"+this.E2;
    }

    // extractFinish の返り値が finish になるような状態にする。
    unextractFinish(finish) {
        [this.C, this.E1, this.E2] = finish.split("_").map(x=>+x);
    }
};

// 動きを axis 軸をU/Dに向けるように変更。
function fixAxis(axis, m) {
    const T = {
        "U/D": {"F": "F", "B": "B", "R": "R", "L": "L", "U": "U", "D": "D", "M": "M", "E": "E", "S": "S"},
        "F/B": {"F": "U", "B": "D", "R": "R", "L": "L", "U": "B", "D": "F", "M": "M", "E": "S", "S": "E"},
        "R/L": {"F": "F", "B": "B", "R": "U", "L": "D", "U": "L", "D": "R", "M": "E", "E": "M", "S": "S"},
    }
    m = T[axis][m[0]]+m.substr(1);
    if (axis=="F/B" && m[0]=="E" ||
        axis=="R/L" && m[0]=="M") {
        m = reverse(m);
    }
    return m;
}

function unfixAxis(axis, m) {
    const T = {
        "U/D": {"F": "F", "B": "B", "R": "R", "L": "L", "U": "U", "D": "D", "M": "M", "E": "E", "S": "S"},
        "F/B": {"F": "D", "B": "U", "R": "R", "L": "L", "U": "F", "D": "B", "M": "M", "E": "S", "S": "E"},
        "R/L": {"F": "F", "B": "B", "R": "D", "L": "U", "U": "R", "D": "L", "M": "E", "E": "M", "S": "S"},
    }
    m = T[axis][m[0]]+m.substr(1);
    if (axis=="F/B" && m[0]=="S" ||
        axis=="R/L" && m[0]=="E") {
        m = reverse(m);
    }
    return m;
}

const leaveSliceTableMax = 6;
const leaveSliceTable = new Map();
{
    const cube = new Cube2();

    leaveSliceTable.set(cube.extractLeaveSlice(), 0);
    let P = [cube.extractLeaveSlice()];

    for (let d=1; d<=leaveSliceTableMax; d++) {
        const P2 = [];

        for (let ls of P) {
            cube.unextractLeaveSlice(ls);

            for (let m of [
                "F2",
                "B2",
                "R2",
                "L2",
                "U", "U2", "U'",
                "D", "D2", "D'",
            ]) {
                cube.move(m);

                const ls2 = cube.extractLeaveSlice();
                if (!leaveSliceTable.has(ls2)) {
                    leaveSliceTable.set(ls2, d);
                    P2.push(ls2);
                }

                cube.undo();
            }
        }

        P = P2;
        //console.log(d, P.length)
    }

    console.log("Leave slice table constructed:", leaveSliceTable.size);
}

const leaveSliceCornerTable = new Map();
{
    const cube = new Cube2();

    leaveSliceCornerTable.set(cube.extractLeaveSliceCorner(), 0);
    let P = [cube.extractLeaveSliceCorner()];

    for (let d=1; d<=20; d++) {
        const P2 = [];

        for (let ls of P) {
            cube.unextractLeaveSliceCorner(ls);

            for (let m of [
                "F2",
                "B2",
                "R2",
                "L2",
                "U", "U2", "U'",
                "D", "D2", "D'",
            ]) {
                cube.move(m);

                const ls2 = cube.extractLeaveSliceCorner();
                if (!leaveSliceCornerTable.has(ls2)) {
                    leaveSliceCornerTable.set(ls2, d);
                    P2.push(ls2);
                }

                cube.undo();
            }
        }

        P = P2;
        //console.log(d, P.length);
    }

    console.log("Leave slice corner table constructed:", leaveSliceCornerTable.size);
}

function searchLeaveSlice(scramble, normal, inverse, axis) {
    let old = scramble;
    scramble = [];
    for (let m of old) {
        scramble.push(fixAxis(axis, m));
    }

    old = normal;
    normal = [];
    for (let m of old) {
        normal.push(fixAxis(axis, m));
    }

    old = inverse;
    inverse = [];
    for (let m of old) {
        inverse.push(fixAxis(axis, m));
    }

    let cube;
    let moves = [];
    let movesLast;

    let bestLSTotal = -1;
    let bestLSSINumber = 0;
    let bestLS = [];
    let bestLSSlices = [];

    function f(depth, maxDepth) {
        if (bestLSTotal>=0 && bestLSSINumber==0) {
            // +0手のスライスインサートが見つかれば探索を打ちきって良い。
            return true;
        }

        if (depth==maxDepth) {
            if (cube.isLeaveSlice()) {
                const normal2 = [...normal, ...moves];
                if (movesLast!="") {
                    normal2.push(movesLast);
                }
                const si = searchSliceInsert(scramble, normal2, inverse);
                if (si && (bestLSTotal==-1 || si.total<bestLSTotal)) {
                    bestLSTotal = si.total;
                    bestLSSINumber = si.total-normalizedMovesNumber([...normal2, ...reverse(inverse)]);
                    bestLS = [];
                    for (let m of moves) {
                        bestLS.push(unfixAxis(axis, m));
                    }
                    if (movesLast!="") {
                        bestLS.push(unfixAxis(axis, movesLast));
                    }
                    bestLSSlices = si.slices;
                    for (let s of bestLSSlices) {
                        s.move = unfixAxis(axis, s.move);
                    }
                    if (bestLSSINumber==0) {
                        return true;
                    }
                }
            }
            return false;
        }

        const ls = cube.extractLeaveSlice();
        const corner = cube.extractLeaveSliceCorner();
        const h1 = leaveSliceTable.has(ls) ? leaveSliceTable.get(ls) : leaveSliceTableMax+1;
        const h2 = leaveSliceCornerTable.get(corner);
        if (depth+Math.max(h1, h2)>maxDepth) {
            return false;
        }

        // U/D は基本的にはどちらか一方で良いはずだが……最短1個しか返さないし、遅くもないので、とりあえずこのまま。
        for (let m of [
            "F2",
            "B2",
            "R2",
            "L2",
            "U2",
            "D2",
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

            const res = f(depth+1, maxDepth);

            cube.undo();
            moves.pop();

            if (res) {
                return res;
            }
        }
        return false;
    }

    let maxDepth = 99;
    for (let depth=0; depth<=maxDepth; depth++) {
        for (let revN=0; revN<2; revN++) {
            if (revN==1 && normal.length==0) {
                continue;
            }

            let first = "";
            if (revN==1) {
                first = normal[normal.length-1][0]+"2";
            }

            for (let revI=0; revI<2; revI++) {
                if (revI==1 && inverse.length==0) {
                    continue;
                }

                let last = "";
                if (revI==1) {
                    last = inverse[inverse.length-1][0]+"2";
                }

                const cubeTemp = new Cube();
                if (last!="") {
                    cubeTemp.move(last);
                }
                for (let m of reverse(inverse)) {
                    cubeTemp.move(m);
                }
                for (let m of scramble) {
                    cubeTemp.move(m);
                }
                for (let m of normal) {
                    cubeTemp.move(m);
                }
                if (first!="") {
                    cubeTemp.move(first);
                }

                cube = new Cube2(cubeTemp);
                moves = [];
                if (first!="") {
                    moves.push(first);
                }
                movesLast = last;

                f(0, depth);
            }
        }

        if (bestLSTotal>=0) {
            // 現在の深さ＋スライスインサート-1 まで探せば、それより短い解は見つからないはず？
            // スライスインサートで手数が減る場合が怪しい。
            maxDepth = Math.min(maxDepth, depth+Math.max(0, bestLSSINumber)-1);
        }
    }

    return {
        moves: bestLS,
        slices: bestLSSlices,
        sliceInsertNumber: bestLSSINumber,
        sliceInsertTotal: bestLSTotal,
    };
}

// 軸は補正済みとみなし、E*のみ挿入する。
function searchSliceInsert(scramble, normal, inverse) {
    const skeleton = [...normal, ...reverse(inverse)];

    let lastNonDR = -1;
    for (let i=normal.length-1; i>=0; i--) {
        if (skeleton[i][0]!="U" && skeleton[i][0]!="D" && skeleton[i][1]!="2") {
            lastNonDR = i;
            break;
        }
    }

    let firstNonDR = skeleton.length;
    for (let i=normal.length; i<skeleton.length; i++) {
        if (skeleton[i][0]!="U" && skeleton[i][0]!="D" && skeleton[i][1]!="2") {
            firstNonDR = i;
            break;
        }
    }

    const cube = new Cube();
    for (let i=firstNonDR; i<skeleton.length; i++) {
        cube.move(skeleton[i]);
    }
    for (let m of scramble) {
        cube.move(m);
    }
    for (let i=0; i<=lastNonDR; i++) {
        cube.move(skeleton[i]);
    }

    // センターを含むE層。
    const F = [12, 13, 14, 21, 22, 23, 30, 31, 32, 39, 40, 41];

    extract = cube => {
        let e = "";
        for (const f of F) {
            e += cube.C[f]
        }
        return e;
    };

    unextract = (cube, e) => {
        for (let i=0; i<12; i++) {
            cube.C[F[i]] = e[i];
        }
    };

    // 動的計画法で最適なスライスインサートを探す。
    // E層の状態のみを見ているが、そこまでの手順によって以降の手数が異なることもあるかもしれない。
    let T = {};
    T[extract(cube)] = {
        length: 0,
        moves: skeleton.slice(0, lastNonDR+1),
        slices: [],
    };

    for (let i=lastNonDR+1; i<=firstNonDR; i++) {
        const P = T;
        T = {};

        for (let p in P) {
            unextract(cube, p);
            const moves = P[p].moves;

            for (let n=0; n<4; n++) {
                const m = "E"+["", "", "2", "'"][n];
                if (n>0) {
                    cube.move(m);
                    moves.push(m);
                }
                if (i<firstNonDR) {
                    cube.move(skeleton[i]);
                    moves.push(skeleton[i]);
                }

                const e = extract(cube);
                const slices = [...P[p].slices];
                if (n>0) {
                    slices.push({
                        position: i,
                        move: m,
                    });
                }
                const t = {
                    length: normalizedMovesNumber(moves),
                    moves: [...moves],
                    slices: slices,
                }
                // 以下の優先順位で採用。
                // - 手数が短い。
                // - 挿入するスライスが少ない。
                if (!T[e] ||
                    t.length<T[e].length ||
                    t.length==T[e].length && t.slices.length<T[e].slices.length) {
                    T[e] = t;
                }

                if (i<firstNonDR) {
                    cube.undo();
                    moves.pop();
                }
                if (n>0) {
                    cube.undo();
                    moves.pop();
                }
            }
        }
    }

    const solved = "LLLFFFRRRBBB";
    if (!T[solved]) {
        return false;
    }

    const moves = T[solved].moves;
    for (let i=firstNonDR; i<skeleton.length; i++) {
        moves.push(skeleton[i]);
    }

    return {
        total: normalizedMovesNumber(moves),
        slices: T[solved].slices,
    };
}

// キャンセルを考慮した手数を返す。
function normalizedMovesNumber(moves) {
    // スライスを持ち替えと外層の動きに置き換え。
    let tmp = moves;
    moves = [];
    for (let m of tmp) {
        switch (m) {
            case "M": moves.push("x'", "L'", "R"); break;
            case "M2": moves.push("x2", "L2", "R2"); break;
            case "M'": moves.push("x", "L", "R'"); break;
            case "E": moves.push("y'", "D'", "U"); break;
            case "E2": moves.push("y2", "D2", "U2"); break;
            case "E'": moves.push("y", "D", "U'"); break;
            case "S": moves.push("z", "F'", "B"); break;
            case "S2": moves.push("z2", "F2", "B2"); break;
            case "S'": moves.push("z'", "F", "B'"); break;
            default:
                moves.push(m);
        }
    }

    const getN = m => {
        if (m.length==1) {
            return 1;
        }
        if (m[1]=="2") {
            return 2;
        } else {
            return 3;
        }
    }

    // 持ち替えの削除。
    tmp = moves;
    moves = [];
    R = {}
    for (let m of "FBRLUD") {
        R[m] = m;
    }
    for (let m of tmp) {
        if (m[0]=="x" || m[0]=="y" || m[0]=="z") {
            for (let i=0; i<getN(m); i++) {
                if (m[0]=="x") {
                    const t = R["U"];
                    R["U"] = R["F"];
                    R["F"] = R["D"];
                    R["D"] = R["B"];
                    R["B"] = t;
                }
                if (m[0]=="y") {
                    const t = R["F"];
                    R["F"] = R["R"];
                    R["R"] = R["B"];
                    R["B"] = R["L"];
                    R["L"] = t;
                }
                if (m[0]=="z") {
                    const t = R["U"];
                    R["U"] = R["L"];
                    R["L"] = R["D"];
                    R["D"] = R["R"];
                    R["R"] = t;
                }
            }
        } else {
            let m2 = R[m[0]];
            if (m.length>1) {
                m2 += m[1];
            }
            moves.push(m2);
        }
    }

    // 互いに影響しない動きをソートする。
    tmp = moves;
    moves = [];
    let M = [];
    const M2L = {
        "F": "f",
        "B": "f",
        "R": "r",
        "L": "r",
        "U": "u",
        "D": "d",
    };
    for (let m of tmp) {
        if (M.length>0 && M2L[M[M.length-1][0]]!=M2L[m[0]]) {
            M.sort();
            for (let m2 of M) {
                moves.push(m2);
            }
            M = [];
        }
        M.push(m);
    }
    M.sort();
    for (let m2 of M) {
        moves.push(m2);
    }

    // 同じ面の動きをまとめる。
    tmp = moves;
    moves = [];
    for (let m of tmp) {
        if (moves.length>0 && moves[moves.length-1][0]==m[0]) {
            let n = (getN(moves[moves.length-1])+getN(m))%4;
            moves.pop();
            if (n!=0) {
                moves.push(m[0]+["", "", "2", "'"][n]);
            }
        } else {
            moves.push(m);
        }
    }

    return moves.length;
}

function normalizedMovesNumberTest() {
    console.assert(normalizedMovesNumber(["R", "R2"])==1);
    console.assert(normalizedMovesNumber(["R", "R2", "R"])==0);
    console.assert(normalizedMovesNumber(["R", "F'", "U2"])==3);
    console.assert(normalizedMovesNumber(["R", "L'"])==2);
    console.assert(normalizedMovesNumber(["R", "L'", "M'"])==0);
    console.assert(normalizedMovesNumber(["R", "L'", "M"])==2);
    console.assert(normalizedMovesNumber(["F", "R", "L'", "M'", "U2"])==1);
    console.assert(normalizedMovesNumber(["F", "R", "L'", "M", "U2"])==4);
}
//normalizedMovesNumberTest();

function analyzeSolution(scramble, normalInput, inverseInput, axis, niss, normal, inverse) {
    // leave slice.
    let leaveSlice = searchLeaveSlice(scramble, [...normalInput, ...normal], [...inverseInput, ...inverse], axis);

    // moves.
    const movesNormal = [];
    let movesTmp = [];
    for (let m of normal) {
        movesTmp.push(m);
        if (m[0]==axis[0] || m[0]==axis[2]) {
            movesNormal.push(movesTmp.join(" "));
            movesTmp = [];
        }
    }
    if (movesTmp.length>0) {
        movesNormal.push(movesTmp.join(" "));
        movesTmp = [];
    }

    const movesInverse = [];
    for (let m of inverse) {
        movesTmp.push(m);
        if (m[0]==axis[0] || m[0]==axis[2]) {
            movesInverse.push("("+movesTmp.join(" ")+")");
            movesTmp = [];
        }
    }
    if (movesTmp.length>0) {
        movesInverse.push("("+movesTmp.join(" ")+")");
        movesTmp = [];
    }

    let moves = [];
    if (niss!="inverse_normal") {
        moves = [...movesNormal, ...movesInverse];
    } else {
        moves = [...movesInverse, ...movesNormal];
    }

    // subset.
    function getSubset(cube) {
        let [_, subset] = cube.hyperParity(axis);
        let sign = "";
        if (subset=="4a1" ||
            subset=="4a2" ||
            subset=="4a3" ||
            subset=="4a4" ||
            subset=="4b2" ||
            subset=="2c4" ||
            subset=="2c5") {
            // HT+QT で次の状態に遷移可能かで判定すれば良いだろう。
            sign = "-";
            for (let m of [" ", "F2", "B2", "R2", "L2", "U2", "D2"]) {
                cube.move(m);
                cube.move(axis[0]);

                let [_, subset2] = cube.hyperParity(axis);
                if (subset2 == {
                    "4a1": "0c0",
                    "4a2": "4a1",
                    "4a3": "4b2",
                    "4a4": "4a3",
                    "4b2": "4a1",
                    "2c4": "2c3",
                    "2c5": "2c4"
                }[subset]) {
                    sign = "+";
                }

                cube.undo();
                cube.undo();
            }
        }
        return subset+sign;
    }

    const subsets = [];
    for (let i=0; i<=moves.length; i++) {
        const M = [];
        for (let j=i-1; j>=0; j--) {
            if (moves[j][0]=="(") {
                M.push(...reverse(moves[j].substring(1, moves[j].length-1).split(" ")));
            }
        }
        M.push(...reverse(inverseInput));
        M.push(...scramble);
        M.push(...normalInput);
        for (let j=0; j<i; j++) {
            if (moves[j][0]!="(") {
                M.push(...moves[j].split(" "));
            }
        }

        let cube = new Cube();
        for (let m of M) {
            cube.move(m);
        }
        const subsetNormal = getSubset(cube);

        cube = new Cube();
        for (let m of reverse(M)) {
            cube.move(m);
        }
        const subsetInverse = getSubset(cube);

        const badCorner = cube.htrBadCorner(axis);
        let badEdge = cube.htrBadEdge(axis);
        // HTR subsetに合わせてバッドエッジを変更。
        if (+subsetNormal[0]!=badCorner ||
            badCorner==4 && badEdge>4) {
            badEdge = 8-badEdge;
        }

        let subset = "";
        if (subsetNormal==subsetInverse) {
            subset = `${subsetNormal},${badEdge}e`;
        } else if (subsetNormal.substring(0, 3)==subsetInverse.substring(0, 3)) {
            subset = `${subsetNormal}(${subsetInverse[3]}),${badEdge}e`;
        } else {
            subset = `${subsetNormal}(${subsetInverse}),${badEdge}e`;
        }
        subsets.push(subset);
    }

    // moves number.
    const inputTotal = normalizedMovesNumber(normalInput)+normalizedMovesNumber(inverseInput);

    let htrNumber = 0;
    for (let m of moves) {
        htrNumber += m.split(" ").length;
    }
    const htrTotal = normalizedMovesNumber([...normalInput, ...normal])+normalizedMovesNumber([...inverseInput, ...inverse]);

    let leaveSliceNumber = leaveSlice.moves.length;
    const leaveSliceTotal = normalizedMovesNumber(
        [...normalInput, ...normal, ...leaveSlice.moves, ...reverse(inverse), ...reverse(inverseInput)]);

    return {
        moves,
        subsets,
        leaveSlice: leaveSlice.moves.join(" "),
        slices: leaveSlice.slices,
        htrNumber,
        htrDiff: htrTotal-inputTotal-htrNumber,
        htrTotal,
        leaveSliceNumber,
        leaveSliceDiff: leaveSliceTotal-htrTotal-leaveSliceNumber,
        leaveSliceTotal,
        sliceInsertNumber: leaveSlice.sliceInsertNumber,
        sliceInsertTotal: leaveSlice.sliceInsertTotal,
    };
}

const htrTableMax = 99;
const htrTable = new Map();
{
    const cube = new Cube2();

    htrTable.set(cube.extractHTR("U/D"), 0);
    let P = [cube.extractHTR("U/D")];

    for (let d=1; d<=htrTableMax; d++) {
        const P2 = [];

        for (let htr of P) {
            cube.unextractHTR(htr);

            for (let m of [
                "F2",
                "B2",
                "R2",
                "L2",
                "U", "U2", "U'",
                "D", "D2", "D'",
            ]) {
                cube.move(m);

                const htr2 = cube.extractHTR("U/D");
                if (!htrTable.has(htr2)) {
                    htrTable.set(htr2, d);
                    P2.push(htr2);
                }

                cube.undo();
            }
        }

        P = P2;
    }

    console.log("HTR table constructed:", htrTable.size);
}

function searchHTR(scramble, normalInput, inverseInput, axis, niss, maxNum) {
    // U/D軸に変換して探索。
    const scrambleFixed = [];
    for (let m of scramble) {
        scrambleFixed.push(fixAxis(axis, m));
    }

    const normalInputFixed = [];
    for (let m of normalInput) {
        normalInputFixed.push(fixAxis(axis, m));
    }

    const inverseInputFixed = [];
    for (let m of inverseInput) {
        inverseInputFixed.push(fixAxis(axis, m));
    }

    const scrambleTable = Cube.makeTable(scrambleFixed);
    const inverseTable = Cube.makeTable(reverse(scrambleFixed));

    // HTRにおいてUとDは基本的に等価。
    // どちらかを選択する。
    // 選択基準はバッドコーナーがより少ないほう。
    // 同じならば、バッドエッジが少ないほう。
    function selectUD(cube, m) {
        const mu = "U"+(m.length==1?"":m[1]);
        cube.move(mu);
        const badCU = cube.htrBadCorner("U/D");
        const badEU = cube.htrBadEdge("U/D");
        cube.undo();

        const md = "D"+(m.length==1?"":m[1]);
        cube.move(md);
        const badCD = cube.htrBadCorner("U/D");
        const badED = cube.htrBadEdge("U/D");
        cube.undo();

        if (badCU<badCD || badCU==badCD && badEU<=badED) {
            return mu;
        } else {
            return md;
        }
    }

    // スクランブルなどに側面の90度回転があるので、Cube2 は使えない。
    const cube = new Cube();

    let num = 0;
    const normal = [];
    const inverse = [];

    // L2 U2 D2 R2 と R2 U2 D2 L2 など、排除しきれない同一解があるので、別途弾く。
    const found = new Set();

    function f2(depth, maxDepthN, rev) {
        if (num>=maxNum) {
            return;
        }

        if (depth==maxDepthN) {
            if (cube.isHTR("U/D")) {
                const face = cube.C.join();
                if (!found.has(face)) {
                    found.add(face);

                    let nor = [];
                    for (let m of normal) {
                        nor.push(unfixAxis(axis, m));
                    }
                    let inv = [];
                    for (let m of inverse) {
                        inv.push(unfixAxis(axis, m));
                    }
                    inv = reverse(inv);

                    if (rev) {
                        const tmp = nor;
                        nor = inv;
                        inv = tmp;
                    }

                    const solution = analyzeSolution(scramble, normalInput, inverseInput, axis, niss, nor, inv);
                    solution["type"] = "htr";
                    postMessage(solution);

                    num++;
                }
            }
            return;
        }

        let h = htrTableMax+1;
        const htr = new Cube2(cube).extractHTR(axis);
        if (htrTable.has(htr)) {
            h = htrTable.get(htr);
        }
        if (depth+h>maxDepthN) {
            return;
        }

        for (let m of [
            "F2",
            "B2",
            "R2",
            "L2",
            "U", "U2", "U'",
        ]) {
            // 最後の1手は U/D のみ。
            // 逆回転はleave sliceで探索する。
            if (depth==maxDepthN-1 && m!="U") {
                continue;
            }

            if (m[0]=="U") {
                m = selectUD(cube, m);
            }

            if (normal.length>0) {
                const last = normal[normal.length-1];
                if (m[0]==last[0] ||
                    (m[0]=="U" || m[0]=="D") && (last[0]=="U" || last[0]=="D") ||
                    m[0]=="F" && last[0]=="B" ||
                    m[0]=="R" && last[0]=="L") {
                    continue;
                }
            }
            // 既存の最後の1手の逆回転は別途探索しているので不要。
            if (depth==0) {
                if (!rev) {
                    if (normalInputFixed.length>0 && m[0]==normalInputFixed[normalInputFixed.length-1][0]) {
                        continue;
                    }
                } else {
                    if (inverseInputFixed.length>0 && m[0]==inverseInputFixed[inverseInputFixed.length-1][0]) {
                        continue;
                    }
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
        if (num>=maxNum) {
            return;
        }

        if (depth==maxDepthI) {
            for (let revI=0; revI<2; revI++) {
                if (revI==1 && ((!rev?maxDepthI:maxDepthN)==0 || inverseInputFixed.length==0)) {
                    continue;
                }
                for (let revN=0; revN<2; revN++) {
                    if (revN==1 && ((!rev?maxDepthN:maxDepthI)==0 || normalInputFixed.length==0)) {
                        continue;
                    }

                    if (!rev) {
                        if (revI==1) {
                            const m = inverseInputFixed[inverseInputFixed.length-1][0]+"2";
                            cube.move(m);
                            inverse.push(m);
                        }
                        for (let m of reverse(inverseInputFixed)) {
                            cube.move(m);
                        }
                        cube.moveTable(scrambleTable);
                        for (let m of normalInputFixed) {
                            cube.move(m);
                        }
                        if (revN==1) {
                            const m = normalInputFixed[normalInputFixed.length-1][0]+"2";
                            cube.move(m);
                            normal.push(m);
                        }
                    } else {
                        if (revN==1) {
                            const m = normalInputFixed[normalInputFixed.length-1][0]+"2";
                            cube.move(m);
                            inverse.push(m);
                        }
                        for (let m of reverse(normalInputFixed)) {
                            cube.move(m);
                        }
                        cube.moveTable(inverseTable);
                        for (let m of inverseInputFixed) {
                            cube.move(m);
                        }
                        if (revI==1) {
                            const m = inverseInputFixed[inverseInputFixed.length-1][0]+"2";
                            cube.move(m);
                            normal.push(m);
                        }
                    }

                    f2(0, maxDepthN, rev);

                    if (!rev) {
                        if (revN==1) {
                            cube.undo();
                            normal.pop();
                        }
                        for (let _ of normalInputFixed) {
                            cube.undo();
                        }
                        cube.moveTable(inverseTable);
                        for (let _ of inverseInputFixed) {
                            cube.undo();
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
                        for (let _ of inverseInputFixed) {
                            cube.undo();
                        }
                        cube.moveTable(scrambleTable);
                        for (let _ of normalInputFixed) {
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

        for (let m of [
            "F2",
            "B2",
            "R2",
            "L2",
            "U", "U2", "U'",
        ]) {
            // 最後の1手（逆に探索しているので最初の1手）は U/D のみ。
            if (depth==0 && m!="U'") {
                continue;
            }

            if (m[0]=="U") {
                m = selectUD(cube, m);
            }

            if (inverse.length>0) {
                const last = inverse[inverse.length-1];
                if (m[0]==last[0] ||
                    (m[0]=="U" || m[0]=="D") && (last[0]=="U" || last[0]=="D") ||
                    m[0]=="B" && last[0]=="F" ||
                    m[0]=="L" && last[0]=="R") {
                    continue;
                }
            }
            // 既存の最後の1手の逆回転は別途探索しているので不要。
            if (depth==maxDepthI-1)
            {
                if (!rev) {
                    if (inverseInputFixed.length>0 &&
                        m[0]==inverseInputFixed[inverseInputFixed.length-1][0]) {
                        continue;
                    }
                } else {
                    if (normalInputFixed.length>0 &&
                        m[0]==normalInputFixed[normalInputFixed.length-1][0]) {
                        continue;
                    }
                }
            }

            cube.move(m);
            inverse.push(m);

            f1(depth+1, maxDepthN, maxDepthI, rev);

            cube.undo();
            inverse.pop();
        }
    }

    for (let depth=0; ; depth++) {
        if (num>=maxNum) {
            break;
        }
        postMessage({
            type: "depth",
            depth: depth,
        });
        for (let depthI=0; depthI<=depth; depthI++) {
            if (num>=maxNum) {
                break;
            }

            const depthN = depth-depthI;

            if (niss=="normal" && depthI>0 ||
                niss=="inverse" && depthN>0 ||
                niss=="before" && depthI>0 && depthN>0) {
                continue;
            }

            // 枝刈りがノーマル方向にしか効かないので、インバースのほうが長ければ逆に探索。
            if (depthN>=depthI) {
                f1(0, depthN, depthI, false);
            } else {
                f1(0, depthI, depthN, true);
            }
        }
    }
}

const finishTableMax = 6;
const finishTable = new Map();
{
    const cube = new Cube2();

    leaveSliceTable.set(cube.extractFinish(), 0);
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

function searchFinish(scramble, normal, inverse, axis) {
    let old = scramble;
    scramble = [];
    for (let m of old) {
        scramble.push(fixAxis(axis, m));
    }

    old = normal;
    normal = [];
    for (let m of old) {
        normal.push(fixAxis(axis, m));
    }

    old = inverse;
    inverse = [];
    for (let m of old) {
        inverse.push(fixAxis(axis, m));
    }

    let cube;
    let moves = [];

    function f(depth, maxDepth) {
        if (depth==maxDepth) {
            if (cube.isFinish()) {
                return [...moves];
            } else {
                return false;
            }
        }

        const finish = cube.extractFinish();
        const ls = cube.extractLeaveSlice();
        const corner = cube.extractLeaveSliceCorner();
        const h1 = finishTable.has(finish) ? finishTable.get(finish) : finishTableMax+1;
        // ヒューリスティックとして使える。
        const h2 = leaveSliceTable.has(ls) ? leaveSliceTable.get(ls) : leaveSliceTableMax+1;
        const h3 = leaveSliceCornerTable.get(corner);
        if (depth+Math.max(h1, h2, h3)>maxDepth) {
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
        for (let revN=0; revN<2; revN++) {
            if (revN==1 && normal.length==0) {
                continue;
            }

            let first = "";
            if (revN==1) {
                first = normal[normal.length-1][0]+"2";
            }

            for (let revI=0; revI<2; revI++) {
                if (revI==1 && inverse.length==0) {
                    continue;
                }

                let last = "";
                if (revI==1) {
                    last = inverse[inverse.length-1][0]+"2";
                }

                const cubeTemp = new Cube();
                if (last!="") {
                    cubeTemp.move(last);
                }
                for (let m of reverse(inverse)) {
                    cubeTemp.move(m);
                }
                for (let m of scramble) {
                    cubeTemp.move(m);
                }
                for (let m of normal) {
                    cubeTemp.move(m);
                }
                if (first!="") {
                    cubeTemp.move(first);
                }

                cube = new Cube2(cubeTemp);
                moves = [];

                const res = f(0, depth);
                if (res!==false) {
                    const moves = [];
                    if (first!="") {
                        moves.push(unfixAxis(axis, first));
                    }
                    for (let m of res) {
                        moves.push(unfixAxis(axis, m));
                    }
                    if (last!="") {
                        moves.push(unfixAxis(axis, last));
                    }
                    return moves;
                }
            }
        }
    }
}

// niss: normal, inverse, keep_only, before, normal_inverse, inverse_normal, keep
function search(input, niss, number) {
    // Parse.
    const scramble = [];
    const normal = [];
    const inverse = [];
    let axis = "";
    let lastDirection;
    {
        let inComment = false;
        let brace = 0;
        const moves = [];
        const dir = [];
        let scrLen = -1;

        for (let p=0; p<input.length; p++) {
            // 最初の改行までがスクランブル。
            if (input[p]=="\n") {
                if (scrLen==-1) {
                    scrLen = moves.length;
                }
            }

            if (inComment) {
                if (input[p]=="\n") {
                    inComment = false;
                }
                continue;
            }

            if (input[p]=="F" ||
                input[p]=="B" ||
                input[p]=="R" ||
                input[p]=="L" ||
                input[p]=="U" ||
                input[p]=="D" ) {
                m = input[p];
                if (p+1<input.length &&
                    (input[p+1]=="'" || input[p+1]=="2")) {
                    m += input[p+1];
                    p += 1;
                }
                moves.push(m);
                if (brace==0) {
                    dir.push("N")
                } else {
                    dir.push("I")
                }
            } else if (input[p]=="(") {
                brace++;
            } else if (input[p]==")") {
                if (brace>0) {
                    brace--;
                }
            } else if (input[p]=="/") {
                inComment = true;
            }
        }
        if (scrLen==-1) {
            scrLen = moves.length;
        }

        // 軸ごとに、解答中で最初にDRが完了した位置を求める。
        const DRed = {
            "U/D": -1,
            "F/B": -1,
            "R/L": -1,
        };
        for (let i=scrLen; i<moves.length; i++) {
            const cube = new Cube();
            for (let j=i; j>=0; j--) {
                if (dir[j]=="I") {
                    cube.move(reverse(moves[j]));
                }
            }
            for (let j=0; j<=i; j++) {
                if (dir[j]=="N") {
                    cube.move(moves[j]);
                }
            }
            for (const axis of ["U/D", "F/B", "R/L"]) {
                if (DRed[axis]==-1 && cube.drBadCorner(axis)==0 && cube.drBadEdge(axis)==0) {
                    DRed[axis] = i;
                }
            }
        }

        // 最後の状態。
        const cube = new Cube();
        for (let i=moves.length-1; i>=0; i--) {
            if (dir[i]=="I") {
                cube.move(reverse(moves[i]));
            }
        }
        for (let i=0; i<moves.length; i++) {
            if (dir[i]=="N") {
                cube.move(moves[i]);
            }
        }

        // 最後の状態でDRが完了していて、最も早くDRが完了した軸をDR軸とする。
        // これによってHTRからleave sliceまでの解の探索にもこのツールを使えるようにする。
        for (const a of ["U/D", "F/B", "R/L"]) {
            if (cube.drBadCorner(a)==0 && cube.drBadEdge(a)==0) {
                if (axis=="" || DRed[a]<DRed[axis]) {
                    axis = a;
                }
            }
        }

        // 入力をスクランブル、ノーマル、インバースに分割。
        for (let i=scrLen-1; i>=0; i--) {
            if (dir[i]=="I") {
                scramble.push(reverse(moves[i]));
            }
        }
        for (let i=0; i<scrLen; i++) {
            if (dir[i]=="N") {
                scramble.push(moves[i]);
            }
        }
        for (let i=scrLen; i<moves.length; i++) {
            if (dir[i]=="N") {
                normal.push(moves[i]);
            } else {
                inverse.push(moves[i]);
            }
        }

        if (dir.length==0 || dir[dir.length-1]=="N") {
            lastDirection = "normal";
        } else {
            lastDirection = "inverse";
        }
    }

    postMessage({
        type: "parsed",
        scramble,
        normal,
        inverse,
        axis,
        lastDirection,
    });

    if (axis=="") {
        postMessage({
            type: "error",
            error: "DR is not finished.",
        })
        return;
    }

    const optimal = searchFinish(scramble, normal, inverse, axis);
    const inputTotal = normalizedMovesNumber(normal)+normalizedMovesNumber(inverse);
    const optimalNumber = optimal.length;
    const optimalTotal = normalizedMovesNumber([...normal, ...optimal, ...reverse(inverse)]);

    postMessage({
        type: "optimal",
        optimal: optimal,
        optimalNumber,
        optimalDiff: optimalTotal-inputTotal-optimalNumber,
        optimalTotal,
    });

    // niss = keep_only, keep はここで変換。
    if (niss=="keep") {
        if (lastDirection=="normal") {
            niss = "normal_inverse";
        } else {
            niss = "inverse_normal";
        }
    }
    if (niss=="keep_only") {
        niss = lastDirection;
    }
    searchHTR(scramble, normal, inverse, axis, niss, number);
}

if (standalone) {
    const number = 16;

    search(`R' U' F R2 B2 R2 F U2 B' D2 B D2 F L2 F R' U L2 B' D2 L' F' D2 F2 R' U' F

(F) R' B // EO (F/B, DR-8e7c (U/D), DR-6e5c (R/L)) (3/3)
(F2 R L) // RZP (U/D, DR-4e4c, AR-0e1c (normal), AR-2e3c (inverse)) (3-1/5)
(U2 D L2 F2 D' L) // DR (U/D, 4QT, HTR-2e2c, Solved+One Bar, 2c4) (6/11)`,
        "keep", number);
}

onmessage = e => {
    const data = e.data;
    search(data.input, data.niss, data.maxNumber);

    postMessage({
        type: "end",
    });
}
