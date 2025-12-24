// Web Audio APIはsecure contextでしか使えない。
const url = new URL(location.href);
if (url.protocol=="http:" && url.hostname!="localhost") {
    url.protocol = "https:";
    location.href = url;
}

function elem(id) {
    return document.getElementById(id);
}

function loadConfig() {
    const configString = localStorage.getItem("browser_timer_display");
    let config;
    if (configString) {
        config = JSON.parse(configString);
        if (!config.deviceID) {
            config.deviceID = "default";
        }
        if (!config.deviceName) {
            config.deviceName = "Default";
        }
    }
    if (!config) {
        config = {
            deviceID: "default",
            deviceName: "Default",
        }
    }
    return config;
}
const config = loadConfig();

let context;
let stream;
let offLED;
let wave = [];
let waveRendered = false;

async function connect() {
    elem("button-connect").classList.add("is-loading");

    try {
        await disconnect();
    } catch (error) {
        elem("button-connect").classList.remove("is-loading");
        throw `Failed to disconnect the previous device. Try reload. Error: ${error}`;
    }

    context = new AudioContext({
        sampleRate: 48000,
    });

    const audio = {
        autoGainControl: false,
        echoCancellation: false,
        noiseSuppression: false,
    };
    if (config.deviceID!="default") {
        audio.deviceId = {exact: config.deviceID};
    }
    try {
        stream = await navigator.mediaDevices.getUserMedia({audio});
    } catch (error) {
        elem("button-connect").classList.remove("is-loading");
        throw `Failed to get ${config.deviceName} (${config.deviceID}). Check permission and that the device exists. Error: ${error}`;
    }
    const source = context.createMediaStreamSource(stream);

    try {
        await context.audioWorklet.addModule("processor.js");
    } catch (error) {
        elem("button-connect").classList.remove("is-loading");
        throw `Failed to load processor.js. Error: ${error}`;
    }
    const node = new AudioWorkletNode(context, "processor");
    node.channelCount = 1;
    node.channelCountMode = "explicit";
    node.channelInterpretation = "speakers";

    node.port.addEventListener("message", e => {
        if (e.data.time) {
            const time = e.data.time;

            let message = [];
            for (let c of time) {
                const code = c.charCodeAt(0);
                if (0x21<=code && code<=0x7e) {
                    message.push(c+" ");
                } else {
                    let m = code.toString(16);
                    while (m.length<2) {
                        m = "0"+m;
                    }
                    message.push(m);
                }
            }
            elem("message").textContent = message.join(" ");

            elem("time-device").textContent = "-:--:---";

            if (time.match(/.\d\d\d\d\d\d.\n\r/)) {
                checksum = 0;
                for (let i=1; i<7; i++) {
                    checksum += +time[i];
                }
                if (checksum+64==time.charCodeAt(7)) {
                    elem("led").dataset.status = time[0]==" "?"progress":"completed";
                    if (offLED) {
                        clearInterval(offLED);
                        offLED = undefined;
                    }
                    offLED = setTimeout(() => {
                        elem("led").dataset.status = "disconnect";
                    }, 1000);

                    elem("timer_m").textContent = time[1]+":";
                    elem("timer_m").style.visibility = time[1]=="0"?"hidden":"visible";
                    elem("timer_s10").textContent = time[2];
                    elem("timer_s10").style.visibility = time[2]=="0"?"hidden":"visible";
                    elem("timer_s1").textContent = time[3];
                    elem("timer_ms").textContent = time.substring(4, 7);

                    elem("time-device").textContent = time[1]+":"+time.substring(2, 4)+"."+time.substring(4, 7);
                }
            }
        }
        if (e.data.wave) {
            wave = e.data.wave;
            waveRendered = false;
            requestAnimationFrame(renderWave);
        }
    });
    node.port.start();

    source.connect(node);

    elem("button-connect").classList.remove("is-loading");
    elem("button-connect").style.display = "none";
    elem("button-disconnect").style.removeProperty("display");
}

async function disconnect() {
    if (context) {
        await context.close();
        context = undefined;
    }
    if (stream) {
        stream.getTracks().forEach(track => track.stop());
        stream = undefined;
    }

    elem("button-connect").style.removeProperty("display");
    elem("button-disconnect").style.display = "none";

    wave = [];
    for (let i=0; i<600; i++) {
        wave.push(0);
    }
    requestAnimationFrame(renderWave);
    elem("message").textContent = "";
    elem("time-device").textContent = "";
}

