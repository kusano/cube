import * as THREE from "./three.module.min.js"

const renderer = new THREE.WebGLRenderer({
    antialias: true,
});
document.getElementById("container").appendChild(renderer.domElement);

const materials = {}
materials["U"] = new THREE.MeshBasicMaterial({color: 0xffffff});
materials["D"] = new THREE.MeshBasicMaterial({color: 0xffff00});
materials["R"] = new THREE.MeshBasicMaterial({color: 0xff0000});
materials["L"] = new THREE.MeshBasicMaterial({color: 0xff8000});
materials["F"] = new THREE.MeshBasicMaterial({color: 0x00ff00});
materials["B"] = new THREE.MeshBasicMaterial({color: 0x0000ff});
materials["b"] = new THREE.MeshBasicMaterial({color: 0x000000});
const materialDesk = new THREE.MeshBasicMaterial({color: 0xffffff});
materialDesk.transparent = true;
materialDesk.opacity = 0.9;

const geometryFace = new THREE.PlaneGeometry(0.60, 0.60);
const geometryPiece = new THREE.BoxGeometry(0.666, 0.666, 0.666);
const geometryDesk = new THREE.PlaneGeometry(10, 10, 10, 10);

const scene = new THREE.Scene();
scene.background = new THREE.Color().setHex(0xffffff);

let width, height, camera, moveSize;
let speed = 2.0;
let sound = false;

{
    const sp = localStorage.getItem("kachakachacube_speed");
    if (sp) {
        speed = Number(sp);
    }
    const so = localStorage.getItem("kachakachacube_sound");
    if (so) {
        sound = so!="false";
    }
}

