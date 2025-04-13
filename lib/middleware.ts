import { type NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import { handleApiError } from "./error-handling"

export async function validateRequest<T>(
  req: NextRequest,
  schema: z.ZodType<T>,
): Promise<{ success: true; data: T } | { success: false; error: NextResponse }> {
  try {
    const body = await req.json()
    const data = schema.parse(body)
    return { success: true, data }
  } catch (error) {
    if (error instanceof z.ZodError) {
      const formattedErrors = error.errors.map((err) => ({
        path: err.path.join("."),
        message: err.message,
      }))

      return {
        success: false,
        error: NextResponse.json({ error: "Dados inválidos", details: formattedErrors }, { status: 400 }),
      }
    }

    const apiError = handleApiError(error)
    return {
      success: false,
      error: NextResponse.json({ error: apiError.message, details: apiError.details }, { status: apiError.status }),
    }
  }
}
