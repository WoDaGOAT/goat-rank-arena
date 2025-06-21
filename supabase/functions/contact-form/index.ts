
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@3.4.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));
const CONTACT_EMAIL = "wodagoat@gmail.com"; // The verified email address that receives the contact form submissions

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

  console.log("Contact form function called");

  if (!Deno.env.get("RESEND_API_KEY")) {
    console.error("RESEND_API_KEY is not configured");
    return new Response(
        JSON.stringify({ error: "Email service is not configured." }),
        { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  }

  try {
    const { name, email, subject, message }: ContactFormPayload = await req.json();
    console.log("Processing contact form submission:", { name, email, subject });

    // Email to admin - using the verified wodagoat@gmail.com address
    console.log("Sending admin notification email...");
    const adminEmail = await resend.emails.send({
      from: "WoDaGOAT Contact <wodagoat@gmail.com>",
      to: [CONTACT_EMAIL],
      subject: `New contact form submission: ${subject}`,
      html: `
        <h2>New Contact Form Submission</h2>
        <p>You have a new contact form submission from:</p>
        <ul>
          <li><strong>Name:</strong> ${name}</li>
          <li><strong>Email:</strong> ${email}</li>
          <li><strong>Subject:</strong> ${subject}</li>
        </ul>
        <h3>Message:</h3>
        <p>${message.replace(/\n/g, "<br>")}</p>
        <hr>
        <p><em>Sent via WoDaGOAT contact form</em></p>
      `,
    });

    if (adminEmail.error) {
      console.error("Admin email error:", adminEmail.error);
      throw new Error(`Failed to send admin notification: ${adminEmail.error.message}`);
    }

    console.log("Admin email sent successfully:", adminEmail.data);

    // Confirmation email to user - using the verified wodagoat@gmail.com address
    console.log("Sending user confirmation email...");
    const userEmail = await resend.emails.send({
      from: "WoDaGOAT Team <wodagoat@gmail.com>",
      to: [email],
      subject: "We've received your message!",
      html: `
        <h1>Hi ${name},</h1>
        <p>Thanks for reaching out to WoDaGOAT! We've received your message and will get back to you as soon as possible.</p>
        <br>
        <p><strong>Your message subject:</strong> ${subject}</p>
        <br>
        <p>Best regards,<br>The WoDaGOAT Team</p>
        <hr>
        <p><em>This is an automated confirmation email.</em></p>
      `,
    });

    if (userEmail.error) {
      console.error("User email error:", userEmail.error);
      // Don't throw here - admin email worked, so we consider it a partial success
      console.log("Admin notification sent, but user confirmation failed");
    } else {
      console.log("User confirmation email sent successfully:", userEmail.data);
    }

    return new Response(JSON.stringify({ 
      message: "Message sent successfully",
      adminEmailId: adminEmail.data?.id,
      userEmailId: userEmail.data?.id || null
    }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error in contact-form function:", error);
    return new Response(
      JSON.stringify({ 
        error: error.message || "An unexpected error occurred",
        details: error.toString()
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
