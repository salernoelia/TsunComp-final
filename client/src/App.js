import React, { Component } from "react";
import logo from "./logo.svg";
import "./App.css";
import potrace from "potrace";
import ChatGPT from "./components/ChatGPT";
import { useSpeech } from "react-speech-kit";

class App extends Component {
  constructor() {
    super();
    this.state = {
      response: "Why hello there",
      prompt: "Why hello there",
    };
  }

  promptObject = "";

  receivePromptFromChild = (data) => {
    this.setState({ prompt: data });
    console.log("PROMPT HERE: " + data);
    this.promptObject = {
      prompt:
        "SingleLineArt style B&W drawing of a cool capybara wearing sunglasses, <lora:SingleLineArt-LORA:1>, continuous line, one stroke, thin lines, thin stroke, centered",
      negative_prompt:
        "text, multiple objects, black surfaces,  color, multiple lines, complex, complexity",
      styles: [
        "professional, sleek, modern, minimalist, graphic, line art, vector graphics",
      ],
      steps: 32,
      cfg_scale: 7,
      sampler_name: "UniPC",
    };
  };

  receiveResponseFromChild = (data) => {
    this.setState({ response: data });
    console.log("RESPONSE HERE: " + data);
    this.setState({ textToSpeak: data });
    this.generateImage(this.promptObject);
    this.handleSpeakClick(data);
  };

  svgData = null;
  name = "";
  result = "";

  gcode = "";

  promptObject = {
    prompt:
      "SingleLineArt style B&W drawing of a sexy witch with a broom, <lora:SingleLineArt-LORA:1>, continuous line, one stroke, thin lines, thin stroke, centered, NSFW",
    negative_prompt:
      "text, multiple objects, black surfaces,  color, multiple lines, complex, complexity",
    styles: [
      "professional, sleek, modern, minimalist, graphic, line art, vector graphics",
      "anime, photorealistic, 35mm film, deformed, glitch, blurry, noisy, off-center, deformed, cross-eyed, closed eyes, bad anatomy, ugly, disfigured, mutated, realism, realistic, impressionism, expressionism, oil, acrylic",
    ],
    steps: 32,
    cfg_scale: 7,
    sampler_name: "UniPC",
  };