elem("button-connect").addEventListener("click", async () => {
    elem("error").textContent = "";
    elem("error-device").textContent = "";

    try {
        await connect();
    } catch (error) {
        elem("error").textContent = error;
    }
});

elem("button-disconnect").addEventListener("click", () => {
    disconnect();
    elem("led").dataset.status = "disconnect";
    elem("timer_m").textContent = "-:";
    elem("timer_m").style.visibility = "visible";
    elem("timer_s10").textContent = "-";
    elem("timer_s10").style.visibility = "visible";
    elem("timer_s1").textContent = "-";
    elem("timer_ms").textContent = "---";
});

elem("button-select-device").addEventListener("click", async () => {
    elem("modal-select-device").classList.add("is-active");

    const elDevices = elem("devices");
    while(elDevices.firstChild) {
        elDevices.removeChild(elDevices.firstChild);
    }

    const devices = await navigator.mediaDevices.enumerateDevices();
    let deviceNumber = 0;
    for (const device of devices) {
        if (device.kind=="audioinput" && device.deviceId!="" && device.label!="") {
            deviceNumber++;

            const elOption = document.createElement("option");
            elDevices.appendChild(elOption);
            elOption.value = device.deviceId;
            elOption.textContent = device.label;
            if (device.deviceId==config.deviceID) {
                elOption.selected = true;
            }
        }
    }

    if (deviceNumber==0) {
        elem("error-device").textContent = "No device found. Check permission.";
    }
});

elem("devices").addEventListener("input", async () => {
    const id = elem("devices").value;
    
    let name = "";
    for (let option of elem("devices").childNodes) {
        if (option.value==id) {
            name = option.textContent;
        }
    }

    config.deviceID = id;
    config.deviceName = name;

    localStorage.setItem("browser_timer_display", JSON.stringify(config));

    elem("error").textContent = "";
    elem("error-device").textContent = "";

    try {
        await connect();
    } catch (error) {
        elem("error-device").textContent = error;
    }
});

elem("button-help").addEventListener("click", () => {
    elem("modal-help").classList.add("is-active");
});

elem("button-hide-buttons").addEventListener("click", e => {
    elem("buttons").style.display = "none";
    // document クリックでボタンが再度表示されるのを防ぐ。
    e.stopPropagation();
});

elem("button-fullscreen").addEventListener("click", () => {
    document.documentElement.requestFullscreen({navigationUI: "hide"});
});

document.addEventListener("click", () => {
    if (document.fullscreenElement) {
        document.exitFullscreen();
    }
    elem("buttons").style.removeProperty("display");
});

document.addEventListener("fullscreenchange", () => {
    if (document.fullscreenElement) {
        elem("buttons").style.display = "none";
    } else {
        elem("buttons").style.removeProperty("display");
    }
});

function renderWave() {
    if (!elem("modal-select-device").classList.contains("is-active")) {
        return;
    }

    if (waveRendered) {
        return;
    }
    waveRendered = true;

    const canvas = elem("wave");
    const ctx = canvas.getContext("2d");

    ctx.clearRect(0, 0, 600, 150);

    const dpr = window.devicePixelRatio;
    canvas.width = 600 * dpr;
    canvas.height = 150 * dpr;
    ctx.scale(dpr, dpr);
    canvas.style.width = `${600}px`;
    canvas.style.height = `${150}px`;

    for (let y of [1, 75, 149]) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(534, y);
        ctx.strokeStyle = "#808080";
        ctx.stroke();
    }

    ctx.beginPath();
    ctx.moveTo(0, 75-wave[0]*75);
    for (let x=1; x<wave.length; x++) {
        ctx.lineTo(x, 75-wave[x]*75);
    }
    ctx.strokeStyle = "#f82010";
    ctx.stroke();
}

// https://bulma.io/documentation/components/modal/#javascript-implementation-example
{
    // Functions to open and close a modal
    function closeModal($el) {
        $el.classList.remove('is-active');
    }

    function closeAllModals() {
        (document.querySelectorAll('.modal') || []).forEach(($modal) => {
            closeModal($modal);
        });
    }

    // Add a click event on various child elements to close the parent modal
    (document.querySelectorAll('.modal-background, .modal-close, .modal-card-head .delete, .modal-card-foot .button') || []).forEach(($close) => {
        const $target = $close.closest('.modal');

        $close.addEventListener('click', () => {
            closeModal($target);
        });
    });

    // Add a keyboard event to close all modals
    document.addEventListener('keydown', (event) => {
        if(event.key === "Escape") {
            closeAllModals();
        }
    });
}
