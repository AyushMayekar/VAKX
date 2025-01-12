// routes/req.js
import { json } from '@remix-run/node';
import fs from 'fs';
const shopDataStore = {};

export const action = async ({ request }) => {
  const contentType = request.headers.get("Content-Type");

  if (contentType === "application/json") {
    // Handle JSON requests (e.g., shop details)
    const data = await request.json();

    if (data.shop && data.accessToken) {
      // Handle shop details from root.jsx
      // console.log("Received shop details:", data);

      // Store shop details in memory (replace with database logic)
      shopDataStore[data.shop] = {
        accessToken: data.accessToken,
        sessionToken: data.sessionToken,
        shopName: data.shop,
      };

      return json({ message: "Shop details saved successfully" });
    } else {
      return json({ error: "Invalid shop details" }, { status: 400 });
    }
  } else if (contentType === "text/plain") {
    // Handle plain text requests (e.g., chatbot code)
    const chatbotCode = await request.text();
    // console.log("Received chatbot code as text:", chatbotCode);
    await saveChatbotCodeInMetafield(chatbotCode);
    await updateChatbotLiquidFile(chatbotCode);
    // You can add your logic here to handle the chatbot code
    return json({ message: "Chatbot code received successfully" });
  } else {
    return new Response("Invalid request", { status: 400 });
  }
};


// Save Chatbot Code in Metafield 
const saveChatbotCodeInMetafield = async (chatbotCode) => {
  for (const shop in shopDataStore) {
    const shopdetails = shopDataStore[shop];
    // console.log("Shop details for the Metafield:", shopdetails);
    if(shopdetails){
      try{       
        const shopIdResponse = await fetch(`https://${shop}/admin/api/2024-10/graphql.json`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Shopify-Access-Token': shopdetails.accessToken.accessToken,
        },
        body: JSON.stringify({
          query: `
            query GetShopId {
              shop {
                id
              }
            }
          `,
        }),
      });

      const shopIdData = await shopIdResponse.json();
      const shopId = shopIdData.data.shop.id;
    
  const response = await fetch(`https://${shop}/admin/api/2024-10/graphql.json`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Access-Token': shopdetails.accessToken.accessToken,
    },
    body: JSON.stringify({
      query: `
          mutation MetafieldsSet($value: String!, $ownerId: ID!) {
          metafieldsSet(metafields: [
            {
              namespace: "chatbot",
              key: "integration_code",
              type: "multi_line_text_field",
              value: $value,
              ownerId: $ownerId
            }
          ]) {
            metafields {
              id
              namespace
              key
              value
            }
            userErrors {
              field
              message
            }
          }
        }
      `,
      variables: {
        value: chatbotCode,
        ownerId: shopId,
      },
    }),
  });
    
  const responseData = await response.json();
  // console.log("Chatbot code saved in metafield:", responseData.data.metafieldsSet.metafields);
}catch(error){
  console.error("Error saving chatbot code in metafield:", error);
}
}else{
  console.error("Shop details not found in shopDataStore");
    }
  }
};


// Update Chatbot Liquid File
async function updateChatbotLiquidFile(chatbotCode) {
  const chatbotCodeObject = JSON.parse(chatbotCode);
  // console.log("Chatbot Code : ", chatbotCodeObject.data);
  const filePath = 'extensions/chatbot/blocks/Chatbot.liquid';
  const fileContent = fs.readFileSync(filePath, 'utf8');
  const startComment = '<!-- Load the chatbot script -->';
  const endComment = '<!-- END --->';
  const startIndex = fileContent.indexOf(startComment);
  const endIndex = fileContent.indexOf(endComment);
  if (startIndex !== -1 && endIndex !== -1) {
    const updatedFileContent = fileContent.substring(0, startIndex + startComment.length) + chatbotCodeObject.data + fileContent.substring(endIndex);
    fs.writeFileSync(filePath, updatedFileContent);
  } else {
    const updatedFileContent = fileContent + '\n' + startComment + '\n' + chatbotCodeObject.data + '\n' + endComment;
    fs.writeFileSync(filePath, updatedFileContent);
  }
}

