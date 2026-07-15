export interface EmailParams {
  to: string;
  subject: string;
  bodyHtml: string;
}

/**
 * Encodes a string as base64url, safely supporting UTF-8 characters.
 */
function base64UrlEncode(str: string): string {
  const base64 = btoa(unescape(encodeURIComponent(str)));
  return base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

/**
 * Composes a full MIME email message and sends it via the Gmail API.
 */
export async function sendEmail(accessToken: string, params: EmailParams): Promise<any> {
  const { to, subject, bodyHtml } = params;

  // Construct MIME message
  const mimeParts = [
    `To: ${to}`,
    `Subject: =?utf-8?B?${btoa(unescape(encodeURIComponent(subject)))}?=`, // Safely encode non-ascii characters in headers
    'MIME-Version: 1.0',
    'Content-Type: text/html; charset=utf-8',
    'Content-Transfer-Encoding: base64',
    '',
    // Base64 encode the HTML body
    btoa(unescape(encodeURIComponent(bodyHtml)))
  ];

  const rawMessage = mimeParts.join('\r\n');
  const encodedRaw = base64UrlEncode(rawMessage);

  const response = await fetch('https://gmail.googleapis.com/gmail/v1/users/me/messages/send', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      raw: encodedRaw,
    }),
  });

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`Gmail API error: ${response.status} - ${errText}`);
  }

  return response.json();
}

/**
 * Retrieves the profile of the current authenticated user from Gmail API.
 */
export async function getGmailProfile(accessToken: string): Promise<{ emailAddress: string; messagesTotal: number } | null> {
  try {
    const response = await fetch('https://gmail.googleapis.com/gmail/v1/users/me/profile', {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      },
    });
    if (!response.ok) return null;
    return response.json();
  } catch (error) {
    console.error('Failed to fetch Gmail profile:', error);
    return null;
  }
}
