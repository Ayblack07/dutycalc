import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!, // only on server
  {
    auth: { persistSession: false },
  }
);

interface VerifyRequest {
  reference: string;
  userId: string;
  plan: string;
}

export async function POST(req: Request): Promise<NextResponse> {
  try {
    const body: VerifyRequest = await req.json();

    const res = await fetch(
      `https://api.paystack.co/transaction/verify/${body.reference}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
        },
      }
    );

    const data = await res.json();

    if (data.status && data.data.status === "success") {
      const now = new Date();
      const end = new Date(now);

      if (body.plan.includes("year")) {
        end.setFullYear(end.getFullYear() + 1);
      } else {
        end.setMonth(end.getMonth() + 1);
      }

      const { error } = await supabase.from("subscriptions").insert({
        user_id: body.userId,
        plan: body.plan,
        status: "active",
        start_date: now.toISOString(),
        end_date: end.toISOString(),
      });

      if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
      }

      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ success: false }, { status: 400 });
  } catch (err) {
    if (err instanceof Error) {
      return NextResponse.json({ error: err.message }, { status: 500 });
    }
    return NextResponse.json({ error: "Unknown error" }, { status: 500 });
  }
}