import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST() {
  (await cookies()).set("token", "", {
    httpOnly: true,
    path: "/",
    expires: new Date(0), // hoặc maxAge: 0
  });

  return NextResponse.json({ success: true, message: "Logged out successfully" });
}
