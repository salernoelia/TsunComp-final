let mic;
let speech;
let font;
let fft;
let speechRec;
let audioContext;
let micLevel = 0;
let micStarted = false;

let a = 0;
let amplitude = 0;
let targetAmplitude = 0;
let recognizedSpeech = "";
let fftBins = 256;
let partsNum = 8;
let spin = 0;

function preload() {
    font = loadFont('./assets/SuisseIntlMono-Regular.otf');
}

function setup() {
    createCanvas(windowWidth, windowHeight);

    pixelDensity(2.0);
    frameRate(60);
    angleMode(DEGREES);

    speechRec = new p5.SpeechRec('en-US', gotSpeech);
    fft = new p5.FFT();
    mic = new p5.AudioIn();
}

function draw() {
    background(0);

    //speech text
    fill(255, 0, 0);
    noStroke();
    textSize(18);
    textAlign(CENTER);
    text(recognizedSpeech, width / 2, height / 1.1);

    //welcome text
    fill(200);
    textSize(18);
    noStroke()
    textAlign(CENTER);
    textFont(font);
    text('Click and press the button to speak to TsunComp', width / 2, height / 6);
    // textFont = font;

    let spectrum = fft.analyze();
    let spectChunks = [];
    while (spectrum.length > 0) {
        const chunk = spectrum.splice(0, fftBins / partsNum);
        spectChunks.push(chunk);
    }

    translate(width / 2 + 30, height / 2);
    spin += 0.05;
    rotate(spin);
    stroke(100);
    noFill()

    for (let i = 1; i < partsNum - 1; i++) {
        beginShape();
        let amp_ = spectChunks[i][spectChunks[i].length - 2];
        let angle_ = (fftBins / partsNum / 360) * -1;
        let r_ = map(amp_, 0, 255, 20, 450);
        let x_ = r_ * cos(angle_);
        let y_ = r_ * sin(angle_);
        curveVertex(x_, y_);
        for (let j = 0; j < fftBins / partsNum; j++) {
            let ampi = spectChunks[i][j];
            let angle = map(j, 0, fftBins / partsNum - 1, 0, 360);
            let r = map(ampi, 0, 255, 1, 450);
            let x = r * cos(angle);
            let y = r * sin(angle);
            curveVertex(x, y);
        }
        amp_ = spectChunks[i][spectChunks[0]];
        angle_ = fftBins / partsNum / 360;
        curveVertex(x_, y_);
        endShape();
    }
}

function gotSpeech() {
    if (speechRec.resultValue) {
        recognizedSpeech = speechRec.resultString;
    }
}


function mousePressed() {
    if (!micStarted) {
        let sources = mic.getSources();
        if (sources.length > 0) {
            mic.setSource(0);
        }
        mic.start();
        console.log('Microphone started');
        speechRec.start(true, true);
        console.log('Speech recognition started');
    } else {
        console.log('Microphone stopped');
        recognizedSpeech = '';
        speechRec.stop();
        mic.stop();
    }
    micStarted = !micStarted;
}
