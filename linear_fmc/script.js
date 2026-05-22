let AESEncrypt;
let AESDecrypt;
{
    // https://csrc.nist.gov/csrc/media/projects/cryptographic-standards-and-guidelines/documents/aes-development/rijndael-ammended.pdf
    // https://github.com/brix/crypto-js/blob/ac34a5a584337b33a2e567f50d96819a96ac44bf/src/aes.js
    // https://en.wikipedia.org/wiki/Advanced_Encryption_Standard

    function mul(x, a) {
        let y = 0;
        while (a>0) {
            if ((a&1)!=0) {
                y ^= x;
            }
            x = x<<1^((x&0x80)!=0?0x11b:0);
            a >>= 1;
        }
        return y;
    }

    const SBox = Array(256);
    {
        function rot(x, s) {
            return x<<s|x>>(8-s);
        }

        let p = 1;
        let q = 1;
        do
        {
            p = mul(p, 3);
            q = mul(q, 0xf6);

            SBox[p] = (q^rot(q, 1)^rot(q, 2)^rot(q, 3)^rot(q, 4)^0x63)&0xff;
        }
        while (p!=1);

        SBox[0] = 0x63;
    }

    const SBoxInv = Array(256);
    for (let i=0; i<256; i++) {
        SBoxInv[SBox[i]] = i;
    }

    function expandKey(key) {
        const rcon = [0x01, 0x02, 0x04, 0x08, 0x10, 0x20, 0x40, 0x80, 0x1b, 0x36];

        const W = Array(16*11);
        for (let i=0; i<16; i++) {
            W[i] = key[i];
        }
        for (let i=16; i<16*11; i+=4) {
            let T = W.slice(i-4, i);
            if (i%16==0) {
                T = [T[1], T[2], T[3], T[0]];
                for (let j=0; j<4; j++) {
                    T[j] = SBox[T[j]];
                }
                T[0] ^= rcon[(i/16|0)-1];
            }
            for (let j=0; j<4; j++) {
                W[i+j] = W[i+j-16]^T[j];
            }
        }

        return W;
    }

    AESEncrypt = (data, offset, key) => {
        const W = expandKey(key);

        function addRoundKey(round) {
            for (let i=0; i<16; i++) {
                data[offset+i] ^= W[round*16+i];
            }
        }

        function subBytes() {
            for (let i=0; i<16; i++) {
                data[offset+i] = SBox[data[offset+i]];
            }
        }

        function shiftRows() {
            const shift = [
                 0,  5, 10, 15,
                 4,  9, 14,  3,
                 8, 13,  2,  7,
                12,  1,  6, 11,
            ];
            const T = data.slice(offset, offset+16);
            for (let i=0; i<16; i++) {
                data[offset+i] = T[shift[i]];
            }
        }

        function mixColumns() {
            for (let i=0; i<4; i++) {
                const T = data.slice(offset+i*4, offset+i*4+4);
                data[offset+i*4  ] = mul(T[0], 2)^mul(T[1], 3)^mul(T[2], 1)^mul(T[3], 1);
                data[offset+i*4+1] = mul(T[0], 1)^mul(T[1], 2)^mul(T[2], 3)^mul(T[3], 1);
                data[offset+i*4+2] = mul(T[0], 1)^mul(T[1], 1)^mul(T[2], 2)^mul(T[3], 3);
                data[offset+i*4+3] = mul(T[0], 3)^mul(T[1], 1)^mul(T[2], 1)^mul(T[3], 2);
            }
        }

        addRoundKey(0);

        for (let i=1; i<10; i++) {
            subBytes();
            shiftRows();
            mixColumns();
            addRoundKey(i);
        }

        subBytes();
        shiftRows();
        addRoundKey(10);
    }

    AESDecrypt = (data, offset, key) => {
        const W = expandKey(key);

        function addRoundKey(round) {
            for (let i=0; i<16; i++) {
                data[offset+i] ^= W[round*16+i];
            }
        }

        function subBytes() {
            for (let i=0; i<16; i++) {
                data[offset+i] = SBoxInv[data[offset+i]];
            }
        }

        function shiftRows() {
            const shift = [
                 0, 13, 10,  7,
                 4,  1, 14, 11,
                 8,  5,  2, 15,
                12,  9,  6,  3,
            ];
            const T = data.slice(offset, offset+16);
            for (let i=0; i<16; i++) {
                data[offset+i] = T[shift[i]];
            }
        }

        function mixColumns() {
            for (let i=0; i<4; i++) {
                const T = data.slice(offset+i*4, offset+i*4+4);
                data[offset+i*4  ] = mul(T[0], 14)^mul(T[1], 11)^mul(T[2], 13)^mul(T[3],  9);
                data[offset+i*4+1] = mul(T[0],  9)^mul(T[1], 14)^mul(T[2], 11)^mul(T[3], 13);
                data[offset+i*4+2] = mul(T[0], 13)^mul(T[1],  9)^mul(T[2], 14)^mul(T[3], 11);
                data[offset+i*4+3] = mul(T[0], 11)^mul(T[1], 13)^mul(T[2],  9)^mul(T[3], 14);
            }
        }

        addRoundKey(10);
        shiftRows();
        subBytes();

        for (let i=9; i>=1; i--) {
            addRoundKey(i);
            mixColumns();
            shiftRows();
            subBytes();
        }

        addRoundKey(0);
    }
}

