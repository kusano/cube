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
    const elSlices = document.getElementById("slices");
    const elSliceS = document.getElementById("slice_s");
    const elSliceM = document.getElementById("slice_m");
    const elSliceE = document.getElementById("slice_e");
    const elSliceError = document.getElementById("slice_error");
    const elSkeleton = document.getElementById("skeleton");
    const elSkeletonMoves = document.getElementById("skeleton_moves");

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
        elSlices.style.display = "none";
        elSliceError.style.display = "none";
        elSkeleton.style.display = "none";

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
                } else if (input[p]=="/" || input[p]=="#") {
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
            const s =
                cube.F[ 3]=="U" &&
                cube.F[ 4]=="U" &&
                cube.F[ 5]=="U" &&
                cube.F[28]=="R" &&
                cube.F[31]=="R" &&
                cube.F[34]=="R" &&
                cube.F[50]=="D" &&
                cube.F[49]=="D" &&
                cube.F[48]=="D" &&
                cube.F[16]=="L" &&
                cube.F[13]=="L" &&
                cube.F[10]=="L";
            const m =
                cube.F[ 1]=="U" &&
                cube.F[ 4]=="U" &&
                cube.F[ 7]=="U" &&
                cube.F[19]=="F" &&
                cube.F[22]=="F" &&
                cube.F[25]=="F" &&
                cube.F[46]=="D" &&
                cube.F[49]=="D" &&
                cube.F[52]=="D" &&
                cube.F[43]=="B" &&
                cube.F[40]=="B" &&
                cube.F[37]=="B";
            const e =
                cube.F[12]=="L" &&
                cube.F[13]=="L" &&
                cube.F[14]=="L" &&
                cube.F[21]=="F" &&
                cube.F[22]=="F" &&
                cube.F[23]=="F" &&
                cube.F[30]=="R" &&
                cube.F[31]=="R" &&
                cube.F[32]=="R" &&
                cube.F[39]=="B" &&
                cube.F[40]=="B" &&
                cube.F[41]=="B";

            elSlices.style.display = "block";
            elSliceS.textContent = s?"Solved":"Unsolved";
            elSliceM.textContent = m?"Solved":"Unsolved";
            elSliceE.textContent = e?"Solved":"Unsolved";

            const n = (s?0:1)+(m?0:1)+(e?0:1);
            if (n==0) {
                elSliceError.style.display = "block";
                elSliceError.textContent = "All slices are solved.";
                return;
            }
            if (n>1) {
                elSliceError.style.display = "block";
                elSliceError.textContent = "Two or more slices are unsolved.";
                return;
            }
            if (!s) {
                slice = "S";
            }
            if (!m) {
                slice = "M";
            }
            if (!e) {
                slice = "E";
            }
        }

        // Skeleton
        let skeleton = [];
        let insertStart = 0;
        let insertEnd = 0;
        {
            const add = m => {
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
            }

            for (let m of normal) {
                add(m);
            }
            const center = skeleton.length;
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


    };
});
