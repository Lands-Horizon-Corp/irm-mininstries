import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import { z } from "zod";

import { ministerSchema } from "@/modules/ministry/ministry-validation";

export async function POST(request: NextRequest) {
  try {
    // Parse the JSON body
    const body = await request.json();

    // Validate the request data against our schema
    const validatedData = ministerSchema.parse(body);

    // Log the minister submission (for debugging - remove in production)
    console.log("Ministry submission:", {
      firstName: validatedData.firstName,
      lastName: validatedData.lastName,
      email: validatedData.email || "No email provided",
      dateOfBirth: validatedData.dateOfBirth,
      timestamp: new Date().toISOString(),
    });

    // Here you would typically:
    // 1. Save to database with auto-generated ID and timestamps
    // 2. Process all the nested arrays (children, education, etc.)
    // 3. Handle file uploads for images/signatures
    // 4. Send notification to admin
    // 5. Send welcome email to new minister
    // 6. Update minister directory cache
    // 7. Log comprehensive audit trail

    // For now, we'll simulate processing
    await new Promise((resolve) => setTimeout(resolve, 1500)); // Simulate processing time

    // Return success response
    return NextResponse.json({
      success: true,
      message: "Ministry minister added successfully",
      data: {
        id: Math.random().toString(36).substring(7), // Generate a fake ID
        name: `${validatedData.firstName} ${validatedData.lastName}`,
        email: validatedData.email,
        timestamp: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error("Ministry minister submission error:", error);

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