/*
{
    const data = [0x00, 0x01, 0x02, 0x03, 0x04, 0x05, 0x06, 0x07, 0x08, 0x09, 0x0a, 0x0b, 0x0c, 0x0d, 0x0e, 0x0f];
    const key = [0x00, 0x01, 0x02, 0x03, 0x04, 0x05, 0x06, 0x07, 0x08, 0x09, 0x0a, 0x0b, 0x0c, 0x0d, 0x0e, 0x0f];

    AESEncrypt(data, 0, key);
    console.log(data.map(v=>v.toString(16)).join(" "));
    // a 94 b b5 41 6e f0 45 f1 c3 94 58 c6 53 ea 5a

    AESDecrypt(data, 0, key);
    console.log(data.map(v=>v.toString(16)).join(" "));
    // 0 1 2 3 4 5 6 7 8 9 a b c d e f
}

{
    const data = [0xf2, 0x3e, 0x36, 0x05, 0x32, 0xf4, 0x6b, 0x1c, 0xaf, 0x58, 0xdf, 0xfe, 0xbf, 0x0c, 0x21, 0x73];
    const key = [0xaa, 0x1c, 0xd6, 0x50, 0x4d, 0xd3, 0x7d, 0x8a, 0x6f, 0xdd, 0x07, 0x62, 0x10, 0x77, 0x31, 0x80];

    AESEncrypt(data, 0, key);
    console.log(data.map(v=>v.toString(16)).join(" "));
    // 49 dc 87 db 7 a9 24 d0 d2 8 40 a2 41 88 eb a3

    AESDecrypt(data, 0, key);
    console.log(data.map(v=>v.toString(16)).join(" "));
    // f2 3e 36 5 32 f4 6b 1c af 58 df fe bf c 21 73
}
*/

import * as THREE from "./three.webgpu.min.js";

const width = 128;
const height = 128;

const renderer = new THREE.WebGPURenderer({
    canvas: document.getElementById("cube"),
});

renderer.setPixelRatio(devicePixelRatio);
renderer.setSize(width, height);

const scene = new THREE.Scene();
scene.background = new THREE.Color(0xffffff);

const camera = new THREE.PerspectiveCamera(45, width / height);
camera.position.set(0, 0, 1000);
camera.lookAt(new THREE.Vector3(0, 0, 0));

const geometry = new THREE.BoxGeometry(400, 400, 400);
const material = new THREE.MeshNormalMaterial();
const box = new THREE.Mesh(geometry, material);
scene.add(box);

let quaternion;

function renderCube() {
    if (quaternion) {
        box.setRotationFromQuaternion(quaternion);
    }
    renderer.render(scene, camera);
}

renderer.setAnimationLoop(renderCube);

const cube = new Cube();

let renderNet;
{
    const S = 24;
    const width = 14.5*S;
    const height = 11*S;

    const canvas = document.getElementById("net");
    const ctx = canvas.getContext("2d", {alpha: false});

    const dpr = window.devicePixelRatio;

    canvas.width = width * dpr;
    canvas.height = height * dpr;

    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;

    ctx.scale(dpr, dpr);

    renderNet = () => {
        ctx.fillStyle = "#fff";
        ctx.fillRect(0, 0, width, height);

        for (let f=0; f<6; f++) {
            const fx = [4, .5, 4, 7.5, 11, 4][f];
            const fy = [.5, 4, 4, 4, 4, 7.5][f];

            for (let y=0; y<3; y++) {
                for (let x=0; x<3; x++) {
                    ctx.beginPath();
                    ctx.rect((fx+x)*S, (fy+y)*S, S, S);
                    ctx.fillStyle = {
                        "U": "#fff",
                        "D": "#ff0",
                        "F": "#0f0",
                        "B": "#00f",
                        "R": "#f00",
                        "L": "#f80",
                    }[cube.faces[f*9+y*3+x]];
                    ctx.fill();
                    ctx.lineWidth = 0.5;
                    ctx.stroke();
                }
            }

            ctx.beginPath();
            ctx.rect(fx*S, fy*S, S*3, S*3);
            ctx.lineWidth = 1;
            ctx.stroke();
        }
    };
}
renderNet();

