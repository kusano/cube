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
    "4-4/Star",
    "5-3/Star",
    "7-1/Star",
    "4-1-1/Perpendicular edges",
    "4-1-1/Parallel edges",
    "Kite/Square",
    "Barrel/Square",
    "Shield/Square",
    "Fist (L)/Square",
    "Pawn (L)/Square",
    "Mushroom/Square",
    "Scallop/Square",
    "Barrel/Kite",
    "Fist (L)/Kite",
    "Mushroom/Kite",
    "Fist (L)/Barrel",
    "Mushroom/Barrel",
    "Fist (L)/Fist (L)",
    "Mushroom/Fist (L)",
    "Mushroom/Mushroom",
]:
    print(shape)
    U, D = shape.split("/")
    U = name2shape[U]
    D = name2shape[D]
    checked = set()

    for up in range(len(U)):
        for dp in range(len(D)):
            U2 = U[up:]+U[:up]
            D2 = D[dp:]+D[:dp]

            if (U2, D2) in checked:
                continue
            checked.add((U2, D2))

            U3, D3 = slice(U2, D2)
            if U3!="":
                # D面にコーナー3個があるか。
                if "222" in D3*2:
                    # U面にコーナー2個とエッジ2個があるか。
                    if "2211" in U3*2 or "2112" in U3*2 or "1122" in U3*2:
                        ok = "o"
                    else:
                        ok = "x"
                    # D面にコーナー2個とエッジ2個、U面にコーナー3個でもOK。
                    if "222" in U3*2 and ("2211" in D3*2 or "2112" in D3*2 or "1122" in D3*2):
                        ok = "o"
                    print(ok, f"{U2}_{D2}")
