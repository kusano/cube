import itertools

PLL = {
    "Solved": "FFFRRRBBBLLL",
    "Aa": "RFRBRLFBBLLF",
    "Ab": "BFLFRFRBBLLR",
    "E" : "LFRBRFRBLFLB",
    "F" : "FBRBRFRFBLLL",
    "Ga": "FBRBLFRRBLFL",
    "Gb": "FLRBBFRFBLRL",
    "Gc": "FRRBLFRFBLBL",
    "Gd": "FBRBFFRLBLRL",
    "H" : "FBFRLRBFBLRL",
    "Ja": "FRRBFFRBBLLL",
    "Jb": "FFRBBFRRBLLL",
    "Na": "FFBLLRBBFRRL",
    "Nb": "BFFRLLFBBLRR",
    "Ra": "FLRBRFRBBLFL",
    "Rb": "RFLFBRBRBLLF",
    "T" : "FFRBLFRBBLRL",
    "Ua": "FLFRFRBBBLRL",
    "Ub": "FRFRLRBBBLFL",
    "V" : "BRFRFLFBBLLR",
    "Y" : "BLFRRLFBBLFR",
    "Z" : "FRFRFRBLBLBL",
}

def rotate(F, n):
    for _ in range(n):
        F = F[3:]+F[:3]
    return F

def rotateColor(F, n):
    for _ in range(n):
        F = F.replace("F", "x")
        F = F.replace("L", "F")
        F = F.replace("B", "L")
        F = F.replace("R", "B")
        F = F.replace("x", "R")
    return F

def apply(F, P):
    S = ["LF", "F", "FR", "R", "RB", "B", "BL", "L"]
    P = [P[11]+P[0], P[1], P[2:4], P[4], P[5:7], P[7], P[8:10], P[10]]
    F = [F[11]+F[0], F[1], F[2:4], F[4], F[5:7], F[7], F[8:10], F[10]]
    F2 = [None]*8
    for i in range(8):
        F2[S.index(P[i])] = F[i]
    F2 = "".join(F2)
    F2 = F2[1:]+F2[0]
    return F2

def isSolved(F):
    for i in range(0, 12, 3):
        if not F[i]==F[i+1]==F[i+2]:
            return False
    return True

PPPLL = [
    "FBFRRRBFBLLL",
    "FFFRRRBLBLBL",
    "FLFRFRBRBLBL",
    "FRFRBRBLBLFL",
    "FLFRBRBFBLRL",

    "BFFRRLFBBLLR",
    "BLFRBLFRBLFR",
    "BRFRFLFLBLBR",
    "BLFRRLFFBLBR",
    "LBRBFFRLLFRB",

    "FFRBRFRBBLLL",
    "FBRBFFRRBLLL",
    "FRRBBFRFBLLL",

    "FBRBLFRFBLRL",
    "FFRBBFRLBLRL",
    "FLRBFFRBBLRL",

    "FRRBLFRBBLFL",
    "FFRBLFRRBLBL",
    "FLRBRFRFBLBL",
    "FBRBRFRLBLFL",
    "FLRBBFRRBLFL",
    "FRRBFFRLBLBL",
]

for C in itertools.permutations(["LF", "FR", "RB", "BL"]):
    for E in itertools.permutations(["F", "R", "B", "L"]):
        F = C[0][1]+E[0]+C[1]+E[1]+C[2]+E[2]+C[3]+E[3]+C[0][0]

        found = False
        for i in range(4):
            for j in range(4):
                F2 = rotateColor(rotate(F, i), j)
                for pll in PLL:
                    if PLL[pll]==F2:
                        found = True
                if F2 in PPPLL:
                    found = True
        if found:
            continue
        assert False
        PPPLL += [F]

for F in PPPLL:
    S = set()
    for pll in PLL:
        for i in range(4):
            for pp in ["FBFRRRBFBLLL", "FFFRLRBBBLRL"]:
                if isSolved(apply(apply(rotate(F, i), PLL[pll]), pp)):
                    S.add(pll+"+pp")
                if isSolved(apply(apply(rotate(F, i), pp), PLL[pll])):
                    S.add("pp+"+pll)
    print(F)
    for s in sorted(list(S)):
        print(s)
    print()
print(len(PPPLL))
