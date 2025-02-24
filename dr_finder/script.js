const elEOMaxDepth = document.getElementById("eo_max_depth");
const elEOMaxNumber = document.getElementById("eo_max_number");
const elEONiss = document.getElementById("eo_niss");
const elRZPUse = document.getElementById("rzp_use");
const elRZP = document.getElementById("rzp");
const elRZPMaxDepth = document.getElementById("rzp_max_depth");
const elRZPMaxNumber = document.getElementById("rzp_max_number");
const elRZPNiss = document.getElementById("rzp_niss");
const elDRMaxDepth = document.getElementById("dr_max_depth");
const elDRMaxNumber = document.getElementById("dr_max_number");
const elDRNiss = document.getElementById("dr_niss");
const elFinishMaxDepth = document.getElementById("finish_max_depth");
const elReset = document.getElementById("reset");
const elRandom = document.getElementById("random");
const elInput = document.getElementById("input");
const elStart = document.getElementById("start");
const elStop = document.getElementById("stop");
const elParse = document.getElementById("parse");
const elScramble = document.getElementById("scramble");
const elVisualize = document.getElementById("visualize");
const elCanvas = document.getElementById("canvas");
const elProgress = document.getElementById("progress");
const elEODepth = document.getElementById("eo_depth");
const elEODepthNum = document.getElementById("eo_depth_num");
const elEONumber = document.getElementById("eo_number");
const elEONumberNum = document.getElementById("eo_number_num");
const elRZPDepth = document.getElementById("rzp_depth");
const elRZPDepthNum = document.getElementById("rzp_depth_num");
const elRZPNumber = document.getElementById("rzp_number");
const elRZPNumberNum = document.getElementById("rzp_number_num");
const elDRDepth = document.getElementById("dr_depth");
const elDRDepthNum = document.getElementById("dr_depth_num");
const elDRNumber = document.getElementById("dr_number");
const elDRNumberNum = document.getElementById("dr_number_num");
const elDRNumberSubsets = document.getElementById("dr_number_subsets");
const elSolution = document.getElementById("solution");
const elSolutionMoves = document.getElementById("solution_moves");
const elSolutionMovesNum = document.getElementById("solution_moves_num");
const elSolutionPre = document.getElementById("solution_pre");
const elDRsTitle = document.getElementById("drs_title");
const elDRs = document.getElementById("drs");

const configVersion = 1;

let config;
{
    const c = localStorage.getItem("dr_finder");
    if (c) {
        config = JSON.parse(c);
        if (!config.version || config.version<configVersion) {
            config = undefined;
        }
    }
    if (!config) {
        config = {
            eo_max_depth: 5,
            eo_max_number: 16,
            eo_niss: "always",
            rzp_use: true,
            rzp_max_depth: 7,
            rzp_max_number: 32,
            rzp_niss: "before",
            dr_max_depth: 14,
            dr_max_number: 32,
            dr_niss: "always",
            finish_max_depth: 16,
        };
    }
}

for (let i=0; i<=8; i++) {
    const o = document.createElement("option");
    o.value = ""+i;
    o.textContent = ""+i;
    elEOMaxDepth.appendChild(o);
}
elEOMaxDepth.value = ""+config.eo_max_depth;

for (let i=1; i<=256; i*=2) {
    const o = document.createElement("option");
    o.value = ""+i;
    o.textContent = ""+i;
    elEOMaxNumber.appendChild(o);
}
elEOMaxNumber.value = ""+config.eo_max_number;

elEONiss.value = config.eo_niss;

elRZPUse.checked = config.rzp_use;
elRZP.style.display = elRZPUse.checked?"block":"none";

for (let i=0; i<=10; i++) {
    const o = document.createElement("option");
    o.value = ""+i;
    o.textContent = ""+i;
    elRZPMaxDepth.appendChild(o);
}
elRZPMaxDepth.value = ""+config.rzp_max_depth;