/*
F:
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
function render(F, move, t) {
    const faces = Array(54);
    // U
    for (let y=0; y<3; y++) {
        for (let x=0; x<3; x++) {
            const m = new THREE.Mesh(geometryFace, materials[F[y*3+x]]);
            m.position.x = 2/3*x-2/3;
            m.position.y = 1.0;
            m.position.z = 2/3*y-2/3;
            m.rotation.x = -Math.PI/2;
            faces[y*3+x] = m;
        }
    }
    // L
    for (let y=0; y<3; y++) {
        for (let x=0; x<3; x++) {
            const m = new THREE.Mesh(geometryFace, materials[F[9+y*3+x]]);
            m.position.x = -1;
            m.position.y = -2/3*y+2/3;
            m.position.z = 2/3*x-2/3;
            m.rotation.y = -Math.PI/2;
            faces[9+y*3+x] = m;
        }
    }
    // F
    for (let y=0; y<3; y++) {
        for (let x=0; x<3; x++) {
            const m = new THREE.Mesh(geometryFace, materials[F[18+y*3+x]]);
            m.position.x = 2/3*x-2/3;
            m.position.y = -2/3*y+2/3;
            m.position.z = 1;
            faces[18+y*3+x] = m;
        }
    }
    // R
    for (let y=0; y<3; y++) {
        for (let x=0; x<3; x++) {
            const m = new THREE.Mesh(geometryFace, materials[F[27+y*3+x]]);
            m.position.x = 1;
            m.position.y = -2/3*y+2/3;
            m.position.z = -2/3*x+2/3;
            m.rotation.y = Math.PI/2;
            faces[27+y*3+x] = m;
        }
    }
    // B
    for (let y=0; y<3; y++) {
        for (let x=0; x<3; x++) {
            const m = new THREE.Mesh(geometryFace, materials[F[36+y*3+x]]);
            m.position.x = -2/3*x+2/3;
            m.position.y = -2/3*y+2/3;
            m.position.z = -1;
            m.rotation.y = Math.PI;
            faces[36+y*3+x] = m;
        }
    }
    // D
    for (let y=0; y<3; y++) {
        for (let x=0; x<3; x++) {
            const m = new THREE.Mesh(geometryFace, materials[F[45+y*3+x]]);
            m.position.x = 2/3*x-2/3;
            m.position.y = -1;
            m.position.z = -2/3*y+2/3;
            m.rotation.x = Math.PI/2;
            faces[45+y*3+x] = m;
        }
    }

    function f1(t) {
        if (t<0.5) {
            return t*t*2;
        } else {
            return 1-(1-t)*(1-t)*2;
        }
    }

    function f2(t) {
        if (t<0.5) {
            return f1(t*2);
        } else {
            return f1((1-t)*2);
        }
    }

    const cube = new THREE.Group();
    if (move[0]=="U") {cube.rotation.x = f2(t)*Math.PI/2*0.01;}
    if (move[0]=="D") {cube.rotation.x = -f2(t)*Math.PI/2*0.01;}
    if (move[0]=="R") {cube.rotation.y = -f2(t)*Math.PI/2*0.01;}
    if (move[0]=="L") {cube.rotation.y = f2(t)*Math.PI/2*0.01;}
    if (move[0]=="F") {cube.rotation.x = -f2(t)*Math.PI/2*0.01;}
    if (move[0]=="B") {cube.rotation.x = f2(t)*Math.PI/2*0.01;}

    const moved = new THREE.Group();
    if (move=="U") {moved.rotation.y = -f1(t)*Math.PI/2};
    if (move=="U2") {moved.rotation.y = -f1(t)*Math.PI};
    if (move=="U'") {moved.rotation.y = f1(t)*Math.PI/2};
    if (move=="D") {moved.rotation.y = f1(t)*Math.PI/2};
    if (move=="D2") {moved.rotation.y = f1(t)*Math.PI};
    if (move=="D'") {moved.rotation.y = -f1(t)*Math.PI/2};
    if (move=="R") {moved.rotation.x = -f1(t)*Math.PI/2};
    if (move=="R2") {moved.rotation.x = -f1(t)*Math.PI};
    if (move=="R'") {moved.rotation.x = f1(t)*Math.PI/2};
    if (move=="L") {moved.rotation.x = f1(t)*Math.PI/2};
    if (move=="L2") {moved.rotation.x = f1(t)*Math.PI};
    if (move=="L'") {moved.rotation.x = -f1(t)*Math.PI/2};
    if (move=="F") {moved.rotation.z = -f1(t)*Math.PI/2};
    if (move=="F2") {moved.rotation.z = -f1(t)*Math.PI};
    if (move=="F'") {moved.rotation.z = f1(t)*Math.PI/2};
    if (move=="B") {moved.rotation.z = f1(t)*Math.PI/2};
    if (move=="B2") {moved.rotation.z = f1(t)*Math.PI};
    if (move=="B'") {moved.rotation.z = -f1(t)*Math.PI/2};
    cube.add(moved);

    for (let x=0; x<3; x++) {
        for (let y=0; y<3; y++) {
            for (let z=0; z<3; z++) {
                const m = new THREE.Mesh(geometryPiece, materials["b"]);
                m.position.x = 2/3*x-2/3;
                m.position.y = 2/3*y-2/3;
                m.position.z = 2/3*z-2/3;
                m.rotation.x = Math.PI/2;

                const g = new THREE.Group();
                g.add(m);
                if (x==0 && y==0 && z==0) {
                    g.add(faces[15]);
                    g.add(faces[44]);
                    g.add(faces[51]);
                }
                if (x==0 && y==0 && z==1) {
                    g.add(faces[16]);
                    g.add(faces[48]);
                }
                if (x==0 && y==0 && z==2) {
                    g.add(faces[17]);
                    g.add(faces[24]);
                    g.add(faces[45]);
                }
                if (x==0 && y==1 && z==0) {
                    g.add(faces[12]);
                    g.add(faces[41]);
                }
                if (x==0 && y==1 && z==1) {
                    g.add(faces[13]);
                }
                if (x==0 && y==1 && z==2) {
                    g.add(faces[14]);
                    g.add(faces[21]);
                }
                if (x==0 && y==2 && z==0) {
                    g.add(faces[0]);
                    g.add(faces[9]);
                    g.add(faces[38]);
                }
                if (x==0 && y==2 && z==1) {
                    g.add(faces[3]);
                    g.add(faces[10]);
                }
                if (x==0 && y==2 && z==2) {
                    g.add(faces[6]);
                    g.add(faces[11]);
                    g.add(faces[18]);
                }
                if (x==1 && y==0 && z==0) {
                    g.add(faces[43]);
                    g.add(faces[52]);
                }
                if (x==1 && y==0 && z==1) {
                    g.add(faces[49]);
                }
                if (x==1 && y==0 && z==2) {
                    g.add(faces[25]);
                    g.add(faces[46]);
                }
                if (x==1 && y==1 && z==0) {
                    g.add(faces[40]);
                }
                if (x==1 && y==1 && z==1) {
                }
                if (x==1 && y==1 && z==2) {
                    g.add(faces[22]);
                }
                if (x==1 && y==2 && z==0) {
                    g.add(faces[1]);
                    g.add(faces[37]);
                }
                if (x==1 && y==2 && z==1) {
                    g.add(faces[4]);
                }
                if (x==1 && y==2 && z==2) {
                    g.add(faces[7]);
                    g.add(faces[19]);
                }
                if (x==2 && y==0 && z==0) {
                    g.add(faces[35]);
                    g.add(faces[42]);
                    g.add(faces[53]);
                }
                if (x==2 && y==0 && z==1) {
                    g.add(faces[34]);
                    g.add(faces[50]);
                }
                if (x==2 && y==0 && z==2) {
                    g.add(faces[26]);
                    g.add(faces[33]);
                    g.add(faces[47]);
                }
                if (x==2 && y==1 && z==0) {
                    g.add(faces[32]);
                    g.add(faces[39]);
                }
                if (x==2 && y==1 && z==1) {
                    g.add(faces[31]);
                }
                if (x==2 && y==1 && z==2) {
                    g.add(faces[23]);
                    g.add(faces[30]);
                }
                if (x==2 && y==2 && z==0) {
                    g.add(faces[2]);
                    g.add(faces[29]);
                    g.add(faces[36]);
                }
                if (x==2 && y==2 && z==1) {
                    g.add(faces[5]);
                    g.add(faces[28]);
                }
                if (x==2 && y==2 && z==2) {
                    g.add(faces[8]);
                    g.add(faces[20]);
                    g.add(faces[27]);
                }

                if (move[0]=="U" && y==2 ||
                    move[0]=="D" && y==0 ||
                    move[0]=="R" && x==2 ||
                    move[0]=="L" && x==0 ||
                    move[0]=="F" && z==2 ||
                    move[0]=="B" && z==0) {
                    moved.add(g);
                } else {
                    cube.add(g);
                }
            }
        }
    }
    scene.add(cube);

    // const cube2 = new THREE.Group();
    // cube2.add(cube.clone());
    // cube2.position.y = -4;
    // cube2.scale.y = -1;
    // scene.add(cube2);

    // const desk = new THREE.Mesh(geometryDesk, materialDesk);
    // desk.rotation.x = -Math.PI/2;
    // desk.position.y = -2;
    // scene.add(desk);

    renderer.render(scene, camera);
    scene.remove(cube);
    //scene.remove(cube2);
    //scene.remove(desk);
}

function applyMove(F, move) {
    function rotate(a, b, c, d) {
        const t = F[d];
        F[d] = F[c];
        F[c] = F[b];
        F[b] = F[a];
        F[a] = t;
    }

    let n = 0;
    switch (move[1]) {
        case "2":
            n = 2;
            break;
        case "'":
            n = 3;
            break;
        default:
            n = 1;
            break;
    }

    for (let i=0; i<n; i++) {
        switch (move[0]) {
            case "F":
                rotate(19, 23, 25, 21);
                rotate( 7, 30, 46, 14);
                rotate(18, 20, 26, 24);
                rotate( 6, 27, 47, 17);
                rotate(11,  8, 33, 45);
                break;
            case "B":
                rotate(37, 41, 43, 39);
                rotate( 1, 12, 52, 32);
                rotate(36, 38, 44, 42);
                rotate( 2,  9, 51, 35);
                rotate(29,  0, 15, 53);
                break;
            case "R":
                rotate(28, 32, 34, 30);
                rotate( 5, 39, 50, 23);
                rotate(27, 29, 35, 33);
                rotate( 8, 36, 53, 26);
                rotate(20,  2, 42, 47);
                break;
            case "L":
                rotate(10, 14, 16, 12);
                rotate( 3, 21, 48, 41);
                rotate( 9, 11, 17, 15);
                rotate( 0, 18, 45, 44);
                rotate( 38, 6, 24, 51);
                break;
            case "U":
                rotate( 1,  5,  7,  3);
                rotate(37, 28, 19, 10);
                rotate( 0,  2,  8,  6);
                rotate(38, 29, 20, 11);
                rotate( 9, 36, 27, 18);
                break;
            case "D":
                rotate(46, 50, 52, 48);
                rotate(25, 34, 43, 16);
                rotate(45, 47, 53, 51);
                rotate(24, 33, 42, 15);
                rotate(17, 26, 35, 44);
                break;
        }
    }
}

function randomInt(n) {
    while (true) {
        const r = Math.random()*n|0;
        if (0<=r && r<n) {
            return r;
        }
    }
}

function randomMove(before1, before2) {
    let m = "";
    while (true) {
        m = "FBRLUD"[randomInt(6)];
        if (m[0]==before1[0] || m[0]==before2[0]) {
            continue;
        }
        break;
    }
    m += ["", "2", "'"][randomInt(3)];
    return m;
}

let F = [];
for (let f=0; f<6; f++) {
    for (let i=0; i<9; i++) {
        F.push("ULFRBD"[f]);
    }
}

for (let i=0; i<100; i++) {
    applyMove(F, randomMove("", ""));
}

let start = Date.now()/1000;
let moves = Array(128);
for (let i=0; i<128; i++) {
    moves[i] = randomMove(i-1>=0?moves[i-1]:"", i-2>=0?moves[i-2]:"");
}

let elmMoves = Array(128);
for (let i=0; i<128; i++) {
    const m = document.createElement("div");
    m.classList.add("move");
    m.innerText = moves[i];    
    document.getElementById("moves").appendChild(m);
    elmMoves[i] = m;
}

function animate() {
    const now = Date.now()/1000;
    let t = (now-start)*speed;

    if (t>=1) {
        if (sound && speed<=10) {
            setTimeout(() => {
                const elmSound = document.getElementById("audio");
                elmSound.pause();
                elmSound.currentTime = 0;
                elmSound.play();
            }, (t*0.1-0.02)*1000);
        }
    }

    let count = 0;
    while (t>=1) {
        applyMove(F, moves[64]);
        for (let i=0; i<127; i++) {
            moves[i] = moves[i+1];
        }
        moves[127] = randomMove(moves[126], moves[125]);
        for (let i=0; i<128; i++) {
            elmMoves[i].innerText = moves[i];
        }
        start += 1/speed;
        t = (now-start)*speed;

        count++;
        if (count>=100) {
            start = Date.now()/1000;
            t = 0;
            break;
        }
    }

    for (let i=0; i<128; i++) {
        elmMoves[i].style.left = `${moveSize*(i-64-t)+width/2}px`;
    }

    render(F, moves[64], t);
}

function resize() {
    width = window.innerWidth;
    height = window.innerHeight;

    const height2 = Math.min(width*1.2, height);
    renderer.setSize(width, height2);

    const elmContainer = document.getElementById("container");
    elmContainer.style.top = `${(height-height2)/2}px`;

    camera = new THREE.PerspectiveCamera(45, width/height2, 0.1, 1000);
    camera.position.x = 2;
    camera.position.y = 3;
    camera.position.z = 5;
    camera.lookAt(0, 0, 0);

    moveSize = Math.min(width, height)/8;
    for (let e of elmMoves) {
        e.style.fontSize = `${moveSize*0.5}px`;
        e.style.width = `${moveSize*0.9}px`;
        e.style.height = `${moveSize*0.6}px`;
        e.style.top = `${height/20}px`;
    }

    const elmCursor = document.getElementById("cursor");
    elmCursor.style.height = `${moveSize*0.8}px`;
    elmCursor.style.left = `${width/2}px`;
    elmCursor.style.top = `${height/20-moveSize*0.1}px`;

    const elmMenu = document.getElementById("menu");
    elmMenu.style.fontSize = `${moveSize*0.3}px`;
    elmMenu.style.top = `${height-elmMenu.clientHeight}px`;

    const elmSpeedSelector = document.getElementById("speedSelector");
    elmSpeedSelector.style.fontSize = `${moveSize*0.3}px`;
    elmSpeedSelector.style.top = `${height-elmMenu.clientHeight-elmSpeedSelector.clientHeight}px`;
    elmSpeedSelector.style.left = `${width-elmSpeedSelector.clientWidth-moveSize*0.2}px`;
}

addEventListener("resize", resize);
addEventListener("orientationchange ", resize);

document.addEventListener("DOMContentLoaded", () => {
    const elmSpeed = document.getElementById("speed");
    const elmSpeedSelector = document.getElementById("speedSelector");

    for (let s of ["0.5", "1", "2", "5", "10", "100"]) {
        const div = document.createElement("div");
        const a = document.createElement("a");
        a.textContent = `${s} turns/sec`;
        a.href = "#";
        a.addEventListener("click", e => {
            e.preventDefault();
            speed = Number(s);
            localStorage.setItem("kachakachacube_speed", s);
            elmSpeed.textContent = a.textContent;
        });
        div.appendChild(a);
        elmSpeedSelector.appendChild(div);

        if (speed==Number(s)) {
            elmSpeed.textContent = a.textContent;
        }
    }

    elmSpeed.addEventListener("click", e => {
        e.preventDefault();

        if (elmSpeedSelector.style.visibility=="hidden") {
            elmSpeedSelector.style.visibility = "visible";
        } else {
            elmSpeedSelector.style.visibility = "hidden";
        }
    });

    const elmSound = document.getElementById("sound");
    elmSound.addEventListener("click", e => {
        e.preventDefault();
        if (!sound) {
            sound = true;
            localStorage.setItem("kachakachacube_sound", "true");
            elmSound.textContent = "Sound: ON";
        } else {
            sound = false;
            localStorage.setItem("kachakachacube_sound", "false");
            elmSound.textContent = "Sound: OFF";
        }
    });
    if (sound) {
        elmSound.textContent = "Sound: ON";
    } else {
        elmSound.textContent = "Sound: OFF";
    }

    resize();
});

document.addEventListener("touchmove", e => {
    e.preventDefault();
}, {
    passive: false,
});

renderer.setAnimationLoop(animate);
