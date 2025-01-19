// Backend code of the VAKX to send a POST request to the Shopify app to display the chatbot on the store page
const express = require('express');
const axios = require('axios');
const app = express();

// Shopify app URL, can be found in the Shopify app settings (replace with your actual Shopify app URL)
const shopifyAppUrl = 'https://recipes-passport-expressions-logic.trycloudflare.com/'; 
const endpointUrl = `${shopifyAppUrl}/routes/req`; // Endpoint URL to send the POST request to the shopify app

// Chatbot code to be sent in the POST request (here is where you will get the chatbot code (script tags) from the VAKX platform)
const chatbotCode = ` 
  <script src="https://cdn.vakx.io/vakchat/vanilla-v5.0.0.js"></script>

  <script>
    // Function to initialize and display the chatbot on page load
    window.onload = function() {
      // Initialize the chatbot
      window.initVAKChat({
        VAKFlowID: "uoUVDR4Pktr9HKiHLpHS",  // Replace with your actual FlowID
        btnText: "AI Assistant",  // Text for the chatbot button (set by VAKChat itself)
        theme: "dark",  // Set the theme for the chatbot
        shade: "amber",  // Set the theme shade
        introMessage: "Hello, I'm your AI assistant, here to help! How can I assist you today?",  // Intro message
        defaultPopupSize: "small",  // Set the default size of the popup
        emailRequired: false,  // Set to true if email is required
        contactRequired: false,  // Set to true if contact number is required
        nameRequired: false  // Set to true if name is required
      });
      
      // Ensure the chatbot widget is visible immediately
      document.getElementById("vakchat").style.display = "block";  // Make sure the widget is visible
    };
  </script>
`;

// Send the POST request to the Shopify app
app.post('/api/send-request', (req, res) => {
  axios.post(endpointUrl, {
    data: chatbotCode,
  }, {
    headers: {
      'Content-Type': 'text/plain',
    },
  })
    .then((response) => {
      res.json(response.data);
    })
    .catch((error) => {
      console.error(error);
      res.status(500).json({ error: 'Failed to send request' });
    });
});

// Serve the index.html file (VAKX frontend code)
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

const port = 3000;
app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});

