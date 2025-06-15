
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@3.4.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));
const CONTACT_EMAIL = "contact@wodagoat.com"; // The email address that receives the contact form submissions

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface ContactFormPayload {
  name: string;
  email: string;
  subject: string;
  message: string;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  if (!Deno.env.get("RESEND_API_KEY")) {
    return new Response(
        JSON.stringify({ error: "Resend API key is not configured." }),
        { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  }

  try {
    const { name, email, subject, message }: ContactFormPayload = await req.json();

    // Email to admin
    const adminEmail = await resend.emails.send({
      from: "Contact Form <onboarding@resend.dev>",
      to: [CONTACT_EMAIL],
      subject: `New contact form submission: ${subject}`,
      html: `
        <p>You have a new contact form submission from:</p>
        <ul>
          <li><strong>Name:</strong> ${name}</li>
          <li><strong>Email:</strong> ${email}</li>
        </ul>
        <h2>Message:</h2>
        <p>${message.replace(/\n/g, "<br>")}</p>
      `,
    });

    if (adminEmail.error) throw new Error(adminEmail.error.message);

    // Confirmation email to user
    const userEmail = await resend.emails.send({
      from: "wodagoat <onboarding@resend.dev>",
      to: [email],
      subject: "We've received your message!",
      html: `
        <h1>Hi ${name},</h1>
        <p>Thanks for reaching out. We've received your message and will get back to you as soon as possible.</p>
        <br>
        <p><strong>Your message subject:</strong> ${subject}</p>
        <br>
        <p>Best regards,<br>The wodagoat Team</p>
      `,
    });

    if (userEmail.error) throw new Error(userEmail.error.message);


    return new Response(JSON.stringify({ message: "Emails sent successfully" }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error in contact-form function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
