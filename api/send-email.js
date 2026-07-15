export default async function handler(req, res) {
  // Only allow POST requests from the form
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const { name, email, phone, location, year, make, model } = req.body;

  try {
    const response = await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'api-key': process.env.BREVO_API_KEY // Pulls securely from Vercel / .env
      },
      body: JSON.stringify({
        sender: { 
          name: "Wrap Connect", 
          email: "stemidacademy@gmail.com" // Your verified Brevo sender
        },
        to: [
          { 
            email: "steveswritenoah@gmail.com", // Where the form submissions will be sent
            name: "Steve Noah" 
          }
        ],
        subject: "New Driver Application - WrapConnect",
        htmlContent: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 12px;">
            <h2 style="color: #0f172a; margin-top: 0;">New Wrap Connect Application</h2>
            <p style="color: #475569; font-size: 16px;">A new driver has submitted their details on the website.</p>
            
            <h3 style="color: #1e293b; border-bottom: 2px solid #e2e8f0; padding-bottom: 8px; margin-top: 24px;">Personal Info</h3>
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Phone:</strong> ${phone}</p>
            <p><strong>Location:</strong> ${location}</p>
            
            <h3 style="color: #1e293b; border-bottom: 2px solid #e2e8f0; padding-bottom: 8px; margin-top: 24px;">Vehicle Details</h3>
            <p><strong>Year:</strong> ${year}</p>
            <p><strong>Make:</strong> ${make}</p>
            <p><strong>Model:</strong> ${model}</p>
          </div>
        `
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to send email');
    }

    return res.status(200).json({ message: 'Email sent successfully' });
  } catch (error) {
    console.error('Email sending error:', error);
    return res.status(500).json({ message: 'Error sending email', error: error.message });
  }
}