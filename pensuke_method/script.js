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

function elem(id) {
    return document.getElementById(id);
}

let worker;

function search() {
    let input = elem("input").value.trim();
    if (input=="") {
        return;
    }

    input = input.replaceAll("‘", "'");
    input = input.replaceAll("’", "'");
    input = input.toUpperCase();

    elem("start").style.display = "none";
    elem("stop").style.display = "block";
    elem("parse").style.display = "none";
    elem("scramble").textContent = "";
    elem("normal").textContent = "";
    elem("inverse").textContent = "";
    elem("dr_axis").textContent = "";
    elem("last_direction").textContent = "";
    elem("visualize").style.display = "none";
    elem("progress").style.display = "block";
    elem("error").style.display = "none";
    elem("depth").style.display = "none";
    elem("number").style.display = "none";
    while (elem("result").firstChild) {
        elem("result").removeChild(elem("result").firstChild);
    }

    if (worker) {
        worker.terminate();
    }
    worker = new Worker("worker.js");

    let number = 0;

    worker.onmessage = e => {
        const data = e.data;

        if (data.type=="parsed") {
            elem("parse").style.display = "block";
            elem("scramble").textContent = data.scramble.join(" ");
            elem("normal").textContent = data.normal.join(" ");
            elem("inverse").textContent = data.inverse.join(" ");
            elem("dr_axis").textContent = data.drAxis;
            elem("last_direction").textContent = data.lastDirection;
            visualize(data.scramble, data.normal, data.inverse);
        }

        if (data.type=="depth") {
            elem("depth").style.display = "block";
            elem("depth_text").textContent = ""+data.depth;
        }

        if (data.type=="error") {
            elem("error").style.display = "block";
            elem("error").textContent = data.error;
        }

        if (data.type=="ls") {
            number++;
            elem("number").style.display = "block";
            elem("number_text").textContent = number;

            const elLS = document.createElement("div");
            elem("result").appendChild(elLS);

            elLS.classList.add("ls");
            elLS.style.width = `${data.moves.length*4+6}em`;

            for (let i=0; i<3; i++) {
                const elTitle = document.createElement("div");
                elLS.appendChild(elTitle);

                elTitle.classList.add("ls_title");
                elTitle.style.top = `${(i+1)*1.4}lh`;
                if (i<2) {
                    const br = elTitle.textContent = [
                        {"U/D": "F/B", "F/B": "R/L", "R/L": "U/D"},
                        {"U/D": "R/L", "F/B": "U/D", "R/L": "F/B"},
                    ][i][data.axis];
                    elTitle.textContent = `BR (${br}):`;
                } else {
                    elTitle.textContent = "FR:";
                }
            }

            let BRs;
            if (data.axis=="U/D") {
                BRs = [data.BRSubsetFB, data.BRSubsetRL];
            }
            if (data.axis=="F/B") {
                BRs = [data.BRSubsetRL, data.BRSubsetUD];
            }
            if (data.axis=="R/L") {
                BRs = [data.BRSubsetUD, data.BRSubsetFB];
            }

            if (data.direction=="inverse") {
                const elMove1 = document.createElement("div");
                elLS.appendChild(elMove1);

                elMove1.classList.add("move");
                elMove1.style.left = `6em`;
                elMove1.style.width = `2em`;
                elMove1.textContent = "(";

                const elMove2 = document.createElement("div");
                elLS.appendChild(elMove2);

                elMove2.classList.add("move");
                elMove2.style.left = `${data.moves.length*4+8}em`;
                elMove2.style.width = `2em`;
                elMove2.textContent = ")";
            }

            for (let i=0; i<data.moves.length+1; i++) {
                if (i<data.moves.length) {
                    const elMove = document.createElement("div");
                    elLS.appendChild(elMove);

                    elMove.classList.add("move");
                    elMove.style.left = `${i*4+2+6}em`;
                    elMove.style.width = `4em`;
                    elMove.textContent = data.moves[i];
                }

                for (let br=0; br<2; br++) {
                    if (i==0 || BRs[br][i-1]!=BRs[br][i]) {
                        let n = 0;
                        for (let j=i; j<BRs[br].length && BRs[br][j]==BRs[br][i]; j++) {
                            n++;
                        }

                        const elSubset = document.createElement("div");
                        elLS.appendChild(elSubset);

                        elSubset.classList.add("subset", `d-${BRs[br][i][2]}`);
                        elSubset.style.top = `${(br+1)*1.4}lh`;
                        elSubset.style.left = `${i*4+6}em`;
                        elSubset.style.width = `${n*4}em`;
                        elSubset.textContent = BRs[br][i];
                    }
                }

                if (i==0 || data.FR[i-1]!=data.FR[i]) {
                    let n = 0;
                    for (let j=i; j<data.FR.length && data.FR[j]==data.FR[i]; j++) {
                        n++;
                    }

                    const elSubset = document.createElement("div");
                    elLS.appendChild(elSubset);

                    elSubset.classList.add("subset", `d-${data.FR[i]}`);
                    elSubset.style.top = `${1.4*3}lh`;
                    elSubset.style.left = `${i*4+6}em`;
                    elSubset.style.width = `${n*4}em`;
                    elSubset.textContent = `${data.FR[i]} ${data.axis[0]}2`;
                }
            }

            console.dir(data);
        }

        if (data.type=="end") {
            worker.terminate();
            worker = undefined;
            elem("start").style.display = "block";
            elem("stop").style.display = "none";
            elem("progress").style.display = "none";
        }
    };

    worker.postMessage({
        input,
    });
}

