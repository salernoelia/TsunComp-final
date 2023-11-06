let mic;
let speech;
let font;
let audioContext;
let finalSpeechString;
let micLevel = 0;
let micStarted = false;
let lastPressed;
let speechRec;
let a = 0;
let amplitude = 0;
let targetAmplitude = 0;
let recognizedSpeech = "";
let speakingFlag = false;
let showSuccessMessage = false; // Variable to control the success message
let blackScreenTimer = 0; // Timer for the black screen

function preload() {
  font = loadFont("./assets/SuisseIntlMono-Regular.otf");
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  pixelDensity(2.0);
  frameRate(120);
  noCursor();
  speechRec = new p5.SpeechRec("en-US", gotSpeech);

  speechRec.onEnd = speechEnd;
  speechRec.onStart = speechStart;

  mic = new p5.AudioIn();
  let sources = mic.getSources();
  if (sources.length > 0) {
    mic.setSource(0);
  }
  mic.start();
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

function draw() {
  background(0);
  if (blackScreenTimer > 0) {
    textSize(18);
    fill(255);
    noStroke();
    textAlign(CENTER);
    text("Sending input...", width / 2, height / 2);
    blackScreenTimer--;
  } else if (showSuccessMessage === true) {
    console.log("SUCCESS");
    textSize(18);
    fill(0, 255, 0);
    noStroke();
    textAlign(CENTER);
    text("Text sent successfully!", width / 2, height / 1.2);
  } else {
    // Original drawing code
    ellipse(mouseX, mouseY, 10, 10);
    noFill();
    stroke(255);
    a -= 0.1;
    micLevel = mic.getLevel();
    targetAmplitude = map(micLevel, 0, 1, 0, 500);
    amplitude = lerp(amplitude, targetAmplitude, 0.1);

    if (micStarted) {
      fill(255, 0, 0);
      textSize(18);
      noStroke();
      textAlign(CENTER);
      textFont(font);
      text("Recording...", width / 2, height / 6);

      fill(255, 0, 0);
      noStroke();
      textSize(18);
      textAlign(CENTER);
      text(recognizedSpeech, width / 2, height / 1.1);

      noFill();
      stroke(255, 0, 0);
      visual(amplitude, -5, 5, 20);
    } else {
      fill(200);
      textSize(18);
      noStroke();
      textAlign(CENTER);
      textFont(font);
      text("Click and press to speak to TsunComp", width / 2, height / 6);
      noFill();
      stroke(255);
      visual(amplitude / 5, -5, 5, 20);
    }
  }
}

function visual(amplitude, minY, maxY, d) {
  for (let x = -5; x < 1; x++) {
    for (let z = -5; z < 1; z++) {
      let xm = x * d - 8.5;
      let zm = z * d - 8.5;

      let y = int(
        amplitude *
          sin(
            0.55 *
              distance(
                x,
                z,
                map(mouseX, 0, windowHeight, minY, maxY),
                map(mouseY, 0, windowHeight, minY, maxY)
              ) +
              a
          )
      );

      let halfw = lerp(width / 2, mouseX, 0.1);
      let halfh = lerp(height / 2, mouseY, 0.1);

      let isox = int(xm - zm + halfw);
      let isoy = int((xm + zm) * 0.75 + halfh);

      ellipse(isox, isoy - y, 20, 15 + y / 5);
    }
  }
}

function distance(x, y, cx, cy) {
  return sqrt(sq(cx - x) + sq(cy - y));
}

function gotSpeech() {
  if (speechRec.resultValue && speakingFlag) {
    recognizedSpeech = speechRec.resultString;
  } else if (speechRec.resultValue && !speakingFlag) {
    recognizedSpeech = speechRec.resultString;
  }
}

function speechEnd() {
  speakingFlag = false;
}

function speechStart() {
  speakingFlag = true;
}

function getFinalSpeech() {
  finalSpeechString = recognizedSpeech;
  console.log(finalSpeechString);
  recognizedSpeech = "";

  httpPost(
    "http://localhost:9000/voiceInput/send",
    "json",
    { title: "Voice input", input: finalSpeechString },
    function (result) {
      console.log("Request sent");
    }
  );
}

function mousePressed() {
  if (millis() - lastPressed >= 300) {
    if (!micStarted) {
      console.log("Microphone started");
      speechRec.start(true, true);
    } else {
      console.log("somethings here");
      speechRec.stop();
    }
    micStarted = !micStarted;
  }
  lastPressed = millis();
}

function mouseReleased() {
  if (micStarted) {
    speechRec.stop();
    blackScreenTimer = 180;
    showSuccessMessage = true;
    setTimeout(() => {
      showSuccessMessage = false;
      getFinalSpeech();
    }, 2000);
    speakingFlag = false;
    micStarted = false;
  }
}
