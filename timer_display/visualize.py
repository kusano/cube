from PIL import Image

V = []
for l in open("sample_480000.txt"):
    V += [float(l)]

w = 5345
im = Image.new("RGB", (w, ((len(V)-1)//w+1)*256), (255, 255, 255))
for i, v in enumerate(V):
    im.putpixel((i%w, 256*(i//w)+128), (0, 0, 0))
    im.putpixel((i%w, 256*(i//w)+128-int(v*100)), (255, 0, 0))
im.save("visualize.png")