function visualize(scramble, normal, inverse) {
    const cube = new Cube();
    cube.move(reverse(inverse));
    cube.move(scramble);
    cube.move(normal);

    elem("visualize").style.display = "block";

    const canvas = elem("canvas");
    const ctx = canvas.getContext("2d");
    ctx.reset();

    const dpr = window.devicePixelRatio;
    const rect = canvas.getBoundingClientRect();

    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;

    canvas.style.width = `${rect.width}px`;
    canvas.style.height = `${rect.height}px`;

    // 25.5/11:1
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.scale(canvas.height, canvas.height);
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


elem("input").addEventListener("input", search);

const examples = [
    "R' U' F U2 F2 R2 D2 B' D2 L2 U2 B2 R2 B D2 U F' D2 U B2 R D L' U2 R' U' F\n\n(D' R F) // EO (F/B, DR-6e6c (U/D), DR-4e4c (R/L)) (3/3)\nL // RZP (U/D, DR-4e4c, AR-1e3c (normal), AR-1e2c (inverse)) (1/4)\nL2 B2 D F2 R2 D' L // DR (U/D, 3QT, HTR-6e4c, Solved+Bars, 4b3) (7-1/10)\nL2 B2 U F2 U (B2 U) // HTR (7-1/16)",
    "R' U' F R2 B2 R2 F U2 B' D2 B D2 F L2 F R' U L2 B' D2 L' F' D2 F2 R' U' F\n\n(F) R' B // EO (F/B, DR-8e7c (U/D), DR-6e5c (R/L)) (3/3)\n(F2 R L) // RZP (U/D, DR-4e4c, AR-0e1c (normal), AR-2e3c (inverse)) (3-1/5)\n(U2 D L2 F2 D' L) // DR (U/D, 4QT, HTR-2e2c, Solved+One Bar, 2c4) (6/11)\n(L2 F2 U' R2 U R2 U) U // HTR (8-1/18)",
    "R' U' F R B L R2 F2 L2 U' R2 F2 D' R2 U' R2 U' R' D' R' U2 R U' F R' U' F\n\n(R) B R // EO (R/L, DR-4e5c (U/D), DR-8e6c (F/B)) (3/3)\nR2 D' F // RZP (U/D, DR-2e3c, AR-0e1c (normal), AR-1e2c (inverse)) (3-1/5)\n(B' D' B) // DR (U/D, 3QT, HTR-4e4c, Solved+One Face (ST2), 4a3) (3/8)\n(U) R2 U2 F2 U F2 U2 R2 D // HTR (9/17)",
    "R' U' F U' R2 B D' R D' F' D' B' L F' U2 B U2 F2 D2 F2 L2 B U2 F2 R' U' F\n\n(D' L) // EO (R/L, DR-6e5c (U/D), DR-4e5c (F/B)) (2/2)\nF U // RZP (F/B, DR-4e4c, AR-1e3c (normal), AR-2e4c (inverse)) (2/4)\n(F U2 F2 U) // DR (F/B, 4QT, HTR-6e4c, Bar/Slash+One Face, 4a4) (4/8)\n(D2 F D2 F) U2 R2 F D2 L2 B // HTR (10-1/17)",
    "R' U' F R2 D' B D2 L2 F R2 F D2 L2 F R2 D2 L' D' B2 F' D2 L U2 R' U' F\n\n(U) R U // EO (U/D, DR-4e4c (F/B), DR-6e5c (R/L)) (3/3)\n// RZP (F/B, DR-4e4c, AR-1e2c (normal), AR-1e2c (inverse)) (0/3)\n(U2 R2 L2 F' D2 R) // DR (F/B, 2QT, HTR-4e4c, Bar/Slash+Bars, 4b2) (6-1/8)\n(F U2 F) F' R2 B // HTR (6/14)",
    "R' U' F L2 B2 D2 L2 F2 U' B2 U L2 D B2 L U2 B2 D' R F' R2 B' D F' R' U' F\n\n(B' D F) // EO (F/B, DR-4e4c (U/D), DR-6e5c (R/L)) (3/3)\n// RZP (U/D, DR-4e4c, AR-2e3c (normal), AR-0e2c (inverse)) (0/3)\nU F2 R2 U D2 L // DR (U/D, 4QT, HTR-2e4c, Bar/Slash+One Face, 4a4) (6/9)\nL2 U B2 U F2 U2 R2 D (R2 U) // HTR (10-1/18)",
    "R' U' F D2 R2 U2 R' B2 U2 L' D2 R F2 L D2 U L' R2 B F' L U2 F' U R' U' F\n\nD F // EO (F/B, DR-4e7c (U/D), DR-4e4c (R/L)) (2/2)\n// RZP (R/L, DR-4e4c, AR-1e2c (normal), AR-1e2c (inverse)) (0/2)\nD2 F2 B2 R' F2 L2 D // DR (R/L, 3QT, HTR-2e4c, Bar/Slash+One Face, 4a3) (7/9)\nB2 R (R2 B2 R B2 R) // HTR (7/16)",
    "R' U' F D2 L2 F2 R2 D L2 D' B2 U L2 F' D L' D' B F2 U L R2 D U' R' U' F\n\nL' U' R2 F // EO (F/B, DR-4e4c (U/D), DR-6e5c (R/L)) (4/4)\n// RZP (U/D, DR-4e4c, AR-0e3c (normal), AR-1e2c (inverse)) (0/4)\n(B2 D2 L2 U' F2 R) // DR (U/D, 5QT, HTR-2e6c, Solved+One Bar, 2c5) (6/10)\n(U' F2 D' R2 U F2 U) U // HTR (8/18)",
    "R' U' F L U F' U' R2 F2 B' L2 U' R' B' U2 F L2 B2 L2 B R2 F' R' U' F\n\nF R' U // EO (U/D, DR-6e6c (F/B), DR-8e6c (R/L)) (3/3)\n(L) // RZP (F/B, DR-4e4c, AR-2e3c (normal), AR-1e3c (inverse)) (1/4)\nU2 B2 R F L2 B' R // DR (F/B, 5QT, HTR-4e4c, Bars+Bars (BB3), 4b5) (7-1/10)\nR2 F (L2 F L2 B' L2 F R2 F) // HTR (10-2/18)",
    "R' U' F R F2 D2 F' U2 R2 F2 D' R B2 U2 B2 U2 L' B2 U2 R2 U2 R' U' F\n\n(F L) D R // EO (R/L, DR-6e5c (U/D), DR-6e3c (F/B)) (4/4)\n(D) // RZP (F/B, DR-4e4c, AR-1e2c (normal), AR-1e2c (inverse)) (1/5)\nF2 L2 B' R2 U // DR (F/B, 4QT, HTR-4e4c, Bars+Bars (BB3), 4b4) (5/10)\nU2 L2 F U2 B (D2 F L2 D2 F) // HTR (10-2/18)",
    "R' U' F D2 B' F U2 B L2 R2 F' R2 B2 D' R U2 L' F U2 L2 U' B' D2 R' U' F\n\n(R2 F2 U) // EO (U/D, DR-4e3c (F/B), DR-6e5c (R/L)) (3/3)\n(U2 F R) // RZP (F/B, DR-4e4c, AR-0e2c (normal), AR-1e2c (inverse)) (3-1/5)\n(B' U2 B2 R) // DR (F/B, 3QT, HTR-2e4c, Bar/Slash+One Face, 4a3) (4/9)\n(R2 U2 F' D2 F) R2 F2 U2 B // HTR (9-1/17)",
    "R' U' F L U2 R' D2 L' D2 B2 R' D2 B2 R' F2 D' B L2 D R B' L' F2 D2 R' U' F\n\nF B' U2 R // EO (R/L, DR-6e4c (U/D), DR-6e4c (F/B)) (4/4)\nB' D // RZP (F/B, DR-4e4c, AR-2e3c (normal), AR-0e2c (inverse)) (2/6)\nD2 F' U' F2 R2 U // DR (F/B, 5QT, HTR-4e4c, Bars+Bars (BB3), 4b5) (6-1/11)\nB' L2 F L2 D2 F L2 F (L2 F) // HTR (10/21)",
    "R' U' F D' L2 F' D2 B2 D2 L2 B2 F L2 R2 D2 F' L' F U' L R F U2 B' R' U' F\n\n(F' U D) // EO (U/D, DR-6e7c (F/B), DR-4e5c (R/L)) (3/3)\n(R) // RZP (F/B, DR-2e4c, AR-0e3c (normal), AR-1e1c (inverse)) (1/4)\nL' B L F D2 F L // DR (F/B, 1QT, HTR-4e4c, Bars+One Face, 4a1) (7/11)\nL2 U2 F2 D2 L2 F // HTR (6-1/16)",
    "R' U' F R2 U2 L2 D' F2 D' R2 F2 R2 U2 F2 L' F' R' U R B L' U F R' U' F\n\n(U' L) L // EO (R/L, DR-6e5c (U/D), DR-6e6c (F/B)) (3/3)\n(U) // RZP (F/B, DR-4e4c, AR-1e2c (normal), AR-1e2c (inverse)) (1/4)\nD2 L2 F2 D2 F U // DR (F/B, 3QT, HTR-4e2c, Bar/Slash+One Bar (BS1), 2c3) (6/10)\nD2 L2 F' D2 B (F) // HTR (6/16)",
    "R' U' F D' U R2 D2 L2 D' B2 D2 U' F2 U' L2 F' D' U L' B' F2 D' L2 B R' U' F\n\nD2 R2 B // EO (F/B, DR-8e6c (U/D), DR-4e6c (R/L)) (3/3)\n(R) // RZP (U/D, DR-4e4c, AR-1e3c (normal), AR-2e2c (inverse)) (1/4)\nR2 D' R2 D R // DR (U/D, 3QT, HTR-4e6c, Bars+One Bar, 2c3) (5/9)\n(R2 U2 B2 D' R2 U' F2 U) // HTR (8-1/16)",
    "R' U' F R2 U L' F' D2 F2 L' U2 R2 U B2 R2 D' F2 L2 F2 D' F L U R' U' F\n\n(B' F) R2 B // EO (F/B, DR-6e5c (U/D), DR-8e6c (R/L)) (4/4)\n(L' D) // RZP (R/L, DR-4e4c, AR-1e3c (normal), AR-2e0c (inverse)) (2/6)\nB2 R' D2 R' D // DR (R/L, 4QT, HTR-4e2c, Bar/Slash+One Bar (BS2), 2c4) (5-1/10)\nD2 L' B2 U2 R' U2 R (D2 F2 R) // HTR (10-2/18)",
    "R' U' F D L B' D' R2 D U2 R2 B2 D F2 L2 F2 U' R F' D2 U' R' D2 B' R' U' F\n\nR D' L2 F // EO (F/B, DR-4e4c (U/D), DR-6e3c (R/L)) (4/4)\n// RZP (U/D, DR-4e4c, AR-2e2c (normal), AR-2e1c (inverse)) (0/4)\nD R2 F2 U' R2 D' L // DR (U/D, 3QT, HTR-4e2c, Bars+One Bar, 2c3) (7/11)\nU2 R2 D' L2 B2 U' R2 U // HTR (8/19)",
    "R' U' F L2 F2 L2 D' U2 B2 U L2 D2 R2 B' D2 R2 F2 R U B D2 L' F' R' U' F\n\n(B U' L2 F) // EO (F/B, DR-6e7c (U/D), DR-4e4c (R/L)) (4/4)\n// RZP (R/L, DR-4e4c, AR-1e2c (normal), AR-1e3c (inverse)) (0/4)\nB2 R D2 R' F2 D // DR (R/L, 4QT, HTR-4e6c, Bar/Slash+One Bar (BS1), 2c4) (6/10)\nB2 L B2 L' F2 R U2 R // HTR (8/18)",
    "R' U' F R2 F L2 D2 U2 B R2 F2 U2 B' U2 L2 D' R' F D F2 D2 U B2 F R' U' F\n\n(R2 F2 L) L // EO (R/L, DR-6e5c (U/D), DR-8e4c (F/B)) (4/4)\nL2 U // RZP (F/B, DR-4e4c, AR-2e1c (normal), AR-1e2c (inverse)) (2-1/5)\n(L2 F2 L2 D2 B D) // DR (F/B, 4QT, HTR-6e2c, Bars+One Bar, 2c4) (6-1/10)\n(F L2 F) R2 L2 F' D2 B // HTR (8/18)",
    "R' U' F L' F B2 U' F2 L' B2 D' B U2 R2 D' F2 D' F2 D2 B2 R2 D' L2 U2 R' U' F\n\n(R D) // EO (U/D, DR-8e3c (F/B), DR-8e5c (R/L)) (2/2)\nF' R // RZP (F/B, DR-4e4c, AR-2e2c (normal), AR-2e2c (inverse)) (2/4)\n(B' L2 F' U2 R) // DR (F/B, 4QT, HTR-6e4c, Bars+Bars (BB3), 4b4) (5/9)\n(R2 F) R2 F' R2 F' D2 F2 R2 F // HTR (10-2/17)",
    "R' U' F L' F' U' B' R2 F L F R' U F2 U L2 U2 F2 L2 U L2 D L2 D R' U' F\n\nU2 R B // EO (F/B, DR-2e4c (U/D), DR-2e5c (R/L)) (3/3)\n// RZP (U/D, DR-2e4c, AR-0e2c (normal), AR-1e2c (inverse)) (0/3)\nR' U R B2 U L // DR (U/D, 0QT, HTR-6e0c, Solved+Solved, 0c0) (6/9)\nU2 L2 F2 B2 U (R2 U) // HTR (7/16)",
    "R' U' F R2 D2 U2 F2 L2 F L2 R2 B U2 F2 L' B' D L2 D L U' B' U' F R' U' F\n\n(B2 R D) D // EO (U/D, DR-6e4c (F/B), DR-6e5c (R/L)) (4/4)\nR // RZP (F/B, DR-4e4c, AR-2e3c (normal), AR-1e2c (inverse)) (1/5)\nL2 F' D2 B L // DR (F/B, 2QT, HTR-4e4c, Bar/Slash+Bars, 4b2) (5/10)\nF L2 B (D2 F' L2 F) // HTR (7-1/16)",
    "R' U' F U2 R' U' D' B2 U R U F B2 U2 D2 L F2 D2 R' U2 F2 D2 R' F2 R' U' F\n\n(R L' B2 U) // EO (U/D, DR-4e5c (F/B), DR-6e2c (R/L)) (4/4)\nL // RZP (F/B, DR-2e3c, AR-0e2c (normal), AR-0e1c (inverse)) (1/5)\nL2 B U2 L' B' L // DR (F/B, 2QT, HTR-4e4c, Bar/Slash+Bars, 4b2) (6-1/10)\nL2 U2 B' U2 L2 F' R2 F (F) // HTR (9-1/18)",
    "R' U' F U' F2 U' B2 F2 L2 F2 D B D' L' R U F' U2 L' U' B2 R' U' F\n\n(D B) U B // EO (F/B, DR-6e6c (U/D), DR-8e5c (R/L)) (4/4)\n(R) // RZP (U/D, DR-4e4c, AR-1e1c (normal), AR-2e3c (inverse)) (1/5)\nD B2 U' L // DR (U/D, 5QT, HTR-4e4c, Bars+Bars (BB3), 4b5) (4/9)\nL2 F2 D R2 D' B2 U R2 U (R2 U) // HTR (11-2/18)",
    "R' U' F D2 B U2 B2 F L2 U2 L2 D2 F2 R' B2 D R2 D R2 F R F' R' U' F\n\nF' R U2 L // EO (R/L, DR-2e4c (U/D), DR-2e3c (F/B)) (4/4)\n// RZP (F/B, DR-2e3c, AR-0e1c (normal), AR-0e3c (inverse)) (0/4)\nL2 F B D F D // DR (F/B, 4QT, HTR-6e4c, Bar/Slash+One Face, 4a4) (6-1/9)\nF U2 F R2 F2 D2 F (R2 F) // HTR (9/18)",
    "R' U' F D' L B2 U' F D' R2 F2 R B L2 B2 L2 F2 U D2 F2 R2 L2 U2 R' U' F\n\n(B U L2 D) // EO (U/D, DR-4e4c (F/B), DR-6e3c (R/L)) (4/4)\n// RZP (F/B, DR-4e4c, AR-1e1c (normal), AR-1e2c (inverse)) (0/4)\nF B2 R F2 D2 R // DR (F/B, 2QT, HTR-6e4c, Bar/Slash+Bars, 4b2) (6/10)\n(F2 L2 F' U2 B) // HTR (5/15)",
    "R' U' F R' B' U' D2 F' D L' U F D2 L2 B U2 D2 R2 B U2 L2 F L2 U R' U' F\n\n(B R2 L' D) // EO (U/D, DR-4e4c (F/B), DR-4e5c (R/L)) (4/4)\n// RZP (F/B, DR-4e4c, AR-1e2c (normal), AR-1e2c (inverse)) (0/4)\n(R2 D2 F R) // DR (F/B, 3QT, HTR-2e6c, Bars+One Bar, 2c3) (4/8)\n(U2 F' L2 F) L2 F2 L2 F // HTR (8/16)",
    "R' U' F L B2 U2 L2 F' R2 F' U2 L2 R2 F U2 L D F R D' U' L2 F R' U' F\n\nL U' D' B // EO (F/B, DR-4e6c (U/D), DR-2e4c (R/L)) (4/4)\n// RZP (R/L, DR-2e4c, AR-0e2c (normal), AR-0e2c (inverse)) (0/4)\n(F2 R B2 U' F2 U) // DR (R/L, 2QT, HTR-4e4c, Bar/Slash+Bars, 4b2) (6/10)\nR2 D2 R U2 B2 L // HTR (6/16)",
    "R' U' F D2 R2 B R U2 F' B2 R D' F U2 B L2 F2 D2 R2 F2 U2 B U2 B2 R' U' F\n\nU F2 D // EO (U/D, DR-4e7c (F/B), DR-4e5c (R/L)) (3/3)\nR // RZP (F/B, DR-4e4c, AR-0e3c (normal), AR-1e2c (inverse)) (1/4)\n(F2 R2 B L) // DR (F/B, 5QT, HTR-4e4c, Bars+Bars (BB3), 4b5) (4/8)\n(L2 F) F2 U2 B D2 B' R2 F D2 F // HTR (11-1/18)",
    "R' U' F D F' L U' B2 U2 F2 U2 L2 F2 U' F2 U' B D R' D' L B F2 R' U' F\n\n(L B' L) // EO (R/L, DR-6e7c (U/D), DR-4e6c (F/B)) (3/3)\n(U) // RZP (F/B, DR-4e4c, AR-0e3c (normal), AR-2e4c (inverse)) (1/4)\n(F' R2 B L2 F D) // DR (F/B, 2QT, HTR-4e4c, Solved+Bars, 4b2) (6/10)\nD2 U2 R2 F D2 R2 B // HTR (7/17)",
    "R' U' F L' B D2 R' U L' B2 U R B' D2 B R2 F D2 B2 U2 F' D2 U R' U' F\n\n(D' B) R D' B // EO (F/B, DR-4e4c (U/D), DR-6e4c (R/L)) (5/5)\n// RZP (U/D, DR-4e4c, AR-1e1c (normal), AR-1e2c (inverse)) (0/5)\n(B2 D' R2 U D' R) // DR (U/D, 3QT, HTR-6e2c, Bar/Slash+One Bar (BS1), 2c3) (6-1/10)\n(R2 U2 R2 U) F2 U' F2 D // HTR (8-1/17)",
    "R' U' F U' F R2 B F' R2 F' L2 U2 L2 U' L' B D' U' L D' B F2 R' U' F\n\n(B L D) // EO (U/D, DR-6e4c (F/B), DR-4e4c (R/L)) (3/3)\n// RZP (R/L, DR-4e4c, AR-0e3c (normal), AR-2e2c (inverse)) (0/3)\n(D2 L B2 D2 R2 D2 L' F) // DR (R/L, 5QT, HTR-2e4c, Bar/Slash+Bars, 4b5) (8-1/10)\n(R) L' D2 L' U2 R D2 R // HTR (8/18)",
];
let currentExample = -1;

elem("example").addEventListener("click", () => {
    while (true) {
        const r = Math.random()*examples.length|0;
        if (0<=r && r<examples.length && r!=currentExample) {
            currentExample = r;
            elem("input").value = examples[r];
            search();
            break;
        }
    }
});

for (let b of document.getElementsByClassName("key")) {
    let v = b.textContent;
    if (v=="←") {
        v = "\n";
    }
    b.addEventListener("click", () => {
        const t = elem("input").value;
        const p = elem("input").selectionStart || 0;
        let t2 = t.substring(0, p);
        let add = 0;
        if (0<p && t[p-1]!=" ") {
            t2 += " ";
            add++;
        }
        t2 += v;
        if (p<t.length && t[p]!=" ") {
            t2 += " ";
            add++;
        }
        add += v.length;
        t2 += t.substring(p);
        elem("input").value = t2;
        setTimeout(() => {
            elInput.setSelectionRange(p+add, p+add);
        }, 0);
    });
}

elem("start").addEventListener("click", () => {
    search();
});

elem("stop").addEventListener("click", () => {
    if (worker) {
        worker.terminate();
        worker = undefined;
    }

    elem("start").style.display = "block";
    elem("stop").style.display = "none";
    elem("progress").style.display = "none";
});

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

for (const canvas of document.querySelectorAll(".cube")) {
    const faces = canvas.dataset.faces;

    const S = 96;

    const ctx = canvas.getContext("2d");
    const dpr = window.devicePixelRatio;
    canvas.width = S*dpr;
    canvas.height = S*dpr;
    ctx.scale(dpr, dpr);
    canvas.style.width = `${S}px`;
    canvas.style.height = `${S}px`;

    function rotate(x, y, z) {
        const th1 = 0.4;
        const x2 = x*Math.cos(th1)-z*Math.sin(th1);
        const y2 = y;
        const z2 = x*Math.sin(th1)+z*Math.cos(th1);

        const th2 = 0.3;
        const x3 = x2;
        const y3 = y2*Math.cos(th2)-z2*Math.sin(th2);
        const z3 = y2*Math.sin(th2)+z2*Math.cos(th2);

        const w = S/3;
        const s = 0.1;
        const x4 = x3*(z3*s/2+1)*w+S/2;
        const y4 = -y3*(z3*s/2+1)*w+S/2;

        return [x4, y4];
    }

    const FP = [
        [[-1,  1, -1], [ 1,  1, -1], [ 1,  1,  1], [-1,  1,  1]],
        [[-1,  1, -1], [-1,  1,  1], [-1, -1,  1], [-1, -1, -1]],
        [[-1,  1,  1], [ 1,  1,  1], [ 1, -1,  1], [-1, -1,  1]],
        [[ 1,  1,  1], [ 1,  1, -1], [ 1, -1, -1], [ 1, -1,  1]],
        [[ 1,  1, -1], [-1,  1, -1], [-1, -1, -1], [ 1, -1, -1]],
        [[-1, -1,  1], [ 1, -1,  1], [ 1, -1, -1], [-1, -1, -1]],
    ];

    // B, L, D, F, R, Uの順に描画。
    const I = [];
    for (let f of [36, 9, 45, 18, 27, 0]) {
        for (let i=0; i<9; i++) {
            I.push(f+i);
        }
    }

    for (let i of I) {
        const fp = FP[i/9|0];
        const fx = i%9%3;
        const fy = i%9/3|0;

        ctx.beginPath();
        ctx.moveTo(...rotate(
            (fp[1][0]-fp[0][0])*fx/3+(fp[3][0]-fp[0][0])*fy/3+fp[0][0],
            (fp[1][1]-fp[0][1])*fx/3+(fp[3][1]-fp[0][1])*fy/3+fp[0][1],
            (fp[1][2]-fp[0][2])*fx/3+(fp[3][2]-fp[0][2])*fy/3+fp[0][2]));
        ctx.lineTo(...rotate(
            (fp[1][0]-fp[0][0])*(fx+1)/3+(fp[3][0]-fp[0][0])*fy/3+fp[0][0],
            (fp[1][1]-fp[0][1])*(fx+1)/3+(fp[3][1]-fp[0][1])*fy/3+fp[0][1],
            (fp[1][2]-fp[0][2])*(fx+1)/3+(fp[3][2]-fp[0][2])*fy/3+fp[0][2]));
        ctx.lineTo(...rotate(
            (fp[1][0]-fp[0][0])*(fx+1)/3+(fp[3][0]-fp[0][0])*(fy+1)/3+fp[0][0],
            (fp[1][1]-fp[0][1])*(fx+1)/3+(fp[3][1]-fp[0][1])*(fy+1)/3+fp[0][1],
            (fp[1][2]-fp[0][2])*(fx+1)/3+(fp[3][2]-fp[0][2])*(fy+1)/3+fp[0][2]));
        ctx.lineTo(...rotate(
            (fp[1][0]-fp[0][0])*fx/3+(fp[3][0]-fp[0][0])*(fy+1)/3+fp[0][0],
            (fp[1][1]-fp[0][1])*fx/3+(fp[3][1]-fp[0][1])*(fy+1)/3+fp[0][1],
            (fp[1][2]-fp[0][2])*fx/3+(fp[3][2]-fp[0][2])*(fy+1)/3+fp[0][2]));
        ctx.closePath();

        if (faces[i]!=".") {
            const rgb = {
                "F": "8 250 8",
                "B": "8 8 250",
                "R": "250 8 8",
                "L": "250 128 8",
                "U": "255 255 255",
                "D": "250 250 0",
            }[faces[i]];
            ctx.fillStyle = `rgb(${rgb} / 90%)`;
        } else {
            ctx.fillStyle = "rgb(192 192 192 / 60%)";
        }
        ctx.fill();
        ctx.lineWidth = .5;
        ctx.stroke();
    }
}
