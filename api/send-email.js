export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { name, email, phone, address, city, state, type, make, year, miles, wrapType } = req.body;
  const brevoApiKey = process.env.BREVO_API_KEY;

  if (!brevoApiKey) {
    return res.status(500).json({ error: 'Brevo API key is missing from Environment Variables' });
  }

  // Construct the email data
  const payload = {
    sender: { 
      name: "WrapConnect", 
      email: "hello@wrapconnect.online" 
    }, 
    to: [
      { email: "wrapconnect-applications@googlegroups.com", name: "WrapConnect Applications" }
    ],
    subject: `New Driver Application: ${name}`,
    htmlContent: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden;">
        <div style="background-color: #0f172a; padding: 24px; text-align: center;">
          <h2 style="color: #ffffff; margin: 0;">New Application Received</h2>
        </div>
        <div style="padding: 32px; background-color: #ffffff; color: #334155; line-height: 1.6;">
          <p style="margin-top: 0;">A new driver has submitted an application. Here are their details:</p>
          
          <table style="width: 100%; border-collapse: collapse; margin-top: 20px;">
            <tr>
              <td style="padding: 12px 0; border-bottom: 1px solid #e2e8f0;"><strong>Name:</strong></td>
              <td style="padding: 12px 0; border-bottom: 1px solid #e2e8f0;">${name}</td>
            </tr>
            <tr>
              <td style="padding: 12px 0; border-bottom: 1px solid #e2e8f0;"><strong>Email:</strong></td>
              <td style="padding: 12px 0; border-bottom: 1px solid #e2e8f0;"><a href="mailto:${email}" style="color: #2563eb;">${email}</a></td>
            </tr>
            <tr>
              <td style="padding: 12px 0; border-bottom: 1px solid #e2e8f0;"><strong>Phone:</strong></td>
              <td style="padding: 12px 0; border-bottom: 1px solid #e2e8f0;">${phone}</td>
            </tr>
            <tr>
              <td style="padding: 12px 0; border-bottom: 1px solid #e2e8f0;"><strong>Address:</strong></td>
              <td style="padding: 12px 0; border-bottom: 1px solid #e2e8f0;">${address}<br/>${city}, ${state}</td>
            </tr>
            <tr>
              <td style="padding: 12px 0; border-bottom: 1px solid #e2e8f0;"><strong>Vehicle:</strong></td>
              <td style="padding: 12px 0; border-bottom: 1px solid #e2e8f0;">${year} ${make} ${type}</td>
            </tr>
            <tr>
              <td style="padding: 12px 0; border-bottom: 1px solid #e2e8f0;"><strong>Avg. Mileage:</strong></td>
              <td style="padding: 12px 0; border-bottom: 1px solid #e2e8f0;">${miles} miles/week</td>
            </tr>
            <tr>
              <td style="padding: 12px 0; border-bottom: 1px solid #e2e8f0;"><strong>Wrap Preference:</strong></td>
              <td style="padding: 12px 0; border-bottom: 1px solid #e2e8f0;">${wrapType}</td>
            </tr>
          </table>
        </div>
      </div>
    `
  };

  try {
    const response = await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: {
        'accept': 'application/json',
        'api-key': brevoApiKey,
        'content-type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const errorData = await response.json();
      return res.status(response.status).json({ error: errorData });
    }

    const data = await response.json();
    return res.status(200).json({ success: true, data });
    
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}