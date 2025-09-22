import { NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  try {
    const { name, email, message } = await req.json();

    // ✅ Send email
    const data = await resend.emails.send({
      from: "DutyCalc <onboarding@resend.dev>", // you can replace with your domain later
      to: "your-support-email@example.com",     // replace with your email
      subject: `New Contact from ${name}`,
      html: `
        <h2>New Contact Request</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Message:</strong><br/>${message}</p>
      `,
    });

    return NextResponse.json({ success: true, data });
  } catch (error) {
    return NextResponse.json(
      { success: false, error },
      { status: 500 }
    );
  }
}