// https://github.com/cs0x7f/cstimer/blob/8a20d7114623e5d9d9cbdeed60ac335729c56750/src/js/hardware/gancube.js
const SERVICE_GAN_V4 = "00000010-0000-fff7-fff6-fff5fff4fff0";
const CHAR_GAN_V4_READ = "0000fff6-0000-1000-8000-00805f9b34fb";
const CHAR_GAN_V4_WRITE = "0000fff5-0000-1000-8000-00805f9b34fb";

function elem(id) {
    return document.getElementById(id);
}

function move(m) {
    if (!startTime) {
        return;
    }

    cube.move(m);
    renderNet();

    if (solution.length==0) {
        solution.push(m);
    } else {
        const p = solution.pop();
        if (p[0]==m[0]) {
            function num(x) {
                if (x[1]=="0") {
                    return 0;
                }
                if (x.length==1) {
                    return 1;
                }
                if (x[1]=="2") {
                    return 2;
                }
                if (x[1]=="'") {
                    return 3;
                }
            }

            let pn = num(p);
            let mn = num(m);
            let n = (pn+mn)%4;
            solution.push(m[0]+["0", "", "2", "'"][n]);
        } else {
            solution.push(p);
            solution.push(m);
        }
    }
    elem("solution").textContent = solution.join(" ");

    let count = 0;
    for (const m of solution) {
        if (m[1]!="0") {
            count++;
        }
    }
    elem("solution_count").textContent = `(${count})`;

    if (cube.faces.join("")==Cube.initialFaces.join("")) {
        startTime = undefined;
        cancelAnimationFrame(requestID);
    }
}

function parseData(data) {
    const mode = data[0];
    const len = data[1];
    const body = data.slice(2, len+2);

    let log;
    if (mode==0x01) {
        // Move
        const time = body[3]*(1<<24)|body[2]<<16|body[1]<<8|body[0];
        const count = body[5]<<8|body[4];
        const rev = body[6]>>6&1;
        const axis = body[6]&0x3f;
        const axisIndex = [1, 2, 4, 8, 16, 32].indexOf(axis);
        if (axisIndex==-1) {
            log = `Invalid move axis: ${body.map(v=>v.toString(16)).join(" ")}`;
        } else {
            const m = "DUBFLR"[axisIndex]+["","'"][rev];
            move(m);
            log = `Move: time=${time}, count=${count}, move=${m}`;
        }
    } else if (mode==0xd1) {
        // Move history.
        // TODO
        log = `Move history: ${body.map(v=>v.toString(16)).join(" ")}`;
    } else if (mode==0xed) {
        // Cube state.
        const count = body[0]<<8|body[1];
        const CE = body.slice(2, 14);
        //log = `Cube state: count=${count}, corner&edge=${CE.map(v=>v.toString(16)).join(" ")}`;
    } else if (mode==0xec) {
        // Gyro.
        function float(index) {
            let w = body[index*2]<<8|body[index*2+1];
            return (1-(w>>15)*2)*((w&0x7fff)/0x8000);
        }
        quaternion = new THREE.Quaternion(float(0), float(3), float(2), float(1));
    } else if (mode==0xef) {
        // Battery.
        // TODO
        log = `Battery: ${body.map(v=>v.toString(16)).join(" ")}`;
    } else if (mode==0xf5) {
        log = `Hardware (f5): ${body.map(v=>v.toString(16)).join(" ")}`;
    } else if (mode==0xf6) {
        log = `Hardware (f6): ${body.map(v=>v.toString(16)).join(" ")}`;
    } else if (mode==0xfa) {
        // Product date.
        const year = body[2]<<8|body[1];
        const month = body[3];
        const day = body[4];
        log = `Product date: ${year}/${month}/${day}`;
    } else if (mode==0xfc) {
        // Hardware name.
        const name = body.slice(1).map(String.fromCharCode).join("");
        log = `Hardware name: ${name}`;
    } else if (mode==0xfd) {
        // Software version.
        const major = body[1]>>4;
        const minor = body[1]&0x0f;
        log = `Software version: ${major}.${minor}`;
    } else if (mode==0xfe) {
        // Hardware version.
        const major = body[1]>>4;
        const minor = body[1]&0x0f;
        log = `Hardware version: ${major}.${minor}`;
    } else if (mode==0xf6) {
        log = `Hardware (ff): ${body.map(v=>v.toString(16)).join(" ")}`;
    } else {
        log = `Invalid mode: ${data.map(v=>v.toString(16)).join(" ")}`;
    }

    if (log) {
        console.log(log);
    }
}

