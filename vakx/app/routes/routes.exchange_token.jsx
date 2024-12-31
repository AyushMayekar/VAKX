import { json } from "@remix-run/node";
import axios from "axios";

export async function action({ request }) {
  const { shop, sessionToken } = await request.json();

  // Shopify API credentials
  const client_id = '9a4a96cb4b47cc15fa27f1ea22a28fea';
  const client_secret = 'ceeb1b18021b32092fa737d0f4db4ff3';

  try {
    const response = await axios.post(`https://${shop}/admin/oauth/access_token`, {
      client_id,
      client_secret,
      grant_type: 'urn:ietf:params:oauth:grant-type:token-exchange',
      subject_token: sessionToken,
      subject_token_type: 'urn:ietf:params:oauth:token-type:id_token',
      requested_token_type: 'urn:shopify:params:oauth:token-type:online-access-token',
    });

    return json({
      accessToken: response.data.access_token,
      expires_in: response.data.expires_in,
    });
  } catch (error) {
    console.error('Error exchanging token:', error);
    return json({ error: 'Error exchanging token' }, { status: 500 });
  }
}