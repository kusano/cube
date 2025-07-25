const elMaxNumber = document.getElementById("max_number");
const elNISS = document.getElementById("niss");
const elView = document.getElementById("view");
const elReset = document.getElementById("reset");
const elExample = document.getElementById("example");
const elInput = document.getElementById("input");
const elStart = document.getElementById("start");
const elStop = document.getElementById("stop");
const elParse = document.getElementById("parse");
const elScramble = document.getElementById("scramble");
const elNormal = document.getElementById("normal");
const elInverse = document.getElementById("inverse");
const elAxis = document.getElementById("axis");
const elLastDirection = document.getElementById("last_direction");
const elVisualize = document.getElementById("visualize");
const elCanvas = document.getElementById("canvas");
const elProgress = document.getElementById("progress");
const elError = document.getElementById("error");
const elOptimal = document.getElementById("optimal");
const elOptimalMoves = document.getElementById("optimal_moves");
const elOptimalNumber = document.getElementById("optimal_number");
const elNumber = document.getElementById("number");
const elNumberNum = document.getElementById("number_num");
const elDepth = document.getElementById("depth");
const elDepthNum = document.getElementById("depth_num");
const elBest = document.getElementById("best");
const elBestPre = document.getElementById("best_pre");
const elGraph = document.getElementById("graph");
const elGraphCanvas = document.getElementById("graph_canvas")
const elList = document.getElementById("list");

const configVersion = 1;

let config;
{
    const c = localStorage.getItem("htr_finder");
    if (c) {
        config = JSON.parse(c);
        if (!config.version || config.version<configVersion) {
            config = undefined;
        }
    }
    if (!config) {
        config = {
            max_number: 16,
            niss: "keep",
            view: "graph",
        };
    }
}

for (let i=1; i<=128; i*=2) {
    const o = document.createElement("option");
    o.value = ""+i;
    o.textContent = ""+i;
    elMaxNumber.appendChild(o);
}
elMaxNumber.value = ""+config.max_number;

elNISS.value = config.niss;

elView.value = config.view;

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

function formatNumber(num, diff, total) {
    let s = "("+num;
    if (diff>0) {
        s += "+"+diff;
    }
    if (diff<0) {
        s += ""+diff;
    }
    s += "/"+total+")";
    return s;
}

function formatSolution(data, insert) {
    const moves = [...data.moves];
    let leaveSlice = data.leaveSlice;

    const moveToSymbol = {}

    if (insert) {
        const inputNormalLen = elNormal.textContent=="" ? 0 : elNormal.textContent.split(" ").length;
        const getSymbol = move => {
            if (!moveToSymbol[move]) {
                    moveToSymbol[move] = "*+%"[Object.keys(moveToSymbol).length];
            }
            return moveToSymbol[move];
        }

        for (let i=0; i<data.slices.length; i++) {
            let p = data.slices[i].position-inputNormalLen+i;
            let ok = false;
            for (let j=0; j<moves.length && !ok; j++) {
                if (moves[j][0]!="(") {
                    if (p<=moves[j].split(" ").length) {
                        ok = true;
                        const t = moves[j].split(" ");
                        moves[j] = [...t.slice(0, p), getSymbol(data.slices[i].move), ...t.slice(p)].join(" ");
                    } else {
                        p -= moves[j].split(" ").length;
                    }
                }
            }
            if (!ok && p<=leaveSlice.split(" ").length) {
                ok = true;
                const t = leaveSlice.split(" ");
                leaveSlice = [...t.slice(0, p), getSymbol(data.slices[i].move), ...t.slice(p)].join(" ");
            } else {
                p -= leaveSlice.split(" ").length;
            }
            for (let j=moves.length-1; j>=0 && !ok; j--) {
                if (moves[j][0]=="(") {
                    if (p<=moves[j].split(" ").length) {
                        ok = true;
                        // Inverse区間なので逆にする。
                        let move = data.slices[i].move;
                        if (move.length==1) {
                            move = move+"'";
                        } else if (move[1]=="'") {
                            move = move[0];
                        }
                        let t = moves[j].substring(1, moves[j].length-1).split(" ");
                        t = [...t.slice(0, t.length-p), getSymbol(move), ...t.slice(t.length-p)];
                        moves[j] = "("+t.join(" ")+")";
                    } else {
                        p -= moves[j].split(" ").length;
                    }
                }
            }
        }
    }

    let solution = moves.join(" ").replaceAll(") (", " ");
    solution += " // HTR ";
    solution += formatNumber(data.htrNumber, data.htrDiff, data.htrTotal)+"\n";
    solution += "// "+data.subsets.join(" → ")+"\n";
    solution += leaveSlice;
    if (data.slices.length==0) {
        solution += " // finish ";
        solution += formatNumber(data.leaveSliceNumber, data.leaveSliceDiff, data.leaveSliceTotal);
    } else {
        solution += " // Leave slice ";
        solution += formatNumber(data.leaveSliceNumber, data.leaveSliceDiff, data.leaveSliceTotal)+"\n";
        if (insert) {
            solution += Object.keys(moveToSymbol).map(m => `${moveToSymbol[m]} = ${m}`).join(", ");
            solution += ` // finish (${data.sliceInsertNumber}/${data.sliceInsertTotal})`;
        }
    }
    return solution;
}

