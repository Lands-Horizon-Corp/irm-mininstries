import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import { z } from "zod";

import { churchSchema } from "@/modules/church/church-validation";

export async function POST(request: NextRequest) {
  try {
    // Parse the JSON body
    const body = await request.json();

    // Validate the request data against our schema
    const validatedData = churchSchema.parse(body);

    // Log the church submission (for debugging - remove in production)
    console.log("Church submission:", {
      email: validatedData.email,
      address: validatedData.address.substring(0, 50) + "...",
      coordinates: {
        latitude: validatedData.latitude,
        longitude: validatedData.longitude,
      },
      timestamp: new Date().toISOString(),
    });

    // Here you would typically:
    // 1. Save to database with auto-generated ID and timestamps
    // 2. Validate coordinates are real locations
    // 3. Check for duplicate churches (email/coordinates)
    // 4. Send notification to admin
    // 5. Update church directory cache
    // 6. Log audit trail

    // For now, we'll simulate processing
    await new Promise((resolve) => setTimeout(resolve, 1200)); // Simulate processing time

    // Return success response
    return NextResponse.json({
      success: true,
      message: "Church added successfully",
      data: {
        id: Math.random().toString(36).substring(7), // Generate a fake ID
        email: validatedData.email,
        coordinates: {
          latitude: parseFloat(validatedData.latitude),
          longitude: parseFloat(validatedData.longitude),
        },
        timestamp: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error("Church submission error:", error);

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
