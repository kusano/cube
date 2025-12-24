average = 0.0
averageSquare = 1.0
signal = False
count0 = 0
count1 = 0
byte = 0
bitsNumber = 0
string = ""

for l in open("sample_480000.txt"):
    v = float(l)

    average = average*0.9999+v*0.0001
    v -= average

    averageSquare = averageSquare*0.999+v*v*0.001
    v /= max(0.001, averageSquare**.5)

    if not signal:
        if v<-.5:
            count0 += 1
            if count0>=8:
                signal = True
        else:
            count0 = 0
    else:
        if v<0:
            count0 += 1
        else:
            count1 += 1

    if count0+count1>=40:
        bit = 0 if count0>count1 else 1
        count0 = 0
        count1 = 0

        if bitsNumber>0:
            byte |= bit<<(bitsNumber-1)
        bitsNumber += 1

        if bitsNumber>=9:
            string += chr(byte)
            byte = 0
            bitsNumber = 0
            signal = False

            if len(string)>=2 and string[-2]=="\n" and string[-1]=="\r":
                print(string.replace("\n", "n").replace("\r", "r"))
                string = ""
