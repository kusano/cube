class Pyra:
    """
 0  1  2  3  4    9   18 19 20 21 22
    5  6  7   10 11 12   23 24 25
       8   13 14 15 16 17   26

           27 28 29 30 31
              32 33 34
                 35
    """
    T = {
        "U":  [ 0,  1, 10, 11,  9,  5,  6, 12,  8,  18, 23, 19, 20, 13, 14, 15, 16, 17,   4,  3,  7, 21, 22,  2, 24, 25, 26,  27, 28, 29, 30, 31, 32, 33, 34, 35],
        "L":  [ 0,  1,  2,  3,  4, 29, 28, 32, 27,   9,  5, 11, 12,  8,  6,  7, 16, 17,  18, 19, 20, 21, 22, 23, 24, 25, 26,  13, 14, 10, 30, 31, 15, 33, 34, 35],
        "R":  [ 0,  1,  2,  3,  4,  5,  6,  7,  8,   9, 10, 11, 29, 13, 14, 34, 30, 31,  18, 19, 20, 21, 22, 15, 16, 12, 17,  27, 28, 25, 24, 26, 32, 33, 23, 35],
        "B":  [22, 21, 25,  3,  4, 20,  6,  7,  8,   9, 10, 11, 12, 13, 14, 15, 16, 17,  18, 19, 34, 33, 35, 23, 24, 32, 26,  27, 28, 29, 30, 31,  2,  1,  5,  0],
        "U'": [ 0,  1, 23, 19, 18,  5,  6, 20,  8,   4,  2,  3,  7, 13, 14, 15, 16, 17,   9, 11, 12, 21, 22, 10, 24, 25, 26,  27, 28, 29, 30, 31, 32, 33, 34, 35],
        "L'": [ 0,  1,  2,  3,  4, 10, 14, 15, 13,   9, 29, 11, 12, 27, 28, 32, 16, 17,  18, 19, 20, 21, 22, 23, 24, 25, 26,   8,  6,  5, 30, 31,  7, 33, 34, 35],
        "R'": [ 0,  1,  2,  3,  4,  5,  6,  7,  8,   9, 10, 11, 25, 13, 14, 23, 24, 26,  18, 19, 20, 21, 22, 34, 30, 29, 31,  27, 28, 12, 16, 17, 32, 33, 15, 35],
        "B'": [35, 33, 32,  3,  4, 34,  6,  7,  8,   9, 10, 11, 12, 13, 14, 15, 16, 17,  18, 19,  5,  1,  0, 23, 24,  2, 26,  27, 28, 29, 30, 31, 25, 21, 20, 22],
    }

    def move(self, m):
        self.F = [self.F[self.T[m][i]] for i in range(36)]

# V[d][v]: 最短手数がd手で状態がvの最短手数の配列。
V = [{} for _ in range(8)]
V[0][".L...LL.."+".....F.F."+"...R..RR."+".D.D.DDD."] = [[]]

pyra = Pyra()
for d in range(1, 8):
    for v in V[d-1]:
        pyra.F = list(v)
        for m in ["U", "L", "R", "B", "U'", "L'", "R'", "B'"]:
            mr = m+"'" if len(m)==1 else m[0]
            pyra.move(m)
            v2 = "".join(pyra.F)
            if all(v2 not in V2 for V2 in V[:d]):
                if v2 not in V[d]:
                    V[d][v2] = []
                for move in V[d-1][v]:
                    V[d][v2] += [[mr]+move]
            pyra.move(mr)

def mirror(v):
    t = "".join(v[x] for x in [22, 21, 20, 19, 18, 25, 24, 23, 26,   9, 12, 11, 10, 17, 16, 15, 14, 13,   4,  3,  2,  1,  0,  7,  6,  5,  8,  31, 30, 29, 28, 27, 34, 33, 32, 35])
    return t.replace("L", "_").replace("R", "L").replace("_", "R")

# 最短手数の途中に vs の要素の状態が出てくるような状態の個数を返す。
# vs の要素の最短手数は同一であること。
def count(vs):
    suffixes = set()
    for v in vs:
        for d in range(8):
            if v in V[d]:
                for m in V[d][v]:
                    suffixLen = len(m)
                    suffixes.add(" ".join(m))

    n = 0
    for d in range(suffixLen+1, 8):
        for v in V[d]:
            ok = False
            for m in V[d][v]:
                if len(m)>suffixLen and " ".join(m[-suffixLen:]) in suffixes:
                    ok = True
            if ok:
                n += 1
    return n

for d in range(1, 5):
    print(f"==={d}===")

    counts = {}
    for v in V[d]:
        # 左右反転した状態について、手順に R の個数が多いほうを採用する。
        mv = mirror(v)
        r = sum("".join(m).count("R") for m in V[d][v])
        mr = sum("".join(m).count("R") for m in V[d][mv])
        if r>mr or r==mr and v<=mv:
            counts[v] = count([v, mv])

    vs = list(counts)
    vs.sort(key=lambda v: counts[v], reverse=True)

    total = sum(len(v) for v in V[d+1:])

    print(len(vs), total)

    S = []
    rank = 0
    for i, v in enumerate(vs):
        if i==0 or counts[v]<counts[vs[i-1]]:
            rank = i+1
        S += [v, mirror(v)]
        c = count(S)
        print("<tr>"+
            f'<td style="text-align: right">{rank}</td>'+
            f'<td><canvas class="pyra{""if d<4 else "4"}" width="128" height="128" data-faces="{v}"></canvas></td>'+
            '<td style="font-weight: bold">'+"".join(f'<div>{" ".join(m)}</div>' for m in V[d][v])+"</td>"+
            f'<td style="text-align: right">{counts[v]:,}</td>'+
            f'<td style="text-align: right">{counts[v]/total*100:.2f} %</td>'+
            f'<td style="text-align: right">{c:,}</td>'+
            f'<td style="text-align: right">{c/total*100:.2f} %</td>'+
            "</tr>")
