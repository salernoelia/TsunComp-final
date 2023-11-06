import { useState, useEffect } from "react";
import axios from "axios";

import "@chatscope/chat-ui-kit-styles/dist/default/styles.min.css";
import {
  MainContainer,
  ChatContainer,
  MessageList,
  Message,
  MessageInput,
  TypingIndicator,
} from "@chatscope/chat-ui-kit-react";

const ChatGPT = (props) => {
  const [myState, setMyState] = useState(0);
  const [prevMyState, setPrevMyState] = useState(0);

  const [responseData, setresponseDataToSend] = useState(
    "Data from child component"
  );
  const [promptData, setpromptDataToSend] = useState(
    "Data from child component 2"
  );

  const sendPromptToParent = (data) => {
    props.sendPromptToParent(data);
  };

  const sendResponseToParent = (data) => {
    props.sendResponseToParent(data);
  };

  useEffect(() => {
    if (myState !== prevMyState) {
      sendMessage();
      setPrevMyState(myState); // Update prevMyState to the current value
    }
  }, [myState, prevMyState]); // Specify myState and prevMyState as dependencies

  const fetchData = async () => {
    try {
      const response = await axios.get("http://localhost:9000/voiceInput/get");
      setMyState(response.data.input);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 1200);
    return () => {
      clearInterval(interval);
    };
  }, []);

  async function sendMessageToChatGPT1(message) {
    const API_KEY = ""; // Replace with your OpenAI API key

    // Construct the request body for a single message
    const apiRequestBody1 = {
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content:
            "Respond with three words no coma that give a B&W just one object, character or animal no scenery.",
        },
        {
          role: "user",
          content: message,
        },
      ],
    };

    try {
      const response = await fetch(
        "https://api.openai.com/v1/chat/completions",
        {
          method: "POST",
          headers: {
            Authorization: "Bearer " + API_KEY,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(apiRequestBody1),
        }
      );

      if (response.status === 200) {
        const responseBody = await response.json();
        const content = responseBody.choices[0]?.message?.content;
        return content;
      } else {
        console.error("Error: API request failed with status", response.status);
        return null;
      }
    } catch (error) {
      console.error("Error processing message:", error);
      return null;
    }
  }

  async function sendMessageToChatGPT2(message) {
    const API_KEY = "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"; // Replace with your OpenAI API key

    // Construct the request body for a single message

    const apiRequestBody2 = {
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content:
            "Act natural and like a good friend of the user, dont describe what the user does. Respond to messages which describe the user's feelings, their day, events in their life, and so on. You provide them with positity but not direct solutions and ask no questions. Let them know that you are drawing something for them and it will be ready soon.",
        },
        {
          role: "user",
          content: message,
        },
      ],
    };

    try {
      const response = await fetch(
        "https://api.openai.com/v1/chat/completions",
        {
          method: "POST",
          headers: {
            Authorization: "Bearer " + API_KEY,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(apiRequestBody2),
        }
      );

      if (response.status === 200) {
        const responseBody = await response.json();
        const content = responseBody.choices[0]?.message?.content;
        return content;
      } else {
        console.error("Error: API request failed with status", response.status);
        return null;
      }
    } catch (error) {
      console.error("Error processing message:", error);
      return null;
    }
  }

  const sendMessage = async () => {
    // Example usage
    const userMessage = myState;

    sendMessageToChatGPT1(userMessage).then((prompt) => {
      if (prompt) {
        console.log("ChatGPT Prompt:", prompt);
        sendPromptToParent(prompt);
      } else {
        console.log("An error occurred.");
      }
    });

    sendMessageToChatGPT2(userMessage).then((response) => {
      if (response) {
        console.log("ChatGPT Response:", response);
        sendResponseToParent(response);
      } else {
        console.log("An error occurred.");
      }
    });
  };

  const incrementState = () => {
    setMyState(myState + 1);
  };

  const sameState = () => {
    setMyState(myState);
  };

  return (
    <div className="App">
      <button onClick={sendMessage}>Send msgs</button>

      <button onClick={incrementState}>Increment State</button>
      <button onClick={sameState}>Same state</button>
    </div>
  );
};

export default ChatGPT;
