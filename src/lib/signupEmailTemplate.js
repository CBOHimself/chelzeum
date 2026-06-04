/**
 * HTML notification email for signup submissions (used by api/subscribe).
 */
export function buildSignupNotificationHtml({ name, phone, email }) {
  const safe = (v) =>
    String(v ?? "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");

  const n = safe(name);
  const p = safe(phone);
  const e = safe(email);

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>New Chelzeum signup</title>
</head>
<body style="margin:0;padding:0;background:#1a1214;font-family:'Century Gothic',Century,sans-serif;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#1a1214;padding:32px 16px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:520px;background:#24181a;border:1px solid rgba(120,66,71,0.45);">
          <tr>
            <td style="padding:28px 32px 12px;border-left:3px solid #784247;">
              <p style="margin:0 0 8px;font-size:10px;letter-spacing:0.35em;text-transform:uppercase;color:#b87a7f;">Chelzeum</p>
              <h1 style="margin:0;font-family:Georgia,'Times New Roman',serif;font-size:22px;font-weight:400;font-style:italic;color:#f4ede5;">New signup request</h1>
            </td>
          </tr>
          <tr>
            <td style="padding:8px 32px 28px;">
              <p style="margin:0 0 20px;font-size:13px;line-height:1.7;color:rgba(244,237,229,0.72);">
                Someone signed up to receive updates from the site popup.
              </p>
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="font-size:13px;color:#f4ede5;">
                <tr>
                  <td style="padding:10px 0;border-top:1px solid rgba(120,66,71,0.25);color:#b87a7f;font-size:10px;letter-spacing:0.22em;text-transform:uppercase;width:120px;">Name</td>
                  <td style="padding:10px 0;border-top:1px solid rgba(120,66,71,0.25);">${n}</td>
                </tr>
                <tr>
                  <td style="padding:10px 0;border-top:1px solid rgba(120,66,71,0.25);color:#b87a7f;font-size:10px;letter-spacing:0.22em;text-transform:uppercase;">Phone</td>
                  <td style="padding:10px 0;border-top:1px solid rgba(120,66,71,0.25);">${p}</td>
                </tr>
                <tr>
                  <td style="padding:10px 0;border-top:1px solid rgba(120,66,71,0.25);color:#b87a7f;font-size:10px;letter-spacing:0.22em;text-transform:uppercase;">Email</td>
                  <td style="padding:10px 0;border-top:1px solid rgba(120,66,71,0.25);"><a href="mailto:${e}" style="color:#d4a0a4;text-decoration:none;">${e}</a></td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td style="padding:0 32px 24px;">
              <p style="margin:0;font-size:9px;letter-spacing:0.2em;color:rgba(244,237,229,0.35);text-transform:uppercase;">chelzeum.net</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

export function buildSignupNotificationText({ name, phone, email }) {
  return [
    "New Chelzeum signup",
    "",
    `Name: ${name}`,
    `Phone: ${phone}`,
    `Email: ${email}`,
  ].join("\n");
}
