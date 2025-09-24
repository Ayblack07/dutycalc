// app/api/contact/route.ts
import { NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  try {
    const { name, email, subject, message } = await req.json();

    // Receiver address (your support inbox)
    const toEmail = "support@dutycalc.ng";

    const data = await resend.emails.send({
      from: "DutyCalc Contact <no-reply@dutycalc.ng>", // ✅ must be verified in Resend
      to: [toEmail],
      subject: `New Contact Form Message: ${subject}`,
      text: `
You have a new contact form submission:

Name: ${name}
Email: ${email}
Subject: ${subject}

Message:
${message}
      `,
      headers: {
        "Reply-To": email, // ✅ fixed: use headers instead of replyTo
      },
    });

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error("Email send failed:", error);
    return NextResponse.json(
      { success: false, error: "Failed to send message" },
      { status: 500 }
    );
  }
}