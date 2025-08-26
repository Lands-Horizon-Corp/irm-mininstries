import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import { z } from "zod";

import { ministrySkillsSchema } from "@/modules/ministry-skills/ministry-skills-validation";

export async function POST(request: NextRequest) {
  try {
    // Parse the JSON body
    const body = await request.json();

    // Validate the request data against our schema
    const validatedData = ministrySkillsSchema.parse(body);

    // Log the ministry skill submission (for debugging - remove in production)
    console.log("Ministry skill submission:", {
      name: validatedData.name,
      description: validatedData.description.substring(0, 50) + "...",
      timestamp: new Date().toISOString(),
    });

    // Here you would typically:
    // 1. Save to database
    // 2. Send notification to admin
    // 3. Update ministry skills cache
    // 4. Log audit trail

    // For now, we'll simulate processing
    await new Promise((resolve) => setTimeout(resolve, 800)); // Simulate processing time

    // Return success response
    return NextResponse.json({
      success: true,
      message: "Ministry skill added successfully",
      data: {
        id: Math.random().toString(36).substring(7), // Generate a fake ID
        name: validatedData.name,
        timestamp: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error("Ministry skill submission error:", error);

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
