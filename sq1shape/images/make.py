from PIL import Image, ImageDraw
from math import pi, sin, cos

def make(shapes):
    shapes = shapes.split("_")

    im = Image.new("RGB", (1024, 1024*len(shapes)), (255, 255, 255))
    draw = ImageDraw.Draw(im)

    long = 480
    short = 480/2**.5/cos(pi/12.)

    for y, shape in enumerate(shapes):
        i = 0
        s = 0

        def point(r, s):
            return (512+r*sin(s), 1024*y+512-r*cos(s))

        while s<12:
            if shape[i]=="1":
                draw.line(
                    (
                        point(0, 0),
                        point(short, s/6*pi),
                        point(short, (s+1)/6*pi),
                        point(0, 0),
                    ),
                    fill=(0, 0, 0),
                    width=8,
                )
            else:
                draw.line(
                    (
                        point(0, 0),
                        point(short, s/6*pi),
                        point(long, (s+1)/6*pi),
                        point(short, (s+2)/6*pi),
                        point(0, 0),
                    ),
                    fill=(0, 0, 0),
                    width=8,
                )

            s += int(shape[i])
            i += 1

    if len(shapes)>1:
        draw.line(
            (
                (512, 32),
                (512, 1024*len(shapes)-32),
            ),
            fill=(255, 0, 0),
            width=16,
        )

    im = im.resize((256, 256*len(shapes)), resample=Image.Resampling.BICUBIC)
    im.save("_".join(shapes)+".png")

make("1211112111")
make("1121112111")
make("1121121111")
make("1112121111")
make("1111221111")

make("211211211")
make("111211122")
make("121211121")
make("211221111")
make("121212111")
make("121221111")
make("112221111")

make("21212121")
make("12122121")
make("21122112")
make("21121122")
make("21122121")
make("12122211")
make("12212211")
make("11222211")

make("2211222")
make("2121222")
make("1221222")

make("222222")

# 樹形図
# 4-1-1/Paired edges
make("111121212_1122222")
# Fist/Scallop
make("21122121_11112222")
# 5-1/Paired edges
make("211111221_2112222")
# Kite/Scallop
make("12122121_22111122")
# Fist (R)/Fist (R)
make("12211212_21212112")
# Kite/Kite
make("21211212_12122121")
# Square/Square
make("12121212_21212121")
# 6/Paired edges
make("221111112_2112222")
# 2-2-2/Paired edges
make("211211211_1122222")
# 4-2/Paired edges
make("211112211_1122222")
# 3-2-1/Paired edges
make("211212111_1122222")
# 3-3/Paired edges
make("221112111_1122222")
# Scallop/Scallop
make("11222211_22111122")
# Barrel/Barrel
make("12211221_21122112")

# 6-2/Star
make("2112111111_222222")
# 8/Star
make("1122111111_222222")
# 2-2-2/Perpendicular edges
make("211211211_2121222")
# 3-3/Perpendicular edges
make("112211121_1212222")
# 3-2-1/Perpendicular edges
make("211212111_2121222")
# 4-2/Perpendicular edges
make("211221111_1212222")
# 5-1/Perpendicular edges
make("221111121_1212222")
# 6/Perpendicular edges
make("112221111_1212222")
# 2-2-2/Parallel edges
make("211211211_1221222")
# 3-3/Parallel edges
make("112211121_1221222")
# 3-2-1/Parallel edges
make("211212111_1221222")
# 4-2/Parallel edges
make("211221111_1221222")
# 5-1/Parallel edges
make("221111121_1221222")
# 6/Parallel edges
make("112221111_1221222")
# Shield/Kite
make("22211211_12212112")
# Pawn/Kite
make("22211121_12212112")
# Shield/Barrel
make("22211211_11221122")
# Pawn/Barrel
make("22211121_22112211")
# Scallop/Barrel
make("22221111_21122112")
# Shield/Shield
make("21121122_11211222")
# Fist/Shield
make("21122121_11211222")
# Pawn/Shield
make("22211121_22112112")
# Mushroom/Shield
make("11221221_11211222")
# Scallop/Shield
make("11222211_11211222")
# Pawn (L)/Fist (L)
make("22211121_12121122")
# Pawn (L)/Fist (R)
make("22211121_12122112")
# Pawn (L)/Pawn (L)
make("22211121_12122211")
# Pawn (L)/Pawn (R)
make("22211121_21211122")
# Mushroom/Pawn
make("11221221_11121222")
# Scallop/Pawn
make("11222211_11121222")
# Scallop/Mushroom
make("22221111_12212211")

# 4-4/Star
make("1211112111_222222")
# 5-3/Star
make("1121112111_222222")
# 7-1/Star
make("1112121111_222222")
# 4-1-1/Parallel edges
make("121212111_1221222")
# Barrel/Square
make("11221122_21212121")
# Shield/Square
make("11222112_21212121")
# Fist/Square
make("11221212_21212121")
# Mushroom/Square
make("22111221_12121212")
# Barrel/Kite
make("11221122_12122121")
# Mushroom/Kite
make("22111221_12212112")
# Fist/Barrel
make("21122121_11221122")
# Mushroom/Barrel
make("22111221_21122112")
# Fist (L)/Fist (L)
make("21122121_12121122")
# Mushroom/Fist
make("22111221_11221212")
# Mushroom/Mushroom
make("22111221_12211122")

# Kite/Square
make("21121221_12121212")
# Fist/Kite
make("12121122_21211212")
# Pawn/Square
make("22212111_12121212")
# 4-1-1/Perpendicular edges
make("111121212_2121222")
# Scallop/Square
make("22211112_12121212")

