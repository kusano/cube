// https://qiita.com/Nyanyan_Cube/items/e517e71cf5c4e2aaf1e5
// https://github.com/cs0x7f/cstimer/blob/41af2b00ac718ce790e964519ea6079ae9a8be49/src/js/hardware/stackmat.js

class Processor extends AudioWorkletProcessor {
    constructor() {
        super();

        this.average = 0.0;
        this.averageSquare = 1.0;
        this.signal = false;
        this.count0 = 0;
        this.count1 = 0;
        this.byte = 0;
        this.bitsNumber = 0;
        this.string = "";
        this.wave = [];
        this.signalCount = 0;
    }

    process(inputs) {
        for (let v of inputs[0][0]) {
            if (this.signalCount++%10==0) {
                this.wave.push(v);
                if (this.wave.length>=534) {
                    this.port.postMessage({wave: this.wave});
                    this.wave = [];
                }
            }

            // 平均を0にする。
            this.average = this.average*0.9999+v*0.0001;
            v -= this.average;

            // 二乗の平均を1にする。
            this.averageSquare = this.averageSquare*0.999+v*v*0.001;
            v /= Math.max(0.001, Math.sqrt(this.averageSquare));

            if (!this.signal) {
                if (v<-.5) {
                    this.count0++;
                    if (this.count0>=8) {
                        this.signal = true;
                    }
                } else {
                    this.count0 = 0;
                }
            } else {
                if (v<0) {
                    this.count0++;
                } else {
                    this.count1++;
                }

                // 入力が48 kHzでボーレートが1200 bpsなので、1信号あたり40サンプル。
                if (this.count0+this.count1>=40) {
                    const bit = this.count0>this.count1?0:1;
                    this.count0 = 0;
                    this.count1 = 0;

                    if (this.bitsNumber>0) {
                        this.byte |= bit<<(this.bitsNumber-1);
                    }
                    this.bitsNumber++;

                    // start bit + data.
                    if (this.bitsNumber>=9) {
                        this.string += String.fromCharCode(this.byte);

                        this.byte = 0;
                        this.bitsNumber = 0;
                        this.signal = false;

                        if (this.string[this.string.length-1]=='\r') {
                            this.port.postMessage({time: this.string});
                            this.string = "";
                        }

                        if (this.string.length>9) {
                            this.string = this.string.substring(this.string.length-9);
                        }
                    }
                }
            }
        }
        return true;
    }
}

registerProcessor("processor", Processor);
