import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import { z } from "zod";

import { db } from "@/db/drizzle";
import { contactSubmissions } from "@/modules/contact-us/contact-us-schema";
import { contactUsFormSchema } from "@/modules/contact-us/contact-us-validation";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = contactUsFormSchema.parse(body);
    const [savedContact] = await db
      .insert(contactSubmissions)
      .values({
        name: validatedData.name,
        email: validatedData.email,
        subject: validatedData.subject,
        description: validatedData.description,
        prayerRequest: validatedData.prayerRequest || null,
        supportEmail: validatedData.supportEmail,
      })
      .returning();

    // Return success response
    return NextResponse.json({
      success: true,
      message: "Contact form submitted successfully",
      data: {
        id: savedContact.id,
        timestamp: savedContact.createdAt,
      },
    });
  } catch (error) {
    console.error("Contact form submission error:", error);

    // Handle Zod validation errors
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          success: false,
          error: "Validation failed",
          details: error.issues.map((err) => ({
            field: err.path.join("."),
            message: err.message,
          })),
        },
        { status: 400 }
      );
    }

    // Handle other errors
    return NextResponse.json(
      {
        success: false,
        error: "Internal server error",
        message: "Something went wrong while processing your request",
      },
      { status: 500 }
    );
  }
}

// Handle unsupported methods
export async function GET() {
  return NextResponse.json(
    {
      success: false,
      error: "Method not allowed",
      message: "GET method is not supported for this endpoint",
    },
    { status: 405 }
  );
}

export async function PUT() {
  return NextResponse.json(
    {
      success: false,
      error: "Method not allowed",
      message: "PUT method is not supported for this endpoint",
    },
    { status: 405 }
  );
}

export async function DELETE() {
  return NextResponse.json(
    {
      success: false,
      error: "Method not allowed",
      message: "DELETE method is not supported for this endpoint",
    },
    { status: 405 }
  );
}
