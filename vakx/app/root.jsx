import {useEffect, useState} from "react";
import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "@remix-run/react";
import createApp from "@shopify/app-bridge";
import { getSessionToken } from "@shopify/app-bridge/utilities";

export default function App() {
  const [sessionToken, setSessionToken] = useState(null);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const host = urlParams.get("host");
    const shop = urlParams.get("shop");
    if (host && shop) {
      localStorage.setItem('shopify_host', host);
      console.log("Captured Host :",host);
      const app = createApp({
        apiKey: "9a4a96cb4b47cc15fa27f1ea22a28fea", // API key from the Partner Dashboard
        host, // host from URL search parameter
      });

      getSessionToken(app).then((token) => {
        console.log("Retrieved Session Token:", token);
        setSessionToken(sessionToken);
        exchangeToken(shop, token);
      })
      .catch((err)=>{
        console.error("Error Capturing the session Token", err);
      });
    }else{
      console.log("No Host Captured");
    }
  },[]);

  const exchangeToken = async (shop, sessionToken) => {
    try {
      const response = await fetch('/routes/exchange_token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          shop,
          sessionToken, // Send session token to backend
        }),
      });

      const data = await response.json();
      console.log("Access Token Response:", data);
      
      // You can handle the response as needed
    } catch (error) {
      console.error("Error sending data to backend:", error);
    }
  };

  return (
    <html>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <link rel="preconnect" href="https://cdn.shopify.com/" />
        <link
          rel="stylesheet"
          href="https://cdn.shopify.com/static/fonts/inter/v4/styles.css"
        />
        <Meta />
        <Links />
      </head>
      <body>
      <div>
          {sessionToken ? (
            <p>Session Token Retrieved</p>
          ) : (
            <p>Fetching Session Token...</p>
          )}
        </div>
        <Outlet />
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}
