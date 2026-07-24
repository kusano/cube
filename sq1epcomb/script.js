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
    }
};

function elem(id) {
    return document.getElementById(id);
}

function makeAvailTable() {
    const elTBody = document.querySelector("#avail-ep tbody");

    for (const u of perms) {
        const elTR = document.createElement("tr");
        elTBody.appendChild(elTR);

        const elTH = document.createElement("th");
        elTR.appendChild(elTH);
        elTH.textContent = permToName[u];

        for (const d of perms) {
            const elTD = document.createElement("td");
            elTR.appendChild(elTD);

            if (u!="skip" || d!="skip") {
                const elLabel = document.createElement("label");
                elTD.appendChild(elLabel);
                elLabel.classList.add("checkbox");
                elLabel.style.display = "block";
                elLabel.style.width = "100%";
                elLabel.style.height = "100%";

                const elCheckBox = document.createElement("input");
                elLabel.appendChild(elCheckBox);
                elCheckBox.id = `avail-check-${u}-${d}`;
                elCheckBox.type = "checkbox";
                elCheckBox.addEventListener("input", () => {
                    updateEP();
                });

                const elSlices = document.createElement("span");
                elLabel.appendChild(elSlices);
                elSlices.id = `avail-slices-${u}-${d}`;

                const elSlicesInput = document.createElement("input")
                elLabel.appendChild(elSlicesInput);
                elSlicesInput.id = `avail-slices-input-${u}-${d}`;
                elSlicesInput.classList.add("input", "is-small");
                elSlicesInput.style.display = "none";
                elSlicesInput.type = "text";
            }
        }
    }
}
makeAvailTable();

function makeEPTable() {
    const elTBody = document.querySelector("#ep tbody");

    for (const u of perms) {
        for (const d of perms) {
            if (u!="skip" || d!="skip") {
                const elTR = document.createElement("tr");
                elTBody.appendChild(elTR);

                const elU = document.createElement("th");
                elTR.appendChild(elU);
                elU.textContent = permToName[u];

                const elD = document.createElement("th");
                elTR.appendChild(elD);
                elD.textContent = permToName[d];

                const elImage = document.createElement("td");
                elTR.appendChild(elImage);

                const elCombination = document.createElement("td");
                elTR.appendChild(elCombination);
                elCombination.id = `comb-${u}-${d}`;

                const elLooks = document.createElement("td");
                elTR.appendChild(elLooks);
                elLooks.id = `looks-${u}-${d}`;

                const elSlices = document.createElement("td");
                elTR.appendChild(elSlices);
                elSlices.id = `slices-${u}-${d}`;

                const el1Look = document.createElement("td");
                elTR.appendChild(el1Look);
                el1Look.id = `1look-${u}-${d}`;

                const elDiff = document.createElement("td");
                elTR.appendChild(elDiff);
                elDiff.id = `diff-${u}-${d}`;

                const elProb = document.createElement("td");
                elTR.appendChild(elProb);
                elProb.textContent = ""+permToProb[u]*permToProb[d];
            }
        }
    }
}
makeEPTable();

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
                    // TODO: ud
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
    /*


    const ud = canvas.dataset.ud;

  const C = 16;

  canvas.style.width = `${W}px`;
  canvas.style.height = `${H}px`;

  ctx.lineWidth = 0.5;
  ctx.strokeStyle = "#303030";
  */
}
render(document.getElementById("test"));

// TODO: load config
for (const u of perms) {
    for (const d of perms) {
        if (u!="skip" || d!="skip") {
            if (defaultSettings.eps[`${u}-${d}`][1]) {
                elem(`avail-check-${u}-${d}`).checked = true;
            }
            elem(`avail-slices-${u}-${d}`).textContent = defaultSettings.eps[`${u}-${d}`][0];
            elem(`avail-slices-input-${u}-${d}`).value = defaultSettings.eps[`${u}-${d}`][0];
        }
    }
}

function updateEP() {
    // TODO: validation

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
                    return inverse(perm);
                }
            }
        }
        throw "error";
    }

    const UD = [];
    for (const u of perms) {
        for (const d of perms) {
            UD.push(`${u}-${d}`);
        }
    }

    const avails = {};
    const costs = {};
    for (const ud of UD) {
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
    // [dist, looks, parity pos]
    const dists = {};
    const combs = {};
    for (const ud of UD) {
        states[ud] = 0;
        dists[ud] = [Infinity, 0, 0];
    }

    const comp = (x, y) => {
        for (let i=0; i<3; i++) {
            if (x[i]<y[i]) {
                return -1;
            } else if (x[i]>y[i]) {
                return 1;
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
        for (const ud of UD) {
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
                if (avails[`${pu}-${pd}`]) {
                    const reached = {};

                    for (let nu=0; nu<4; nu++) {
                        for (let nd=0; nd<4; nd++) {
                            const u2 = getPerm(apply(apply("LFRB", inverse(u), 0), pu, nu));
                            const d2 = getPerm(apply(apply("LFRB", inverse(d), 0), pd, nd));
                            const ud2 = `${u2}-${d2}`;

                            if (!reached[ud2]) {
                                reached[ud2] = true;

                                const dist2 = [
                                    dists[mud][0]+costs[`${pu}-${pd}`],
                                    dists[mud][1]+1,
                                    0,
                                ];
                                if (comp(dist2, dists[ud2])<0) {
                                    states[ud2] = 1;
                                    dists[ud2] = dist2;
                                    combs[ud2] = [];
                                }
                                if (comp(dist2, dists[ud2])<=0) {
                                    for (const comb of combs[mud]) {
                                        if (combs[ud2].length<5) {
                                            combs[ud2].push([...comb, `${pu}-${pd}`]);
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

    for (const ud of UD) {
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
                        elDiv.textContent = comb.map(
                            c => c.split("-").map(x => permToName[x]).join("/")
                        ).join(" → ");
                    } else {
                        elDiv.textContent = "...";
                    }
                    n++;
                }

                elem(`looks-${ud}`).textContent = ""+dists[ud][1];
                elem(`slices-${ud}`).textContent = ""+dists[ud][0];
                const look1 = +elem(`avail-slices-input-${ud}`).value;
                elem(`1look-${ud}`).textContent = ""+look1;
                elem(`diff-${ud}`).textContent = ""+(dists[ud][0]-look1);
            }
        }
    }
}
updateEP();