  deleteFiles = async () => {
    try {
      const response = await fetch("http://localhost:9000/deleteFiles", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (response.ok) {
        console.log("Files deleted");
        const responseData = await response.json();
        console.log(responseData);
      } else {
        console.error("Files not deleted");
        // Handle error here
      }
    } catch (error) {
      console.error("Error:", error);
      // Handle network or other errors here
    }
  };

  // Send prompt to Stable Diffusion
  generateImage = async (prompt) => {
    this.deleteFiles();
    console.log(prompt);
    try {
      const response = await fetch("http://localhost:9000/generateImage", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt }),
        responseType: "blob",
      });
      if (response.ok) {
        console.log("Image generated successfully");
        this.convertToSVG();
      } else {
        console.error("Image generation failed");
        // Handle error here
      }
    } catch (error) {
      console.error("Error:", error);
      // Handle network or other errors here
    }
  };

  convertToSVG = async () => {
    try {
      const response = await fetch("http://localhost:9000/convertToSVG", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (response.ok) {
        console.log("Execution success");
        const responseData = await response.json();
        this.extractPathFromSVG(responseData.result);
      } else {
        console.error("Execution failed");
        // Handle error here
      }
    } catch (error) {
      console.error("Error:", error);
      // Handle network or other errors here
    }
  };

  // Reformat SVG so Gcode converted correctly reads it
  extractPathFromSVG = (svgContent) => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(svgContent, "image/svg+xml");

    // Find the path element (modify the selector to match your specific SVG structure)
    const pathElement = doc.querySelector("path");

    // Extract the path data from the path element
    const pathData = pathElement.getAttribute("d");

    const svgString = `<?xml version="1.0" standalone="no"?> 
    <!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 20010904//EN" 
    "http://www.w3.org/TR/2001/REC-SVG-20010904/DTD/svg10.dtd">
    <svg version="1.0" xmlns="http://www.w3.org/2000/svg" 
    width="512pt" height="512pt" viewBox="0 0 512 512" 
    preserveAspectRatio="xMidYMid meet"> 
    <g transform="scale(0.350000)"
    fill="#000000" stroke="none"> 
    
    <path style="stroke:#000000; fill:none;" d="${pathData}"/>
    </g>
    </svg>`;
    this.svgData = svgString;
    this.saveSVG(svgString);
  };

  // Save SVG on the filesystem
  saveSVG = async (svgData) => {
    try {
      const response = await fetch("http://localhost:9000/saveSVG", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ svgData }),
      });
      if (response.ok) {
        console.log("SVG successfully saved");
        this.svg2gcode();
      } else {
        console.error("Execution failed");
        // Handle error here
      }
    } catch (error) {
      console.error("Error:", error);
      // Handle network or other errors here
    }
  };

  // Convert image to gcode and then send it to CNC.JS
  svg2gcode = async () => {
    try {
      const response = await fetch("http://localhost:9000/svg2gcode", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (response.ok) {
        console.log("Script executed successfully");
        const responseData = await response.json();
        this.result = responseData.result;
        console.log("GCODE: " + this.result);

        this.sendGcode(this.result);
      } else {
        console.error("Execution failed");
        // Handle error here
      }
    } catch (error) {
      console.error("Error:", error);
      // Handle network or other errors here
    }
  };

  sendGcode = async (data) => {
    var myHeaders = new Headers();
    myHeaders.append(
      "Cookie",
      "connect.sid=s%3ArxhEH3yLdbAoiwC6yeXc72hE2Qh5dTTI.esU%2BxR89gnu%2FGs4x6%2BmSkEQUAr2w2j5rkPgtEHifiIU; lang=en"
    );

    var formdata = new FormData();
    formdata.append("port", "COM13");
    formdata.append("name", '"Test gcode"');
    formdata.append("gcode", this.result);

    var requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: formdata,
      redirect: "follow",
    };

    fetch("http://10.128.141.223:8000/api/gcode", requestOptions)
      .then((response) => response.text())
      .then((result) => console.log(result))
      .then(this.runGCode())
      .catch((error) => console.log("error", error));
  };

  runGCode = async () => {
    try {
      const response = await fetch("http://localhost:9000/runGCode", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });
    } catch (error) {
      console.error("Error:", error);
      // Handle network or other errors here
    }
  };

  getVoiceInput = async () => {
    try {
      const response = await fetch("http://localhost:9000/voiceInput/get", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (response.ok) {
        console.log("Here's your input");
        const responseData = await response.json();
        console.log(responseData);
      } else {
        console.error("Execution failed");
        // Handle error here
      }
    } catch (error) {
      console.error("Error:", error);
      // Handle network or other errors here
    }
  };

  gptRequest = async () => {
    try {
      const response = await fetch("http://localhost:9000/chatGPT", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (response.ok) {
        console.log("Here's your input");
        const responseData = await response.json();
        console.log(responseData);
      } else {
        console.error("Execution failed");
        // Handle error here
      }
    } catch (error) {
      console.error("Error:", error);
      // Handle network or other errors here
    }
  };

  speak = (text) => {
    const synth = window.speechSynthesis;
    const utterance = new SpeechSynthesisUtterance(text);
    synth.speak(utterance);
  };

  handleInputChange = (e) => {
    this.setState({ textToSpeak: e.target.value });
  };

  handleSpeakClick = (data) => {
    var textToSpeak = data;
    if (textToSpeak.trim() !== "") {
      this.speak(textToSpeak);
    }
  };

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <button onClick={() => this.generateImage(this.promptObject)}>
            generate Image
          </button>
          <button onClick={() => this.svg2gcode()}>convert to gcode</button>
          <button onClick={() => this.sendGcode(this.result)}>
            send gcode
          </button>
          <button onClick={() => this.runGCode()}>run gcode</button>
          <button onClick={() => this.convertToSVG()}>png to svg</button>
          <button onClick={() => this.deleteFiles()}>delete files</button>
          <button onClick={() => this.getVoiceInput()}>getVoiceInput</button>
          <button onClick={() => this.handleSpeakClick()}>Speak</button>

          {this.state.prompt}
          {this.state.response}

          <ChatGPT
            initial={this.state.initialMessage}
            prompt={this.state.prompt}
            sendPromptToParent={this.receivePromptFromChild}
            sendResponseToParent={this.receiveResponseFromChild}
          ></ChatGPT>
        </header>
      </div>
    );
  }
}

export default App;
