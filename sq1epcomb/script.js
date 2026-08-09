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

const permsUD = [];

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

// /24
const permToProb = {
    "skip": 1,
    "cwu": 4,
    "ccwu": 4,
    "z": 2,
    "h": 1,
    "opp": 2,
    "adj": 4,
    "cwo": 1,
    "ccwo": 1,
    "w": 4,
};

const permToFaceU = {
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

const permToFaceD = {
    "skip": "RFLB",
    "cwu": "RLBF",
    "ccwu": "RBFL",
    "z": "FRBL",
    "h": "LBRF",
    "opp": "LFRB",
    "adj": "RLFB",
    "cwo": "FLBR",
    "ccwo": "BRFL",
    "w": "BLRF",
};

const permToFaceUD = {};

function makeUD() {
    for (const u of perms) {
        for (const d of perms) {
            const ud = `${u}-${d}`;
            permsUD.push(ud);

            permToName[ud] = `${permToName[u]}/${permToName[d]}`;
            permToParity[ud] = permToParity[u]!=permToParity[d];
            permToProb[ud] = permToProb[u]*permToProb[d];
            permToFaceUD[ud] = permToFaceU[u]+permToFaceD[d];
        }
    }
}
makeUD();

const defaultSettings = {
    eps: {
        "cwu-skip": ["8", false],
        "cwu-cwu": ["5", false],
        "cwu-ccwu": ["8", false],
        "cwu-z": ["8", false],
        "cwu-h": ["10", false],
        "cwu-opp": ["12", false],
        "cwu-adj": ["12", false],
        "cwu-cwo": ["13", false],
        "cwu-ccwo": ["12", false],
        "cwu-w": ["11", false],
        "ccwu-skip": ["8", false],
        "ccwu-cwu": ["8", false],
        "ccwu-ccwu": ["5", false],
        "ccwu-z": ["8", false],
        "ccwu-h": ["10", false],
        "ccwu-opp": ["12", false],
        "ccwu-adj": ["12", true],
        "ccwu-cwo": ["12", false],
        "ccwu-ccwo": ["13", false],
        "ccwu-w": ["11", false],
        "z-skip": ["6", false],
        "z-cwu": ["8", false],
        "z-ccwu": ["8", false],
        "z-z": ["6", false],
        "z-h": ["8", false],
        "z-opp": ["9", false],
        "z-adj": ["10", false],
        "z-cwo": ["11", false],
        "z-ccwo": ["11", false],
        "z-w": ["10", false],
        "h-skip": ["8", false],
        "h-cwu": ["10", false],
        "h-ccwu": ["10", false],
        "h-z": ["8", false],
        "h-h": ["5", false],
        "h-opp": ["9", false],
        "h-adj": ["10", false],
        "h-cwo": ["9", false],
        "h-ccwo": ["9", false],
        "h-w": ["12", false],
        "opp-skip": ["12", false],
        "opp-cwu": ["12", false],
        "opp-ccwu": ["12", false],
        "opp-z": ["9", false],
        "opp-h": ["9", false],
        "opp-opp": ["3", true],
        "opp-adj": ["7", false],
        "opp-cwo": ["6", false],
        "opp-ccwo": ["6", false],
        "opp-w": ["9", false],
        "adj-skip": ["13", true],
        "adj-cwu": ["12", false],
        "adj-ccwu": ["12", false],
        "adj-z": ["10", false],
        "adj-h": ["10", false],
        "adj-opp": ["7", false],
        "adj-adj": ["4", true],
        "adj-cwo": ["9", false],
        "adj-ccwo": ["9", false],
        "adj-w": ["7", false],
        "cwo-skip": ["10", false],
        "cwo-cwu": ["13", false],
        "cwo-ccwu": ["12", false],
        "cwo-z": ["11", false],
        "cwo-h": ["9", false],
        "cwo-opp": ["6", false],
        "cwo-adj": ["9", false],
        "cwo-cwo": ["8", false],
        "cwo-ccwo": ["8", false],
        "cwo-w": ["9", false],
        "ccwo-skip": ["10", false],
        "ccwo-cwu": ["12", false],
        "ccwo-ccwu": ["13", false],
        "ccwo-z": ["11", false],
        "ccwo-h": ["9", false],
        "ccwo-opp": ["6", false],
        "ccwo-adj": ["9", false],
        "ccwo-cwo": ["8", false],
        "ccwo-ccwo": ["7", false],
        "ccwo-w": ["9", false],
        "w-skip": ["11", false],
        "w-cwu": ["11", false],
        "w-ccwu": ["11", false],
        "w-z": ["10", false],
        "w-h": ["12", false],
        "w-opp": ["9", false],
        "w-adj": ["7", false],
        "w-cwo": ["9", false],
        "w-ccwo": ["9", false],
        "w-w": ["7", false],
        "skip-cwu": ["8", false],
        "skip-ccwu": ["8", false],
        "skip-z": ["6", false],
        "skip-h": ["8", false],
        "skip-opp": ["11", false],
        "skip-adj": ["13", false],
        "skip-cwo": ["10", false],
        "skip-ccwo": ["10", false],
        "skip-w": ["11", false],
    },
    parityEPPosition: "first",
};

function elem(id) {
    return document.getElementById(id);
}

function render(canvas) {
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
    canvas.height = S*2.25*dpr;
    ctx.scale(dpr, dpr);
    canvas.style.width = `${S}px`;
    canvas.style.height = `${S*2.25}px`;

    ctx.lineWidth = 0.5;

    for (let ud=0; ud<2; ud++) {
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
                    c = ["LFRB", "RFLB"][ud][r];
                } else if (f==1) {
                    XY = [
                        [-0.9*Math.tan(Math.PI/12), -0.9],
                        [0.9*Math.tan(Math.PI/12), -0.9],
                        [0.5*Math.tan(Math.PI/12), -0.5],
                        [-0.5*Math.tan(Math.PI/12), -0.5],
                    ];
                    c = canvas.dataset.ud[ud*4+r];
                } else if (f==2) {
                    XY = [
                        [0.9*Math.tan(Math.PI/12), -0.9],
                        [0.9, -0.9],
                        [0.5, -0.5],
                        [0.5*Math.tan(Math.PI/12), -0.5],
                    ];
                    c = ["LFRB", "RFLB"][ud][r];
                } else if (f==3) {
                    XY = [
                        [-0.5, -0.5],
                        [-0.5*Math.tan(Math.PI/12), -0.5],
                        [0, 0],
                        [-0.5, -0.5*Math.tan(Math.PI/12)],
                    ];
                    c = "DU"[ud];
                } else if (f==4) {
                    XY = [
                        [-0.5*Math.tan(Math.PI/12), -0.5],
                        [0.5*Math.tan(Math.PI/12), -0.5],
                        [0, 0],
                    ];
                    c = "DU"[ud];
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

                    y2 += ud*2.5;

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

    const x = (1-Math.tan(Math.PI/12)*0.9)*S/2;

    ctx.beginPath();
    ctx.moveTo(0.05*S, 1*S);
    ctx.lineTo(x, 1*S);
    ctx.lineTo(x, 1.25*S);
    ctx.lineTo(0.05*S, 1.25*S);
    ctx.closePath();
    ctx.fillStyle = colors["R"];
    ctx.fill();
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(x, 1*S);
    ctx.lineTo(0.95*S, 1*S);
    ctx.lineTo(0.95*S, 1.25*S);
    ctx.lineTo(x, 1.25*S);
    ctx.closePath();
    ctx.fillStyle = colors["R"];
    ctx.fill();
    ctx.stroke();
}

function makeLegend() {
    for (const perm of perms) {
        const elTH = document.createElement("th");
        elem("legend-name").appendChild(elTH);
        elTH.textContent = permToName[perm];
        if (permToParity[perm]) {
            elTH.classList.add("parity-bg");
        }

        const elTD = document.createElement("td");
        elem("legend-image").appendChild(elTD);
        elTD.rowSpan = 2;
        if (permToParity[perm]) {
            elTD.classList.add("parity-bg");
        }

        const elCanvas = document.createElement("canvas");
        elTD.appendChild(elCanvas);
        elCanvas.dataset.ud = permToFaceU[perm]+permToFaceD[perm];
        render(elCanvas);
    }
}
makeLegend();

function makeAvailTable() {
    const elTBody = document.querySelector("#avail-ep tbody");
    for (const d of perms) {
        const elTH = document.createElement("th");
        document.querySelector("#avail-ep thead tr").appendChild(elTH);
        elTH.style.minWidth = "5em";
        elTH.textContent = permToName[d];
        if (permToParity[d]) {
            elTH.classList.add("parity-bg");
        }
    }

    for (const u of perms) {
        const elTR = document.createElement("tr");
        document.querySelector("#avail-ep tbody").appendChild(elTR);

        const elTH = document.createElement("th");
        elTR.appendChild(elTH);
        elTH.textContent = permToName[u];
        if (permToParity[u]) {
            elTH.classList.add("parity-bg");
        }

        for (const d of perms) {
            const ud = `${u}-${d}`;

            const elTD = document.createElement("td");
            elTR.appendChild(elTD);
            if (permToParity[u]!=permToParity[d]) {
                elTD.classList.add("parity-bg");
            }

            if (u!="skip" || d!="skip") {
                const elLabel = document.createElement("label");
                elTD.appendChild(elLabel);
                elLabel.id = `avail-label-${ud}`;
                elLabel.classList.add("checkbox");
                elLabel.style.display = "block";
                elLabel.style.width = "100%";
                elLabel.style.height = "100%";

                const elCheckBox = document.createElement("input");
                elLabel.appendChild(elCheckBox);
                elCheckBox.id = `avail-check-${ud}`;
                elCheckBox.type = "checkbox";
                elCheckBox.addEventListener("input", () => {
                    updateJSON();
                    updateEP();
                });

                const elSlices = document.createElement("span");
                elLabel.appendChild(elSlices);
                elSlices.id = `avail-slices-${ud}`;
                elSlices.style.display = "inline-block";
                elSlices.style.width = "1.5em";
                elSlices.style.textAlign = "right";

                const elSlicesInput = document.createElement("input")
                elTD.appendChild(elSlicesInput);
                elSlicesInput.id = `avail-slices-input-${ud}`;
                elSlicesInput.classList.add("input", "is-small");
                elSlicesInput.style.display = "none";
                elSlicesInput.style.width = "4em";
                elSlicesInput.style.textAlign = "right";
                elSlicesInput.type = "text";
            }
        }
    }
}
makeAvailTable();

elem("edit-slice-numbers").addEventListener("click", () => {
    for (const ud of permsUD) {
        if (ud!="skip-skip") {
            elem(`avail-label-${ud}`).style.display = "none";
            elem(`avail-slices-input-${ud}`).style.display = "inline-flex";
        }
    }
    elem("edit-slice-numbers").style.display = "none";
    elem("edit-slice-numbers-ok").style.display = "inline-flex";
});

elem("edit-slice-numbers-ok").addEventListener("click", () => {
    let ok = true;
    for (const ud of permsUD) {
        if (ud!="skip-skip") {
            const v = +elem(`avail-slices-input-${ud}`).value;
            if (!(Number.isInteger(v) && 1<=v && v<=99)) {
                ok = false;
            }
        }
    }
    if (!ok) {
        elem("edit-slice-numbers-error").textContent = "Slices numbers must be integer and within 1 and 99.";
        return;
    } else {
        elem("edit-slice-numbers-error").textContent = "";
    }

    for (const ud of permsUD) {
        if (ud!="skip-skip") {
            elem(`avail-label-${ud}`).style.display = "inline-flex";
            elem(`avail-slices-input-${ud}`).style.display = "none";

            elem(`avail-slices-${ud}`).textContent = elem(`avail-slices-input-${ud}`).value;
        }
    }
    elem("edit-slice-numbers").style.display = "inline-flex";
    elem("edit-slice-numbers-ok").style.display = "none";

    updateJSON();
    updateEP();
});

elem("parity-ep-position").addEventListener("input", () => {
    updateJSON();
    updateEP();
});

elem("json").addEventListener("input", () => {
    const json = elem("json").value;
    try {
        const data = JSON.parse(json);
        if (!data.eps) {
            throw "No data.eps.";
        }
        for (const perm of permsUD) {
            if (perm!="skip-skip") {
                if (!data.eps[perm]) {
                    throw `No data.eps["${perm}"].`;
                }
                const v = +data.eps[perm][0];
                if (!(Number.isInteger(v) && 1<=v && v<=99)) {
                    throw `data.eps["${perm}"][0] must be integer string and within 1 and 99.`;
                }
            }
        }
        if (data.parityEPPosition!="first" &&
            data.parityEPPosition!="last" &&
            data.parityEPPosition!="dont_care") {
            throw 'data.parityEPPosition must be "first", "last" or "dont_care".';
        }

        for (const ud of permsUD) {
            if (ud!="skip-skip") {
                elem(`avail-slices-${ud}`).textContent = data.eps[ud][0];
                elem(`avail-slices-input-${ud}`).value = data.eps[ud][0];
                elem(`avail-check-${ud}`).checked = data.eps[ud][1];
            }
        }
        elem("parity-ep-position").value = data.parityEPPosition;

        elem("json-error").textContent = "";

        updateEP();
    } catch (e) {
        elem("json-error").textContent = e;
    }
});

elem("reset").addEventListener("click", () => {
    if (confirm("Reset?")) {
        for (const ud of permsUD) {
            if (ud!="skip-skip") {
                elem(`avail-slices-${ud}`).textContent = defaultSettings.eps[ud][0];
                elem(`avail-slices-input-${ud}`).value = defaultSettings.eps[ud][0];
                elem(`avail-check-${ud}`).checked = defaultSettings.eps[ud][1];
            }
        }
        elem("parity-ep-position").value = defaultSettings.parityEPPosition;

        updateJSON();
        updateEP();
    }
});

function makeEPTable() {
    const elTBody = document.querySelector("#ep tbody");

    for (const u of perms) {
        for (const d of perms) {
            const ud = `${u}-${d}`;
            if (ud!="skip-skip") {
                const elTR = document.createElement("tr");
                elTBody.appendChild(elTR);
                if (permToParity[ud]) {
                    elTR.classList.add("parity-bg");
                }

                const elU = document.createElement("th");
                elTR.appendChild(elU);
                elU.textContent = permToName[u];

                const elD = document.createElement("th");
                elTR.appendChild(elD);
                elD.textContent = permToName[d];

                const elImage = document.createElement("td");
                elTR.appendChild(elImage);

                const elCanvas = document.createElement("canvas");
                elImage.appendChild(elCanvas);
                elCanvas.dataset.ud = permToFaceUD[ud];
                render(elCanvas);

                const elCombination = document.createElement("td");
                elTR.appendChild(elCombination);
                elCombination.id = `comb-${ud}`;

                const elLooks = document.createElement("td");
                elTR.appendChild(elLooks);
                elLooks.id = `looks-${ud}`;
                elLooks.style.textAlign = "right";

                const elSlices = document.createElement("td");
                elTR.appendChild(elSlices);
                elSlices.id = `slices-${ud}`;
                elSlices.style.textAlign = "right";

                const el1Look = document.createElement("td");
                elTR.appendChild(el1Look);
                el1Look.id = `1look-${ud}`;
                el1Look.style.textAlign = "right";

                const elDiff = document.createElement("td");
                elTR.appendChild(elDiff);
                elDiff.id = `diff-${ud}`;
                elDiff.style.textAlign = "right";

                const elProb = document.createElement("td");
                elTR.appendChild(elProb);
                elProb.textContent = ""+permToProb[ud];
                elProb.style.textAlign = "right";
            }
        }
    }
}
makeEPTable();

function loadSettings() {
    let data;
    try {
        data = JSON.parse(localStorage["sq1epcomb"]);
    } catch {
        data = defaultSettings;
    }

    for (const ud of permsUD) {
        if (ud!="skip-skip") {
            elem(`avail-slices-${ud}`).textContent = data.eps[ud][0];
            elem(`avail-slices-input-${ud}`).value = data.eps[ud][0];
            elem(`avail-check-${ud}`).checked = data.eps[ud][1];
        }
    }
    elem("parity-ep-position").value = data.parityEPPosition;
}
loadSettings();

function updateEP() {
    // Save settings to localStorage.
    {
        const data = {};
        data.eps = {};
        for (const ud of permsUD) {
            if (ud!="skip-skip") {
                data.eps[ud] = [
                    elem(`avail-slices-${ud}`).textContent,
                    elem(`avail-check-${ud}`).checked,
                ];
            }
        }
        data.parityEPPosition = elem("parity-ep-position").value;
        localStorage["sq1epcomb"] = JSON.stringify(data);
    }

    function apply(sides, perm, d) {
        sides = sides[d%4]+sides[(d+1)%4]+sides[(d+2)%4]+sides[(d+3)%4];

        if (perm=="skip") {
            sides = sides[0]+sides[1]+sides[2]+sides[3];
        } else if (perm=="cwu") {
            sides = sides[0]+sides[3]+sides[1]+sides[2];
        } else if (perm=="ccwu") {
            sides = sides[0]+sides[2]+sides[3]+sides[1];
        } else if (perm=="z") {
            sides = sides[3]+sides[2]+sides[1]+sides[0];
        } else if (perm=="h") {
            sides = sides[2]+sides[3]+sides[0]+sides[1];
        } else if (perm=="opp") {
            sides = sides[2]+sides[1]+sides[0]+sides[3];
        } else if (perm=="adj") {
            sides = sides[0]+sides[2]+sides[1]+sides[3];
        } else if (perm=="cwo") {
            sides = sides[3]+sides[0]+sides[1]+sides[2];
        } else if (perm=="ccwo") {
            sides = sides[1]+sides[2]+sides[3]+sides[0];
        } else if (perm=="w") {
            sides = sides[1]+sides[3]+sides[0]+sides[2];
        } else {
            throw "error";
        }

        sides = sides[(4-d)%4]+sides[(5-d)%4]+sides[(6-d)%4]+sides[(7-d)%4];

        return sides;
    }

    function inverse(perm) {
        return {
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
        }[perm];
    }

    function getPerm(sides) {
        for (const perm of perms) {
            for (let n=0; n<4; n++) {
                const sides2 = apply(sides, perm, n);
                if (sides2=="LFRB") {
                    return perm;
                }
            }
        }
        throw "error";
    }

    const avails = {};
    const costs = {};
    for (const ud of permsUD) {
        if (ud=="skip-skip") {
            avails[ud] = false;
        } else {
            avails[ud] = elem(`avail-check-${ud}`).checked;
            costs[ud] = +elem(`avail-slices-${ud}`).textContent;
        }
    }

    // 0: 未到達
    // 1: 到達済
    // 2: 確定
    const states = {};
    // [dist, looks, parity pos (-1: no parity)]
    const dists = {};
    const combs = {};
    for (const ud of permsUD) {
        states[ud] = 0;
        dists[ud] = [Infinity, 0, 0];
    }

    const comp = (x, y) => {
        if (x[0]<y[0]) {
            return -1;
        } else if (x[0]>y[0]) {
            return 1;
        }
        if (x[1]<y[1]) {
            return -1;
        } else if (x[1]>y[1]) {
            return 1;
        }
        if (x[2]==-1) {
            return -1;
        }
        if (y[2]==-1) {
            return 1;
        }
        if (elem("parity-ep-position").value=="first") {
            if (x[2]<y[2]) {
                return -1;
            }
            if (x[2]>y[2]) {
                return 1;
            }
        }
        if (elem("parity-ep-position").value=="last") {
            if (x[2]<y[2]) {
                return 1;
            }
            if (x[2]>y[2]) {
                return -1;
            }
        }
        return 0;
    };

    states["skip-skip"] = 1;
    dists["skip-skip"] = [0, 0, 0];
    combs["skip-skip"] = [[]];

    while (true) {
        let md = [Infinity, 0, 0];
        let mud = "";
        for (const ud of permsUD) {
            if (states[ud]==1) {
                if (comp(dists[ud], md)<0) {
                    md = dists[ud];
                    mud = ud;
                }
            }
        }

        if (mud=="") {
            break;
        }

        states[mud] = 2;

        const [u, d] = mud.split("-");

        for (const pu of perms) {
            for (const pd of perms) {
                const pud = `${pu}-${pd}`;
                if (avails[pud]) {
                    for (let nu=0; nu<4; nu++) {
                        for (let nd=0; nd<4; nd++) {
                            const u2 = getPerm(apply(apply("LFRB", inverse(u), 0), inverse(pu), nu));
                            const d2 = getPerm(apply(apply("LFRB", inverse(d), 0), inverse(pd), nd));
                            const ud2 = `${u2}-${d2}`;
                            let parityPos = -1;
                            if (dists[mud][2]>=0) {
                                parityPos = dists[mud][2]+1;
                            }
                            if (permToParity[pud]) {
                                parityPos = 0;
                            }
                            const dist2 = [
                                dists[mud][0]+costs[pud],
                                dists[mud][1]+1,
                                parityPos,
                            ];
                            if (comp(dist2, dists[ud2])<0) {
                                states[ud2] = 1;
                                dists[ud2] = dist2;
                                combs[ud2] = [];
                            }
                            if (comp(dist2, dists[ud2])<=0) {
                                for (const comb of combs[mud]) {
                                    if (combs[ud2].length<5) {
                                        const combs2 = [pud, ...comb];
                                        let found = false;
                                        for (const c of combs[ud2]) {
                                            if (c.join("->")==combs2.join("->")) {
                                                found = true;
                                            }
                                        }
                                        if (!found) {
                                            combs[ud2].push(combs2);
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }

    let unsolvable = false;
    let looksSum = 0;
    let looksMax = -Infinity;
    let looksMaxEPs = [];
    let slicesSum = 0;
    let slicesMax = -Infinity;
    let slicesMaxEPs = [];
    let diffSum = 0;
    let diffMax = -Infinity;
    let diffMaxEPs = [];

    for (const ud of permsUD) {
        if (ud!="skip-skip") {
            while (elem(`comb-${ud}`).firstChild) {
                elem(`comb-${ud}`).removeChild(elem(`comb-${ud}`).firstChild);
            }

            if (states[ud]==2) {
                let n = 0;
                for (const comb of combs[ud]) {
                    const elDiv = document.createElement("div");
                    elem(`comb-${ud}`).appendChild(elDiv);

                    if (n<4) {
                        let first = true;
                        for (const c of comb) {
                            if (first) {
                                first = false;
                            } else {
                                const elSpan = document.createElement("span");
                                elDiv.appendChild(elSpan);
                                elSpan.textContent = " → ";
                            }

                            const [u, d] = c.split("-");
                            const elSpan = document.createElement("span");
                            elDiv.appendChild(elSpan);
                            if (permToParity[u]!=permToParity[d]) {
                                elSpan.classList.add("parity-text");
                            }
                            elSpan.style.fontWeight = "bold";
                            elSpan.textContent = `${permToName[u]}/${permToName[d]}`;
                        }
                    } else {
                        elDiv.textContent = "...";
                    }
                    n++;
                }

                const [slices, looks] = dists[ud];
                const slices1Look = +elem(`avail-slices-input-${ud}`).value;
                const diff = slices-slices1Look;
                const prob = permToProb[ud];

                elem(`looks-${ud}`).textContent = ""+looks;
                elem(`slices-${ud}`).textContent = ""+slices;
                elem(`1look-${ud}`).textContent = ""+slices1Look;
                elem(`diff-${ud}`).textContent = ""+diff;

                if (looks>looksMax) {
                    looksMax = looks;
                    looksMaxEPs = [];
                }
                if (looks==looksMax) {
                    looksMaxEPs.push(permToName[ud]);
                }
                looksSum += looks*prob;
                if (slices>slicesMax) {
                    slicesMax = slices;
                    slicesMaxEPs = [];
                }
                if (slices==slicesMax) {
                    slicesMaxEPs.push(permToName[ud]);
                }
                slicesSum += slices*prob;
                if (diff>diffMax) {
                    diffMax = diff;
                    diffMaxEPs = [];
                }
                if (diff==diffMax) {
                    diffMaxEPs.push(permToName[ud]);
                }
                diffSum += diff*prob;
            } else {
                unsolvable = true;
                elem(`comb-${ud}`).textContent = "Unsolvable";
                elem(`looks-${ud}`).textContent = "-";
                elem(`slices-${ud}`).textContent = "-";
                elem(`1look-${ud}`).textContent = "-";
                elem(`diff-${ud}`).textContent = "-";
            }
        }
    }

    if (!unsolvable) {
        if (looksMaxEPs.length>4) {
            looksMaxEPs.length = 4;
            looksMaxEPs.push("...");
        }
        if (slicesMaxEPs.length>4) {
            slicesMaxEPs.length = 4;
            slicesMaxEPs.push("...");
        }
        if (diffMaxEPs.length>4) {
            diffMaxEPs.length = 4;
            diffMaxEPs.push("...");
        }

        elem("stats-looks-average").textContent = (looksSum/576).toFixed(2);
        elem("stats-looks-max").textContent = looksMax;
        elem("stats-looks-max-eps").textContent = `(${looksMaxEPs.join(", ")})`;
        elem("stats-slices-average").textContent = (slicesSum/576).toFixed(2);
        elem("stats-slices-max").textContent = slicesMax;
        elem("stats-slices-max-eps").textContent = `(${slicesMaxEPs.join(", ")})`;
        elem("stats-diff-average").textContent = (diffSum/576).toFixed(2);
        elem("stats-diff-max").textContent = diffMax;
        elem("stats-diff-max-eps").textContent = `(${diffMaxEPs.join(", ")})`;
    } else {
        elem("stats-looks-average").textContent = "Unsolvable";
        elem("stats-looks-max").textContent = "Unsolvable";
        elem("stats-looks-max-eps").textContent = "";
        elem("stats-slices-average").textContent = "Unsolvable";
        elem("stats-slices-max").textContent = "Unsolvable";
        elem("stats-slices-max-eps").textContent = "";
        elem("stats-diff-average").textContent = "Unsolvable";
        elem("stats-diff-max").textContent = "Unsolvable";
        elem("stats-diff-max-eps").textContent = "";
    }

    // EPを追加したときの平均スライス数。
    /*
    const addEPs = [];
    for (const aud of permsUD) {
        if (aud!="skip-skip" && !avails[aud]) {
            // 0: 未到達
            // 1: 到達済
            // 2: 確定
            const states = {};
            const dists = {};
            for (const ud of permsUD) {
                states[ud] = 0;
                dists[ud] = [Infinity];
            }

            states["skip-skip"] = 1;
            dists["skip-skip"] = 0;

            while (true) {
                let md = Infinity;
                let mud = "";
                for (const ud of permsUD) {
                    if (states[ud]==1) {
                        if (dists[ud]<md) {
                            md = dists[ud];
                            mud = ud;
                        }
                    }
                }

                if (mud=="") {
                    break;
                }

                states[mud] = 2;

                const [u, d] = mud.split("-");

                for (const pu of perms) {
                    for (const pd of perms) {
                        const pud = `${pu}-${pd}`;
                        if (avails[pud] || pud==aud) {
                            for (let nu=0; nu<4; nu++) {
                                for (let nd=0; nd<4; nd++) {
                                    const u2 = getPerm(apply(apply("LFRB", inverse(u), 0), inverse(pu), nu));
                                    const d2 = getPerm(apply(apply("LFRB", inverse(d), 0), inverse(pd), nd));
                                    const ud2 = `${u2}-${d2}`;
                                    const dist2 = dists[mud]+costs[`${pu}-${pd}`];
                                    if (dist2<dists[ud2]) {
                                        states[ud2] = 1;
                                        dists[ud2] = dist2;
                                    }
                                }
                            }
                        }
                    }
                }
            }

            let slicesSum = 0;
            for (const ud of permsUD) {
                if (ud!="skip-skip") {
                    if (states[ud]==2) {
                        slicesSum += dists[ud]*permToProb[ud];
                    } else {
                        slicesSum = Infinity;
                    }
                }
            }
            addEPs.push([aud, slicesSum/576]);
        }
    }
    addEPs.sort((x, y) => x[1]-y[1]);

    for (let i=0; i<4; i++) {
        console.log(i, permToName[addEPs[i][0]], addEPs[i][1].toFixed(2));
    }
    */
}
updateEP();

function updateJSON() {
    const data = {};
    data.eps = {};
    for (const ud of permsUD) {
        if (ud!="skip-skip") {
            data.eps[ud] = [
                elem(`avail-slices-${ud}`).textContent,
                elem(`avail-check-${ud}`).checked,
            ];
        }
    }
    data.parityEPPosition = elem("parity-ep-position").value;
    elem("json").value = JSON.stringify(data, null, 2);
}
updateJSON();
