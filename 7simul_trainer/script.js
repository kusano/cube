document.addEventListener("DOMContentLoaded", () => {
    const elmAdjuster = document.getElementById("adjuster");
    const elmCanvas = document.getElementById("canvas");
    const elmScramble = document.getElementById("scramble");
    const elmMemo = document.getElementById("memo");
    const elmTimer = document.getElementById("timer");
    const elmTimerSec = document.getElementById("timer_sec");
    const elmTimerSubsec = document.getElementById("timer_subsec");
    const elmButton = document.getElementById("button");
    const elmMethod = document.getElementById("method");
    const elmLetters = document.getElementById("letters");

    // https://www.youtube.com/watch?v=ZX5ssGWUGb4
    // https://note.com/squid_sushi/n/na9077bf062a4
    // flip: x2
    const methodTommy = [
        "-d+c",
        "-r+dr-L+U",
        "-U+L",
        "-r+d",
        "-U+UR-D+C-ul+l+r",
        "-c+u+d-L+UL-R+DR",
    ].join("\n");

    // https://www.youtube.com/watch?v=HGlJo6yqUkc
    // https://note.com/squid_sushi/n/ne99f854cbd5f
    // flip: y2
    const methodBpaul = [
        "-L+U-l+ul",
        "-u+c",
        "-l+u",
        "-R+D-r+dr",
        "-d+c",
    ].join("\n");

    // flip: x2
    const methodBpaul2 = [
        "-L+U-r+dr",
        "-d+c",
        "-r+d",
        "-u+c",
        "-l+ul-R+D",
    ].join("\n");

    const lettersSigned = "0 1 2 3 4 5 6 -5 -4 -3 -2 -1";
    const lettersUnsigned = "0 1 2 3 4 5 6 7 8 9 10 11";
    const lettersAlphabet = "0 1 2 3 4 5 6 E D C B A";
    const lettersHexadecimal = "0 1 2 3 4 5 6 B C D E F";

    const render = (clocks, flip) => {
        const ctx = elmCanvas.getContext("2d");

        const width = elmAdjuster.clientWidth;
        const height = width/2;

        const dpr = window.devicePixelRatio;
        if (elmCanvas.width!=""+width*dpr) {
            canvas.width = ""+width*dpr;
        }
        if (elmCanvas.height!=""+height*dpr) {
            canvas.height = ""+height*dpr;
        }
        ctx.save();
        ctx.scale(dpr, dpr);
        canvas.style.width = `${width}px`;
        canvas.style.height = `${height}px`;

        ctx.clearRect(0, 0, width, height);

        for (let f=0; f<2; f++) {
            ctx.save();
            ctx.scale(height, height);
            ctx.translate(f, 0);

            // 52 mm
            ctx.translate(.05, .05);
            ctx.scale(.9, .9);

            ctx.beginPath();
            ctx.arc(.5, .5, .5, 0, 2*Math.PI);
            if (f==0) {
                ctx.fillStyle = "#444";
                ctx.fill();
            } else {
                ctx.lineWidth = 1/height/.9;
                ctx.strokeStyle = "#aaa";
                ctx.stroke();
            }

            for (let y=0; y<2; y++) {
                for (let x=0; x<2; x++) {
                    ctx.beginPath();
                    // 30 mm, 3.35 mm
                    ctx.arc(x*.29+.355, y*.29+.355, .032, 0, 2*Math.PI);
                    ctx.fillStyle = f==0?"#fff":"#111";
                    ctx.fill();
                }
            }

            for (let y=0; y<3; y++) {
                for (let x=0; x<3; x++) {
                    ctx.save();

                    // 30 mm, 14.5 mm
                    ctx.translate(x*.29+.065+.005, y*.29+.065+.005);
                    ctx.scale(.28, .28);

                    ctx.beginPath();
                    ctx.arc(.5, .5, .5, 0, 2*Math.PI);
                    ctx.fillStyle = f==0?"#111":"#fff";
                    ctx.fill();

                    if (f==1) {
                        ctx.beginPath();
                        ctx.arc(.5, .5, .5, 0, 2*Math.PI);
                        ctx.lineWidth = 1/height/.9/.28;
                        ctx.strokeStyle = "#ccc";
                        ctx.stroke();
                    }

                    for (let i=0; i<12; i++) {
                        ctx.save();
                        ctx.translate(.5, .5);
                        ctx.rotate(i/12*2*Math.PI);

                        if (
                            flip=="y2" && i==0 ||
                            flip=="x2" && f==0 && i==0 ||
                            flip=="x2" && f==1 && i==6
                        ) {
                            ctx.fillStyle = "#c22";
                            ctx.fillRect(-.045, -.46, .03, .08);
                            ctx.fillRect(.015, -.46, .03, .08);
                        }
                        else if (i%3==0) {
                            ctx.fillStyle = f==0?"#fff":"#111";
                            ctx.fillRect(-.015, -.46, .03, .08);
                        } else {
                            ctx.beginPath();
                            // 11.3 mm, 0.62 mm
                            ctx.arc(.0, -.40, .015, 0,2*Math.PI);
                            ctx.fillStyle = f==0?"#fff":"#111";
                            ctx.fill();
                        }

                        ctx.restore();
                    }

                    ctx.beginPath();
                    // 10 mm
                    ctx.arc(.5, .5, .34, 0, 2*Math.PI);
                    ctx.fillStyle = f==0?"#fff":"#111";
                    ctx.fill();

                    ctx.save();
                    ctx.translate(.5, .5);
                    let angle;
                    if (f==0) {
                        angle = clocks[0][y][x];
                    } else {
                        if (flip=="y2") {
                            angle = clocks[1][y][x];
                        } else {
                            angle = clocks[1][2-y][2-x]+6;
                        }
                    }
                    ctx.rotate(angle/12*2*Math.PI);

                    ctx.beginPath();
                    ctx.moveTo(0, 0);
                    ctx.lineTo(-.05, -.13);
                    ctx.lineTo(0, -.31);
                    ctx.lineTo(.05, -.13);
                    ctx.fillStyle = f==0?"#111":"#fff";
                    ctx.fill();

                    ctx.beginPath();
                    ctx.arc(0, 0, .05, 0, 2*Math.PI);
                    ctx.fillStyle = f==0?"#111":"#fff";
                    ctx.fill();

                    ctx.restore();

                    ctx.restore();
                }
            }

            ctx.restore();
        }
        ctx.restore();
    };

    const makeClocks = scramble => {
        // [f, x, y]
        const T = [
            [[0, 1, 0], [0, 2, 0], [0, 1, 1], [0, 2, 1], [1, 0, 0]], // UR
            [[0, 1, 1], [0, 2, 1], [0, 1, 2], [0, 2, 2], [1, 0, 2]], // DR
            [[0, 0, 1], [0, 1, 1], [0, 0, 2], [0, 1, 2], [1, 2, 2]], // DL
            [[0, 0, 0], [0, 1, 0], [0, 0, 1], [0, 1, 1], [1, 2, 0]], // UL
            [[0, 0, 0], [0, 1, 0], [0, 2, 0], [0, 0, 1], [0, 1, 1], [0, 2, 1], [1, 0, 0], [1, 2, 0]], // U
            [[0, 1, 0], [0, 2, 0], [0, 1, 1], [0, 2, 1], [0, 1, 2], [0, 2, 2], [1, 0, 0], [1, 0, 2]], // R
            [[0, 0, 1], [0, 1, 1], [0, 2, 1], [0, 0, 2], [0, 1, 2], [0, 2, 2], [1, 0, 2], [1, 2, 2]], // D
            [[0, 0, 0], [0, 1, 0], [0, 0, 1], [0, 1, 1], [0, 0, 2], [0, 1, 2], [1, 2, 0], [1, 2, 2]], // L
            [[0, 0, 0], [0, 1, 0], [0, 2, 0], [0, 0, 1], [0, 1, 1], [0, 2, 1], [0, 0, 2], [0, 1, 2], [0, 2, 2], [1, 0, 0], [1, 2, 0], [1, 0, 2], [1, 2, 2]], // ALL
        ];

        const clocks = [[[0, 0, 0], [0, 0, 0], [0, 0, 0]], [[0, 0, 0], [0, 0, 0], [0, 0, 0]]];

        for (let i=0; i<14; i++) {
            for (const t of T[i<9?i:i-9+4]) {
                let [f, x, y] = t;
                let angle = scramble[i];
                if (i<9) {
                    f = 1-f;
                    angle = -angle;
                }
                if (f==1) {
                    angle = -angle;
                }
                clocks[f][y][x] += angle;
            }
        }

        for (let f=0; f<2; f++) {
            for (let y=0; y<3; y++) {
                for (let x=0; x<3; x++) {
                    clocks[f][y][x] = (clocks[f][y][x]%12+12)%12;
                }
            }
        }

        return clocks;
    };

    const analyze = (clocks, flip, method, letters) => {
        const T = {
            "UL": clocks[0][0][0],
            "U":  clocks[0][0][1],
            "UR": clocks[0][0][2],
            "L":  clocks[0][1][0],
            "C":  clocks[0][1][1],
            "R":  clocks[0][1][2],
            "DL": clocks[0][2][0],
            "D":  clocks[0][2][1],
            "DR": clocks[0][2][2],
            "ul": flip=="y2"?clocks[1][0][0]:clocks[1][2][2],
            "u":  flip=="y2"?clocks[1][0][1]:clocks[1][2][1],
            "ur": flip=="y2"?clocks[1][0][2]:clocks[1][2][0],
            "l":  flip=="y2"?clocks[1][1][0]:clocks[1][1][2],
            "c":  flip=="y2"?clocks[1][1][1]:clocks[1][1][1],
            "r":  flip=="y2"?clocks[1][1][2]:clocks[1][1][0],
            "dl": flip=="y2"?clocks[1][2][0]:clocks[1][0][2],
            "d":  flip=="y2"?clocks[1][2][1]:clocks[1][0][1],
            "dr": flip=="y2"?clocks[1][2][2]:clocks[1][0][0],
        };

        const L = letters.trim().split(/ +/);
        if (L.length!=12) {
            return "-";
        }

        const M = [];
        for (const line of method.split(/\n|\r\n/)) {
            if (line=="") {
                continue;
            }
            if (!line.match(/^((\+|-)(UL|U|UR|L|C|R|DL|D|DR|ul|u|ur|l|c|r|dl|d|dr))+$/)) {
                M.push("-");
                continue;
            }

            let m = 0;
            for (let i=0; i<line.length;) {
                let sign = line[i]=="+"?1:-1;
                i++;
                for (let c of ["UL", "UR", "DL", "DR", "U", "L", "C", "R", "D", "ul", "ur", "dl", "dr", "u", "l", "c", "r", "d"]) {
                    if (line.substr(i, c.length)==c) {
                        m += sign*T[c];
                        i += c.length;
                        break;
                    }
                }
            }
            M.push(L[(m%12+12)%12]);
        }
        return M.join(" ");
    };

    const scrambleToString = scramble => {
        const a2s = angle => {
            if (angle<=6) {
                return angle+"+";
            } else {
                return Math.abs(angle-12)+"-";
            }
        };

        return [
            "UR"+a2s(scramble[0]),
            "DR"+a2s(scramble[1]),
            "DL"+a2s(scramble[2]),
            "UL"+a2s(scramble[3]),
            "U"+a2s(scramble[4]),
            "R"+a2s(scramble[5]),
            "D"+a2s(scramble[6]),
            "L"+a2s(scramble[7]),
            "ALL"+a2s(scramble[8]),
            "y2",
            "U"+a2s(scramble[9]),
            "R"+a2s(scramble[10]),
            "D"+a2s(scramble[11]),
            "L"+a2s(scramble[12]),
            "ALL"+a2s(scramble[13]),
        ].join(" ");
    };

    let scramble = Array(14);
    for (let i=0; i<14; i++) {
        scramble[i] = Math.random()*12|0;
    }
    scramble = [5, 3, 3, 2, -5, 1, 5, 1, -1, -3, 2, 3, -4, 1];
    let clocks = makeClocks(scramble);

    let flip;
    let method;
    let letters;

    let customMethod;
    let customFlip;
    let customLetters;

    {
        const d = JSON.parse(localStorage.getItem("7simul_trainer")||"{}");

        customMethod = d["custom_method"]||methodTommy;
        customFlip = d["custom_flip"]||"x2";
        customLetters = d["custom_letters"]||lettersSigned;

        const m = d["method"]||"tommy";
        if (m=="tommy") {
            flip = "x2";
            method = methodTommy;
        }
        if (m=="bpaul") {
            flip = "y2";
            method = methodBpaul;
        }
        if (m=="bpaul2") {
            flip = "x2";
            method = methodBpaul2;
        }
        if (m=="custom") {
            flip = customFlip;
            method = customMethod;
        }

        const l = d["letters"]||"signed";
        if (l=="signed") {
            letters = lettersSigned;
        }
        if (l=="unsigned") {
            letters = lettersUnsigned;
        }
        if (l=="alphabet") {
            letters = lettersAlphabet;
        }
        if (l=="hexadecimal") {
            letters = lettersHexadecimal;
        }
        if (l=="custom") {
            letters = customLetters;
        }

        document.querySelector(`input[type=radio][name=method][value=${m}]`).checked = true;
        document.querySelector(`input[type=radio][name=flip][value=${flip}]`).checked = true;
        elmMethod.value = method;
        if (m!="custom") {
            for (let elem of document.querySelectorAll("input[type=radio][name=flip]")) {
                elem.setAttribute("disabled", "");
            }
            elmMethod.setAttribute("disabled", "");
        }

        document.querySelector(`input[type=radio][name=letters][value=${l}]`).checked = true;
        elmLetters.value = letters;
        if (l!="custom") {
            elmLetters.setAttribute("disabled", "");
        }
    }

    render(clocks, flip);
    elmScramble.innerText = scrambleToString(scramble);
    elmMemo.innerText = analyze(clocks, flip, method, letters);

    window.addEventListener("resize", () => {
        render(clocks, flip);
    });

    let state = "stop";
    let stopFlag = false;
    let start;

    elmButton.addEventListener("click", e => {
        e.preventDefault();

        if (state=="stop") {
            elmButton.classList.add("is-loading");

            const clocks1 = makeClocks(scramble);
            for (let i=0; i<14; i++) {
                scramble[i] = Math.random()*12|0;
            }
            const clocks2 = makeClocks(scramble);

            elmScramble.innerText = scrambleToString(scramble);
            elmMemo.innerText = "? ? ?";
            elmTimerSec.innerText = "0";
            elmTimerSubsec.innerText = "00";

            start = performance.now();

            const animate2 = now => {
                if (stopFlag) {
                    stopFlag = false;
                    return;
                }

                const t = (now-start)|0;
                const sec = (t/1000|0);
                elmTimerSec.innerText = ""+sec;
                let subsec = ""+(((t/10)|0)%100);
                while (subsec.length<2) {
                    subsec = "0"+subsec;
                }
                elmTimerSubsec.innerText = subsec;

                elmTimer.classList.remove("timer_green");
                elmTimer.classList.remove("timer_red");
                if (sec<15) {
                    elmTimer.classList.add("timer_green");
                } else {
                    elmTimer.classList.add("timer_red");
                }

                requestAnimationFrame(animate2);
            };

            const animate1 = now => {
                const t = (now-start)/1000/.3;

                if (t<1) {
                    const t2 = t<.5 ? 2*t*t : 4*t-2*t*t-1;
                    for (let f=0; f<2; f++) {
                        for (let x=0; x<3; x++) {
                            for (let y=0; y<3; y++) {
                                clocks[f][y][x] = (1-t2)*clocks1[f][y][x]+t2*(clocks2[f][y][x]+12);
                            }
                        }
                    }
                    render(clocks, flip);
                    requestAnimationFrame(animate1);
                } else {
                    clocks = makeClocks(scramble);
                    render(clocks, flip);

                    state = "start";
                    elmButton.classList.remove("is-loading");
                    elmButton.innerText = "Stop";
                    requestAnimationFrame(animate2);
                }
            };
            requestAnimationFrame(animate1);
        } else {
            state = "stop";
            stopFlag = true;

            elmMemo.innerText = analyze(clocks, flip, method, letters);

            elmTimer.classList.remove("timer_green");
            elmTimer.classList.remove("timer_red");

            const t = (performance.now()-start)|0;
            const sec = (t/1000|0);
            elmTimerSec.innerText = ""+sec;
            let subsec = ""+(((t/10)|0)%100);
            while (subsec.length<2) {
                subsec = "0"+subsec;
            }
            elmTimerSubsec.innerText = subsec;

            elmButton.innerText = "Start";
        }
    });

    const update = () => {
        render(clocks, flip);
        if (state=="stop") {
            elmMemo.innerText = analyze(clocks, flip, method, letters);
        }

        const d = {};
        for (const elem of document.querySelectorAll("input[type=radio][name=method]")) {
            if (elem.checked) {
                d["method"] = elem.value;
            }
        }
        d["custom_flip"] = customFlip;
        d["custom_method"] = customMethod;
        for (const elem of document.querySelectorAll("input[type=radio][name=letters]")) {
            if (elem.checked) {
                d["letters"] = elem.value;
            }
        }
        d["custom_letters"] = customLetters;
        localStorage.setItem("7simul_trainer", JSON.stringify(d));
    };

    for (const elem of document.querySelectorAll("input[type=radio][name=method]")) {
        elem.addEventListener("change", e => {
            const m = e.target.value;
            if (m=="tommy") {
                flip = "x2";
                method = methodTommy;
            }
            if (m=="bpaul") {
                flip = "y2"
                method = methodBpaul;
            }
            if (m=="bpaul2") {
                flip = "x2";
                method = methodBpaul2;
            }
            if (m=="custom") {
                flip = customFlip;
                method = customMethod;
            }
            document.querySelector(`input[type=radio][name=flip][value=${flip}]`).checked = true;
            elmMethod.value = method;

            if (m=="custom") {
                for (let elem of document.querySelectorAll("input[type=radio][name=flip]")) {
                    elem.removeAttribute("disabled");
                }
                elmMethod.removeAttribute("disabled");
            } else {
                for (let elem of document.querySelectorAll("input[type=radio][name=flip]")) {
                    elem.setAttribute("disabled", "");
                }
                elmMethod.setAttribute("disabled", "");
                elmMethod.classList.remove("is-danger");
            }

            update();
        });
    }

    for (const elem of document.querySelectorAll("input[type=radio][name=flip]")) {
        elem.addEventListener("change", e => {
            customFlip = e.target.value;
            flip = e.target.value;

            update();
        });
    }

    elmMethod.addEventListener("input", e => {
        customMethod = elmMethod.value;
        method = elmMethod.value;

        let ok = true;
        for (const line of elmMethod.value.split(/\n|\r\n/)) {
            if (!line.match(/^((\+|-)(UL|U|UR|L|C|R|DL|D|DR|ul|u|ur|l|c|r|dl|d|dr))*$/)) {
                ok = false;
            }
        }
        if (ok) {
            elmMethod.classList.remove("is-danger");
        } else {
            elmMethod.classList.add("is-danger");
        }

        update();
    });

    for (const elem of document.querySelectorAll("input[type=radio][name=letters]")) {
        elem.addEventListener("change", e => {
            const l = e.target.value;
            if (l=="signed") {
                letters = lettersSigned;
            }
            if (l=="unsigned") {
                letters = lettersUnsigned;
            }
            if (l=="alphabet") {
                letters = lettersAlphabet;
            }
            if (l=="hexadecimal") {
                letters = lettersHexadecimal;
            }
            if (l=="custom") {
                letters = customLetters;
            }
            elmLetters.value = letters;

            if (l=="custom") {
                elmLetters.removeAttribute("disabled");
            } else {
                elmLetters.setAttribute("disabled", "");
                elmLetters.classList.remove("is-danger");
            }

            update();
        });
    }

    elmLetters.addEventListener("input", e => {
        customLetters = elmLetters.value;
        letters = elmLetters.value;

        if (elmLetters.value.trim().split(/ +/).length==12) {
            elmLetters.classList.remove("is-danger");
        } else {
            elmLetters.classList.add("is-danger");
        }

        update();
    });
});
