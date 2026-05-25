def normalize(s):
    return "/".join(sorted(s.split("/")))

def trans(s):
    S2 = set()
    s = [x.split("-") for x in s.split("/")]
    for i in range(1, 4):
        j, k = [[], [2, 3], [1, 3], [1, 2]][i]
        for x, y in [[0, 2], [2, 0]]:
            s[0][x], s[i][x] = s[i][x], s[0][x]
            s[j][y], s[k][y] = s[k][y], s[j][y]
            S2.add(normalize("/".join("-".join(x) for x in s)))
            s[0][x], s[i][x] = s[i][x], s[0][x]
            s[j][y], s[k][y] = s[k][y], s[j][y]
    return list(S2)

def transM(s):
    S2 = set()
    s = [x.split("-") for x in s.split("/")]
    for i in range(1, 4):
        j, k = [[], [2, 3], [1, 3], [1, 2]][i]
        s[0][0], s[i][0] = s[i][0], s[0][0]
        s[j][0], s[k][0] = s[k][0], s[j][0]
        s[0][2], s[i][2] = s[i][2], s[0][2]
        s[j][2], s[k][2] = s[k][2], s[j][2]
        S2.add(normalize("/".join("-".join(x) for x in s)))
        s[0][0], s[i][0] = s[i][0], s[0][0]
        s[j][0], s[k][0] = s[k][0], s[j][0]
        s[0][2], s[i][2] = s[i][2], s[0][2]
        s[j][2], s[k][2] = s[k][2], s[j][2]
    return list(S2)

S = {}
S[normalize("UF-UF-UF/DF-DF-DF/DB-DB-DB/UB-UB-UB")] = 0

while True:
    S2 = []
    for s in S:
        for s2 in trans(s):
            if s2 not in S:
                S2 += [s2]
    if S2==[]:
        break
    for s in S2:
        S[s] = 0

X = set()
for s in S:
    B = 0
    HL = 0
    PL = 0
    PR = 0
    for x in s.split("/"):
        x = x.split("-")
        if x[0]==x[1]==x[2]:
            B += 1
        if x[0]==x[2]!=x[1]:
            HL += 1
        if x[0]==x[1]!=x[2]:
            PL += 1
        if x[0]!=x[1]==x[2]:
            PR += 1
    t = [B, HL, PL, PR]

    if t==[4, 0, 0, 0]:
        S[s] = 0
    elif t==[2, 2, 0, 0]:
        S[s] = 1
    elif t==[1, 3, 0, 0]:
        S[s] = 2
    elif t==[0, 4, 0, 0]:
        S[s] = 3
    elif t==[0, 0, 4, 0] or t==[0, 0, 0, 4]:
        S[s] = 4
    elif t==[0, 0, 2, 2]:
        S[s] = 5
    elif t==[0, 0, 2, 0] or t==[0, 0, 0, 2]:
        S[s] = 6
    elif t==[0, 0, 1, 1]:
        S[s] = 7
    elif t==[0, 0, 0, 0]:
        S[s] = 8
    else:
        raise "error"

gn = 9
while True:
    up2 = False
    for g in range(gn):
        T = []
        for s in S:
            if S[s]==g:
                T += [s]
        t0 = None
        up = False
        for s in T:
            t = set()
            for s2 in trans(s):
                t.add(S[s2])
            t = sorted(list(t))
            if t0 is None:
                t0 = t
            if t!=t0:
                S[s] = gn
                up = True
        if up:
            gn += 1
            up2 = True
    if not up2:
        break

names = ["4B0", "2B3", "1B4", "HL2", "4P4", "4P1", "2P3", "2P2", "0P3", "HL3", "0P4"]
G = [[] for _ in range(gn)]
for s in S:
    G[S[s]] += [s]
for g in range(gn):
    print(names[g])

    T = set()
    for t in trans(G[g][0]):
        T.add(S[t])
    print("R2/L2:", " ".join(names[t] for t in sorted(list(T))))
    TM = None
    for s in G[g]:
        tm = set()
        for t in transM(G[g][0]):
            tm.add(S[t])
        if TM is None:
            TM = tm
        if TM != tm:
            raise("error")
    print("M2:", " ".join(names[t] for t in sorted(list(TM))))

    for s in G[g]:
        print(s)
    print()
