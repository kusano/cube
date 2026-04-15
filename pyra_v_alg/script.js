function render(canvas, pyra) {
    const S = 96;

    const ctx = canvas.getContext("2d");
    const dpr = window.devicePixelRatio;
    canvas.width = S*dpr;
    canvas.height = S*dpr;
    ctx.scale(dpr, dpr);
    canvas.style.width = `${S}px`;
    canvas.style.height = `${S}px`;

    // [B, R, L]
    const F = [
        [[3, 0, 0], [2, 0, 0], [2, 0, 1]],
        [[2, 0, 0], [1, 0, 1], [2, 0, 1]],
        [[2, 0, 0], [1, 0, 0], [1, 0, 1]],
        [[1, 0, 0], [0, 0, 1], [1, 0, 1]],
        [[1, 0, 0], [0, 0, 0], [0, 0, 1]],
        [[2, 0, 1], [1, 0, 1], [1, 0, 2]],
        [[1, 0, 1], [0, 0, 2], [1, 0, 2]],
        [[1, 0, 1], [0, 0, 1], [0, 0, 2]],
        [[1, 0, 2], [0, 0, 2], [0, 0, 3]],

        [[0, 0, 0], [0, 1, 0], [0, 0, 1]],
        [[0, 0, 1], [0, 1, 1], [0, 0, 2]],
        [[0, 0, 1], [0, 1, 0], [0, 1, 1]],
        [[0, 1, 0], [0, 2, 0], [0, 1, 1]],
        [[0, 0, 2], [0, 1, 2], [0, 0, 3]],
        [[0, 0, 2], [0, 1, 1], [0, 1, 2]],
        [[0, 1, 1], [0, 2, 1], [0, 1, 2]],
        [[0, 1, 1], [0, 2, 0], [0, 2, 1]],
        [[0, 2, 0], [0, 3, 0], [0, 2, 1]],

        [[0, 0, 0], [1, 0, 0], [0, 1, 0]],
        [[1, 0, 0], [1, 1, 0], [0, 1, 0]],
        [[1, 0, 0], [2, 0, 0], [1, 1, 0]],
        [[2, 0, 0], [2, 1, 0], [1, 1, 0]],
        [[3, 0, 0], [2, 1, 0], [2, 0, 0]],
        [[0, 1, 0], [1, 1, 0], [0, 2, 0]],
        [[1, 1, 0], [1, 2, 0], [0, 2, 0]],
        [[2, 1, 0], [1, 2, 0], [1, 1, 0]],
        [[0, 2, 0], [1, 2, 0], [0, 3, 0]],

        [[0, 0, 3], [0, 1, 2], [1, 0, 2]],
        [[0, 1, 2], [1, 1, 1], [1, 0, 2]],
        [[0, 1, 2], [0, 2, 1], [1, 1, 1]],
        [[0, 2, 1], [1, 2, 0], [1, 1, 1]],
        [[0, 2, 1], [0, 3, 0], [1, 2, 0]],
        [[1, 0, 2], [1, 1, 1], [2, 0, 1]],
        [[1, 1, 1], [2, 1, 0], [2, 0, 1]],
        [[1, 1, 1], [1, 2, 0], [2, 1, 0]],
        [[2, 0, 1], [2, 1, 0], [3, 0, 0]],
    ];

    function rotate(x, y, z) {
        let th2;
        let th3;
        let scale;
        th2 = 0.0;
        th3 = 0.1;
        scale = S*1.25;

        const x2 = x*Math.cos(th2)-y*Math.sin(th2);
        const y2 = x*Math.sin(th2)+y*Math.cos(th2);
        const z2 = z;

        const x3 = x2;
        const y3 = y2*Math.cos(th3)-z2*Math.sin(th3);
        const z3 = y2*Math.sin(th3)+z2*Math.cos(th3);

        return [x3*scale+S*.5, y3*scale+S*.625];
    }

    const [Ux, Uy] = rotate(0, 0, Math.sqrt(2/3));
    const [Bx, By] = rotate(0, -1/Math.sqrt(3), 0);
    const [Rx, Ry] = rotate(1/2, 1/(2*Math.sqrt(3)), 0);
    const [Lx, Ly] = rotate(-1/2, 1/(2*Math.sqrt(3)), 0);

    // D, L, R, F の順に描画。
    const I = [];
    for (let f of [27, 0, 18, 9]) {
        for (let i=0; i<9; i++) {
            I.push(f+i);
        }
    }

    for (let i of I) {
        ctx.beginPath();
        for (let j=0; j<3; j++) {
            const x = ((Bx-Ux)*F[i][j][0]/3+(Rx-Ux)*F[i][j][1]/3+(Lx-Ux)*F[i][j][2]/3)+Ux;
            const y = ((By-Uy)*F[i][j][0]/3+(Ry-Uy)*F[i][j][1]/3+(Ly-Uy)*F[i][j][2]/3)+Uy;
            if (j==0) {
                ctx.moveTo(x, y);
            } else {
                ctx.lineTo(x, y);
            }
        }
        ctx.closePath();
        ctx.fillStyle = {
            "R": "#00F",
            "F": "#0F0",
            "L": "#F00",
            "D": "#FF0",
            ".": "rgba(192 192 192 / 70%)",
        }[pyra[i]];
        ctx.fill();
        ctx.lineWidth = 0.25;
        ctx.stroke();
    }

    for (let l of [
        [[Ux, Uy], [Bx, By]],
        [[Ux, Uy], [Rx, Ry]],
        [[Ux, Uy], [Lx, Ly]],
        [[Bx, By], [Rx, Ry]],
        [[Rx, Ry], [Lx, Ly]],
        [[Lx, Ly], [Bx, By]],
    ]) {
        ctx.beginPath();
        ctx.moveTo(l[0][0], l[0][1]);
        ctx.lineTo(l[1][0], l[1][1]);
        ctx.closePath();
        ctx.lineWidth = 0.5;
        ctx.stroke();
    }
}

document.addEventListener("DOMContentLoaded", () => {
    for (const elem of document.querySelectorAll("canvas.pyra")) {
        render(elem, elem.dataset.faces);
    }

    const details = document.getElementById("details_4move");
    let rendered = false;
    details.addEventListener("toggle", () => {
        if (details.open) {
            if (!rendered) {
                rendered = true;
                for (const elem of document.querySelectorAll("canvas.pyra4")) {
                    render(elem, elem.dataset.faces);
                }
            }
        }
    });
});