let worker;

function search() {
    let input = elInput.value;
    if (input=="") {
        return;
    }

    input = input.replaceAll("‘", "'");
    input = input.replaceAll("’", "'");
    input = input.toUpperCase();

    maxNumber = +elMaxNumber.value,
    niss = elNISS.value,
    view = elView.value;

    localStorage.setItem("htr_finder", JSON.stringify({
        version: configVersion,
        max_number: maxNumber,
        niss: niss,
        view: view,
    }));

    elStart.style.display = "none";
    elStop.style.display = "block";
    elParse.style.display = "none";
    elScramble.textContent = "";
    elNormal.textContent = "";
    elInverse.textContent = "";
    elAxis.textContent = "";
    elLastDirection.textContent = "";
    elVisualize.style.display = "none";
    elProgress.style.display = "block";
    elError.style.display = "none";
    elOptimal.style.display = "none";
    elNumber.style.display = "none";
    elDepth.style.display = "none";
    elBest.style.display = "none";
    elBestPre.style.display = "none";
    elGraph.style.display = "none";
    while (elGraph.lastChild && elGraph.lastChild!=elGraphCanvas) {
        elGraph.removeChild(elGraph.lastChild);
    }
    root = {children: []};
    elList.style.display = "none";
    while (elList.firstChild) {
        elList.removeChild(elList.firstChild);
    }

    if (worker) {
        worker.terminate();
    }
    worker = new Worker("worker.js?v=20250726");

    let number = 0;
    let best = 9999;
    let optimal = 9999;

    worker.onmessage = e => {
        const data = e.data;

        if (data.type=="parsed") {
            elParse.style.display = "block";
            elScramble.textContent = data.scramble.join(" ");
            elNormal.textContent = data.normal.join(" ");
            elInverse.textContent = data.inverse.join(" ");
            elAxis.textContent = data.axis;
            elLastDirection.textContent = data.lastDirection;
            visualize(data.scramble, data.normal, data.inverse);
        }

        if (data.type=="optimal") {
            optimal = data.optimalTotal;

            elOptimal.style.display = "block";
            elOptimalMoves.textContent = data.optimal.join(" ");
            elOptimalNumber.textContent = formatNumber(data.optimalNumber, data.optimalDiff, data.optimalTotal);
        }

        if (data.type=="depth") {
            elDepth.style.display = "block";
            elDepthNum.textContent = ""+data.depth;
        }

        if (data.type=="htr") {
            number++;

            elNumber.style.display = "block";
            elNumberNum.textContent = ""+number;

            if (data.sliceInsertTotal<best) {
                best = data.sliceInsertTotal;

                elBest.style.display = "block";
                elBestPre.style.display = "block";
                elBestPre.textContent = formatSolution(data, true);
            }

            if (elView.value=="graph") {
                addHTRGraph(data, best, optimal, input);
            }
            if (elView.value=="list") {
                addHTRList(data, best, optimal, input);
            }
        }

        if (data.type=="error") {
            elError.style.display = "block";
            elError.textContent = data.error;
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
        input,
        maxNumber,
        niss,
    });
}

