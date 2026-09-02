import FTO from "./fto.js"

function getCenter(fto) {
    const center = [];
    for (let i=0; i<FTO.triangles.length; i++) {
        if (fto.faces[FTO.triangles[i]]=="U") {
            center.push(i);
        }
    }

    for (const c of ["R", "L", "B"]) {
        for (let i=0; i<FTO.edges.length; i++) {
            if (fto.faces[FTO.edges[i][0]]=="U" &&
                fto.faces[FTO.edges[i][1]]==c) {
                center.push(i);
            }
        }
    }

    return center.map(i => ""+i).join("-");
}

function setCenter(fto, center) {
    for (let i=0; i<72;i++) {
        fto.faces[i] = ".";
    }

    center = center.split("-").map(i => +i);

    for (let i=0; i<3; i++) {
        fto.faces[FTO.triangles[center[i]]] = "U";
    }

    for (let i=0; i<3; i++) {
        fto.faces[FTO.edges[center[3+i]][0]] = "U";
        fto.faces[FTO.edges[center[3+i]][1]] = ["R", "L", "B"][i];
    }
}

const fto = new FTO();

const S = [new Set()];

for (const r1 of ["", "Ro", "Ro'", "Fo"]) {
    for (const r2 of ["", "Uo", "Uo'"]) {
        if (r1!="") {
            fto.move(r1);
        }
        if (r2!="") {
            fto.move(r2);
        }

        S[0].add(getCenter(fto));

        if (r2!="") {
            fto.undo();
        }
        if (r1!="") {
            fto.undo();
        }
    }
}
console.log(0, S[0].size);

for (let d=1; ; d++) {
    S.push(new Set());

    for (const center of S[d-1]) {
        setCenter(fto, center);

        for (const move of [
            "U", "U'",
            "R", "R'",
            "F", "F'",
            "L", "L'",
            "D", "D'",
            "BR", "BR'",
            "B", "B'",
            "BL", "BL'",
        ]) {
            fto.move(move);

            const center2 = getCenter(fto);

            let found = false;
            for (let d2=0; d2<d; d2++) {
                if (S[d2].has(center2)) {
                    found = true;
                }
            }

            if (!found) {
                S[d].add(center2);
            }

            fto.undo();
        }
    }

    console.log(d, S[d].size);
    if (S[d].size==0) {
        break;
    }
}
