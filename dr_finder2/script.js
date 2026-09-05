const configVersion = 1;

let config;
{
    const c = localStorage.getItem("dr_finder2");
    if (c) {
        config = JSON.parse(c);
        if (!config.version || config.version<configVersion) {
            config = undefined;
        }
    }
    if (!config) {
        config = {
            dr_max_number: 100,
        };
    }
}

function elem(id) {
    return document.getElementById(id);
}

elem("dr_max_number").value = ""+config.dr_max_number;

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

function comma(num) {
    num = ""+num;

    let num2 = "";
    for (let i=num.length-1; i>=0; i--) {
        if (i<num.length-1 && (num.length-1-i)%3==0) {
            num2 = ","+num2;
        }
        num2 = num[i]+num2;
    }
    return num2;
}

let worker;

function search() {
    const drMaxNumber = +elem("dr_max_number").value;

    localStorage.setItem("dr_finder2", JSON.stringify({
        version: configVersion,
        dr_max_number: drMaxNumber,
    }));

    let input = elem("input").value;
    if (input=="") {
        return;
    }

    input = input.replaceAll("‘", "'");
    input = input.replaceAll("’", "'");
    input = input.toUpperCase();

    // Parse.
    const scramble = [];
    {
        const normal = [];
        const inverse = [];

        let inComment = false;
        let brace = 0;

        for (let p=0; p<input.length; p++) {
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
                if (brace==0) {
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

        for (let m of reverse(inverse)) {
            scramble.push(m);
        }
        for (let m of normal) {
            scramble.push(m);
        }
    }

    elem("parse").style.display = "block";
    elem("scramble").textContent = scramble.join(" ");

    // Visualize.
    {
        const cube = new Cube();
        cube.move(scramble);

        const elCanvas = elem("canvas");

        elem("visualize").style.display = "block";
        const ctx = elCanvas.getContext("2d");
        ctx.reset();

        const dpr = window.devicePixelRatio;
        const rect = elCanvas.getBoundingClientRect();

        elCanvas.width = rect.width * dpr;
        elCanvas.height = rect.height * dpr;

        elCanvas.style.width = `${rect.width}px`;
        elCanvas.style.height = `${rect.height}px`;

        // 25.5/11:1
        ctx.clearRect(0, 0, elCanvas.width, elCanvas.height);
        ctx.scale(elCanvas.height, elCanvas.height);
        ctx.lineWidth = 0.002;

        const faceToColor = {
            "F": "#08F808",
            "B": "#0808F8",
            "R": "#F80808",
            "L": "#F88008",
            "U": "#FFFFFF",
            "D": "#F8F800",
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

    elem("start").style.display = "none";
    elem("stop").style.display = "block";
    elem("progress").style.display = "block";

    elem("dr_depth").style.display = "none";
    elem("searched_nodes").style.display = "none";
    elem("dr_number").style.display = "none";
    elem("solution").style.display = "none";
    elem("solution_pre").style.display = "none";
    elem("drs_title").style.display = "none";
    elem("drs").style.display = "none";

    let drNumber = 0;
    let drNumberSubsets = new Map();
    let best = 9999;

    while (elem("drs").firstChild) {
        elem("drs").removeChild(elem("drs").lastChild);
    }

    if (worker) {
        worker.terminate();
    }
    worker = new Worker("worker.js?v=20260805");

    worker.onmessage = e => {
        const data = e.data;

        if (data.type=="dr") {
            drNumber++;
            elem("dr_number").style.display = "block";
            elem("dr_number_num").textContent = comma(drNumber);

            if (!drNumberSubsets.has(data.subset)) {
                drNumberSubsets.set(data.subset, 0);
            }
            drNumberSubsets.set(data.subset, drNumberSubsets.get(data.subset)+1);

            const subsets = [];
            for (let subset of [
                "0c0", "0c3", "0c4",
                "4a1", "4a2", "4a3", "4a4",
                "4b2", "4b3", "4b4", "4b5",
                "2c3", "2c4", "2c5",
            ]) {
                if (drNumberSubsets.has(subset)) {
                    subsets.push(`${subset}: ${comma(drNumberSubsets.get(subset))}`);
                }
            }
            elem("dr_number_subsets").textContent = subsets.join(", ");

            elem("drs_title").style.display = "block";
            elem("drs").style.display = "block";

            const elDR = document.createElement("li");
            elem("drs").appendChild(elDR);
            elDR.classList.add("mt-2");

            let drMoves = data.DRNormal.join(" ");
            if (data.DRInverse.length>0) {
                if (drMoves!="") {
                    drMoves += " ";
                }
                drMoves += "("+data.DRInverse.join(" ")+")";
            }

            const elDRMoves = document.createElement("span");
            elDR.appendChild(elDRMoves);
            elDRMoves.classList.add("has-text-weight-bold");
            elDRMoves.textContent = drMoves;

            const drStep = data.DRNormal.length+data.DRInverse.length;
            elDR.appendChild(document.createTextNode(
                ` // DR (${data.axis}, ${data.subset}, ${data.badEdges}) (${drStep}/${drStep})`
            ));

            const elUL = document.createElement("ul");
            elDR.appendChild(elUL);
            elUL.style.marginTop = "0";

            const elFinish = document.createElement("li");
            elUL.appendChild(elFinish);

            const elFinishMoves = document.createElement("span");
            elFinish.appendChild(elFinishMoves);
            elFinishMoves.classList.add("has-text-weight-bold");
            elFinishMoves.textContent = data.finish.join(" ");

            elFinish.appendChild(document.createTextNode(
                ` // finish (${data.finish.length}/`
            ));

            const total = drStep+data.finish.length;

            const elTotal = document.createElement("span");
            elFinish.appendChild(elTotal);
            elTotal.classList.add("has-text-weight-bold");
            elTotal.textContent = ""+total;

            elFinish.appendChild(document.createTextNode(")"));

            if (total<best) {
                best = total;

                for (const e of document.querySelectorAll(".best")) {
                    e.parentNode.removeChild(e);
                }

                elem("solution").style.display = "block";
                elem("solution_moves").textContent =
                    [...data.DRNormal, ...data.finish, ...reverse(data.DRInverse)].join(" ");
                elem("solution_moves_num").textContent = ""+total;

                // https://stackoverflow.com/a/31615643
                function getNumberWithOrdinal(n) {
                    var s = ["th", "st", "nd", "rd"],
                        v = n % 100;
                    return n + (s[(v - 20) % 10] || s[v] || s[0]);
                }
                elem("solution_nth").textContent = getNumberWithOrdinal(drNumber);

                elem("solution_pre").style.display = "block";
                elem("solution_pre").textContent =
                    `${drMoves} // DR (${data.axis}, ${data.subset}, ${data.badEdges}) (${drStep}/${drStep})\n`+
                    `${data.finish.join(" ")} // finish (${data.finish.length}/${total})`;
            }

            if (total==best) {
                const elBest = document.createElement("span");
                elFinish.appendChild(elBest);

                elBest.classList.add("best", "tag", "is-primary", "ml-2");
                elBest.textContent = "Best";
            }
        }

        if (data.type=="dr_depth") {
            elem("dr_depth").style.display = "block";
            elem("dr_depth_num").textContent = data.depth;
        }

        if (data.type=="nodes") {
            elem("searched_nodes").style.display = "block";
            elem("searched_nodes_phase1").textContent = comma(data.phase1);
            elem("searched_nodes_phase2").textContent = comma(data.phase2);
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
        scramble: scramble,
        DRMaxNumber: drMaxNumber,
    });
}

for (let e of [
    elem("dr_max_number"),
    elem("input"),
]) {
    e.addEventListener("input", search);
}

elem("reset").addEventListener("click", () => {
    elem("dr_max_number").value = "100";

    search();
});

elem("example").addEventListener("click", () => {
    function rand(n) {
        let r = Math.random()*n|0;
        if (r<0 || n<=r) {
            r = 0;
        }
        return r;
    }

    const scrambles = [
        "R' U' F R F D R2 B2 R2 D2 L2 D' F2 U F D2 B L' B' U2 R' U R' U' F",
        "R' U' F U2 F2 D2 L' B2 D2 L F2 R' F2 R2 F' L D' B2 D' B' F' U' R F' R' U' F",
        "R' U' F L2 D2 U2 B' L2 D2 R2 F R2 F' R2 U B R D F U' L B D2 F2 R' U' F",
        "R' U' F R F R F' D B2 D' B L U2 F2 L2 F' L2 F U2 R2 F' L2 B' R' U' F",
        "R' U' F L U L' U' B2 D F' L2 U' F2 D R2 U R2 B2 U' F2 R2 D2 R' U' R' U' F",
        "R' U' F R' U' R B2 L2 U2 L2 U' R2 U' F2 U B2 L' B2 F' U2 B' R2 U' R' U' F",
        "R' U' F L2 B' R' B2 L2 F2 D L2 D B2 D' B2 D2 B2 L' B' D U B2 L' F R' U' F",
        "R' U' F D F2 R2 B' L2 D' R2 U' R' F2 D2 R' B2 L U2 B2 U2 F' R' U' F",
        "R' U' F D2 F U2 R U L D2 F' U L2 F2 D2 B R2 D2 B U2 L2 F' U2 B R' U' F",
        "R' U' F U F' U F2 D F2 L2 F2 D2 F2 R2 U R B' F D' B2 D L F' R' U' F",
        "R' U' F U' L2 D R2 U' R2 F2 D R2 B2 U2 F' U B2 F2 L2 D2 R' U' B2 R' U' F",
        "R' U' F U D R2 F D2 F2 R' F' D2 F D2 F' R2 F U2 F2 L2 B L' U2 R' U' F",
        "R' U' F U2 R2 F2 U2 R2 B2 R2 U2 F2 U2 F' R B' D' L U2 R' F' L2 D' F' R' U' F",
        "R' U' F U L2 U2 B' D2 F D2 L2 F U2 B' D B R' U B' L2 U B' L F R' U' F",
        "R' U' F U2 D2 F' R2 B D' R B2 U2 F2 U2 R2 D' R2 D2 B2 U L2 U R B2 R' U' F",
        "R' U' F U2 R2 D' B2 D2 F2 U' F2 U' R2 U L2 B F2 U' B' U' B D R B R' U' F",
        "R' U' F U2 F U' R F2 L' B' U2 F2 L2 D F2 D' R2 L2 D B2 D' B2 F U R' U' F",
        "R' U' F U' F R2 B2 L2 U' F2 R2 D' L2 U R2 U B2 L D' L2 R2 F' D2 U2 R' U' F",
        "R' U' F L2 D B U' F' B' U2 R U2 R2 B' D2 L2 F U2 F R2 F' U2 R' U' F",
        "R' U' F R F' D2 L B2 D2 R D2 L U2 L2 U2 R2 U' L' U2 L2 B' L2 F' U2 R' U' F",
        "R' U' F R' U2 F U' R2 B' R B' L' D2 L2 U D2 F2 B2 R2 F2 B2 U F2 R' U' F",
        "R' U' F R2 U' R2 U R D R' F L2 D2 R2 F B2 R2 B' L2 D2 F2 U2 L B R' U' F",
        "R' U' F R U2 R' D2 L' D2 R F2 R F2 R' F2 U' F' L' D B U' B R2 U' R' U' F",
        "R' U' F D R2 D' B2 D B2 U B2 F2 U B2 L' D R' U2 L B U2 F D' U' R' U' F",
        "R' U' F R U' R2 F R D' F B2 R U L2 D' B2 U' L2 F2 R2 B2 U2 F2 R' U' F",
        "R' U' F L D R2 B2 U2 R2 B2 D' B2 U' F2 U2 F2 B R U2 B' F2 U L' D R' U' F",
        "R' U' F R' U2 R' D2 L' U2 F2 R D2 B2 R D2 F D2 B2 L' D2 F R' D' B R' U' F",
        "R' U' F L2 F L D' L2 F2 D2 B2 D' B2 D F2 R2 U' R B L F D2 L B R' U' F",
        "R' U' F U2 B' L2 F2 U2 R2 U' L2 U' F2 L2 U2 R' D' L B2 F D' U B' D' R' U' F",
        "R' U' F L U' L2 D' B2 D' B2 R2 B2 D R2 D2 B D' U' F R' B' R2 D B2 R' U' F",
        "R' U' F D2 F2 L2 R2 B R2 B' F' L2 R2 F' R' D F D2 F2 L2 R' D L' F R' U' F",
        "R' U' F U2 L' B' U L2 B2 U' R2 D2 F2 U' B2 U' B2 L' D' F2 D F U2 B R' U' F",
        "R' U' F D2 B' U' R' F2 D' B' D' B' R2 D2 R' U2 F2 L B2 R' F2 B2 R' F' R' U' F",
        "R' U' F D2 F' L2 B2 D' L2 F2 L2 F2 U' F2 U' B U L R2 B' U' F' D2 R' U' F",
        "R' U' F R2 U' D2 F2 L2 F L2 F' R2 B' F' D2 F' L' F' R' B R' F' R2 U' R' U' F",
        "R' U' F D2 U2 B R2 U2 F D2 R2 F R2 U' L R2 D' R2 F2 R2 F' L D' R' U' F",
        "R' U' F R' L U' D L' F R' L B R L2 F2 L' U2 R D2 R' U2 L U2 R' U' F",
        "R' U' F L F' D2 F2 R' U2 L' U2 R2 B2 U2 L' B2 D L2 R D' U2 B U2 R' U' F",
        "R' U' F R2 D2 F2 D' F2 U' L2 F2 U2 R2 B2 D' F D' R D' U R' D2 B' U' R' U' F",
        "R' U' F D F' D' R' F2 B' U2 L F2 R2 D B2 R2 U F2 B2 D R2 D R' D2 R' U' F",
        "R' U' F D R' D2 B U2 F' U2 L2 U D2 L' D2 R2 F2 D2 L B2 D2 L' D2 F2 R' U' F",
        "R' U' F L2 D2 F2 U2 R2 U2 B' U2 B' D2 F2 L2 U' R2 F U R D' B L' D' R' U' F",
        "R' U' F D2 F2 R2 D' L2 D' R2 U' L2 D' L2 U B' F D' B' L' B U' F2 R' U' F",
        "R' U' F U' B U2 B L2 U2 L2 B D2 F L2 D' U' L' B2 F' D L D' F2 R' U' F",
        "R' U' F U2 L2 D2 B2 F2 R2 F2 U' R2 U2 L2 F D' R B' L2 D' R' D' R B' R' U' F",
        "R' U' F L F2 D2 R2 B R2 B R2 F2 D2 F L2 D U' F' R2 D L' F D2 F2 R' U' F",
        "R' U' F U2 F2 D2 U' R2 F2 U B2 D2 U' L U R U' B D R2 U' F' U2 R' U' F",
        "R' U' F U2 L2 U2 R2 F2 D2 R' B2 U2 B' L2 R F L' D' U2 R2 F' U' R' U' F",
        "R' U' F R' B2 U F' L D2 R B U' R2 U B2 R2 L2 U' L2 F2 D2 F2 U' R' U' F",
        "R' U' F U' R' D' U L2 R2 U' R2 B2 U2 L2 U' R' F2 R B' L D2 U' R B R' U' F",
        "R' U' F L U' F D B D2 L F2 R2 F2 D R2 F2 D F2 L2 U' B' R' U' R' U' F",
        "R' U' F L2 U' R2 B2 R2 D F2 R2 D F2 R U' R' U' L2 U B' F2 R' U' F",
        "R' U' F R2 U2 L2 U R2 U B2 L2 B2 U2 R B R U L B L' U2 L2 U R' U' F",
        "R' U' F L U' R2 F2 L U2 B' L2 D L2 B2 U L2 F2 U R2 U R2 U B R' U' F",
        "R' U' F U' B' D2 B L2 D2 U2 B' F2 U2 B2 L2 D B L' B' D F2 U B2 R' U' F",
        "R' U' F R2 U2 B D2 F2 R2 D2 L2 D2 B' F L' F R' B2 L U R' F L2 D R' U' F",
        "R' U' F D' L' B2 R2 F R' B D' F B2 U2 L2 B2 D2 R2 L' U2 R F2 R' U' F",
        "R' U' F R F' U2 D F2 D2 R D' F' R2 U2 R' F2 R' U2 R' B2 D2 R D2 R' U' F",
        "R' U' F L U B R2 U2 F2 D2 F2 U2 R' D2 U2 F2 R' B F2 D R D' B' U R' U' F",
        "R' U' F L2 U2 R2 D2 U2 B2 F' U2 F D2 F' R U2 F2 U2 F2 L' F' R2 U R' U' F",
        "R' U' F U2 B' F2 D2 R D2 L' F2 R2 B2 R2 D2 U R B D' B' L2 B2 R' U' F",
        "R' U' F D F R2 U' R' B' L B U B2 L B2 R U2 D2 R2 U2 R B2 R2 U2 R' U' F",
        "R' U' F D' L' F B' L' F' R' U F D U2 R2 D2 F U2 B D2 F2 L2 B R' U' F",
        "R' U' F U' B2 U B2 F2 U' B2 F2 R2 D F' R' U' R D L2 U2 F U2 R' U' F",
        "R' U' F U2 B2 F2 R' U2 R2 B2 D2 B2 U2 L' R2 D' F' L2 B D' R' U' B' U R' U' F",
        "R' U' F U' R' F2 D2 B2 F D2 R2 B' L2 F L2 U2 R' F' D' U2 R' U2 F' D R' U' F",
        "R' U' F D2 B2 R2 F B U' B' U2 R F' L2 D2 B2 D2 B D2 R2 B2 R2 B' R' U' F",
        "R' U' F L2 R D' B2 D2 F2 U' F2 D F2 U2 B' D' U2 F' U2 F2 L' R B' R' U' F",
        "R' U' F R B' D L' B2 L U2 L R2 F2 D2 F2 R' F2 U' R U2 R F' U F2 R' U' F",
        "R' U' F R2 B F2 L F2 R' U2 R' B2 D2 F2 R U2 D B D' U' L' F2 L2 D2 R' U' F",
        "R' U' F R2 U' R2 U2 B2 U' F2 L2 B2 U2 L2 D' B U2 L R2 F2 D L F2 R' U' F",
        "R' U' F R2 U' R2 U L2 U2 F2 L2 D2 F2 B' D2 B' D2 R2 U R F2 U2 F D' R' U' F",
        "R' U' F L B2 L2 D2 L' D2 L' F2 L2 B2 R2 D L' F L2 B L B R2 D' R' U' F",
        "R' U' F R B2 R' D' F' U2 R F2 U' F2 U2 R2 U2 D' L2 U' B2 F R' D2 R' U' F",
        "R' U' F D R' B2 U' L' U2 F U R2 F2 U' R2 D2 B2 U2 F2 U' L2 D' R' F' R' U' F",
        "R' U' F R' B2 R' B R2 L' D' B R2 B2 U2 F2 B2 R2 F2 U' L2 U' R2 U R' U' F",
        "R' U' F L U2 L2 B R2 B F2 L2 U2 F L2 U2 F' D B R' B2 U' L' F D' R' U' F",
        "R' U' F R2 D F2 D2 R2 U L2 D L2 B2 D2 L B R2 B2 L R' D' B2 L' U R' U' F",
        "R' U' F R2 U' F L B D L F L2 U2 F' R2 D2 B D2 B' L2 F2 R' B2 R' U' F",
        "R' U' F R2 B L2 R2 B' L2 R2 F R2 B2 L2 D U' B D2 L F2 D' B' R B2 R' U' F",
        "R' U' F R2 L' B' U L' B2 U' F R2 D2 R' F2 R' F2 D2 B2 R' D2 L' F2 D' R' U' F",
        "R' U' F D' L' U2 F2 R2 F2 R U2 F2 R' B2 F2 D' B' F2 L U F D B2 U' R' U' F",
        "R' U' F U2 B' L' B2 L2 D B2 D F2 U' F2 D2 B2 F' D U2 B L' U F2 R' U' F",
        "R' U' F R U B L U' D L F' U2 L' B2 L B2 U2 L B2 D2 R U' R' U' F",
        "R' U' F R B2 F2 D2 L' D2 L F2 R' F2 L2 R' B R U' L2 F' D2 B L2 U R' U' F",
        "R' U' F R L2 F' D R L F' U2 R2 F' D2 F2 U' F2 D' R2 F2 D2 F2 L2 B2 R' U' F",
        "R' U' F R L2 B' L' U D L' B' U' F' D2 R2 U2 L2 F2 U2 F2 B' U2 B2 R' U' F",
        "R' U' F R2 B R2 U2 B D2 F R2 D2 F2 L2 R B' L' D F' D R2 D U2 B2 R' U' F",
        "R' U' F D' F2 U' L2 F2 U' F2 D2 F2 D R2 L U' L' U2 R B R' U' F",
        "R' U' F L2 B2 D2 B2 D2 R B2 R' D2 B2 F U L' R' B D2 F L D B R' U' F",
        "R' U' F U2 B2 U' F2 L2 D' R2 D' L2 R2 F2 D2 F' D' F U L' D B' F' U' R' U' F",
        "R' U' F L2 B' U F2 D' B2 F2 U' L2 D' F2 D2 L F' R2 F' L F L2 B R' U' F",
        "R' U' F U F U2 R2 F' D2 F2 L2 D2 U2 B L U2 F' D R2 U2 R' B' U R' U' F",
        "R' U' F U' R L2 B2 U' B2 R2 U2 R2 D U2 F2 B L U F R' D R F2 R' U' F",
        "R' U' F U L F B2 R2 L U2 B U L2 D2 B' D2 R2 F B2 L2 F' B2 D2 R' U' F",
        "R' U' F R D2 B2 L D2 R2 U2 R' U2 R' D2 U' F' R' D F' L' D' B2 L2 F' R' U' F",
        "R' U' F R2 D2 F R2 F D2 B' F2 D B' U R U R2 B L' R' F' R' U' F",
        "R' U' F U2 R F' D B2 L F2 D' B R2 B2 D2 R' U2 F2 R' F2 L2 F2 R2 U2 R' U' F",
        "R' U' F L2 R2 D' F2 D' L2 D2 R2 D L2 R2 U' R' U2 B' D R' U F2 L2 F R' U' F",
        "R' U' F U2 D' F2 B U' B R F B U2 L2 B2 R2 D2 B U2 F L2 F' D B R' U' F",
        "R' U' F R' U B D2 L2 D2 B2 U2 F2 L2 B D2 L D' U F R F U' F' R' U' F",
        "R' U' F L U F2 L2 F2 U' F' B2 D' L2 F2 B2 D2 R F2 L U2 B2 L' D2 R' U' F",
        "R' U' F U2 B2 F2 L B2 L U2 L' U2 L B2 R D U' R' F' D2 L' U' L' B R' U' F",
        "R' U' F L2 D2 U2 L' D2 F2 U2 R D2 R2 F U2 L' D' B' F' U L D2 F' R' U' F",
        "R' U' F U' R2 B2 D U B2 L2 R' B U' L2 U F2 U R B D U R' U' F",
        "R' U' F R U2 F2 U2 R' B2 L' R2 D2 B2 R' D' F2 D' B F' R2 U' F' R' U' F",
        "R' U' F L' F2 L2 F2 L' B2 R' B2 R U2 D F R' U' B F' L2 D' B2 U2 R' U' F",
        "R' U' F D2 R U' F2 L2 U B2 L2 F2 L2 U' B2 R B D' F2 D' F' L U' B2 R' U' F",
        "R' U' F D2 B L B2 D L2 B2 U R2 U' L2 F2 D2 U L' B2 F' L' U R' B' R' U' F",
        "R' U' F R2 U F2 R' D2 L2 U2 R' D2 R' B2 L' R2 B' R' U' L2 F2 R2 U R' U' F",
        "R' U' F R2 F R B' U' D R' U2 L U B2 L2 U2 F' B R2 F R2 L2 B' R' U' F",
        "R' U' F D' F' R F' D2 B' D B2 R B2 U2 F2 R2 U F2 R2 B2 U' F2 U2 R' U' F",
        "R' U' F U2 L' F' B2 D2 L2 B2 U' L2 R2 B2 R2 U' B2 F' L' R B R2 B2 D R' U' F",
        "R' U' F D2 B L2 D' F2 U' B' L D' L' F2 U2 B2 U2 R' F2 R2 D2 B2 L' U2 R' U' F",
        "R' U' F U L F' U2 F2 L2 F R2 D2 F' L2 R2 D' R2 U R U' L' F2 R' U' F",
        "R' U' F L' D2 L F2 L' B2 F2 L B2 F2 U' R' B D R' F' L D' B2 R' U' F",
        "R' U' F D R2 F2 U2 F2 U' B2 D' F2 D B D R2 D' R F U2 L R' D' R' U' F",
        "R' U' F L U2 F L2 U2 B2 U2 R2 B D2 R2 B2 D L F U' L B' L F U' R' U' F",
        "R' U' F U' F' R' U2 F2 D B U2 L F R2 F R2 B' R2 U2 B2 D2 R' U' F",
        "R' U' F U B' D' R' D2 L F D R F2 D2 R' B2 L F2 R2 B2 R2 D2 B2 U R' U' F",
        "R' U' F D2 L2 B2 D' F2 D2 F2 L2 U' F2 U L' F D2 L B' D L2 U B' U' R' U' F",
        "R' U' F D2 F2 D' R2 D' F2 U B2 D2 B2 F' L' D' U' B' L F' D R' F2 R' U' F",
        "R' U' F D2 U2 F2 D2 L2 U L2 U2 F2 L2 F2 U L U' R' D F' L F' U R' U' F",
        "R' U' F R D2 F L' D2 B U' F' D U2 F' R2 D2 B' D2 F L2 D2 B L2 B' R' U' F",
        "R' U' F U' F D2 U' B2 R2 D R2 B2 F2 D R2 U' L F L B L2 R U2 B' R' U' F",
        "R' U' F L2 U' F' L2 B2 L' F2 D R F2 L' B2 R L2 U2 F2 U2 B2 L2 F2 B R' U' F",
        "R' U' F L' R2 D2 R2 B2 F2 D' F2 D2 B2 U L' B D' L2 R2 F L R U R' U' F",
        "R' U' F D2 U2 L2 B' L2 R2 D2 L2 B' U2 B F2 U R' F U' L' U2 B2 F U' R' U' F",
        "R' U' F L2 F' R2 U' F2 D2 L2 B2 L2 U' B2 F2 L2 B2 F' R' F' D' L' R U R' U' F",
        "R' U' F U2 B2 L D2 L2 D2 R' B2 L2 U2 B2 F2 D' F2 D' F L U B D' R' U' F",
        "R' U' F D2 R' D2 F D' B2 U R' F2 B2 U L2 D F2 U F2 R2 U B2 D2 R' U' F",
        "R' U' F D U' R2 D L2 D R2 U2 R2 B2 U2 F2 L B' U' L' B' L' R2 U B2 R' U' F",
        "R' U' F U' B2 D' F2 L2 D L2 B2 D' L2 R2 D2 F' L' B U' R' B2 U B' U2 R' U' F",
        "R' U' F D' B2 R' D2 R U2 R' D2 R' D2 R B2 L2 D' R' D2 L2 F R2 B' R' U' F",
        "R' U' F R' B2 R2 B D R' F L U F' R2 F2 B2 L2 U B2 L2 D' L2 D F2 R' U' F",
        "R' U' F R U2 F2 U2 L' B2 R' B2 F2 L' B D' L2 R' D L U F2 D' F R' U' F",
        "R' U' F L2 B L2 F' L2 B R2 F' D2 R2 F' R' F2 D L' R2 F2 U' B F R' U' F",
        "R' U' F L2 D2 U2 B2 D2 R D2 F2 R2 U2 B2 R F L' D F2 L D R D F' R' U' F",
        "R' U' F U' L' B' L2 F B2 L2 U L' B2 U2 F U2 B U2 L2 U2 D2 F' U2 R' U' F",
        "R' U' F R2 B2 U R2 D' B2 F2 D R2 F' R D2 L' F U R2 D2 B2 R' U' F",
        "R' U' F U2 R' D' U2 B L2 U2 L2 U2 F L2 F' R2 F' R F' R U' L' B2 R' U' F",
        "R' U' F D2 L2 F R' D F2 D2 B' R2 L' D2 L' D2 F2 D2 R U2 L' D' R' U' F",
        "R' U' F L2 F U2 B' F2 U2 F2 R2 D2 R2 F2 U2 R B2 D' L U2 L' U2 R' U' F",
        "R' U' F L2 F U2 F' L2 U2 F' D2 B D2 F' U R D2 L F' D R2 B' R2 U' R' U' F",
        "R' U' F D2 B L U' R' U D F L' U2 F' R2 U2 B' D2 F R2 F R2 D2 F2 R' U' F",
        "R' U' F U2 F R2 D2 B2 F' L2 R2 U2 R2 F D2 L F U L' D2 L' U' L' U' R' U' F",
        "R' U' F U L' U' R F2 B D' R2 L B F2 L2 D2 L2 D B2 U F2 L2 D' F2 R' U' F",
        "R' U' F R B2 R F2 R2 U2 B2 R B2 L D L D L' F' R' B L B R' U' F",
        "R' U' F R U' R L D' R B' L U' R F2 U L2 U B2 D' L2 B2 U2 D' B2 R' U' F",
        "R' U' F U2 F2 D2 B2 L' B2 L2 R U2 R F2 U F' R B' D L' U2 R' D' R' U' F",
        "R' U' F U B2 U2 F2 D L2 U2 B2 R2 U2 F2 R F U' B R2 D2 R D2 U2 B2 R' U' F",
        "R' U' F L U2 F L' F2 L' B L2 B2 U' F2 U L2 D2 F2 B2 U' L2 U B' R' U' F",
        "R' U' F L' U2 B R2 D2 R2 U2 B' D2 L2 B' U2 L B2 F2 R' U' R U2 R' U' F",
        "R' U' F L2 B U2 L U' F2 U2 R' B' D2 B' L2 F2 B' L2 B' U2 L2 D2 L2 D R' U' F",
        "R' U' F U2 F2 U2 B2 L2 D2 B D2 U2 F D2 R B D' B' R D R U' R' D2 R' U' F",
        "R' U' F R2 B L2 D2 F D2 U2 B' L2 B' R2 U R' B F D F2 R B2 L B R' U' F",
        "R' U' F D' L F2 D F' B U2 B' L F2 D2 B2 L2 D2 F2 D F2 U' B2 D F R' U' F",
        "R' U' F U L2 F2 R' D2 R2 B2 R F2 L' U2 F2 U F R D U' F2 U' R' F R' U' F",
        "R' U' F R' D F U' B2 U L B L' U' L U2 L' U2 R' D2 B2 L2 B2 R' U2 R' U' F",
        "R' U' F R2 D2 F2 R' U R U' L' F2 U2 L2 B R2 B' U2 R2 U2 F R' U' F",
        "R' U' F R' U2 F2 R2 F2 R' B2 U2 B2 L R' F' U' F2 D B' R D2 U R' D2 R' U' F",
        "R' U' F R F2 U R2 F2 D U2 R2 F2 U2 R2 F U2 B L2 D2 L D B2 U F' R' U' F",
        "R' U' F U' D2 R' U2 B2 D2 U2 R' U2 R B2 U2 F R' D2 B L2 B L F' R' U' F",
        "R' U' F L2 F R2 D2 U2 B2 U2 F' U2 L2 F2 L' F D L' D2 L B' R B' U2 R' U' F",
        "R' U' F R' F R L2 U' L' U2 R F' U' R2 U2 R2 U' L2 B2 U' F2 B2 D B R' U' F",
        "R' U' F D2 B' U2 B' L2 F' L2 D2 F' D' U B' L' F2 R U B F2 U R' U' F",
        "R' U' F U' D2 B R2 B2 D2 F' R2 F' L2 D2 U2 F D B L' D L2 R' B F2 R' U' F",
        "R' U' F R F2 R F2 U2 L2 U' F2 L2 D L2 F2 R' B D2 U L' B' D R' U' F",
        "R' U' F U2 B2 U2 B2 R' B2 L2 U2 B2 U2 L D' R2 U' B' D2 R U L2 F' R' U' F",
        "R' U' F U B2 D L2 D2 B2 F2 U' B2 U' L U2 L2 R F R B' D' B2 D' R' U' F",
        "R' U' F L2 U2 B2 D R2 D2 F2 L2 R2 F R B F L' R' B' L' D' U R' U' F",
        "R' U' F L' B' R F2 U B2 F2 D L2 U B2 F2 R2 U' F' L U2 B F D' B R' U' F",
        "R' U' F U L2 U' L2 U2 B2 U' R2 B2 D' B2 F2 R F' U2 F2 L' R2 D R2 U' R' U' F",
        "R' U' F U D2 L' F' B' D B2 U B2 U2 R' U2 R2 U2 L D2 R' U2 B2 D2 R' U' F",
        "R' U' F R' F' B2 R2 D F2 R2 U2 L2 U' R2 U B' U' F2 R' B2 F R' U2 R' U' F",
        "R' U' F U2 L2 D2 F2 L F2 U2 R2 U2 R' B2 R2 U L D B2 D2 U B F' R' U' F",
        "R' U' F U2 R' F2 D2 F2 U2 L2 D2 R' B2 R D' B L2 R U' B L U' F R' U' F",
        "R' U' F U' D' B2 L D B U D R L2 D' L2 D F2 D B2 L2 U2 L2 U R' U' F",
        "R' U' F L2 F' U' D2 R2 L' F R2 F D2 L2 F2 U' B2 R2 F2 D2 F2 D B2 U R' U' F",
        "R' U' F R2 D2 B' U2 F2 L2 F' L2 F' U2 R2 D2 L F2 R2 U' R B2 D R F R' U' F",
        "R' U' F D B2 D L2 D U2 L2 B2 U2 B R' B2 U2 B' D B2 L D2 L F' R' U' F",
        "R' U' F R L2 D R2 F2 D2 R2 U F2 L2 D L2 B' R B' F D' R' B' L2 D' R' U' F",
        "R' U' F D2 R2 U2 F2 L D2 B2 L' R2 D2 U L R2 D2 B' D2 U' L' U' F R' U' F",
        "R' U' F D F2 D R2 U F2 R2 U' L2 U' B' L' D F2 U' B' F2 L2 R B2 R' U' F",
        "R' U' F D U F2 R2 U2 L2 U R2 U' B D R B' L2 R2 B R' D2 U R' U' F",
        "R' U' F L' R D2 L' U2 B2 R2 F2 U2 R F' U L B F' D U' F2 L D2 R' U' F",
        "R' U' F L2 U L' U' R F U' B' U R2 U R2 U L2 U' B2 R2 B2 U2 L' F2 R' U' F",
        "R' U' F D F2 R U' F' R2 U' B L' B2 R F2 R D2 R2 B2 R' B2 D2 B R' U' F",
        "R' U' F R2 F R' D' L' F' B D B2 U' R2 L2 F2 D' B2 U2 R2 F2 B' R' U' F",
        "R' U' F L F' U2 B U2 R2 U2 F2 D2 B2 R2 U2 R' U B2 L2 F R2 U R2 B' R' U' F",
        "R' U' F U2 L2 B2 R2 U2 B' L2 B D2 F' U2 F2 L F D' L B2 D' F' L U' R' U' F",
        "R' U' F R2 D B' U' B2 U' R2 F2 L2 B2 D' L2 U R' F D' U B2 F U' B' R' U' F",
        "R' U' F D U' L2 U' B2 L2 U R2 B2 U F' D' L2 U L R' D' F U B' R' U' F",
        "R' U' F R' F' U2 D' R' U2 D' B' R F2 L2 U2 L2 D2 L B2 L U2 B2 D2 B' R' U' F",
        "R' U' F R' B2 R' D2 U2 R2 F2 L' R2 U2 R2 U2 B' L2 D R B' R U R' D2 R' U' F",
        "R' U' F R B U2 R2 F' L2 B D2 F L2 U2 L2 D F L2 D R D' F2 U R' U' F",
        "R' U' F R' D2 B' U2 L2 B U2 B2 F' U2 F2 D B F' R2 U R B2 F2 D2 R' U' F",
        "R' U' F U2 R' B2 D2 L' B2 L' R2 F2 D2 U2 R B' L D' R' D' U' L2 F2 R' U' F",
        "R' U' F L R2 U2 B2 F2 R2 F2 U L2 U R2 B' L B' R D R2 B U R' U' F",
        "R' U' F D2 L' U' B2 R' D2 B2 D' R' D2 F2 L2 F D2 R2 D2 F2 L2 B' D2 F' R' U' F",
        "R' U' F L2 U R2 F2 D' U' B2 F2 U' B2 L2 U2 R' F' L D F L' B L D R' U' F",
        "R' U' F U B U' L2 R' B2 L2 B2 U2 F2 R2 F2 R' F2 D R' U2 R2 F D2 B' R' U' F",
        "R' U' F U L2 B U2 R2 B D2 L2 F2 D2 R2 B U2 D F D L U2 F' D2 U2 R' U' F",
        "R' U' F D B2 L2 F2 D2 B2 F2 L2 D B2 D2 L2 F D2 L' D' F L B2 R2 D' R' U' F",
        "R' U' F R2 U D R' B U' D' F' R L2 U2 D2 B' U2 B2 D2 L2 U2 F' R' U' F",
        "R' U' F L2 F U' F' R' F U' R' U2 B2 D' B2 L2 D B2 U' F2 D B2 D' R' U' F",
        "R' U' F L2 D F U' D' R F B' L B2 R F2 L2 B2 R' U2 L2 F2 D2 B2 R' U' F",
        "R' U' F D2 F U R2 B2 L2 U' F2 U' B2 U2 L2 U' L U L' D2 B L2 D' R' U' F",
        "R' U' F R' F2 R' B2 U2 R' D2 R' U2 R' F' D B2 D' R D B' F U2 F2 R' U' F",
        "R' U' F D B2 R2 B2 D2 B2 D' B2 D R2 U' B L' R U2 B' F2 D F D R' U' F",
        "R' U' F L F' U2 L2 B D2 R2 B' D2 F' L2 B D2 U B R F' D' B2 R' F' R' U' F",
        "R' U' F R U L2 F2 U' L2 B2 U F2 U2 F2 U2 F L' R2 D' B U B D' F' R' U' F",
        "R' U' F R D2 F2 R D2 L R2 D2 R D2 U' F L U B R' B' U' B' R' U' F",
        "R' U' F D2 F2 D2 B R2 U2 F U2 L2 F R2 F2 L F' R' D' F' L2 U' R2 F R' U' F",
        "R' U' F D' R U2 L2 R2 B' L2 F2 L2 F' U2 R2 D B' F2 D L R2 U2 F D R' U' F",
        "R' U' F D R' U2 L2 B' D2 B R2 B F2 R2 F' R2 L' B' D2 L B R' D' R' U' F",
        "R' U' F L2 F' D' F2 L2 R2 U2 L2 U L2 B2 F2 D' R' D B2 F2 D' R F U R' U' F",
        "R' U' F R' F2 U2 F R F D' B U' L2 F L2 F' U2 F R2 F U2 D2 F2 R' U' F",
        "R' U' F U2 D' B U' D R' B' L2 F R' F2 R2 D2 B U2 R2 B' D2 B L2 D2 R' U' F",
        "R' U' F R' D U2 B2 L2 R2 F2 R2 U B2 U2 F2 B' D L2 R' F2 D B' U2 R' U' F",
        "R' U' F D2 B' R2 B2 L2 B2 R' U2 R2 D2 L U2 B' D' F' R B D2 U B R' U' F",
        "R' U' F D' L2 U2 B2 R2 F L2 F L2 B2 R2 F' L' U F' R B D L' D2 B2 R' U' F",
        "R' U' F L2 B D' F' U B2 L F R' B2 R2 U2 B2 R' B2 R' U2 R2 D2 U' R' U' F",
        "R' U' F R2 D2 B2 D2 R2 B' L2 F2 L2 U2 B R F L2 D2 U' B2 R2 D' R' F2 R' U' F",
        "R' U' F D2 F' U2 B2 D2 L2 B2 L2 U2 B' L2 D L R2 F D2 U' F D L B2 R' U' F",
        "R' U' F L2 D' U2 L B2 L' F2 R2 U2 R' B2 L' D2 B2 D' F L U' R2 B2 D2 R' U' F",
        "R' U' F R' D F D2 R U2 B2 D' F' R2 U' L2 D R2 U' F2 U2 D' B2 R' U' F",
        "R' U' F U' L F' D2 R2 F2 L2 R2 D R2 B2 U B2 D' F' U R F U F2 U2 R' U' F",
        "R' U' F R' D2 R' B2 L F2 L' U2 L2 D2 L2 R' F' D L2 U F D2 R' D2 U R' U' F",
        "R' U' F D B2 R2 U F2 L2 F2 D' U2 F2 D' B U2 L' B' D' B2 L' D R F' R' U' F",
        "R' U' F L U L2 R2 D' F2 D U L2 B2 L2 F2 B' R' F2 D' R F2 R D R' U' F",
        "R' U' F L' D2 F2 U' B U2 R B L F' R2 F' D2 F R2 F R2 U2 B' U2 F R' U' F",
        "R' U' F U' B D R2 F D' L F U2 D2 F2 R' F2 L U2 R' U2 B2 D2 R D' R' U' F",
        "R' U' F L' R2 D2 B' U2 F U2 F2 U2 B' D2 U' R U L U L' B2 R' U' F",
        "R' U' F L' D2 B' L2 U2 F2 L2 U2 B F2 R2 B' U F R B2 L2 F' D2 R D R' U' F",
        "R' U' F L' D2 F' D2 R2 B' L2 D2 B2 R2 U2 F' D2 U' B' D' L' B F2 U2 R' U' F",
        "R' U' F L' F2 D2 U2 L' F2 D2 R U2 L' B2 L B L F2 R2 U L' D L' B R' U' F",
        "R' U' F R F R2 D2 F2 D L2 B2 D' B2 U2 R2 U2 L' D2 U' R' D B2 D2 R' U' F",
        "R' U' F D2 L2 U' F2 L2 B2 U R2 U' R2 F2 R' F' D' L' B2 U B' L R2 F R' U' F",
        "R' U' F R' L2 U L F2 B' U' R2 F U F2 D2 F2 R2 D R2 D2 F2 R2 U' D' R' U' F",
        "R' U' F L2 F2 D2 U2 B D2 B' D2 R2 F U2 F' U' R2 U' R U2 F2 U' R2 B' R' U' F",
        "R' U' F R2 D2 R' U2 F2 L U2 F2 D2 F2 B' U L' U2 B R' F' D' L2 B' R' U' F",
        "R' U' F D' R' B U' B2 R2 F2 U2 F2 U' R2 D2 B2 F D' L R B' R2 U R' U' F",
        "R' U' F U' F2 L' D' R2 L' U' F2 L2 F2 D2 F R2 U2 B' D2 B D2 B' L' D' R' U' F",
        "R' U' F U F2 R2 D F2 U2 R2 D' F2 U2 R2 L U B F2 L2 U F' D2 B' D R' U' F",
        "R' U' F D' R2 F2 D U2 L2 F2 L2 F2 D L B' F' L2 D L R2 B D F2 R' U' F",
        "R' U' F U F R2 D2 B2 R B2 F2 U2 L U2 L U' R U R2 U' F R D' R' U' F",
        "R' U' F D2 L2 F' R' U2 L F' L B2 U' L2 B2 U R2 L2 D F2 D' R2 D R' U' F",
        "R' U' F L' B' D' R2 F2 R2 B2 F2 U' L2 U' B2 U R' D' R B' R2 F' D' R' U' F",
        "R' U' F U B2 F2 L2 D U B2 U' R2 U B2 R2 L D' F' R D2 R B F' U' R' U' F",
        "R' U' F D2 L' D' R F B D' B L2 F U2 L2 B' R2 L2 U2 F R2 F2 L' F2 R' U' F",
        "R' U' F U R D2 R' B2 L' U2 F2 D2 R U2 F' D L B' R F D2 F' D' R' U' F",
        "R' U' F U D L2 F D F' R B' U R2 D' F2 U R2 L2 U2 B2 R2 D B2 F R' U' F",
        "R' U' F L U2 L' B U D2 L' F' D' B' R2 L2 U' B2 U' F2 D' F2 L2 F2 R' U' F",
        "R' U' F U2 L2 F' R' U B L D' L' R2 F2 D2 B' U2 B' R2 F L2 U2 F U R' U' F",
        "R' U' F U' B2 U' B2 U' L2 U' B2 U' R2 U2 R B U' L2 U L' F' U F2 D R' U' F",
    ];

    elem("input").value = scrambles[rand(scrambles.length)];
    search();
});

for (let b of document.getElementsByClassName("key")) {
    let v = b.textContent;
    if (v=="←") {
        v = "\n";
    }

    const elInput = elem("input");

    b.addEventListener("click", () => {
        const t = elInput.value;
        const p = elInput.selectionStart || 0;
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
        elInput.value = t2;
        setTimeout(() => {
            elInput.setSelectionRange(p+add, p+add);
        }, 0);
    });
}

elem("stop").addEventListener("click", () => {
    if (worker) {
        worker.terminate();
        worker = undefined;
    }

    elem("start").style.display = "block";
    elem("stop").style.display = "none";
    elem("progress").style.display = "none";
});

elem("start").addEventListener("click", () => {
    search();
});
