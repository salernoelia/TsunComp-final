let friction = 0.98;
let maxAge = 200;
let maxSpeed = 20;
let particles = [];
let magnet;
let magnetStrength = 20;

let mic;
let speech;
let font;
let speechRec;
let audioContext;
let micLevel = 0;
let micStarted = false;

let a = 0;
let amplitude = 0;
let targetAmplitude = 0;
let recognizedSpeech = "";

function preload() {
  font = loadFont('./assets/SuisseIntlMono-Regular.otf');
}




function setup() {
  createCanvas(windowWidth, windowHeight);

  pixelDensity(2.0);
  frameRate(120);

  speechRec = new p5.SpeechRec('en-US', gotSpeech);
  fft = new p5.FFT();
  mic = new p5.AudioIn();
  noCursor();
}

function draw() {
  background(0, 50);

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

  noFill();
  stroke(255);
  magnet = createVector(mouseX, mouseY);



  micLevel = mic.getLevel();
  targetAmplitude = map(micLevel, 0, 1, 0, 500);
  // smooth with lerp();
  amplitude = lerp(amplitude, targetAmplitude, 0.1);

  push();
  noFill();
  stroke(255);
  ellipse(mouseX, mouseY, 50, 50);
  pop();
  // fill(255);

  if (micStarted) {
    console.log('print');
    stroke(255, 0, 0);
    particles.push(new particle(random(windowWidth), random(windowHeight), random(-1, 1), random(-1, 1)));
    for (let p of particles) {
      p.draw();
      p.move();
      p.magnet();
    }
    particles = particles.filter(p => { return p.age < maxAge })
  } else {
    stroke(255);
    particles.push(new particle(random(windowWidth), random(windowHeight), random(-1, 1), random(-1, 1)));
    for (let p of particles) {
      p.draw();
      p.move();
      // p.magnet();
    }
    particles = particles.filter(p => { return p.age < maxAge })
  }
}


function particle(x, y, xvel, yvel) {
  this.pos = createVector(x, y);
  this.vel = createVector(xvel, yvel);
  this.age = 0;
  this.draw = function () {
    ellipse(this.pos.x, this.pos.y, 3, 3);
  }
  this.move = function () {
    this.pos.add(this.vel);
    this.vel.mult(friction);
    this.vel.limit(maxSpeed);
    this.age++;
  }
  this.defaultMove = function () {
    this.pos.add(this.vel);
    this.vel.mult(friction);
    this.vel.limit(maxSpeed / 5);
    this.age++;
  }
  this.magnet = function () {
    var magpull = p5.Vector.sub(magnet, this.pos);
    let magstrength = magnetStrength / this.pos.dist(magnet);
    magpull.normalize().mult(magstrength);
    this.vel.add(magpull);
  }
}
function gotSpeech() {
  if (speechRec.resultValue) {
    console.log(recognizedSpeech);
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