elem("connect").addEventListener("click", async () => {
    elem("error").textContent = "";
    elem("connect").setAttribute("disabled", "");

    try {
        if (!navigator.bluetooth) {
            throw "Bluetooth is not available";
        }
        const avail = navigator.bluetooth.getAvailability();
        if (!avail) {
            throw "Bluetooth is not available";
        }

        const device = await navigator.bluetooth.requestDevice({
            filters: [
                {namePrefix: "GANi4"},
            ],
            optionalServices: [
                SERVICE_GAN_V4,
            ],
        });
        await device.gatt.connect();

        const services = await device.gatt.getPrimaryServices();
        let serviceV4;
        for (const service of services) {
            if (service.uuid==SERVICE_GAN_V4) {
                serviceV4 = service;
            }
        }
        if (!serviceV4) {
            throw `Service GAN v4 (${SERVICE_GAN_V4}) not found`;
        }

        const chars = await serviceV4.getCharacteristics();
        let charV4Read;
        let charV4Write;
        for (const char of chars) {
            if (char.uuid==CHAR_GAN_V4_READ) {
                charV4Read = char;
            }
            if (char.uuid==CHAR_GAN_V4_WRITE) {
                charV4Write = char;
            }
        }
        if (!charV4Read) {
            throw `Characteristics GAN v4 read (${CHAR_GAN_V4_READ}) not found`;
        }
        if (!charV4Write) {
            throw `Characteristics GAN v4 write (${CHAR_GAN_V4_WRITE}) not found`;
        }

        const mac = elem("mac").value;
        const macMatch = mac.match(/^([0-9a-fA-F][0-9a-fA-F]):([0-9a-fA-F][0-9a-fA-F]):([0-9a-fA-F][0-9a-fA-F]):([0-9a-fA-F][0-9a-fA-F]):([0-9a-fA-F][0-9a-fA-F]):([0-9a-fA-F][0-9a-fA-F])$/);
        if (!macMatch) {
            throw "MAC address format is invalid";
        }

        const key = [0x01, 0x02, 0x42, 0x28, 0x31, 0x91, 0x16, 0x07, 0x20, 0x05, 0x18, 0x54, 0x42, 0x11, 0x12, 0x53];
        const iv = [0x11, 0x03, 0x32, 0x28, 0x21, 0x01, 0x76, 0x27, 0x20, 0x95, 0x78, 0x14, 0x32, 0x12, 0x02, 0x43];
        for (let i=0; i<6; i++) {
            const v = parseInt(macMatch[6-i], 16);
            key[i] = (key[i]+v)%255;
            iv[i] = (iv[i]+v)%255;
        }

        await charV4Read.startNotifications();

        charV4Read.addEventListener("characteristicvaluechanged", () => {
            const value = Array.from(new Uint8Array(charV4Read.value.buffer));
            if (value.length>16) {
                AESDecrypt(value, value.length-16, key);
                for (let i=0; i<16; i++) {
                    value[value.length-16+i] ^= iv[i];
                }
            }
            AESDecrypt(value, 0, key);
            for (let i=0; i<16; i++) {
                value[i] ^= iv[i];
            }

            parseData(value);
        });


        for (const data of [
            [0xdf, 0x03], // hardware info
            [0xdd, 0x04, 0x00, 0xed], // facelets
            [0xdd, 0x04, 0x00, 0xef], // battery
        ]) {
            const req = Array(20);
            for (let i=0; i<20; i++) {
                if (i<data.length) {
                    req[i] = data[i];
                } else {
                    req[i] = 0;
                }
            }

            for (let i=0; i<16; i++) {
                req[i] ^= iv[i];
            }
            AESEncrypt(req, 0, key);

            for (let i=0; i<16; i++) {
                req[i+4] ^= iv[i];
            }
            AESEncrypt(req, 4, key);

            await charV4Write.writeValue(new Uint8Array(req));
        }
    } catch (message) {
        elem("error").textContent = message;
        elem("connect").removeAttribute("disabled");
    }
});

elem("reset").addEventListener("click", () => {
    cube.reset();
    if (elem("scramble").value!="") {
        for (const move of elem("scramble").value.split(" ")) {
            cube.move(move);
        }
    }
    renderNet();
});

let startTime;
let requestID;
let solution = [];

elem("start").addEventListener("click", () => {
    startTime = new Date().getTime()/1000;
    requestID = requestAnimationFrame(animateTimer);
    solution = [];
    elem("solution").textContent = "";
    elem("solution_count").textContent = "";
});

function animateTimer() {
    if (!startTime) {
        return;
    }

    let time = (120-((new Date().getTime()/1000)-startTime))*1000|0;
    if (time<0) {
        time = 0;
    }

    const minute = time/60000|0;
    const sec = (time/1000|0)%60;
    const msec = time%1000;

    function pad(x, d) {
        let s = ""+x;
        while (s.length<d) {
            s = "0"+s;
        }
        return s;
    }

    elem("timer").textContent = `${minute}:${pad(sec, 2)}.${pad(msec, 3)}`;

    if (time>0) {
        requestID = requestAnimationFrame(animateTimer);
    } else {
        startTime = undefined;
    }
}
