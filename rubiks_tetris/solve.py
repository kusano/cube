#  0  1  2
#  3  4  5
#  6  7  8
#
#  9 10 11
# 12 13 14
# 15 16 17
#
# 18 19 20
# 21 22 23
# 24 25 26

faces = [
    [
        [ 0,  1,  2],
        [ 3,  4,  5],
        [ 6,  7,  8],
    ], [
        [ 0,  3,  6],
        [ 9, 12, 15],
        [18, 21, 24],
    ], [
        [ 6,  7,  8],
        [15, 16, 17],
        [24, 25, 26],
    ], [
        [ 8,  5,  2],
        [17, 14, 11],
        [26, 23, 20],
    ], [
        [ 2,  1,  0],
        [11, 10,  9],
        [20, 19, 18],
    ], [
        [24, 25, 26],
        [21, 22, 23],
        [18, 19, 20],
    ],
]

def makeTetrominoes():
    T = {
        "O": [
            [
                [1, 1, 0],
                [1, 1, 0],
                [0, 0, 0],
            ],
        ],
        "S": [
            [
                [0, 1, 1],
                [1, 1, 0],
                [0, 0, 0],
            ], [
                [0, 0, 0],
                [0, 1, 1],
                [1, 1, 0],
            ],
        ],
        "Z": [
            [
                [1, 1, 0],
                [0, 1, 1],
                [0, 0, 0],
            ], [
                [0, 0, 0],
                [1, 1, 0],
                [0, 1, 1],
            ],
        ],
        "J": [
            [
                [1, 0, 0],
                [1, 1, 1],
                [0, 0, 0],
            ], [
                [0, 0, 0],
                [1, 0, 0],
                [1, 1, 1],
            ],
        ],
        "L": [
            [
                [0, 0, 1],
                [1, 1, 1],
                [0, 0, 0],
            ], [
                [0, 0, 0],
                [0, 0, 1],
                [1, 1, 1],
            ],
        ],
        "T": [
            [
                [0, 1, 0],
                [1, 1, 1],
                [0, 0, 0],
            ], [
                [0, 0, 0],
                [0, 1, 0],
                [1, 1, 1],
            ],
        ],
    }

    tetrominoes = {}
    for name in T:
        for shape in T[name]:
            for d in range(4):
                shape = list(zip(*shape))[::-1]
                tetrominoes[tuple(map(tuple, shape))] = name
    return tetrominoes
tetrominoes = makeTetrominoes()

# numbers[color] = [center, edge, corner]
numbers = {
    "P": [1, 1, 2],
    "G": [1, 2, 1],
    "R": [1, 2, 1],
    "Y": [1, 2, 1],
    "B": [0, 2, 2],
    "O": [1, 2, 1],
}

cube = ["."]*27
cube[ 4] = "P"
cube[12] = "O"
cube[16] = "G"
cube[14] = "Y"
cube[10] = "R"
cube[22] = "K"
cube[13] = "*"

def display():
    S = [[" "]*12 for y in range(9)]
    for f in range(6):
        fx = [3, 0, 3, 6, 9, 3][f]
        fy = [0, 3, 3, 3, 3, 6][f]
        for y in range(3):
            for x in range(3):
                S[fy+y][fx+x] = cube[faces[f][y][x]]
    for s in S:
        print("".join(s))

def BT(f):
    if f<5:
        c = cube[faces[f][1][1]]
        for shape in tetrominoes:
            if shape[1][1]!=0:
                ok = True
                for y in range(3):
                    for x in range(3):
                        if shape[y][x]!=0 and (x, y)!=(1, 1) and cube[faces[f][y][x]]!=".":
                            ok = False
                if ok:
                    centers = 0
                    edges = 0
                    corners = 0
                    for y in range(3):
                        for x in range(3):
                            if shape[y][x]!=0:
                                if (x, y)==(1, 1):
                                    centers += 1
                                elif (x, y) in [(0, 1), (1, 0), (1, 2), (2, 1)]:
                                    edges += 1
                                else:
                                    corners += 1
                    if numbers[c]==[centers, edges, corners]:
                        for y in range(3):
                            for x in range(3):
                                if shape[y][x]!=0 and (x, y)!=(1, 1):
                                    cube[faces[f][y][x]] = c
                        BT(f+1)
                        for y in range(3):
                            for x in range(3):
                                if shape[y][x]!=0 and (x, y)!=(1, 1):
                                    cube[faces[f][y][x]] = "."
    else:
        for i in range(27):
            if cube[i]==".":
                cube[i] = "W"
                for j in range(27):
                    if cube[j]==".":
                        cube[j] = "B"

                # 6種類のテトリミノがあることを確認。
                T = set()
                for f2 in range(6):
                    for c in "PGRYBO":
                        shape = [[0]*3 for _ in range(3)]
                        for y in range(3):
                            for x in range(3):
                                if cube[faces[f2][y][x]]==c:
                                    shape[y][x] = 1
                        shape = tuple(map(tuple, shape))
                        if shape in tetrominoes:
                            T.add(tetrominoes[shape])
                if len(T)==6:
                    s = ""
                    for f2 in range(6):
                        for y in range(3):
                            for x in range(3):
                                s += cube[faces[f2][y][x]]
                    print(s)
                for j in range(27):
                    if cube[j]=="B":
                        cube[j] = "."
                cube[i] = "."
BT(0)
