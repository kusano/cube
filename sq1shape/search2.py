name2shape = {
    "4-4": "1211112111",
    "5-3": "1121112111",
    "6-2": "1121121111",
    "7-1": "1112121111",
    "8": "1111221111",
    "2-2-2": "211211211",
    "3-3": "111211122",
    "3-2-1 (L)": "121211121",
    "3-2-1 (R)": "121112121",
    "4-2 (L)": "211221111",
    "4-2 (R)": "111122112",
    "4-1-1": "121212111",
    "5-1 (L)": "121221111",
    "5-1 (R)": "111122121",
    "6": "112221111",
    "Square": "21212121",
    "Kite": "12122121",
    "Barrel": "21122112",
    "Shield": "21121122",
    "Fist (L)": "21122121",
    "Fist (R)": "12122112",
    "Pawn (L)": "12122211",
    "Pawn (R)": "11222121",
    "Mushroom": "12212211",
    "Scallop": "11222211",
    "Paired edges": "2211222",
    "Perpendicular edges": "2121222",
    "Parallel edges": "1221222",
    "Star": "222222",
}

def shape2name(shape):
    for n in name2shape:
        if shape in name2shape[n]*2:
            return n
    raise shape

# U面がより上のものになっていると嬉しい。
# その中でも、D面がこの位置になっていると嬉しい。
tier = [
    [
        ("4-2 (L)",   "1122222"),
        ("4-2 (R)",   "2211222"),
        ("5-1 (L)",   "2112222"),
        ("5-1 (R)",   "2112222"),
    ], [
        ("6",     "2112222"),
        ("2-2-2", "1122222"),
        ("3-2-1 (L)", "1122222"),
        ("3-2-1 (R)", "2211222"),
        ("3-3",   "1122222"),
    ], [
        ("4-1-1", "1122222"),
    ]
]

def slice(U, D):
    t = 0
    for i in range(len(U)):
        t += int(U[i])
        if t==6:
            up = i+1
            break
        if t>6:
            return "", ""
    t = 0
    for i in range(len(D)):
        t += int(D[i])
        if t==6:
            dp = i+1
            break
        if t>6:
            return "", ""
    return D[:dp]+U[up:], U[:up]+D[dp:]

for shape in [
    "6-2/Star",
    "8/Star",
    "2-2-2/Perpendicular edges",
    "3-3/Perpendicular edges",
    "3-2-1/Perpendicular edges",
    "4-2/Perpendicular edges",
    "5-1/Perpendicular edges",
    "6/Perpendicular edges",
    "2-2-2/Parallel edges",
    "3-3/Parallel edges",
    "3-2-1/Parallel edges",
    "4-2/Parallel edges",
    "5-1/Parallel edges",
    "6/Parallel edges",
    "Shield/Kite",
    "Pawn/Kite",
    "Shield/Barrel",
    "Pawn/Barrel",
    "Scallop/Barrel",
    "Shield/Shield",
    "Fist/Shield",
    "Pawn/Shield",
    "Mushroom/Shield",
    "Scallop/Shield",
    "Pawn (L)/Fist (L)",
    "Pawn (L)/Fist (R)",
    "Pawn (L)/Pawn (L)",
    "Pawn (L)/Pawn (R)",
    "Mushroom/Pawn",
    "Scallop/Pawn",
    "Scallop/Mushroom",
]:
    U, D = shape.split("/")
    if U in ["3-2-1", "4-2", "5-1", "Pawn", "Fist"]:
        U += " (L)"
    if D in ["3-2-1", "4-2", "5-1", "Pawn", "Fist"]:
        D += " (L)"
    U = name2shape[U]
    D = name2shape[D]

    best_score = -9999
    for up in range(len(U)):
        for dp in range(len(D)):
            U2 = U[up:]+U[:up]
            D2 = D[dp:]+D[:dp]
            U3, D3 = slice(U2, D2)
            if U3!="" and shape2name(D3)=="Paired edges":
                for t in range(len(tier)):
                    for u, d in tier[t]:
                        if shape2name(U3)==u:
                            score = -t*2+(1 if d==D3 else 0)
                            if score>best_score:
                                best_score = score
                                best = (U2, D2)
    print(f'<div class="m-4 has-text-centered"><div>{shape}</div><div><img src="images/{best[0]}_{best[1]}.png" width="64" height="128"></div></div>')

