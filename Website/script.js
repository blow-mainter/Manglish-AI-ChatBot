// TaLim AI
const chatInput = document.querySelector("#chat-input");
const sendButton = document.querySelector("#send-btn");
const chatContainer = document.querySelector(".chat-container");
const themeButton = document.querySelector("#theme-btn");
const deleteButton = document.querySelector("#delete-btn");

let userText = null;



// neww

async function fetchData() {
      try {
        const response = await fetch('external_data.json'); // Replace 'external_data.json' with your file path
        const data = await response.json();
        return data;
      } catch (error) {
        console.error('Error fetching data:', error);
        return null;
      }
    }
    
    
  
function findSimilarPhrase(userInput, phrases) {
      let maxSimilarity = 0;
      let similarPhrase = null;

      phrases.forEach(phrase => {
        const similarity = stringSimilarity.compareTwoStrings(userInput, phrase);
        if (similarity > maxSimilarity) {
          maxSimilarity = similarity;
          similarPhrase = phrase;
        }
      });

      return maxSimilarity >= 0.5 ? similarPhrase : null;
    }
    
    
    
    
    
    
    
    
    
    // Modify the getResponse function to accept user input and return the response or a random message
async function getResponse(userInput) {
  try {
    let response = 'No response found';

    const externalData = await fetchData();

    if (externalData) {
      const data = externalData;

      // Check for exact matching inputs
      data.forEach(entry => {
        const inputs = entry['Input'].map(phrase => phrase.toLowerCase());
        if (inputs.includes(userInput.toLowerCase())) {
          const responses = entry['Response'];
          response = responses[Math.floor(Math.random() * responses.length)];
        }
      });

      // If no exact matching response found, try finding similar phrases
      if (response === 'No response found') {
        data.forEach(entry => {
          const inputs = entry['Input'].map(phrase => phrase.toLowerCase());
          const similarPhrase = findSimilarPhrase(userInput.toLowerCase(), inputs);
          if (similarPhrase) {
            const responses = entry['Response'];
            response = responses[Math.floor(Math.random() * responses.length)];
          }
        });
      }
    }

    // If still no response found, select a random message
    if (response === 'No response found') {
      const randomMessages = ["👀", "Enthonn", "Eeh", "😶"];
      response = randomMessages[Math.floor(Math.random() * randomMessages.length)];
    }

    return response;
  } catch (error) {
    console.error('Error processing response:', error);
    return 'Error occurred while processing the message';
  }
}









const loadDataFromLocalstorage = () => {
    // Load saved chats and theme from local storage and apply/add on the page
    const themeColor = localStorage.getItem("themeColor");

    document.body.classList.toggle("light-mode", themeColor === "light_mode");
    themeButton.innerText = document.body.classList.contains("light-mode") ? "dark_mode" : "light_mode";

    const defaultText = `<div class="default-text">
                            <h1>Manglish AI Bot</h1>
                            <p>Welcome To Manglish AI ChatBot<br> Developed By Ashik</p>
                            <br>
                            <p>This AI Was Under Training - Sometimes it may send wrong outputs and this version was using a test Manglish AI Backend not real Manglish AI </p>
                        </div>`

    chatContainer.innerHTML = localStorage.getItem("all-manglish-ai-chats") || defaultText;
    chatContainer.scrollTo(0, chatContainer.scrollHeight); // Scroll to bottom of the chat container
}

const createChatElement = (content, className) => {
    // Create new div and apply chat, specified class and set html content of div
    const chatDiv = document.createElement("div");
    chatDiv.classList.add("chat", className);
    chatDiv.innerHTML = content;
    return chatDiv; // Return the created chat div
}

