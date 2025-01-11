// send_req.js
const axios = require('axios');

const shopifyAppUrl = 'https://sr-relying-communications-updated.trycloudflare.com/';
const endpointUrl = `${shopifyAppUrl}/routes/req`;
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

const sendData = async () => {
  try {
    const response = await axios.post(endpointUrl, {
      data: chatbotCode,
    }, {
      headers: {
        'Content-Type': 'text/plain',
      },
    });

    console.log(response.data);
  } catch (error) {
    console.error(error);
  }
};

sendData();

