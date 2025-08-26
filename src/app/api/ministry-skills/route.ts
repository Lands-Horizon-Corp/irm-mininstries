import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import { z } from "zod";

import { db } from "@/db/drizzle";
import { ministrySkills } from "@/modules/ministry-skills/ministry-skills-schema";
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

    // Save to database
    const [savedSkill] = await db
      .insert(ministrySkills)
      .values({
        name: validatedData.name,
        description: validatedData.description,
      })
      .returning();

    // Here you would typically also:
    // 1. Send notification to admin
    // 2. Update ministry skills cache
    // 3. Log audit trail

    // Simulate additional processing time
    await new Promise((resolve) => setTimeout(resolve, 300));

    // Return success response
    return NextResponse.json({
      success: true,
      message: "Ministry skill added successfully",
      data: {
        id: savedSkill.id,
        name: savedSkill.name,
        timestamp: savedSkill.createdAt,
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
