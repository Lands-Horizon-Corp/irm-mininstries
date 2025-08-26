import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import { z } from "zod";

import { db } from "@/db/drizzle";
import { ministryRanks } from "@/modules/ministry-ranks/ministry-ranks-schema";
import { ministryRanksSchema } from "@/modules/ministry-ranks/ministry-ranks-validation";

export async function POST(request: NextRequest) {
  try {
    // Parse the JSON body
    const body = await request.json();

    // Validate the request data against our schema
    const validatedData = ministryRanksSchema.parse(body);

    // Save to database
    const [savedRank] = await db
      .insert(ministryRanks)
      .values({
        name: validatedData.name,
        description: validatedData.description,
      })
      .returning();

    await new Promise((resolve) => setTimeout(resolve, 300));

    // Return success response
    return NextResponse.json({
      success: true,
      message: "Ministry rank added successfully",
      data: {
        id: savedRank.id,
        name: savedRank.name,
        timestamp: savedRank.createdAt,
      },
    });
  } catch (error) {
    console.error("Ministry rank submission error:", error);

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
