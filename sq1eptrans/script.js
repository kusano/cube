const perms = [
    "skip",
    "cwu",
    "ccwu",
    "z",
    "h",
    "opp",
    "adj",
    "cwo",
    "ccwo",
    "w",
];

const permToName = {
    "skip": "Skip",
    "cwu": "cw U",
    "ccwu": "ccw U",
    "z": "Z",
    "h": "H",
    "opp": "Opp",
    "adj": "Adj",
    "cwo": "cw O",
    "ccwo": "ccw O",
    "w": "W",
};

const permToParity = {
    "skip": false,
    "cwu": false,
    "ccwu": false,
    "z": false,
    "h": false,
    "opp": true,
    "adj": true,
    "cwo": true,
    "ccwo": true,
    "w": true,
};

const permToFace = {
    "skip": "LFRB",
    "cwu": "LRBF",
    "ccwu": "LBFR",
    "z": "FLBR",
    "h": "RBLF",
    "opp": "RFLB",
    "adj": "LRFB",
    "cwo": "FRBL",
    "ccwo": "BLFR",
    "w": "BRLF",
};

const inverse = {
    "skip": "skip",
    "cwu": "ccwu",
    "ccwu": "cwu",
    "z": "z",
    "h": "h",
    "opp": "opp",
    "adj": "adj",
    "cwo": "ccwo",
    "ccwo": "cwo",
    "w": "w",
};

function apply(edges, perm, r) {
    edges = edges[r%4]+edges[(r+1)%4]+edges[(r+2)%4]+edges[(r+3)%4];

    if (perm=="skip") {
        edges = edges[0]+edges[1]+edges[2]+edges[3];
    } else if (perm=="cwu") {
        edges = edges[0]+edges[3]+edges[1]+edges[2];
    } else if (perm=="ccwu") {
        edges = edges[0]+edges[2]+edges[3]+edges[1];
    } else if (perm=="z") {
        edges = edges[3]+edges[2]+edges[1]+edges[0];
    } else if (perm=="h") {
        edges = edges[2]+edges[3]+edges[0]+edges[1];
    } else if (perm=="opp") {
        edges = edges[2]+edges[1]+edges[0]+edges[3];
    } else if (perm=="adj") {
        edges = edges[0]+edges[2]+edges[1]+edges[3];
    } else if (perm=="cwo") {
        edges = edges[3]+edges[0]+edges[1]+edges[2];
    } else if (perm=="ccwo") {
        edges = edges[1]+edges[2]+edges[3]+edges[0];
    } else if (perm=="w") {
        edges = edges[1]+edges[3]+edges[0]+edges[2];
    } else {
        throw "error";
    }

    edges = edges[(4-r)%4]+edges[(5-r)%4]+edges[(6-r)%4]+edges[(7-r)%4];

    return edges;
}

function getPerm(edges) {
    for (const perm of perms) {
        for (let n=0; n<4; n++) {
            const sides2 = apply(edges, perm, n);
            if (sides2=="LFRB") {
                return perm;
            }
        }
    }
    throw "error";
}

function elem(id) {
    return document.getElementById(id);
}

function render(canvas, edges) {
    const colors = {
        "F": "#08f808",
        "B": "#0808f8",
        "R": "#f80808",
        "L": "#f8a008",
        "U": "#ffffff",
        "D": "#404040",
    };

    const S = 64;

    const ctx = canvas.getContext("2d");
    const dpr = window.devicePixelRatio;
    canvas.width = S*dpr;
    canvas.height = S*dpr;
    ctx.scale(dpr, dpr);
    canvas.style.width = `${S}px`;
    canvas.style.height = `${S}px`;

    ctx.lineWidth = 0.5;

    for (let r=0; r<4; r++) {
        for (let f=0; f<5; f++) {
            let XY;
            let c;
            if (f==0) {
                XY = [
                    [-0.9, -0.9],
                    [-0.9*Math.tan(Math.PI/12), -0.9],
                    [-0.5*Math.tan(Math.PI/12), -0.5],
                    [-0.5, -0.5],
                ];
                c = "LFRB"[r];
            } else if (f==1) {
                XY = [
                    [-0.9*Math.tan(Math.PI/12), -0.9],
                    [0.9*Math.tan(Math.PI/12), -0.9],
                    [0.5*Math.tan(Math.PI/12), -0.5],
                    [-0.5*Math.tan(Math.PI/12), -0.5],
                ];
                c = edges[r];
            } else if (f==2) {
                XY = [
                    [0.9*Math.tan(Math.PI/12), -0.9],
                    [0.9, -0.9],
                    [0.5, -0.5],
                    [0.5*Math.tan(Math.PI/12), -0.5],
                ];
                c = "LFRB"[r];
            } else if (f==3) {
                XY = [
                    [-0.5, -0.5],
                    [-0.5*Math.tan(Math.PI/12), -0.5],
                    [0, 0],
                    [-0.5, -0.5*Math.tan(Math.PI/12)],
                ];
                c = "D";
            } else if (f==4) {
                XY = [
                    [-0.5*Math.tan(Math.PI/12), -0.5],
                    [0.5*Math.tan(Math.PI/12), -0.5],
                    [0, 0],
                ];
                c = "D";
            }

            for (let i=0; i<XY.length; i++) {
                let [x, y] = XY[i];
                let x2, y2;
                if (r==0) {
                    x2 = x;
                    y2 = y;
                } else if (r==1) {
                    x2 = -y;
                    y2 = x;
                } else if (r==2) {
                    x2 = -x;
                    y2 = -y;
                } else if (r==3) {
                    x2 = y;
                    y2 = -x;
                }

                XY[i][0] = x2*S/2+S/2;
                XY[i][1] = y2*S/2+S/2;
            }

            ctx.beginPath();
            ctx.moveTo(...XY[0]);
            for (let i=1; i<XY.length; i++) {
                ctx.lineTo(...XY[i]);
            }
            ctx.closePath();
            ctx.fillStyle = colors[c];
            ctx.fill();
            ctx.stroke();
        }
    }
}