function visualize(scramble, normal, inverse) {
    const cube = new Cube();
    cube.move(reverse(inverse));
    cube.move(scramble);
    cube.move(normal);

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

let root;

function addHTRGraph(htr, best, optimal, input) {
    elGraph.style.display = "block";

    // parent/id が存在しなければ、作成する。
    // 作成する際は、作成した要素を引数として make を呼び出す。
    function add(parentPath, id, make) {
        let parent = root;
        for (let p of parentPath) {
            let found = false;
            for (let c of parent.children) {
                if (c.id==p) {
                    found = true;
                    parent = c;
                    break;
                }
            }
            if (!found) {
                throw "error";
            }
        }

        let found = false;
        for (let c of parent.children) {
            if (c.id==id) {
                found = true;
                break;
            }
        }
        if (found) {
            return;
        }

        const div = document.createElement("div");
        div.style.position = "absolute";
        make(div);
        elGraph.appendChild(div);

        parent.children.push({
            id,
            element: div,
            children: [],
        })
    }

    const path = [];
    add(path, "", div => {
        div.textContent = htr.subsets[0];
    });
    path.push("");

    for (let i=0; i<htr.moves.length; i++) {
        add(path, htr.moves[i], div => {
            const moves = document.createElement("div");
            moves.classList.add("has-text-weight-bold");
            moves.textContent = htr.moves[i];
            div.appendChild(moves);

            const subset = document.createElement("div");
            subset.classList.add("has-text-right");
            subset.textContent = htr.subsets[i+1];
            div.appendChild(subset);
        });
        path.push(htr.moves[i]);
    }

    let htrNum = "HTR "+formatNumber(htr.htrNumber, htr.htrDiff, htr.htrTotal);
    add(path, htrNum, div => {
        div.textContent = htrNum;
    });
    path.push(htrNum);

    add(path, htr.leaveSlice, div => {
        div.classList.add("has-text-weight-bold");
        div.textContent = htr.leaveSlice;
    });
    path.push(htr.leaveSlice);

    const hasSI = htr.slices.length>0;

    addTags = div => {
        const best = document.createElement("span");
        best.classList.add("best", "tag", "is-info", "ml-2");
        best.textContent = "Best";
        div.appendChild(best);

        const optimal = document.createElement("span");
        optimal.classList.add("optimal", "tag", "is-success", "ml-2");
        optimal.textContent = "Optimal";
        div.appendChild(optimal);

        div.dataset.total = ""+htr.sliceInsertTotal;
    };

    let lsNum = "";
    if (hasSI) {
        lsNum = "LS ";
    } else {
        lsNum = "finish ";
    }
    lsNum += formatNumber(htr.leaveSliceNumber, htr.leaveSliceDiff, htr.leaveSliceTotal);
    add(path, lsNum, div => {
        div.textContent = lsNum;
        if (!hasSI) {
            addTags(div);
        }
    });
    path.push(lsNum);

    if (hasSI) {
        siNum = `SI (${htr.sliceInsertNumber}/${htr.sliceInsertTotal})`;
        add(path, siNum, div => {
            const siInput = input+"\n"+formatSolution(htr, false);
            const a = document.createElement("a");
            a.setAttribute("href", `../fmc_slice/?input=${encodeURIComponent(siInput)}`);
            a.setAttribute("target", "_blank");
            a.textContent = "SI";
            div.appendChild(a);
            const text = document.createTextNode(` (${htr.sliceInsertNumber}/${htr.sliceInsertTotal})`);
            div.appendChild(text);
            addTags(div);
        });
        path.push(siNum);
    }

    // 再配置。
    // 上下方向は子から親に、左右方向は親から子に伝播する。
    let leafTop = 0;
    let width = 0;
    let height = 0;

    function trace1(node, left) {
        const elem = node.element;
        node.left = left;

        let top, bottom;
        if (node.children.length==0) {
            const h = elem.clientHeight;
            node.top = leafTop+h;

            top = leafTop+h;
            bottom = leafTop+2*h;

            leafTop += h*2.5;
        } else {
            top = 99999999;
            bottom = 0;
            for (let c of node.children) {
                const [t, b] = trace1(c, left+elem.clientWidth+(node.children.length>1?64:32));
                top = Math.min(top, t);
                bottom = Math.max(bottom, b);
            }
            node.top = (top+bottom-elem.clientHeight)/2;
        }

        elem.style.left = node.left+"px";
        elem.style.top = node.top+"px";

        width = Math.max(width, node.left+elem.clientWidth);
        height = Math.max(height, node.top+elem.clientHeight);

        return [top, bottom];
    }
    for (let c of root.children) {
        trace1(c, 0);
    }
    elGraph.style.minWidth = width+32+"px";
    elGraph.style.height = height+"px";

    // エッジの描画。
    const ctx = elGraphCanvas.getContext("2d");
    const dpr = window.devicePixelRatio;
    elGraphCanvas.width = width * dpr;
    elGraphCanvas.height = height * dpr;
    ctx.scale(dpr, dpr);
    elGraphCanvas.style.width = width+"px";
    elGraphCanvas.style.height = height+"px";

    ctx.strokeStyle = "#808080";

    function trace2(node) {
        for (let c of node.children) {
            const x1 = node.left+node.element.clientWidth+4;
            const y1 = node.top+node.element.clientHeight/2;
            const x2 = c.left-4;
            const y2 = c.top+c.element.clientHeight/2;

            ctx.beginPath();
            ctx.moveTo(x1, y1);
            ctx.bezierCurveTo((x1+x2)/2, y1, (x1+x2)/2, y2, x2, y2)
            ctx.stroke();

            trace2(c);
        }
    }
    for (let c of root.children) {
        trace2(c);
    }

    // タグ。
    for (let e of elGraph.querySelectorAll(".best, .optimal")) {
        e.style.display = "none";
    }
    function trace3(node) {
        if (node.element.dataset.total==""+optimal) {
            node.element.querySelector(".optimal").style.display = "inline-flex";
        } else if (node.element.dataset.total==""+best) {
            node.element.querySelector(".best").style.display = "inline-flex";
        }

        for (let c of node.children) {
            trace3(c);
        }
    }
    for (let c of root.children) {
        trace3(c);
    }
}

function addHTRList(htr, best, optimal, input) {
    elList.style.display = "block";

    const li1 = document.createElement("li");
    elList.appendChild(li1);

    const htrMoves = document.createElement("span");
    htrMoves.textContent = htr.moves.join(" ").replaceAll(") (", " ");
    htrMoves.classList.add("has-text-weight-bold")
    li1.appendChild(htrMoves);

    const htrComment = document.createTextNode(
        " // HTR "+formatNumber(htr.htrNumber, htr.htrDiff, htr.htrTotal));

    li1.appendChild(htrComment);

    const tagBest = document.createElement("span");
    tagBest.classList.add("best", "tag", "is-info", "ml-2");
    tagBest.textContent = "Best";
    li1.appendChild(tagBest);

    const tagOptimal = document.createElement("span");
    tagOptimal.classList.add("optimal", "tag", "is-success", "ml-2");
    tagOptimal.textContent = "Optimal";
    li1.appendChild(tagOptimal);

    li1.dataset.total = ""+htr.leaveSliceTotal;

    const ul = document.createElement("ul");
    li1.appendChild(ul);

    const li2 = document.createElement("li");
    ul.appendChild(li2);
    li2.textContent = "// "+htr.subsets.join(" → ");

    const li3 = document.createElement("li");
    ul.appendChild(li3);

    const leaveSliceMoves = document.createElement("span");
    leaveSliceMoves.textContent = htr.leaveSlice;
    leaveSliceMoves.classList.add("has-text-weight-bold")
    li3.appendChild(leaveSliceMoves);

    const hasSI = htr.slices.length>0;

    const leaveSliceComment = document.createTextNode(
        ` // ${hasSI?"LS":"finish"} `+formatNumber(htr.leaveSliceNumber, htr.leaveSliceDiff, htr.leaveSliceTotal));
    li3.appendChild(leaveSliceComment);

    if (hasSI) {
        const li4 = document.createElement("li");
        ul.appendChild(li4);

        li4.appendChild(document.createTextNode("// "));

        const siInput = input+"\n"+formatSolution(htr, false);
        const a = document.createElement("a");
        a.setAttribute("href", `../fmc_slice/?input=${encodeURIComponent(siInput)}`);
        a.setAttribute("target", "_blank");
        a.textContent = "SI";
        li4.appendChild(a);

        li4.appendChild(document.createTextNode(` (${htr.sliceInsertNumber}/${htr.sliceInsertTotal})`));
    }

    // タグ。
    for (let e of elList.querySelectorAll(".best, .optimal")) {
        e.style.display = "none";
    }
    for (let node of elList.childNodes) {
        if (node.dataset.total==""+optimal) {
            node.querySelector(".optimal").style.display = "inline-flex";
        } else if (node.dataset.total==""+best) {
            node.querySelector(".best").style.display = "inline-flex";
        }
    }
}

for (let e of [
    elMaxNumber,
    elNISS,
    elView,
    elInput,
]) {
    e.addEventListener("input", search);
}

elReset.addEventListener("click", () => {
    elMaxNumber.value = "16";
    elNISS.value = "keep";
    elView.value = "graph";

    search();
});

const examples = [
    "R' U' F U2 F2 R2 D2 B' D2 L2 U2 B2 R2 B D2 U F' D2 U B2 R D L' U2 R' U' F\n\n(D' R F) // EO (F/B, DR-6e6c (U/D), DR-4e4c (R/L)) (3/3)\nL // RZP (U/D, DR-4e4c, AR-1e3c (normal), AR-1e2c (inverse)) (1/4)\nL2 B2 D F2 R2 D' L // DR (U/D, 3QT, HTR-6e4c, Solved+Bars, 4b3) (7-1/10)",
    "R' U' F R2 B2 R2 F U2 B' D2 B D2 F L2 F R' U L2 B' D2 L' F' D2 F2 R' U' F\n\n(F) R' B // EO (F/B, DR-8e7c (U/D), DR-6e5c (R/L)) (3/3)\n(F2 R L) // RZP (U/D, DR-4e4c, AR-0e1c (normal), AR-2e3c (inverse)) (3-1/5)\n(U2 D L2 F2 D' L) // DR (U/D, 4QT, HTR-2e2c, Solved+One Bar, 2c4) (6/11)",
    "R' U' F R B L R2 F2 L2 U' R2 F2 D' R2 U' R2 U' R' D' R' U2 R U' F R' U' F\n\n(R) B R // EO (R/L, DR-4e5c (U/D), DR-8e6c (F/B)) (3/3)\nR2 D' F // RZP (U/D, DR-2e3c, AR-0e1c (normal), AR-1e2c (inverse)) (3-1/5)\n(B' D' B) // DR (U/D, 3QT, HTR-4e4c, Solved+One Face (ST2), 4a3) (3/8)",
    "R' U' F U' R2 B D' R D' F' D' B' L F' U2 B U2 F2 D2 F2 L2 B U2 F2 R' U' F\n\n(D' L) // EO (R/L, DR-6e5c (U/D), DR-4e5c (F/B)) (2/2)\nF U // RZP (F/B, DR-4e4c, AR-1e3c (normal), AR-2e4c (inverse)) (2/4)\n(F U2 F2 U) // DR (F/B, 4QT, HTR-6e4c, Bar/Slash+One Face, 4a4) (4/8)",
    "R' U' F R2 D' B D2 L2 F R2 F D2 L2 F R2 D2 L' D' B2 F' D2 L U2 R' U' F\n\n(U) R U // EO (U/D, DR-4e4c (F/B), DR-6e5c (R/L)) (3/3)\n// RZP (F/B, DR-4e4c, AR-1e2c (normal), AR-1e2c (inverse)) (0/3)\n(U2 R2 L2 F' D2 R) // DR (F/B, 2QT, HTR-4e4c, Bar/Slash+Bars, 4b2) (6-1/8)",
    "R' U' F L2 B2 D2 L2 F2 U' B2 U L2 D B2 L U2 B2 D' R F' R2 B' D F' R' U' F\n\n(B' D F) // EO (F/B, DR-4e4c (U/D), DR-6e5c (R/L)) (3/3)\n// RZP (U/D, DR-4e4c, AR-2e3c (normal), AR-0e2c (inverse)) (0/3)\nU F2 R2 U D2 L // DR (U/D, 4QT, HTR-2e4c, Bar/Slash+One Face, 4a4) (6/9)",
    "R' U' F D2 R2 U2 R' B2 U2 L' D2 R F2 L D2 U L' R2 B F' L U2 F' U R' U' F\n\nD F // EO (F/B, DR-4e7c (U/D), DR-4e4c (R/L)) (2/2)\n// RZP (R/L, DR-4e4c, AR-1e2c (normal), AR-1e2c (inverse)) (0/2)\nD2 F2 B2 R' F2 L2 D // DR (R/L, 3QT, HTR-2e4c, Bar/Slash+One Face, 4a3) (7/9)",
    "R' U' F D2 L2 F2 R2 D L2 D' B2 U L2 F' D L' D' B F2 U L R2 D U' R' U' F\n\nL' U' R2 F // EO (F/B, DR-4e4c (U/D), DR-6e5c (R/L)) (4/4)\n// RZP (U/D, DR-4e4c, AR-0e3c (normal), AR-1e2c (inverse)) (0/4)\n(B2 D2 L2 U' F2 R) // DR (U/D, 5QT, HTR-2e6c, Solved+One Bar, 2c5) (6/10)",
    "R' U' F L U F' U' R2 F2 B' L2 U' R' B' U2 F L2 B2 L2 B R2 F' R' U' F\n\nF R' U // EO (U/D, DR-6e6c (F/B), DR-8e6c (R/L)) (3/3)\n(L) // RZP (F/B, DR-4e4c, AR-2e3c (normal), AR-1e3c (inverse)) (1/4)\nU2 B2 R F L2 B' R // DR (F/B, 5QT, HTR-4e4c, Bars+Bars (BB3), 4b5) (7-1/10)",
    "R' U' F R F2 D2 F' U2 R2 F2 D' R B2 U2 B2 U2 L' B2 U2 R2 U2 R' U' F\n\n(F L) D R // EO (R/L, DR-6e5c (U/D), DR-6e3c (F/B)) (4/4)\n(D) // RZP (F/B, DR-4e4c, AR-1e2c (normal), AR-1e2c (inverse)) (1/5)\nF2 L2 B' R2 U // DR (F/B, 4QT, HTR-4e4c, Bars+Bars (BB3), 4b4) (5/10)",
    "R' U' F D2 B' F U2 B L2 R2 F' R2 B2 D' R U2 L' F U2 L2 U' B' D2 R' U' F\n\n(R2 F2 U) // EO (U/D, DR-4e3c (F/B), DR-6e5c (R/L)) (3/3)\n(U2 F R) // RZP (F/B, DR-4e4c, AR-0e2c (normal), AR-1e2c (inverse)) (3-1/5)\n(B' U2 B2 R) // DR (F/B, 3QT, HTR-2e4c, Bar/Slash+One Face, 4a3) (4/9)",
    "R' U' F L U2 R' D2 L' D2 B2 R' D2 B2 R' F2 D' B L2 D R B' L' F2 D2 R' U' F\n\nF B' U2 R // EO (R/L, DR-6e4c (U/D), DR-6e4c (F/B)) (4/4)\nB' D // RZP (F/B, DR-4e4c, AR-2e3c (normal), AR-0e2c (inverse)) (2/6)\nD2 F' U' F2 R2 U // DR (F/B, 5QT, HTR-4e4c, Bars+Bars (BB3), 4b5) (6-1/11)",
    "R' U' F D' L2 F' D2 B2 D2 L2 B2 F L2 R2 D2 F' L' F U' L R F U2 B' R' U' F\n\n(F' U D) // EO (U/D, DR-6e7c (F/B), DR-4e5c (R/L)) (3/3)\n(R) // RZP (F/B, DR-2e4c, AR-0e3c (normal), AR-1e1c (inverse)) (1/4)\nL' B L F D2 F L // DR (F/B, 1QT, HTR-4e4c, Bars+One Face, 4a1) (7/11)",
    "R' U' F R2 U2 L2 D' F2 D' R2 F2 R2 U2 F2 L' F' R' U R B L' U F R' U' F\n\n(U' L) L // EO (R/L, DR-6e5c (U/D), DR-6e6c (F/B)) (3/3)\n(U) // RZP (F/B, DR-4e4c, AR-1e2c (normal), AR-1e2c (inverse)) (1/4)\nD2 L2 F2 D2 F U // DR (F/B, 3QT, HTR-4e2c, Bar/Slash+One Bar (BS1), 2c3) (6/10)",
    "R' U' F D' U R2 D2 L2 D' B2 D2 U' F2 U' L2 F' D' U L' B' F2 D' L2 B R' U' F\n\nD2 R2 B // EO (F/B, DR-8e6c (U/D), DR-4e6c (R/L)) (3/3)\n(R) // RZP (U/D, DR-4e4c, AR-1e3c (normal), AR-2e2c (inverse)) (1/4)\nR2 D' R2 D R // DR (U/D, 3QT, HTR-4e6c, Bars+One Bar, 2c3) (5/9)",
    "R' U' F R2 U L' F' D2 F2 L' U2 R2 U B2 R2 D' F2 L2 F2 D' F L U R' U' F\n\n(B' F) R2 B // EO (F/B, DR-6e5c (U/D), DR-8e6c (R/L)) (4/4)\n(L' D) // RZP (R/L, DR-4e4c, AR-1e3c (normal), AR-2e0c (inverse)) (2/6)\nB2 R' D2 R' D // DR (R/L, 4QT, HTR-4e2c, Bar/Slash+One Bar (BS2), 2c4) (5-1/10)",
    "R' U' F D L B' D' R2 D U2 R2 B2 D F2 L2 F2 U' R F' D2 U' R' D2 B' R' U' F\n\nR D' L2 F // EO (F/B, DR-4e4c (U/D), DR-6e3c (R/L)) (4/4)\n// RZP (U/D, DR-4e4c, AR-2e2c (normal), AR-2e1c (inverse)) (0/4)\nD R2 F2 U' R2 D' L // DR (U/D, 3QT, HTR-4e2c, Bars+One Bar, 2c3) (7/11)",
    "R' U' F L2 F2 L2 D' U2 B2 U L2 D2 R2 B' D2 R2 F2 R U B D2 L' F' R' U' F\n\n(B U' L2 F) // EO (F/B, DR-6e7c (U/D), DR-4e4c (R/L)) (4/4)\n// RZP (R/L, DR-4e4c, AR-1e2c (normal), AR-1e3c (inverse)) (0/4)\nB2 R D2 R' F2 D // DR (R/L, 4QT, HTR-4e6c, Bar/Slash+One Bar (BS1), 2c4) (6/10)",
    "R' U' F R2 F L2 D2 U2 B R2 F2 U2 B' U2 L2 D' R' F D F2 D2 U B2 F R' U' F\n\n(R2 F2 L) L // EO (R/L, DR-6e5c (U/D), DR-8e4c (F/B)) (4/4)\nL2 U // RZP (F/B, DR-4e4c, AR-2e1c (normal), AR-1e2c (inverse)) (2-1/5)\n(L2 F2 L2 D2 B D) // DR (F/B, 4QT, HTR-6e2c, Bars+One Bar, 2c4) (6-1/10)",
    "R' U' F L' F B2 U' F2 L' B2 D' B U2 R2 D' F2 D' F2 D2 B2 R2 D' L2 U2 R' U' F\n\n(R D) // EO (U/D, DR-8e3c (F/B), DR-8e5c (R/L)) (2/2)\nF' R // RZP (F/B, DR-4e4c, AR-2e2c (normal), AR-2e2c (inverse)) (2/4)\n(B' L2 F' U2 R) // DR (F/B, 4QT, HTR-6e4c, Bars+Bars (BB3), 4b4) (5/9)",
    "R' U' F L' F' U' B' R2 F L F R' U F2 U L2 U2 F2 L2 U L2 D L2 D R' U' F\n\nU2 R B // EO (F/B, DR-2e4c (U/D), DR-2e5c (R/L)) (3/3)\n// RZP (U/D, DR-2e4c, AR-0e2c (normal), AR-1e2c (inverse)) (0/3)\nR' U R B2 U L // DR (U/D, 0QT, HTR-6e0c, Solved+Solved, 0c0) (6/9)",
    "R' U' F R2 D2 U2 F2 L2 F L2 R2 B U2 F2 L' B' D L2 D L U' B' U' F R' U' F\n\n(B2 R D) D // EO (U/D, DR-6e4c (F/B), DR-6e5c (R/L)) (4/4)\nR // RZP (F/B, DR-4e4c, AR-2e3c (normal), AR-1e2c (inverse)) (1/5)\nL2 F' D2 B L // DR (F/B, 2QT, HTR-4e4c, Bar/Slash+Bars, 4b2) (5/10)",
    "R' U' F U2 R' U' D' B2 U R U F B2 U2 D2 L F2 D2 R' U2 F2 D2 R' F2 R' U' F\n\n(R L' B2 U) // EO (U/D, DR-4e5c (F/B), DR-6e2c (R/L)) (4/4)\nL // RZP (F/B, DR-2e3c, AR-0e2c (normal), AR-0e1c (inverse)) (1/5)\nL2 B U2 L' B' L // DR (F/B, 2QT, HTR-4e4c, Bar/Slash+Bars, 4b2) (6-1/10)",
    "R' U' F U' F2 U' B2 F2 L2 F2 D B D' L' R U F' U2 L' U' B2 R' U' F\n\n(D B) U B // EO (F/B, DR-6e6c (U/D), DR-8e5c (R/L)) (4/4)\n(R) // RZP (U/D, DR-4e4c, AR-1e1c (normal), AR-2e3c (inverse)) (1/5)\nD B2 U' L // DR (U/D, 5QT, HTR-4e4c, Bars+Bars (BB3), 4b5) (4/9)",
    "R' U' F D2 B U2 B2 F L2 U2 L2 D2 F2 R' B2 D R2 D R2 F R F' R' U' F\n\nF' R U2 L // EO (R/L, DR-2e4c (U/D), DR-2e3c (F/B)) (4/4)\n// RZP (F/B, DR-2e3c, AR-0e1c (normal), AR-0e3c (inverse)) (0/4)\nL2 F B D F D // DR (F/B, 4QT, HTR-6e4c, Bar/Slash+One Face, 4a4) (6-1/9)",
    "R' U' F D' L B2 U' F D' R2 F2 R B L2 B2 L2 F2 U D2 F2 R2 L2 U2 R' U' F\n\n(B U L2 D) // EO (U/D, DR-4e4c (F/B), DR-6e3c (R/L)) (4/4)\n// RZP (F/B, DR-4e4c, AR-1e1c (normal), AR-1e2c (inverse)) (0/4)\nF B2 R F2 D2 R // DR (F/B, 2QT, HTR-6e4c, Bar/Slash+Bars, 4b2) (6/10)",
    "R' U' F R' B' U' D2 F' D L' U F D2 L2 B U2 D2 R2 B U2 L2 F L2 U R' U' F\n\n(B R2 L' D) // EO (U/D, DR-4e4c (F/B), DR-4e5c (R/L)) (4/4)\n// RZP (F/B, DR-4e4c, AR-1e2c (normal), AR-1e2c (inverse)) (0/4)\n(R2 D2 F R) // DR (F/B, 3QT, HTR-2e6c, Bars+One Bar, 2c3) (4/8)",
    "R' U' F L B2 U2 L2 F' R2 F' U2 L2 R2 F U2 L D F R D' U' L2 F R' U' F\n\nL U' D' B // EO (F/B, DR-4e6c (U/D), DR-2e4c (R/L)) (4/4)\n// RZP (R/L, DR-2e4c, AR-0e2c (normal), AR-0e2c (inverse)) (0/4)\n(F2 R B2 U' F2 U) // DR (R/L, 2QT, HTR-4e4c, Bar/Slash+Bars, 4b2) (6/10)",
    "R' U' F D2 R2 B R U2 F' B2 R D' F U2 B L2 F2 D2 R2 F2 U2 B U2 B2 R' U' F\n\nU F2 D // EO (U/D, DR-4e7c (F/B), DR-4e5c (R/L)) (3/3)\nR // RZP (F/B, DR-4e4c, AR-0e3c (normal), AR-1e2c (inverse)) (1/4)\n(F2 R2 B L) // DR (F/B, 5QT, HTR-4e4c, Bars+Bars (BB3), 4b5) (4/8)",
    "R' U' F D F' L U' B2 U2 F2 U2 L2 F2 U' F2 U' B D R' D' L B F2 R' U' F\n\n(L B' L) // EO (R/L, DR-6e7c (U/D), DR-4e6c (F/B)) (3/3)\n(U) // RZP (F/B, DR-4e4c, AR-0e3c (normal), AR-2e4c (inverse)) (1/4)\n(F' R2 B L2 F D) // DR (F/B, 2QT, HTR-4e4c, Solved+Bars, 4b2) (6/10)",
    "R' U' F L' B D2 R' U L' B2 U R B' D2 B R2 F D2 B2 U2 F' D2 U R' U' F\n\n(D' B) R D' B // EO (F/B, DR-4e4c (U/D), DR-6e4c (R/L)) (5/5)\n// RZP (U/D, DR-4e4c, AR-1e1c (normal), AR-1e2c (inverse)) (0/5)\n(B2 D' R2 U D' R) // DR (U/D, 3QT, HTR-6e2c, Bar/Slash+One Bar (BS1), 2c3) (6-1/10)",
    "R' U' F U' F R2 B F' R2 F' L2 U2 L2 U' L' B D' U' L D' B F2 R' U' F\n\n(B L D) // EO (U/D, DR-6e4c (F/B), DR-4e4c (R/L)) (3/3)\n// RZP (R/L, DR-4e4c, AR-0e3c (normal), AR-2e2c (inverse)) (0/3)\n(D2 L B2 D2 R2 D2 L' F) // DR (R/L, 5QT, HTR-2e4c, Bar/Slash+Bars, 4b5) (8-1/10)",
];
let currentExample = -1;

elExample.addEventListener("click", () => {
    while (true) {
        const r = Math.random()*examples.length|0;
        if (0<=r && r<examples.length && r!=currentExample) {
            currentExample = r;
            elInput.value = examples[r];
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
