import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import { z } from "zod";

import { db } from "@/db/drizzle";
import { churches } from "@/modules/church/church-schema";
import { churchSchema } from "@/modules/church/church-validation";

export async function POST(request: NextRequest) {
  try {
    // Parse the JSON body
    const body = await request.json();

    // Validate the request data against our schema
    const validatedData = churchSchema.parse(body);

    // Save to database
    const [savedChurch] = await db
      .insert(churches)
      .values({
        imageUrl: validatedData.imageUrl,
        email: validatedData.email,
        address: validatedData.address,
        description: validatedData.description,
        latitude: validatedData.latitude,
        longitude: validatedData.longitude,
      })
      .returning();

    // Return success response
    return NextResponse.json({
      success: true,
      message: "Church added successfully",
      data: {
        id: savedChurch.id,
        email: savedChurch.email,
        coordinates: {
          latitude: parseFloat(savedChurch.latitude),
          longitude: parseFloat(savedChurch.longitude),
        },
        timestamp: savedChurch.createdAt,
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
