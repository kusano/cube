document.addEventListener("DOMContentLoaded", () => {
    const context = new AudioContext();
    let buffer;
    const sources = [];
    let startTime;
    let animateID;

    (async function load() {
        const res = await fetch("voice.mp3");
        const arrayBuffer = await res.arrayBuffer();
        buffer = await context.decodeAudioData(arrayBuffer);

        document.getElementById("start").classList.remove("is-loading");
        document.getElementById("start").removeAttribute("disabled");
        document.getElementById("start").focus();
        document.getElementById("ready").classList.remove("is-loading");
        document.getElementById("ready").removeAttribute("disabled");
    })();

    function stop() {
        for (const source of sources) {
            source.stop();
        }
        startTime = undefined;
        if (animateID!==undefined) {
            cancelAnimationFrame(animateID);
        }
        document.getElementById("stop").setAttribute("disabled", "");
        render();
    }

    function start() {
        stop();

        startTime = context.currentTime;

        function add(when, offset, duration) {
            const source = new AudioBufferSourceNode(context, {buffer});
            source.connect(context.destination);
            source.start(startTime+when, offset, duration);
            sources.push(source);
        }

        add(0, 7, 0.5);
        if (document.querySelector('input[name="language"][value="japanese"]').checked) {
            add(8-.1, 2, 1);
            add(12, 3, 1);
        } else {
            add(8, 5, 1);
            add(12, 6, 1);
        }
        add(15, 8, 0.5);
        add(17, 7, 0.5);

        animateID = requestAnimationFrame(animate);

        document.getElementById("stop").removeAttribute("disabled");
    }

    function render() {
        const time = startTime===undefined?0:context.currentTime-startTime;
        if (time>20) {
            time = 20;
        }

        const ms = (time*1000+.5)|0;
        let timeText = ""+(ms%1000);
        while (timeText.length<3) {
            timeText = "0"+timeText;
        }
        timeText = (ms/1000|0)+"."+timeText+" s";
        document.getElementById("time").textContent = timeText;

        const canvas = document.getElementById("bar");
        const ctx = canvas.getContext("2d");
        ctx.reset();
        const dpr = devicePixelRatio;
        const rect = canvas.getBoundingClientRect();
        canvas.width = rect.width*dpr;
        canvas.height = rect.height*dpr;
        ctx.scale(dpr, dpr);

        const W = rect.width;
        const H = rect.height;

        ctx.strokeStyle = "#20e020";
        ctx.beginPath();
        ctx.moveTo(0.02*W, 0);
        ctx.lineTo(0.02*W, H);
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo((8/20*0.96+0.02)*W, 0);
        ctx.lineTo((8/20*0.96+0.02)*W, H);
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo((12/20*0.96+0.02)*W, 0);
        ctx.lineTo((12/20*0.96+0.02)*W, H);
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(0.02*W, H/2);
        ctx.lineTo((15/20*0.96+0.02)*W, H/2);
        ctx.stroke();

        ctx.strokeStyle = "#e0e020";
        ctx.beginPath();
        ctx.moveTo((15/20*0.96+0.02)*W, 0);
        ctx.lineTo((15/20*0.96+0.02)*W, H);
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo((15/20*0.96+0.02)*W, H/2);
        ctx.lineTo((17/20*0.96+0.02)*W, H/2);
        ctx.stroke();

        ctx.strokeStyle = "#c04040";
        ctx.beginPath();
        ctx.moveTo((17/20*0.96+0.02)*W, 0);
        ctx.lineTo((17/20*0.96+0.02)*W, H);
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo((17/20*0.96+0.02)*W, H/2);
        ctx.lineTo((20/20*0.96+0.02)*W, H/2);
        ctx.stroke();

        if (time>0) {
            ctx.beginPath();
            ctx.rect(0.02*W, 0.2*H, Math.min(time, 15)/20*0.96*W, 0.6*H);
            ctx.fillStyle = "#20e020";
            ctx.fill();
        }

        if (time>15) {
            ctx.beginPath();
            ctx.rect((15/20*0.96+0.02)*W, 0.2*H, (Math.min(time, 17)-15)/20*0.96*W, 0.6*H);
            ctx.fillStyle = "#e0e020";
            ctx.fill();
        }

        if (time>17) {
            ctx.beginPath();
            ctx.rect((17/20*0.96+0.02)*W, 0.2*H, (Math.min(time, 20)-17)/20*0.96*W, 0.6*H);
            ctx.fillStyle = "#c04040";
            ctx.fill();
        }
    }
    render();

    function loadConfig() {
        const config = JSON.parse(localStorage.getItem("inspection_timer")||"{}");
        if ((config.language||"japanese")=="japanese") {
            document.querySelector('input[name="language"][value="japanese"]').checked = true;
        } else {
            document.querySelector('input[name="language"][value="english"]').checked = true;
        }
    }
    loadConfig();

    function saveConfig() {
        const config = {
            version: 1,
        };
        if (document.querySelector('input[name="language"][value="japanese"]').checked) {
            config.language = "japanese";
        } else {
            config.language = "english";
        }
        localStorage.setItem("inspection_timer", JSON.stringify(config));
    }

    for (const elem of document.getElementsByName("language")) {
        elem.addEventListener("change", ()=>{
            saveConfig();
        });
    }

    function animate() {
        if (context.currentTime-startTime>=20) {
            stop();
            return;
        }

        render();
        animateID = requestAnimationFrame(animate);
    }

    document.getElementById("start").addEventListener("click", () => {
        start();
    });

    document.body.addEventListener("keyup", e => {
        if (e.key==" " && e.target==document.body) {
            start();
        }
    });

    document.getElementById("ready").addEventListener("click", () => {
        stop();

        const source = new AudioBufferSourceNode(context, {buffer});
        source.connect(context.destination);
        if (document.querySelector('input[name="language"][value="japanese"]').checked) {
            source.start(0, 0, 1.8);
        } else {
            source.start(0, 4, 1);
        }
        sources.push(source);
    });

    document.getElementById("stop").addEventListener("click", () => {
        stop();
    });
});
