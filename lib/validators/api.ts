import { z } from "zod";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function validateRequest<T>(
  req: NextRequest,
  schema: z.ZodType<T>
): Promise<
  { success: true; data: T } | { success: false; error: NextResponse }
> {
  try {
    const body = await req.json();
    const data = schema.parse(body);
    return { success: true, data };
  } catch (error) {
    console.error("Validation error:", error);
    return {
      success: false,
      error: NextResponse.json(
        { error: "Invalid request data" },
        { status: 400 }
      ),
    };
  }
}
