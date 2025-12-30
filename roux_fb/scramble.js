/*
const scramble = getScramble();
console.log(scramble);
// "B2 F2 D' B2 D' B2 R2 D' R2 U R2 U' B2 U2 F' D' B L2 F2 L' D U' L' R'"
*/
const getScramble = (() => {
    // https://github.com/thewca/tnoodle-lib/tree/9397fb605d8d593868dc75dbaf84c54c808ee9dc/min2phase/src/main/java/cs/min2phase
    /*

            2  3  3
            2  U  0
            1  1  0
            +--------+
    .. .. ..|.. .. ..|.. .. ..|.. .. ..
    ..  L ..| 9  F  8|..  R ..|11  B 10
    .. .. ..|.. .. ..|.. .. ..|.. .. ..
            +--------+
            5  5  4
            6  D  4
            6  7  7
    */
    const U1 = 0;
    const U2 = 1;
    const U3 = 2;
    const R1 = 3;
    const R2 = 4;
    const R3 = 5;
    const F1 = 6;
    const F2 = 7;
    const F3 = 8;
    const D1 = 9;
    const D2 = 10;
    const D3 = 11;
    const L1 = 12;
    const L2 = 13;
    const L3 = 14;
    const B1 = 15;
    const B2 = 16;
    const B3 = 17;

    class Cube {
        static {
            this.moveCP = Array(18);
            this.moveCP[U1] = [3, 0, 1, 2, 4, 5, 6, 7];
            this.moveCP[R1] = [4, 1, 2, 0, 7, 5, 6, 3];
            this.moveCP[F1] = [1, 5, 2, 3, 0, 4, 6, 7];
            this.moveCP[D1] = [0, 1, 2, 3, 5, 6, 7, 4];
            this.moveCP[L1] = [0, 2, 6, 3, 4, 1, 5, 7];
            this.moveCP[B1] = [0, 1, 3, 7, 4, 5, 2, 6];
            // 移動した後に適用。
            this.moveCO = Array(18);
            this.moveCO[U1] = [0, 0, 0, 0, 0, 0, 0, 0];
            this.moveCO[R1] = [2, 0, 0, 1, 1, 0, 0, 2];
            this.moveCO[F1] = [1, 2, 0, 0, 2, 1, 0, 0];
            this.moveCO[D1] = [0, 0, 0, 0, 0, 0, 0, 0];
            this.moveCO[L1] = [0, 1, 2, 0, 0, 2, 1, 0];
            this.moveCO[B1] = [0, 0, 1, 2, 0, 0, 2, 1];

            this.moveEP = Array(18);
            this.moveEP[U1] = [3, 0, 1, 2, 4, 5, 6, 7, 8, 9, 10, 11];
            this.moveEP[R1] = [8, 1, 2, 3, 11, 5, 6, 7, 4, 9, 10, 0];
            this.moveEP[F1] = [0, 9, 2, 3, 4, 8, 6, 7, 1, 5, 10, 11];
            this.moveEP[D1] = [0, 1, 2, 3, 5, 6, 7, 4, 8, 9, 10, 11];
            this.moveEP[L1] = [0, 1, 10, 3, 4, 5, 9, 7, 8, 2, 6, 11];
            this.moveEP[B1] = [0, 1, 2, 11, 4, 5, 6, 10, 8, 9, 3, 7];
            // 移動した後に適用。
            this.moveEO = Array(18);
            this.moveEO[U1] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
            this.moveEO[R1] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
            this.moveEO[F1] = [0, 1, 0, 0, 0, 1, 0, 0, 1, 1, 0, 0];
            this.moveEO[D1] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
            this.moveEO[L1] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
            this.moveEO[B1] = [0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 1, 1];

            for (let m=0; m<18; m+=3) {
                const CP = [...this.moveCP[m]];
                const CO = [...this.moveCO[m]];
                const EP = [...this.moveEP[m]];
                const EO = [...this.moveEO[m]];

                for (let i=1; i<3; i++) {
                    const tmpCP = [...CP];
                    const tmpCO = [...CO];
                    for (let i=0; i<8; i++) {
                        CP[i] = tmpCP[this.moveCP[m][i]];
                        CO[i] = (tmpCO[this.moveCP[m][i]]+this.moveCO[m][i])%3;
                    }
                    const tmpEP = [...EP];
                    const tmpEO = [...EO];
                    for (let i=0; i<12; i++) {
                        EP[i] = tmpEP[this.moveEP[m][i]];
                        EO[i] = (tmpEO[this.moveEP[m][i]]+this.moveEO[m][i])%2;
                    }
                    this.moveCP[m+i] = [...CP];
                    this.moveCO[m+i] = [...CO];
                    this.moveEP[m+i] = [...EP];
                    this.moveEO[m+i] = [...EO];
                }
            }
        }

        constructor() {
            this.CP = [0, 1, 2, 3, 4, 5, 6, 7];
            this.CO = [0, 0, 0, 0, 0, 0, 0, 0];
            this.EP = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
            this.EO = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
            this.history = [];

            this.tmpP = Array(12);
            this.tmpO = Array(12);
        }

        move(m, phase) {
            this.history.push(m);

            this.move_internal(m, phase);
        }

        undo(phase) {
            let m = this.history.pop();
            m = (m/3|0)*3+(2-m%3);

            this.move_internal(m, phase);
        }

        move_internal(m, phase) {
            if (phase!=1) {
                for (let i=0; i<8; i++) {
                    this.tmpP[i] = this.CP[i];
                }
                for (let i=0; i<8; i++) {
                    this.CP[i] = this.tmpP[Cube.moveCP[m][i]];
                }
            }
            if (phase!=2) {
                for (let i=0; i<8; i++) {
                    this.tmpO[i] = this.CO[i];
                }
                for (let i=0; i<8; i++) {
                    this.CO[i] = (this.tmpO[Cube.moveCP[m][i]]+Cube.moveCO[m][i])%3;
                }
            }
            for (let i=0; i<12; i++) {
                this.tmpP[i] = this.EP[i];
            }
            for (let i=0; i<12; i++) {
                this.EP[i] = this.tmpP[Cube.moveEP[m][i]];
            }
            if (phase!=2) {
                for (let i=0; i<12; i++) {
                    this.tmpO[i] = this.EO[i];
                }
                for (let i=0; i<12; i++) {
                    this.EO[i] = (this.tmpO[Cube.moveEP[m][i]]+Cube.moveEO[m][i])%2;
                }
            }
        }

        toString() {
            const CF = ["URF", "UFL", "ULB", "UBR", "DFR", "DLF", "DBL", "DRB"];
            const CX = [
                [[5, 2], [6, 3], [5, 3]],
                [[3, 2], [3, 3], [2, 3]],
                [[3, 0], [0, 3], [11, 3]],
                [[5, 0], [9, 3], [8, 3]],
                [[5, 6], [5, 5], [6, 5]],
                [[3, 6], [2, 5], [3, 5]],
                [[3, 8], [11, 5], [0, 5]],
                [[5, 8], [8, 5], [9, 5]],
            ];
            const EF = ["UR", "UF", "UL", "UB", "DR", "DF", "DL", "DB", "FR", "FL", "BL", "BR"];
            const EX = [
                [[5, 1], [7, 3]],
                [[4, 2], [4, 3]],
                [[3, 1], [1, 3]],
                [[4, 0], [10, 3]],
                [[5, 7], [7, 5]],
                [[4, 6], [4, 5]],
                [[3, 7], [1, 5]],
                [[4, 8], [10, 5]],
                [[5, 4], [6, 4]],
                [[3, 4], [2, 4]],
                [[11, 4], [0, 4]],
                [[9, 4], [8, 4]],
            ];

            const F = [];
            for (let i=0; i<9; i++) {
                F.push([]);
                for (let j=0; j<12; j++) {
                    F[i].push(" ");
                }
            }
            for (let i=0; i<8; i++) {
                for (let j=0; j<3; j++) {
                    F[CX[i][j][1]][CX[i][j][0]] = CF[this.CP[i]][(j-this.CO[i]+3)%3];
                }
            }
            for (let i=0; i<12; i++) {
                for (let j=0; j<2; j++) {
                    F[EX[i][j][1]][EX[i][j][0]] = EF[this.EP[i]][(j-this.EO[i]+2)%2];
                }
            }
            F[1][4] = "U";
            F[4][1] = "L";
            F[4][4] = "F";
            F[4][7] = "R";
            F[4][10] = "B";
            F[7][4] = "D";

            let res = "";
            for (const f of F) {
                for (const c of f) {
                    res += c;
                }
                res += "\n";
            }
            return res;
        }

        getCP() {
            return perm2index(8, this.CP);
        }

        setCP(cp) {
            index2perm(8, cp, this.CP);
        }

        getCO() {
            let co = 0;
            for (let i=0; i<7; i++) {
                co = co*3+this.CO[i];
            }
            return co;
        }

        setCO(co) {
            let c = 0;
            for (let i=6; i>=0; i--) {
                this.CO[i] = co%3;
                co = co/3|0;
                c += this.CO[i];
            }
            this.CO[7] = (3-co%3)%3;
        }

        getEP() {
            return perm2index(12, this.EP);
        }

        setEP(ep) {
            index2perm(12, ep, this.EP);
        }

        getEO() {
            let eo = 0;
            for (let i=0; i<11; i++) {
                eo = eo*2+this.EO[i];
            }
            return eo;
        }

        setEO(eo) {
            let e = 0;
            for (let i=10; i>=0; i--) {
                this.EO[i] = eo%2;
                eo = eo/2|0;
                e += this.EO[i];
            }
            this.EO[11] = (2-eo%2)%2;
        }
    }

    function perm2index(n, perm) {
        let index = 0;
        for (let i=0; i<n; i++) {
            let v = perm[i];
            for (let j=0; j<i; j++) {
                if (perm[j]<perm[i]) {
                    v--;
                }
            }
            index = index*(n-i)+v;
        }
        return index;
    }

    function index2perm(n, index, perm) {
        I = [];
        for (let i=1; i<=n; i++) {
            I.push(index%i);
            index = index/i|0;
        }

        const V = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
        for (let i=0; i<n; i++) {
            const e = I.pop();
            perm[i] = V[e];
            for (let j=e; j<12; j++) {
                V[j] = V[j+1];
            }
        }
    }

    function getRandom() {
        function randInt(n) {
            while (true) {
                const x = Math.random()*n|0;
                if (0<=x && x<n) {
                    return x;
                }
            }
        }

        const cube = new Cube();

        let p = 0;
        for (let i=7; i>0; i--) {
            const r = randInt(i+1);
            if (r<i) {
                p++;
                const t = cube.CP[i];
                cube.CP[i] = cube.CP[r];
                cube.CP[r] = t;
            }
        }

        for (let i=11; i>1; i--) {
            const r = randInt(i+1);
            if (r<i) {
                p++;
                const t = cube.EP[i];
                cube.EP[i] = cube.EP[r];
                cube.EP[r] = t;
            }
        }
        if (p%2!=0) {
            const t = cube.EP[1];
            cube.EP[1] = cube.EP[0];
            cube.EP[0] = t;
        }

        let o = 0;
        for (let i=0; i<7; i++) {
            cube.CO[i] = randInt(3);
            o += cube.CO[i];
        }
        cube.CO[7] = (3-o%3)%3;

        o = 0;
        for (let i=0; i<11; i++) {
            cube.EO[i] = randInt(2);
            o += cube.EO[i];
        }
        cube.EO[11] = (2-o%2)%2;

        return cube;
    }

    function makePhase1Table() {
        const cube = new Cube();

        const table = new Map();
        table.set(0, 0);
        let T = [0];

        for (let d=1; d<=5; d++) {
            const P = T;
            T = [];
            for (const coeo of P) {
                cube.setCO(coeo%2048);
                cube.setEO(coeo/2048|0);
                for (let m=0; m<18; m++) {
                    cube.move(m, 1);
                    const coeo2 = cube.getEO()*2048+cube.getCO();
                    cube.undo(1);
                    if (!table.has(coeo2)) {
                        table.set(coeo2, d);
                        T.push(coeo2);
                    }
                }
            }
        }
        return table;
    }
    const phase1Table = makePhase1Table();

    function solvePhase1(cube) {
        let solution = [];
        cube.history = [];

        function search(depth, maxDepth, prevMove) {
            if (depth>=maxDepth) {
                let solved = true;
                for (let i=0; i<8 && solved; i++) {
                    if (cube.CO[i]!=0) {
                        solved = false;
                    }
                }
                for (let i=0; i<12 && solved; i++) {
                    if (cube.EO[i]!=0) {
                        solved = false;
                    }
                    if ((i<8)!=(cube.EP[i]<8)) {
                        solved = false;
                    }
                }
                if (solved) {
                    solution = [...cube.history];
                }
                return solved;
            }

            const coeo = cube.getEO()*2048+cube.getCO();
            const h = phase1Table.has(coeo) ? phase1Table.get(coeo) : 6;
            if (depth+h>maxDepth) {
                return false;
            }

            for (let move=0; move<18; move++) {
                if (prevMove>=0) {
                    if ((move/3|0)==(prevMove/3|0) ||
                        (move/3|0)*3==U1 && (prevMove/3|0)*3==D1 ||
                        (move/3|0)*3==R1 && (prevMove/3|0)*3==L1 ||
                        (move/3|0)*3==F1 && (prevMove/3|0)*3==B1) {
                        continue;
                    }
                }

                cube.move(move, 1);
                const solved = search(depth+1, maxDepth, move);
                cube.undo(1);

                if (solved) {
                    return true;
                }
            }

            return false;
        }

        for (let maxDepth=0; ; maxDepth++) {
            const solved = search(0, maxDepth, -1);
            if (solved) {
                break;
            }
        }

        return solution;
    }

    // CP
    function makePhase2Table1() {
        const cube = new Cube();

        const table = [];
        for (let i=0; i<40320; i++) {
            table.push(-1);
        }
        table[0] = 0;

        for (let d=0; ; d++) {
            up = false;
            for (let cp=0; cp<40320; cp++) {
                if (table[cp]==d) {
                    cube.setCP(cp);
                    for (const m of [U1, U2, U3, R2, F2, D1, D2, D3, L2, B2]) {
                        cube.move(m, 2);
                        const cp2 = cube.getCP();
                        cube.undo(2);
                        if (table[cp2]==-1) {
                            table[cp2] = d+1;
                            up = true;
                        }
                    }
                }
            }
            if (!up) {
                break;
            }
        }
        return table;
    }
    const phase2Table1 = makePhase2Table1();

    // CP+EP
    function makePhase2Table2() {
        const cube = new Cube();

        const table = new Map();
        table.set("0_0", 0);
        let T = ["0_0"];

        for (let d=1; d<=6; d++) {
            const P = T;
            T = [];
            for (const cpep of P) {
                const t = cpep.split("_");
                cube.setCP(+t[0]);
                cube.setEP(+t[1]);
                for (const m of [U1, U2, U3, R2, F2, D1, D2, D3, L2, B2]) {
                    cube.move(m, 2);
                    const cpep2 = `${cube.getCP()}_${cube.getEP()}`;
                    cube.undo(2);
                    if (!table.has(cpep2)) {
                        table.set(cpep2, d);
                        T.push(cpep2);
                    }
                }
            }
        }
        return table;
    }
    const phase2Table2 = makePhase2Table2();

    function solvePhase2(cube) {
        let solution = [];
        cube.history = [];

        function search(depth, maxDepth, prevMove) {
            if (depth>=maxDepth) {
                let solved = true;
                for (let i=0; i<8 && solved; i++) {
                    if (cube.CP[i]!=i || cube.CO[i]!=0) {
                        solved = false;
                    }
                }
                for (let i=0; i<12 && solved; i++) {
                    if (cube.EP[i]!=i || cube.EO[i]!=0) {
                        solved = false;
                    }
                }
                if (solved) {
                    solution = [...cube.history];
                }
                return solved;
            }

            const h1 = phase2Table1[cube.getCP()];
            const cpep = `${cube.getCP()}_${cube.getEP()}`;
            const h2 = phase2Table2.has(cpep) ? phase2Table2.get(cpep) : 7;
            if (depth+Math.max(h1, h2)>maxDepth) {
                return false;
            }

            for (const move of [U1, U2, U3, R2, F2, D1, D2, D3, L2, B2]) {
                if (prevMove>=0) {
                    if ((move/3|0)==(prevMove/3|0) ||
                        (move/3|0)*3==U1 && (prevMove/3|0)*3==D1 ||
                        (move/3|0)*3==R1 && (prevMove/3|0)*3==L1 ||
                        (move/3|0)*3==F1 && (prevMove/3|0)*3==B1) {
                        continue;
                    }
                }

                cube.move(move, 2);
                const solved = search(depth+1, maxDepth, move);
                cube.undo(2);

                if (solved) {
                    return true;
                }
            }

            return false;
        }

        for (let maxDepth=0; ; maxDepth++) {
            const solved = search(0, maxDepth, -1);
            if (solved) {
                break;
            }
        }

        return solution;
    }

    function getScramble() {
        const cube = getRandom();
        //console.log(""+cube);
        const solution1 = solvePhase1(cube);
        for (let m of solution1) {
            cube.move(m, 0);
        }
        const solution2 = solvePhase2(cube);
        // phase1 の最後と phase2 の最初がキャンセルする可能性がある。
        const solution = [];
        for (let m of [...solution1, ...solution2]) {
            if (solution.length>0 && (solution[solution.length-1]/3|0)==(m/3|0)) {
                const p = solution.pop();
                const pn = p%3+1;
                const mn = m%3+1;
                const n = (pn+mn)%4;
                if (n>0) {
                    solution.push((m/3|0)*3+n-1);
                }
            } else {
                solution.push(m);
            }
        }

        const gen = [];
        for (let i=solution.length-1; i>=0; i--) {
            const m = solution[i];
            gen.push((m/3|0)*3+(2-m%3));
        }

        const scramble = [];
        for (const m of gen) {
            scramble.push("URFDLB"[m/3|0]+["", "2", "'"][m%3]);
        }
        return scramble.join(" ");
    }

    return getScramble;
})();

postMessage(getScramble());