for (const perm of perms) {
    if (perm!="skip") {
        const option = document.createElement("option");
        elem("applying-ep").appendChild(option);
        option.value = perm;
        option.textContent = permToName[perm];
    }
}

elem("applying-ep").addEventListener("input", update);
elem("applying-rotation").addEventListener("input", update);

elem("applying-ep").value = "ccwu";
elem("applying-rotation").value = "0";

function update() {
    const applyingEP = elem("applying-ep").value;
    const applyingRotation = +elem("applying-rotation").value;

    render(
        elem("applying-visual"),
        apply("LFRB", inverse[applyingEP], applyingRotation),
    );

    function clearChildren(elem) {
        while (elem.firstChild) {
            elem.removeChild(elem.firstChild);
        }
    }

    clearChildren(document.querySelector("#parity-table thead tr"));
    clearChildren(document.querySelector("#parity-table tbody"));
    clearChildren(document.querySelector("#non-parity-table thead tr"));
    clearChildren(document.querySelector("#non-parity-table tbody"));

    for (let parity=0; parity<2; parity++) {
        for (const perm of [
            ["", "skip", "cwu", "ccwu", "z", "h"],
            ["", "adj", "opp", "cwo", "ccwo", "w"],
        ][parity^(permToParity[applyingEP]?0:1)]) {
            const elTH = document.createElement("th");
            document.querySelector(`#${["parity-table", "non-parity-table"][parity]} thead tr`).appendChild(elTH);
            elTH.style.textAlign = "center";

            if (perm=="") {
                elTH.style.minWidth = "6em";
            } else {
                const elDiv1 = document.createElement("div");
                elTH.appendChild(elDiv1);
                elDiv1.textContent = permToName[perm];

                const elDiv2 = document.createElement("div");
                elTH.appendChild(elDiv2);

                const elCanvas = document.createElement("canvas");
                elDiv2.appendChild(elCanvas);
                render(elCanvas, apply("LFRB", inverse[perm], 0));
            }
        }
    }

    for (const perm of perms) {
        if (perm!="skip") {
            const elTR = document.createElement("tr");
            if (permToParity[perm]) {
                document.querySelector("#parity-table tbody").appendChild(elTR);
            } else {
                document.querySelector("#non-parity-table tbody").appendChild(elTR);
            }

            const elName = document.createElement("th");
            elTR.appendChild(elName);
            elName.textContent = permToName[perm];

            const elTDs = {};
            for (const perm2 of [
                ["skip", "cwu", "ccwu", "z", "h"],
                ["adj", "opp", "cwo", "ccwo", "w"],
            ][(permToParity[perm]?0:1)^(permToParity[applyingEP]?0:1)]) {
                const elTD = document.createElement("td");
                elTR.appendChild(elTD);
                elTDs[perm2] = elTD;
            }

            const added = {};

            for (let r=0; r<4; r++) {
                const edges = apply("LFRB", inverse[perm], r);
                const perm2 = getPerm(apply(edges, applyingEP, applyingRotation));

                if (!added[perm2]) {
                    added[perm2] = true;

                    const elCanvas = document.createElement("canvas");
                    elTDs[perm2].appendChild(elCanvas);
                    render(elCanvas, edges);
                }
            }
        }
    }
}
update();