const getChatResponse = async (incomingChatDiv) => {



const pElement = document.createElement("p");



   const userInput = userText; // Replace this with the actual user input
getResponse(userInput)
  .then(response => {
    console.log('Bot Response:', response);
    
    pElement.textContent = response;
  })
  .catch(error => {
    console.error('Error:', error);
    pElement.classList.add("error");
        pElement.textContent = "Oops! Something went wrong while retrieving the message. Please try again.";
  });
   
   

// Define the code logic to be executed after 5 seconds
function afterResp() {



// Example usage:



  incomingChatDiv.querySelector(".typing-animation").remove();
    incomingChatDiv.querySelector(".chat-details").appendChild(pElement);
    localStorage.setItem("all-manglish-ai-chats", chatContainer.innerHTML);
    chatContainer.scrollTo(0, chatContainer.scrollHeight);
}


setTimeout(afterResp, 1000);
    
}

const copyResponse = (copyBtn) => {
    // Copy the text content of the response to the clipboard
    const reponseTextElement = copyBtn.parentElement.querySelector("p");
    navigator.clipboard.writeText(reponseTextElement.textContent);
    copyBtn.textContent = "done";
    setTimeout(() => copyBtn.textContent = "content_copy", 1000);
}

const showTypingAnimation = () => {
    // Display the typing animation and call the getChatResponse function
    const html = `<div class="chat-content">
                    <div class="chat-details">
                        <img src="images/brain.png" alt="chatbot-img" style="border-radius:50%;">
                        <div class="typing-animation">
                            <div class="typing-dot" style="--delay: 0.2s"></div>
                            <div class="typing-dot" style="--delay: 0.3s"></div>
                            <div class="typing-dot" style="--delay: 0.4s"></div>
                        </div>
                    </div>
                    <span onclick="copyResponse(this)" class="material-symbols-rounded">content_copy</span>
                </div>`;
    // Create an incoming chat div with typing animation and append it to chat container
    const incomingChatDiv = createChatElement(html, "incoming");
    chatContainer.appendChild(incomingChatDiv);
    chatContainer.scrollTo(0, chatContainer.scrollHeight);
    
        
    
    getChatResponse(incomingChatDiv);
    
    
    
}

const handleOutgoingChat = () => {
    
    var text = chatInput.value.trim();
    
    userText = text;

     // Get chatInput value and remove extra spaces
    if(!text) return; // If chatInput is empty return from here

    // Clear the input field and reset its height
    chatInput.value = "";
    chatInput.style.height = `${initialInputHeight}px`;

    const html = `<div class="chat-content">
                    <div class="chat-details">
                        <img src="images/profile.png" alt="user-img" style="border-radius:50%;">
                        
                        <p>${text}</p>
                        
                    </div>
                </div>`;

    // Create an outgoing chat div with user's message and append it to chat container
    const outgoingChatDiv = createChatElement(html, "outgoing");
    chatContainer.querySelector(".default-text")?.remove();
    chatContainer.appendChild(outgoingChatDiv);
    chatContainer.scrollTo(0, chatContainer.scrollHeight);
    setTimeout(showTypingAnimation, 500);
}

deleteButton.addEventListener("click", () => {
    // Remove the chats from local storage and call loadDataFromLocalstorage function
    if(confirm("Are you sure you want to delete all the chats?")) {
        localStorage.removeItem("all-manglish-ai-chats");
        loadDataFromLocalstorage();
    }
});

themeButton.addEventListener("click", () => {
    // Toggle body's class for the theme mode and save the updated theme to the local storage 
    document.body.classList.toggle("light-mode");
    localStorage.setItem("themeColor", themeButton.innerText);
    themeButton.innerText = document.body.classList.contains("light-mode") ? "dark_mode" : "light_mode";
});

const initialInputHeight = chatInput.scrollHeight;

chatInput.addEventListener("input", () => {   
    // Adjust the height of the input field dynamically based on its content
    chatInput.style.height =  `${initialInputHeight}px`;
    chatInput.style.height = `${chatInput.scrollHeight}px`;
});

chatInput.addEventListener("keydown", (e) => {
    // If the Enter key is pressed without Shift and the window width is larger 
    // than 800 pixels, handle the outgoing chat
    if (e.key === "Enter" && !e.shiftKey && window.innerWidth > 800) {
        e.preventDefault();
        handleOutgoingChat();
    }
});

loadDataFromLocalstorage();
sendButton.addEventListener("click", handleOutgoingChat);
        
