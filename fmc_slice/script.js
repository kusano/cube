class Cube {
/*
          0  1  2
          3  4  5
          6  7  8
 9 10 11 18 19 20 27 28 29 36 37 38
12 13 14 21 22 23 30 31 32 39 40 41
15 16 17 24 25 26 33 34 35 42 43 44
         45 46 47
         48 49 50
         51 52 53
*/
    constructor() {
        this.F = [];
        for (let i=0; i<9; i++) {
            this.F.push("U");
        }
        for (let i=0; i<9; i++) {
            this.F.push("L");
        }
        for (let i=0; i<9; i++) {
            this.F.push("F");
        }
        for (let i=0; i<9; i++) {
            this.F.push("R");
        }
        for (let i=0; i<9; i++) {
            this.F.push("B");
        }
        for (let i=0; i<9; i++) {
            this.F.push("D");
        }
    }

    move(m) {
        if (Array.isArray(m)) {
            for (let c of m) {
                this.move(c);
            }
            return;
        }

        if (m.length>=2) {
            if (m[1]=="2") {
                for (let i=0; i<2; i++) {
                    this.move(m[0]);
                }
            }
            if (m[1]=="'") {
                for (let i=0; i<3; i++) {
                    this.move(m[0]);
                }
            }
            return;
        }

        const rotate = (a, b, c, d) => {
            let t = this.F[d];
            this.F[d] = this.F[c];
            this.F[c] = this.F[b];
            this.F[b] = this.F[a];
            this.F[a] = t;
        }

        if (m=="F") {
            rotate(19, 23, 25, 21);
            rotate( 7, 30, 46, 14);
            rotate(18, 20, 26, 24);
            rotate( 6, 27, 47, 17);
            rotate(11,  8, 33, 45);
        }
        if (m=="B") {
            rotate(37, 41, 43, 39);
            rotate( 1, 12, 52, 32);
            rotate(36, 38, 44, 42);
            rotate( 2,  9, 51, 35);
            rotate(29,  0, 15, 53);
        }
        if (m=="R") {
            rotate(28, 32, 34, 30);
            rotate( 5, 39, 50, 23);
            rotate(27, 29, 35, 33);
            rotate( 8, 36, 53, 26);
            rotate(20,  2, 42, 47);
        }
        if (m=="L") {
            rotate(10, 14, 16, 12);
            rotate( 3, 21, 48, 41);
            rotate( 9, 11, 17, 15);
            rotate( 0, 18, 45, 44);
            rotate( 38, 6, 24, 51);
        }
        if (m=="U") {
            rotate( 1,  5,  7,  3);
            rotate(37, 28, 19, 10);
            rotate( 0,  2,  8,  6);
            rotate(38, 29, 20, 11);
            rotate( 9, 36, 27, 18);
        }
        if (m=="D") {
            rotate(46, 50, 52, 48);
            rotate(25, 34, 43, 16);
            rotate(45, 47, 53, 51);
            rotate(24, 33, 42, 15);
            rotate(17, 26, 35, 44);
        }
        if (m=="M") {
            rotate( 4, 22, 49, 40);
            rotate( 1, 19, 46, 43);
            rotate( 7, 25, 52, 37);
        }
        if (m=="S") {
            rotate( 4, 31, 49, 13);
            rotate( 3, 28, 50, 16);
            rotate( 5, 34, 48, 10);
        }
        if (m=="E") {
            rotate(13, 22, 31, 40);
            rotate(12, 21, 30, 39);
            rotate(14, 23, 32, 41);
        }
    }
}

function reverse(moves) {
    const rev = [];
    for (let i=moves.length-1; i>=0; i--) {
        if (moves[i].length==1) {
            rev.push(moves[i][0]+"'");
        } else if (moves[i][1]=="2") {
            rev.push(moves[i]);
        } else if (moves[i][1]=="'") {
            rev.push(moves[i][0]);
        }
    }
    return rev;
}