for (let i=1; i<=1024; i*=2) {
    const o = document.createElement("option");
    o.value = ""+i;
    o.textContent = ""+i;
    elRZPMaxNumber.appendChild(o);
}
elRZPMaxNumber.value = ""+config.rzp_max_number;

elRZPNiss.value = config.rzp_niss;

for (let i=0; i<=16; i++) {
    const o = document.createElement("option");
    o.value = ""+i;
    o.textContent = ""+i;
    elDRMaxDepth.appendChild(o);
}
elDRMaxDepth.value = ""+config.dr_max_depth;

for (let i=1; i<=1024; i*=2) {
    const o = document.createElement("option");
    o.value = ""+i;
    o.textContent = ""+i;
    elDRMaxNumber.appendChild(o);
}
elDRMaxNumber.value = ""+config.dr_max_number;

elDRNiss.value = config.dr_niss;

for (let i=0; i<=18; i++) {
    const o = document.createElement("option");
    o.value = ""+i;
    o.textContent = ""+i;
    elFinishMaxDepth.appendChild(o);
}
elFinishMaxDepth.value = ""+config.finish_max_depth;

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

let worker;

function search() {
    let input = elInput.value;
    if (input=="") {
        return;
    }

    input = input.replace("‘", "'");
    input = input.replace("’", "'");
    input = input.toUpperCase();

    eoMaxDepth = +elEOMaxDepth.value,
    eoMaxNumber = +elEOMaxNumber.value,
    eoNiss = elEONiss.value,
    rzpUse = elRZPUse.checked,
    rzpMaxDepth = +elRZPMaxDepth.value,
    rzpMaxNumber = +elRZPMaxNumber.value,
    rzpNiss = elRZPNiss.value,
    drMaxDepth = +elDRMaxDepth.value,
    drMaxNumber = +elDRMaxNumber.value,
    drNiss = elDRNiss.value,
    finishMaxDepth = +elFinishMaxDepth.value,

    localStorage.setItem("dr_finder", JSON.stringify({
        version: configVersion,
        eo_max_depth: eoMaxDepth,
        eo_max_number: eoMaxNumber,
        eo_niss: eoNiss,
        rzp_use: rzpUse,
        rzp_max_depth: rzpMaxDepth,
        rzp_max_number: rzpMaxNumber,
        rzp_niss: rzpNiss,
        dr_max_depth: drMaxDepth,
        dr_max_number: drMaxNumber,
        dr_niss: drNiss,
        finish_max_depth: finishMaxDepth,
    }));

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

    elParse.style.display = "block";
    elScramble.textContent = scramble.join(" ");

    // Visualize.
    {
        const cube = new Cube();
        cube.move(scramble);

        elVisualize.style.display = "block";
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

    elStart.style.display = "none";
    elStop.style.display = "block";
    elProgress.style.display = "block";

    elEODepth.style.display = "none";
    elEONumber.style.display = "none";
    elRZPDepth.style.display = "none";
    elRZPNumber.style.display = "none";
    elDRDepth.style.display = "none";
    elDRNumber.style.display = "none";
    elSolution.style.display = "none";
    elSolutionPre.style.display = "none";

    let eoNumber = 0;
    let rzpNumber = 0;
    let drNumber = 0;
    let drNumberSubsets = new Map();
    let best = 9999;

    while (elDRs.firstChild) {
        elDRs.removeChild(elDRs.lastChild);
    }
    elDRsTitle.style.display = "block";
    elDRs.style.display = "block";

    if (worker) {
        worker.terminate();
    }
    worker = new Worker("worker.js?v=20250225");

    worker.onmessage = e => {
        function movesString(x) {
            let s = "";
            if (x.inverse && x.inverse.length>0) {
                s += "("+x.inverse.join(" ")+")";
            }
            if (x.normal && x.normal.length>0) {
                if (s!="") {
                    s += " ";
                }
                s += x.normal.join(" ");
            }
            return s;
        }

        function eoInfoString(eo) {
            infos = [eo.axis];
            if (eo.DRmUD) {
                infos.push(`DR-${eo.DRmUD} (U/D)`);
            }
            if (eo.DRmFB) {
                infos.push(`DR-${eo.DRmFB} (F/B)`);
            }
            if (eo.DRmRL) {
                infos.push(`DR-${eo.DRmRL} (R/L)`);
            }
            return infos.join(", ");
        }

        function rzpInfoString(rzp) {
            infos = [
                rzp.axis,
                `DR-${rzp.DRm}`,
                `AR-${rzp.ARmNormal} (normal)`,
                `AR-${rzp.ARmInverse} (inverse)`,
            ];
            return infos.join(", ");
        }

        function drInfoString(dr) {
            infos = [
                dr.axis,
                `${dr.htrSubset[2]}QT`,
                `HTR-${dr.HTRm}`,
                dr.hyperParity,
                dr.htrSubset,
            ];
            return infos.join(", ");
        }

        const data = e.data;
        if (data.type=="eo_depth") {
            elEODepth.style.display = "block";
            elEODepthNum.textContent = ""+data.depth;
        }
        if (data.type=="eo") {
            eoNumber++;
            elEONumber.style.display = "block";
            elEONumberNum.textContent = ""+eoNumber;

            const eo = data.eo;

            let html = `<span class="has-text-weight-bold">${movesString(eo)}</span> // EO`;
            html += ` (${eoInfoString(eo)})`;
            html += ` (<span class="has-text-weight-bold">${eo.moves}</span>`;
            html += `/<span class="has-text-weight-bold">${eo.moves}</span>)`;

            const li = document.createElement("li");
            li.innerHTML = html;
            elDRs.appendChild(li);

            const ul = document.createElement("ul");
            ul.id = "eo_"+eo.id;
            ul.style.display = "none";
            li.appendChild(ul);
        }
        if (data.type=="rzp_depth") {
            elRZPDepth.style.display = "block";
            elRZPDepthNum.textContent = ""+data.depth;
        }
        if (data.type=="rzp") {
            const rzp = data.rzp;

            rzpNumber++;
            elRZPNumber.style.display = "block";
            elRZPNumberNum.textContent = ""+rzpNumber;

            let html = `<span class="has-text-weight-bold">${movesString(rzp)}</span> // RZP`;
            html += ` (${rzpInfoString(rzp)})`;

            const n = rzp.normal.length+rzp.inverse.length;
            html += ` (<span class="has-text-weight-bold">${n}${rzp.moves-n!=0?rzp.moves-n:""}</span>`;
            html += `/<span class="has-text-weight-bold">${rzp.moves+rzp.eo.moves}</span>)`;

            const eo = document.getElementById("eo_"+rzp.eo.id);
            eo.style.display = "block";

            const li = document.createElement("li");
            li.innerHTML = html;
            eo.appendChild(li);

            const ul = document.createElement("ul");
            ul.id = "rzp_"+rzp.id;
            ul.style.display = "none";
            li.append(ul);
        }
        if (data.type=="dr_depth") {
            elDRDepth.style.display = "block";
            elDRDepthNum.textContent = ""+data.depth;
        }
        if (data.type=="dr") {
            const dr = data.dr;

            drNumber++;
            elDRNumber.style.display = "block";
            elDRNumberNum.textContent = ""+drNumber;

            if (!drNumberSubsets.has(dr.htrSubset)) {
                drNumberSubsets.set(dr.htrSubset, 0);
            }
            drNumberSubsets.set(dr.htrSubset, drNumberSubsets.get(dr.htrSubset)+1);

            const subsets = [];
            for (let subset of [
                "0c0", "0c3", "0c4",
                "4a1", "4a2", "4a3", "4a4",
                "4b2", "4b3", "4b4", "4b5",
                "2c3", "2c4", "2c5",
            ]) {
                if (drNumberSubsets.has(subset)) {
                    subsets.push(`${subset}: ${drNumberSubsets.get(subset)}`);
                }
            }
            elDRNumberSubsets.textContent = subsets.join(", ");

            let html = `<span class="has-text-weight-bold">${movesString(dr)}</span> // DR`;
            html += ` (${drInfoString(dr)})`;

            const n = dr.normal.length+dr.inverse.length;
            html += ` (<span class="has-text-weight-bold">${n}${dr.moves-n!=0?dr.moves-n:""}</span>`;
            html += `/<span class="has-text-weight-bold">${dr.moves+dr.rzp.moves+dr.rzp.eo.moves}</span>)`;

            let parent;
            if (dr.rzp.skip) {
                parent = document.getElementById("eo_"+dr.rzp.eo.id);
            } else {
                parent = document.getElementById("rzp_"+dr.rzp.id);
            }
            parent.style.display = "block";

            const li = document.createElement("li");
            li.innerHTML = html;
            parent.appendChild(li);

            const ul = document.createElement("ul");
            ul.id = "dr_"+dr.id;
            ul.style.display = "none";
            li.append(ul);
        }
        if (data.type=="finish") {
            const finish = data.finish;
            const dr = finish.dr;
            const rzp = dr.rzp;
            const eo = rzp.eo;

            const num = finish.moves+dr.moves+rzp.moves+eo.moves;
            if (num<best) {
                best = num;
                elSolution.style.display = "block";

                const moves = [];
                function add(m) {
                    if (moves.length>0) {
                        if (moves[moves.length-1][0]=="B" && m[0]=="F" ||
                            moves[moves.length-1][0]=="L" && m[0]=="R" ||
                            moves[moves.length-1][0]=="D" && m[0]=="U") {
                            const t = moves.pop();
                            moves.push(m);
                            m = t;
                        }

                        if (moves[moves.length-1][0]==m[0]) {
                            const t = moves.pop();
                            const n = ({"": 1, "2": 2, "'": 3}[t.substring(1)]+{"": 1, "2": 2, "'": 3}[m.substring(1)])%4;
                            if (n>0) {
                                moves.push(m[0]+["", "", "2", "'"][n]);
                            }
                        } else {
                            moves.push(m);
                        }
                    } else {
                        moves.push(m);
                    }
                }
                for (let m of eo.normal) {
                    add(m);
                }
                for (let m of rzp.normal) {
                    add(m);
                }
                for (let m of dr.normal) {
                    add(m);
                }
                for (let m of finish.normal) {
                    add(m);
                }
                for (let m of reverse(dr.inverse)) {
                    add(m);
                }
                for (let m of reverse(rzp.inverse)) {
                    add(m);
                }
                for (let m of reverse(eo.inverse)) {
                    add(m);
                }
                elSolutionMoves.textContent = moves.join(" ");

                elSolutionMovesNum.textContent = ""+num;

                let solution = "";
                let movesStr = movesString(eo);
                let n = eo.normal.length+eo.inverse.length;
                solution += `${movesStr}${movesStr==""?"":" "}// EO (${eoInfoString(eo)}) (${n}/${eo.moves})\n`;

                if (!rzp.skip) {
                    movesStr = movesString(rzp);
                    n = rzp.normal.length+rzp.inverse.length;
                    diff = rzp.moves-n;
                    solution += `${movesStr}${movesStr==""?"":" "}// RZP (${rzpInfoString(rzp)}) (${n}${diff!=0?""+diff:""}/${eo.moves+rzp.moves})\n`;
                }

                movesStr = movesString(dr);
                n = dr.normal.length+dr.inverse.length;
                diff = dr.moves-n;
                solution += `${movesStr}${movesStr==""?"":" "}// DR (${drInfoString(dr)}) (${n}${diff!=0?""+diff:""}/${eo.moves+rzp.moves+dr.moves})\n`;

                movesStr = movesString(finish);
                n = finish.normal.length;
                diff = finish.moves-n;
                solution += `${movesStr}${movesStr==""?"":" "}// finish (${n}${diff!=0?""+diff:""}/${eo.moves+rzp.moves+dr.moves+finish.moves})`;
                elSolutionPre.style.display = "block";
                elSolutionPre.textContent = solution;
            }

            let html = `<span class="has-text-weight-bold">${movesString(finish)}</span> // finish`;

            const n = finish.normal.length;
            html += ` (<span class="has-text-weight-bold">${n}${finish.moves-n!=0?finish.moves-n:""}</span>`;
            html += `/<span class="has-text-weight-bold">${num}</span>)`;

            const elDR = document.getElementById("dr_"+dr.id);
            elDR.style.display = "block";

            const li = document.createElement("li");
            li.innerHTML = '<span class="finish">'+html+"</span>";
            elDR.appendChild(li);
        }
        if (data.type=="finish_fail") {
            const finish = data.finish;
            const dr = data.dr;

            const elDR = document.getElementById("dr_"+dr.id);
            elDR.style.display = "block";

            const li = document.createElement("li");
            li.textContent = finish;
            elDR.appendChild(li);
        }
        if (data.type=="end") {
            worker.terminate();
            worker = undefined;
            elStart.style.display = "block";
            elStop.style.display = "none";
            elProgress.style.display = "none";
        }
    };

    worker.postMessage({
        scramble: scramble,
        EOMaxDepth: eoMaxDepth,
        EOMaxNumber: eoMaxNumber,
        EONiss: eoNiss,
        RZPUse: rzpUse,
        RZPMaxDepth: rzpMaxDepth,
        RZPMaxNumber: rzpMaxNumber,
        RZPNiss: rzpNiss,
        DRMaxDepth: drMaxDepth,
        DRMaxNumber: drMaxNumber,
        DRNiss: drNiss,
        finishMaxDepth: finishMaxDepth,
    });
}

for (let e of [
    elEOMaxDepth,
    elEOMaxNumber,
    elEONiss,
    elRZPUse,
    elRZPMaxDepth,
    elRZPMaxNumber,
    elRZPNiss,
    elDRMaxDepth,
    elDRMaxNumber,
    elDRNiss,
    elFinishMaxDepth,
    elInput,
]) {
    e.addEventListener("input", search);
}

elRZPUse.addEventListener("input", () => {
    elRZP.style.display = elRZPUse.checked?"block":"none";
});

elReset.addEventListener("click", () => {
    elEOMaxDepth.value = "5";
    elEOMaxNumber.value = "16";
    elEONiss.value = "always";
    elRZPUse.checked = true;
    elRZP.style.display = "block";
    elRZPMaxDepth.value = "7";
    elRZPMaxNumber.value = "32";
    elRZPNiss.value = "before";
    elDRMaxDepth.value = "14";
    elDRMaxNumber.value = "32";
    elDRNiss.value = "always";
    elFinishMaxDepth.value = "16";

    search();
});

elRandom.addEventListener("click", () => {
    // TODO: ランダム状態にしたい。
    const scramble = ["R'", "U'", "F"];

    function rand(n) {
        let r = Math.random()*n|0;
        if (r<0 || n<=r) {
            r = 0;
        }
        return r;
    }

    for (let i=0; i<24; i++) {
        while (true) {
            const m = ["F", "B", "R", "L", "U", "D"][rand(6)]+["", "2", "'"][rand(3)];
            last = scramble[scramble.length-1];
            if (m[0]==last[0] ||
                m[0]=="F" && last[0]=="B" ||
                m[0]=="R" && last[0]=="L" ||
                m[0]=="U" && last[0]=="D" ||
                i==23 && (m[0]=="R" || m[0][0]=="L")) {
                continue;
            }
            scramble.push(m);
            break;
        }
    }

    scramble.push("R'", "U'", "F");

    elInput.value = scramble.join(" ");
    search();
});

for (let b of document.getElementsByClassName("key")) {
    let v = b.textContent;
    if (v=="←") {
        v = "\n";
    }
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

elStop.addEventListener("click", () => {
    if (worker) {
        worker.terminate();
        worker = undefined;
    }

    elStart.style.display = "block";
    elStop.style.display = "none";
    elProgress.style.display = "none";
});

elStart.addEventListener("click", () => {
    search();
});
