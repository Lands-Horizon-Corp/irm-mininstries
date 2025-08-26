import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import { z } from "zod";

import { contactUsFormSchema } from "@/modules/contact-us/contact-us-validation";

export async function POST(request: NextRequest) {
  try {
    // Parse the JSON body
    const body = await request.json();

    // Validate the request data against our schema
    const validatedData = contactUsFormSchema.parse(body);

    // Log the contact form submission (for debugging - remove in production)
    console.log("Contact form submission:", {
      name: validatedData.name,
      email: validatedData.email,
      subject: validatedData.subject,
      timestamp: new Date().toISOString(),
    });

    // Here you would typically:
    // 1. Save to database
    // 2. Send email notification
    // 3. Send auto-reply email
    // 4. Integrate with CRM

    // For now, we'll simulate processing
    await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate processing time

    // Return success response
    return NextResponse.json({
      success: true,
      message: "Contact form submitted successfully",
      data: {
        id: Math.random().toString(36).substring(7), // Generate a fake ID
        timestamp: new Date().toISOString(),
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