document.addEventListener("DOMContentLoaded", () => {
    const elInput = document.getElementById("input");
    const elParse = document.getElementById("parse");
    const elScramble = document.getElementById("scramble");
    const elNormal = document.getElementById("normal");
    const elInverse = document.getElementById("inverse");
    const elVisualize = document.getElementById("visualize");
    const elCanvas = document.getElementById("canvas");
    const elSlice = document.getElementById("slice");
    const elSliceError = document.getElementById("slice_error");
    const elSkeleton = document.getElementById("skeleton");
    const elSkeletonMoves = document.getElementById("skeleton_moves");
    const elSkeleton2 = document.getElementById("skeleton2");
    const elSkeleton2Moves = document.getElementById("skeleton2_moves");
    const elInsertion = document.getElementById("insertion");
    const elInsertionMoves = document.getElementById("insertion_moves");
    const elInsertionError = document.getElementById("insertion_error");
    const elResult = document.getElementById("result");
    const elResultMoves = document.getElementById("result_moves");
    const elResultCount = document.getElementById("result_count");

    let currentInput = "";

    elInput.addEventListener("input", () => {
        input = elInput.value;

        if (input==currentInput) {
            return;
        }
        currentInput = input;

        solve(input);
    });

    const solve = input => {
        elParse.style.display = "none";
        elVisualize.style.display = "none";
        elSlice.style.display = "none";
        elSliceError.style.display = "none";
        elSkeleton.style.display = "none";
        elSkeleton2.style.display = "none";
        elInsertion.style.display = "none";
        elInsertionError.style.display = "none";
        elResult.style.display = "none";

        // Parse input.
        const scramble = [];
        const normal = [];
        const inverse = [];
        {
            let inScramble = true;
            let inComment = false;
            let brace = 0;

            for (let p=0; p<input.length; p++) {
                if (input[p]=="\n") {
                    inScramble = false;
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
                    if (inScramble) {
                        scramble.push(m);
                    } else if (brace==0) {
                        normal.push(m);
                    } else {
                        inverse.push(m);
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
        }

        elParse.style.display = "block";
        elScramble.textContent = scramble.join(" ");
        elNormal.textContent = normal.join(" ");
        elInverse.textContent = inverse.join(" ");

        const cube = new Cube();
        cube.move(reverse(inverse));
        cube.move(scramble);
        cube.move(normal);

        // Visualize.
        {
            elVisualize.style.display = "block";
            const ctx = elCanvas.getContext("2d");
            ctx.reset();

            ctx.clearRect(0, 0, elCanvas.width, elCanvas.height);
            ctx.scale(elCanvas.height, elCanvas.height);
            ctx.lineWidth = 0.002;

            const faceToColor = {
                "F": "#00FF00",
                "B": "#0000FF",
                "R": "#FF0000",
                "L": "#FF8000",
                "U": "#FFFFFF",
                "D": "#FFFF00",
            };

            for (let f=0; f<6; f++)
            {
                let ox, oy;
                switch (f) {
                    case 0:
                        ox = 1+4.5/11;
                        oy = 0.5/11;
                        break;
                    case 1:
                        ox = 1+1.0/11;
                        oy = 4.0/11;
                        break;
                    case 2:
                        ox = 1+4.5/11;
                        oy = 4.0/11;
                        break;
                    case 3:
                        ox = 1+8.0/11;
                        oy = 4.0/11;
                        break;
                    case 4:
                        ox = 1+11.5/11;
                        oy = 4.0/11;
                        break;
                    case 5:
                        ox = 1+4.5/11;
                        oy = 7.5/11;
                        break;
                }

                for (let y=0; y<3; y++) {
                    for (let x=0; x<3; x++) {
                        ctx.fillStyle = faceToColor[cube.F[f*9+y*3+x]];
                        ctx.fillRect(ox+x/11, oy+y/11, 1/11, 1/11);

                        ctx.strokeStyle = "#202020";
                        ctx.strokeRect(ox+x/11, oy+y/11, 1/11, 1/11);
                    }
                }
            }

            // x: R
            // y: U
            // z: F
            const trans = (x, y, z) => {
                const th1 = -Math.PI/6;
                const x2 = x*Math.cos(th1)+z*Math.sin(th1);
                const y2 = y;
                const z2 = -x*Math.sin(th1)+z*Math.cos(th1);

                const th2 = -Math.PI/6;
                const x3 = x2;
                const y3 = y2*Math.cos(th2)+z2*Math.sin(th2);
                const z3 = -y2*Math.sin(th2)+z2*Math.cos(th2);

                const x4 = x3*(1+z3/8);
                const y4 = y3*(1+z3/8);

                const x5 = x4/4+0.5;
                const y5 = -y4/4+0.5;

                return [x5, y5];
            };

            // F
            for (let y=0; y<3; y++) {
                for (let x=0; x<3; x++) {
                    ctx.beginPath();
                    ctx.moveTo(...trans(-1+x*2/3, 1-y*2/3, 1));
                    ctx.lineTo(...trans(-1+x*2/3+2/3, 1-y*2/3, 1));
                    ctx.lineTo(...trans(-1+x*2/3+2/3, 1-y*2/3-2/3, 1));
                    ctx.lineTo(...trans(-1+x*2/3, 1-y*2/3-2/3, 1));
                    ctx.closePath();

                    ctx.fillStyle = faceToColor[cube.F[18+y*3+x]];
                    ctx.fill();
                    ctx.stroke();
                }
            }

            // R
            for (let y=0; y<3; y++) {
                for (let x=0; x<3; x++) {
                    ctx.beginPath();
                    ctx.moveTo(...trans(1, 1-y*2/3, 1-x*2/3));
                    ctx.lineTo(...trans(1, 1-y*2/3, 1-x*2/3-2/3));
                    ctx.lineTo(...trans(1, 1-y*2/3-2/3, 1-x*2/3-2/3));
                    ctx.lineTo(...trans(1, 1-y*2/3-2/3, 1-x*2/3));
                    ctx.closePath();

                    ctx.fillStyle = faceToColor[cube.F[27+y*3+x]];
                    ctx.fill();
                    ctx.stroke();
                }
            }

            // U
            for (let y=0; y<3; y++) {
                for (let x=0; x<3; x++) {
                    ctx.beginPath();
                    ctx.moveTo(...trans(-1+x*2/3, 1, -1+y*2/3));
                    ctx.lineTo(...trans(-1+x*2/3+2/3, 1, -1+y*2/3));
                    ctx.lineTo(...trans(-1+x*2/3+2/3, 1, -1+y*2/3+2/3));
                    ctx.lineTo(...trans(-1+x*2/3, 1, -1+y*2/3+2/3));
                    ctx.closePath();

                    ctx.fillStyle = faceToColor[cube.F[y*3+x]];
                    ctx.fill();
                    ctx.stroke();
                }
            }
        }

        // Slices.
        let slice = "";
        {
            const check = T => {
                for (const t of T) {
                    for (const x of t) {
                        if (cube.F[x]!=cube.F[t[0]]) {
                            return false;
                        }
                    }
                }
                return true;
            }
            const s = check([
                [ 0,  1,  2,  6,  7,  8],
                [ 9, 11, 12, 14, 15, 17],
                [18, 19, 20, 21, 22, 23, 24, 25, 26],
                [27, 29, 30, 32, 33, 35],
                [36, 37, 38, 39, 40, 41, 42, 43, 44],
                [45, 46, 47, 51, 52, 53],
            ]);
            const m = check([
                [ 0,  2,  3,  5,  6,  8],
                [ 9, 10, 11, 12, 13, 14, 15, 16, 17],
                [18, 20, 21, 23, 24, 26],
                [27, 28, 29, 30, 31, 32, 33, 34, 35],
                [36, 38, 39, 41, 42, 44],
                [45, 47, 48, 50, 51, 53],
            ]);
            const e = check([
                [ 0,  1,  2,  3,  4,  5,  6,  7,  8],
                [ 9, 10, 11, 15, 16, 17],
                [18, 19, 20, 24, 25, 26],
                [27, 28, 29, 33, 34, 35],
                [36, 37, 38, 42, 43, 44],
                [45, 46, 47, 48, 49, 50, 51, 52, 53],
            ]);

            const n = (s?1:0)+(m?1:0)+(e?1:0);
            if (n==0) {
                elSliceError.style.display = "block";
                elSliceError.textContent = "Two or more slices are unsolved.";
                return;
            }
            if (n>1) {
                elSliceError.style.display = "block";
                elSliceError.textContent = "All slices are solved.";
                return;
            }

            if (s) {
                slice = "S";
            }
            if (m) {
                slice = "M";
            }
            if (e) {
                slice = "E";
            }

            // センターがずれている場合は、以降の方法では修正できない？
            // 弾いておく。
            if ((slice=="S" && cube.F[ 1]!=cube.F[ 4]) ||
                (slice=="M" && cube.F[ 3]!=cube.F[ 4]) ||
                (slice=="E" && cube.F[10]!=cube.F[13])) {
                elSliceError.style.display = "block";
                elSliceError.textContent = "Fixing centers is not supported.";
                return;
            }

            elSlice.style.display = "block";
            elSlice.textContent = `Slice: ${slice}`;
        }

        // Skeleton
        let skeleton = [];
        let insertStart = 0;
        let insertEnd = 0;
        {
            let center = -1;

            const add = m => {
                const add2 = m => {
                    if (skeleton.length==0 || skeleton[skeleton.length-1][0]!=m[0]) {
                        skeleton.push(m);
                    } else {
                        let n = 0;
                        let p = skeleton[skeleton.length-1];
                        if (p.length==1) {
                            n += 1;
                        } else if (p[1]=="2") {
                            n += 2;
                        } else {
                            n += 3;
                        }
                        if (m.length==1) {
                            n += 1;
                        } else if (m[1]=="2") {
                            n += 2;
                        } else {
                            n += 3;
                        }
                        n %= 4;

                        if (center==skeleton.length) {
                            if (n==0 || skeleton[skeleton.length-1][1]=="2") {
                                center--;
                            }
                        }

                        switch (n) {
                            case 0:
                                skeleton.pop();
                                break;
                            case 1:
                                skeleton[skeleton.length-1] = m[0];
                                break;
                            case 2:
                                skeleton[skeleton.length-1] = m[0]+"2";
                                break;
                            case 3:
                                skeleton[skeleton.length-1] = m[0]+"'";
                                break;
                        }
                    }
                };

                // 対象のスライスに平行な動きは、F->B, R->L, U->D の順番にする。
                // キャンセル処理の際に、連続するスライスに平行な動きを高々2個にするため。
                // 挿入可能な範囲が不連続になりうるので、対象のスライス以外は順番を変えない。
                if (skeleton.length>0 && (
                    slice=="S" && skeleton[skeleton.length-1][0]=="B" && m[0]=="F" ||
                    slice=="M" && skeleton[skeleton.length-1][0]=="L" && m[0]=="R" ||
                    slice=="E" && skeleton[skeleton.length-1][0]=="D" && m[0]=="U")) {
                    if (center==skeleton.length) {
                        center--;
                    }
                    const t = skeleton.pop();
                    add2(m);
                    add2(t);
                } else {
                    add2(m);
                }
            };

            for (let m of normal) {
                add(m);
            }
            center = skeleton.length;
            for (let m of reverse(inverse)) {
                add(m);
            }

            const bad = m => {
                return (
                    slice=="S" && (m=="U" || m=="U'" || m=="R" || m=="R'" || m=="D" || m=="D'" || m=="L" || m=="L'") ||
                    slice=="M" && (m=="U" || m=="U'" || m=="F" || m=="F'" || m=="D" || m=="D'" || m=="B" || m=="B'") ||
                    slice=="E" && (m=="F" || m=="F'" || m=="R" || m=="R'" || m=="B" || m=="B'" || m=="L" || m=="L'")
                );
            }

            insertStart = 0;
            for (let p=center; p>0; p--) {
                if (bad(skeleton[p-1])) {
                    insertStart = p;
                    break;
                }
            }
            insertEnd = skeleton.length;
            for (let p=center; p<skeleton.length; p++) {
                if (bad(skeleton[p])) {
                    insertEnd = p;
                    break;
                }
            }

            let moves = "";
            for (let i=0; i<skeleton.length; i++) {
                if (i>0) {
                    moves += " ";
                }
                if (i==insertStart) {
                    moves += "[";
                }
                moves += skeleton[i];
                if (i+1==insertEnd) {
                    moves += "]";
                }
            }

            elSkeleton.style.display = "block";
            elSkeletonMoves.textContent = moves;
        }

        // Skeleton2.
        let skeleton2 = [];
        let prefixLength = 0;
        {
            const cubePrefix = new Cube();
            cubePrefix.move(skeleton.slice(insertEnd));
            cubePrefix.move(scramble);
            cubePrefix.move(skeleton.slice(0, insertStart));

            let moves = [];
            let faces = [];
            if (slice=="S") {
                moves = ["U2", "R2", "D2", "L2"];
                faces = [3, 4, 5, 28, 31, 34, 50, 49, 48, 16, 13, 10];
            }
            if (slice=="M") {
                moves = ["U2", "F2", "D2", "B2"];
                faces = [1, 4, 7, 19, 22, 25, 46, 49, 52, 43, 40, 37];
            }
            if (slice=="E") {
                moves = ["L2", "F2", "R2", "B2"];
                faces = [12, 13, 14, 21, 22, 23, 30, 31, 32, 39, 40, 41];
            }

            let prefix = [];
            let ok = false;
            for (let l=0; l<=5; l++) {
                for (let b=0; b<(1<<(2*l)); b++) {
                    prefix = [];
                    for (let i=0; i<l; i++) {
                        prefix.push(moves[b>>(2*i)&0x3]);
                    }
                    const c = new Cube();
                    c.move(prefix);

                    ok = true;
                    for (const f of faces) {
                        if (c.F[f]!=cubePrefix.F[f]) {
                            ok = false;
                        }
                    }
                    if (ok) {
                        break;
                    }
                }
                if (ok) {
                    break;
                }
            }
            if (!ok) {
                console.error("???");
                return;
            }

            skeleton2 = prefix;
            prefixLength = prefix.length;

            for (const m of skeleton.slice(insertStart, insertEnd)) {
                skeleton2.push(m);
            }

            elSkeleton2.style.display = "block";
            let html = "";
            for (let i=0; i<skeleton2.length; i++) {
                if (html!="") {
                    html += " ";
                }
                if (i<prefixLength ||
                    (slice=="S" && (skeleton2[i][0]=="F" || skeleton2[i][0]=="B")) ||
                    (slice=="M" && (skeleton2[i][0]=="R" || skeleton2[i][0]=="L")) ||
                    (slice=="E" && (skeleton2[i][0]=="U" || skeleton2[i][0]=="D"))) {
                    html += `<span class="has-text-grey-light">${skeleton2[i]}</span>`;
                } else {
                    html += skeleton2[i];
                }
            }
            elSkeleton2Moves.innerHTML = html;
        }

        // Insertion.
        let insertions = [];
        {
            let faces = [];
            if (slice=="S") {
                faces = [3, 4, 5, 28, 31, 34, 50, 49, 48, 16, 13, 10];
            }
            if (slice=="M") {
                faces = [1, 4, 7, 19, 22, 25, 46, 49, 52, 43, 40, 37];
            }
            if (slice=="E") {
                faces = [12, 13, 14, 21, 22, 23, 30, 31, 32, 39, 40, 41];
            }

            const extract = cube => {
                let r = "";
                for (const f of faces) {
                    r += cube.F[f];
                }
                return r;
            };

            const cube = new Cube();
            cube.move(skeleton2.slice(0, prefixLength));

            T = {};
            T[extract(cube)] = {
                diff: 0,
                slices: [],
            };

            for (let i=prefixLength; i<=skeleton2.length; i++) {
                P = T;
                T = {};

                for (let k in P) {
                    for (let i=0; i<faces.length; i++) {
                        cube.F[faces[i]] = k[i];
                    }

                    for (let j=0; j<4; j++) {
                        // 1個の動きを二重にキャンセルしてしまうことを防ぐため特定の箇所にはインサートしない。
                        // 例えば、対象のスライスが S のときは、* の箇所にインサートしない。
                        //   U F * L U F * L R * U F * R U
                        if (j>0) {
                            const para = i => {
                                return 0<=i && i<skeleton2.length && (
                                    slice=="S" && (skeleton2[i][0]=="F" || skeleton2[i][0]=="B") ||
                                    slice=="M" && (skeleton2[i][0]=="R" || skeleton2[i][0]=="L") ||
                                    slice=="E" && (skeleton2[i][0]=="U" || skeleton2[i][0]=="D"));
                            };
                            if (!para(i-1) && para(i) || para(i-2) && para(i-1)) {
                                continue;
                            }
                        }

                        let move = "";
                        switch (j) {
                            case 1:
                                move = slice;
                                break;
                            case 2:
                                move = slice+"2";
                                break;
                            case 3:
                                move = slice+"'";
                        }
                        if (move!="") {
                            cube.move([move]);
                        }
                        if (i<skeleton2.length) {
                            cube.move([skeleton2[i]]);
                        }

                        let diff = 0;
                        if (move!="") {
                            diff += 2;

                            const cancel = (m1, m2, same) => {
                                const c1 = m1.length==1 ? 1 : m1[1]=="2" ? 2 : 3;
                                const c2 = m2.length==1 ? 1 : m2[1]=="2" ? 2 : 3;
                                if (same) {
                                    return c1==c2 ? -2 : -1;
                                } else {
                                    return c1==4-c2 ? -2 : -1;
                                }
                            };

                            for (let p=i-1; p<=i; p++) {
                                if (move[0]=="S" && prefixLength<=p && p<skeleton2.length && skeleton2[p][0]=="F") {diff += cancel(move, skeleton2[p], true);}
                                if (move[0]=="S" && prefixLength<=p && p<skeleton2.length && skeleton2[p][0]=="B") {diff += cancel(move, skeleton2[p], false);}
                                if (move[0]=="M" && prefixLength<=p && p<skeleton2.length && skeleton2[p][0]=="R") {diff += cancel(move, skeleton2[p], false);}
                                if (move[0]=="M" && prefixLength<=p && p<skeleton2.length && skeleton2[p][0]=="L") {diff += cancel(move, skeleton2[p], true);}
                                if (move[0]=="E" && prefixLength<=p && p<skeleton2.length && skeleton2[p][0]=="U") {diff += cancel(move, skeleton2[p], false);}
                                if (move[0]=="E" && prefixLength<=p && p<skeleton2.length && skeleton2[p][0]=="D") {diff += cancel(move, skeleton2[p], true);}
                            }
                        }

                        const k2 = extract(cube);
                        const v2 = {
                            diff: P[k].diff+diff,
                            slices: P[k].slices.slice(),
                        }
                        if (move!="") {
                            v2.slices.push({
                                pos: i,
                                move: move,
                            })
                        }

                        if (!T[k2] ||
                            v2.diff<T[k2].diff ||
                            v2.diff==T[k2].diff && v2.slices.length<T[k2].slices.length ||
                            v2.diff==T[k2].diff && v2.slices.length==T[k2].slices.length && v2.slices[0].pos>T[k2].slices[0].pos) {
                            T[k2] = v2;
                        }

                        if (i<skeleton2.length) {
                            cube.move(reverse([skeleton2[i]]));
                        }
                        switch (j) {
                            case 1:
                                cube.move(slice+"'");
                                break;
                            case 2:
                                cube.move(slice+"2");
                                break;
                            case 3:
                                cube.move(slice);
                        }
                    }
                }
            }

            const solved = new Cube();
            solved.move(reverse(inverse));
            solved.move(scramble);
            solved.move(normal);

            // コーナーにセンターを合わせる。
            solved.F[ 1] = solved.F[ 3] = solved.F[ 4] = solved.F[ 5] = solved.F[ 7] = solved.F[ 0];
            solved.F[10] = solved.F[12] = solved.F[13] = solved.F[14] = solved.F[16] = solved.F[ 9];
            solved.F[19] = solved.F[21] = solved.F[22] = solved.F[23] = solved.F[25] = solved.F[18];
            solved.F[28] = solved.F[30] = solved.F[31] = solved.F[32] = solved.F[34] = solved.F[27];
            solved.F[37] = solved.F[39] = solved.F[40] = solved.F[41] = solved.F[43] = solved.F[44];
            solved.F[46] = solved.F[48] = solved.F[48] = solved.F[50] = solved.F[52] = solved.F[45];
            const best = T[extract(solved)];

            if (!best) {
                elInsertionError.style.display = "block";
                elInsertionError.textContent = "Cannot fix with slice insertion.";
                return;
            }

            let html = "";
            for (let i=0; i<=skeleton2.length; i++) {
                for (const s of best.slices) {
                    if (s.pos==i) {
                        insertions.push({
                            pos: s.pos-prefixLength+insertStart,
                            move: s.move
                        });

                        if (html!="") {
                            html += " ";
                        }
                        html += `<span class="has-text-danger">${s.move}</span>`;
                    }
                }

                if (i<skeleton2.length) {
                    if (html!="") {
                        html += " ";
                    }
                    if (i<prefixLength ||
                        (slice=="S" && (skeleton2[i][0]=="F" || skeleton2[i][0]=="B")) ||
                        (slice=="M" && (skeleton2[i][0]=="R" || skeleton2[i][0]=="L")) ||
                        (slice=="E" && (skeleton2[i][0]=="U" || skeleton2[i][0]=="D"))) {
                        html += `<span class="has-text-grey-light">${skeleton2[i]}</span>`;
                    } else {
                        html += skeleton2[i];
                    }
                }
            }
            elInsertion.style.display = "block";
            elInsertionMoves.innerHTML = html;
        }

        // Result.
        {
            const result = [];

            const add = m => {
                if (result.length==0 || result[result.length-1][0]!=m[0]) {
                    result.push(m);
                } else {
                    let n = 0;
                    let p = result[result.length-1];
                    if (p.length==1) {
                        n += 1;
                    } else if (p[1]=="2") {
                        n += 2;
                    } else {
                        n += 3;
                    }
                    if (m.length==1) {
                        n += 1;
                    } else if (m[1]=="2") {
                        n += 2;
                    } else {
                        n += 3;
                    }
                    n %= 4;

                    switch (n) {
                        case 0:
                            result.pop();
                            break;
                        case 1:
                            result[result.length-1] = m[0];
                            break;
                        case 2:
                            result[result.length-1] = m[0]+"2";
                            break;
                        case 3:
                            result[result.length-1] = m[0]+"'";
                            break;
                    }
                }
            };

            let F = {
                "F": "F",
                "B": "B",
                "R": "R",
                "L": "L",
                "U": "U",
                "D": "D",
            };

            for (let i=0; i<=skeleton.length; i++) {
                for (const ins of insertions) {
                    if (ins.pos==i) {
                        const n = ins.move.length==1?1:ins.move[1]=="2"?2:3;
                        const suffix = ["", "", "2", "'"][n];
                        const rev = ["", "'", "2", ""][n];

                        if (ins.move[0]=="S") {
                            if (i>0 && skeleton[i-1][0]=="F") {
                                add("F"+rev);
                                add("B"+suffix);
                            } else {
                                add("B"+suffix);
                                add("F"+rev);
                            }
                        } else if (ins.move[0]=="M") {
                            if (i>0 && skeleton[i-1][0]=="L") {
                                add("L"+rev);
                                add("R"+suffix);
                            } else {
                                add("R"+suffix);
                                add("L"+rev);
                            }
                        } else if (ins.move[0]=="E") {
                            if (i>0 && skeleton[i-1][0]=="D") {
                                add("D"+rev);
                                add("U"+suffix);
                            } else {
                                add("U"+suffix);
                                add("D"+rev);
                            }
                        } else {
                            add(ins.move);
                        }

                        for (let i=0; i<n; i++) {
                            if (ins.move[0]=="S") {
                                F = {
                                    "F": F["F"],
                                    "B": F["B"],
                                    "R": F["U"],
                                    "L": F["D"],
                                    "U": F["L"],
                                    "D": F["R"],
                                };
                            }
                            if (ins.move[0]=="M") {
                                F = {
                                    "F": F["U"],
                                    "B": F["D"],
                                    "R": F["R"],
                                    "L": F["L"],
                                    "U": F["B"],
                                    "D": F["F"],
                                };
                            }
                            if (ins.move[0]=="E") {
                                F = {
                                    "F": F["L"],
                                    "B": F["R"],
                                    "R": F["F"],
                                    "L": F["B"],
                                    "U": F["U"],
                                    "D": F["D"],
                                };
                            }
                        }
                    }
                }
                if (i<skeleton.length) {
                    add(F[skeleton[i][0]]+(skeleton[i].length==1?"":skeleton[i][1]));
                }
            };

            elResult.style.display = "block";
            elResultMoves.textContent = result.join(" ");
            const diff = result.length-skeleton.length;
            elResultCount.textContent = `(${diff>0?"+":diff==0?"±":""}${diff}/${result.length})`;
        }
    };

    const pasteSample = id => {
        const sample = [
            "",
`R' U' F D U2 L2 F2 D' F2 U' F2 L2 R' B L' F L U2 B2 F' R U L D' R' U' F

R' L2 F // EO (3/3)
L' D // DR-2e3c (2/5)
(D2 L' D' R D') // DR (5/10)
(R) B2 R D2 F2 U2 F2 R' // HTR (8/18)
D2 R2 D2 F2 L2 // FR (5/23)
F2 B2 // leave slice (2/25)`,

`R' U' F L' D2 F2 L2 D2 L F2 R2 F2 D2 F' L' R2 B2 D' B2 L U B' D2 F' R' U' F

U2 R' B2 U' // EO (U/D) (4/4)
B F2 L // DR-2e3c (F/B) (3/7)
F2 L2 B2 U2 F' L B' L' // DR (F/B, 3QT) (8/15)
F2 U2 F' U2 L2 D2 L2 F' R2 B' // HTR (10/25)
R2 U2 L2 U2 L2 F2 // FR (F/B) (6/31)
R2 // leave slice (1/32)`,

`R' U' F L' B2 F2 U2 F2 L' F2 R' D2 B2 U R2 F U2 R' F' L U' R2 B2 R' U' F

(R U F L) // EO (L/R) (4/4)
(B) // DR-2e3c (U/D) (1/5)
(D F2 D F' D F') // DR (U/D, 3QT) (6/11)
(U R2 B2 L2 B2 U B2 U') // HTR (8/19)
U2 B2 R2 U2 // FR (U/D) (4/23)
R2 F2 R2 // leave slice (3/26)`,
        ];
        elInput.value = sample[id];
        elInput.dispatchEvent(new Event("input"));
    };

    for (let i=1; i<=3; i++) {
        document.getElementById("sample"+i).addEventListener("click", () => {
            pasteSample(i);
        });
    }
});
