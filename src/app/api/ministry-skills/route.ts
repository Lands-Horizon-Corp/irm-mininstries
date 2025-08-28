import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import { asc, count, desc, ilike, or } from "drizzle-orm";
import { z } from "zod";

import { db } from "@/db/drizzle";
import { ministrySkills } from "@/modules/ministry-skills/ministry-skills-schema";
import { ministrySkillsSchema } from "@/modules/ministry-skills/ministry-skills-validation";

// GET - Get all ministry skills with pagination and search
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    // Extract query parameters
    const page = Math.max(1, parseInt(searchParams.get("page") || "1"));
    const limit = Math.min(
      100,
      Math.max(1, parseInt(searchParams.get("limit") || "10"))
    );
    const search = searchParams.get("search")?.trim() || "";
    const sortBy = searchParams.get("sortBy") || "createdAt";
    const sortOrder = searchParams.get("sortOrder") || "desc";

    const offset = (page - 1) * limit;

    // Build where clause for search
    const whereClause = search
      ? or(
          ilike(ministrySkills.name, `%${search}%`),
          ilike(ministrySkills.description, `%${search}%`)
        )
      : undefined;

    // Build order clause
    const orderClause =
      sortOrder === "asc"
        ? asc(
            ministrySkills[sortBy as keyof typeof ministrySkills._.columns] ||
              ministrySkills.createdAt
          )
        : desc(
            ministrySkills[sortBy as keyof typeof ministrySkills._.columns] ||
              ministrySkills.createdAt
          );

    // Get total count for pagination
    const [totalResult] = await db
      .select({ count: count() })
      .from(ministrySkills)
      .where(whereClause);

    const total = totalResult.count;

    // Get paginated results
    const results = await db
      .select()
      .from(ministrySkills)
      .where(whereClause)
      .orderBy(orderClause)
      .limit(limit)
      .offset(offset);

    const totalPages = Math.ceil(total / limit);

    return NextResponse.json({
      success: true,
      data: results,
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1,
      },
      search: search || null,
      sort: {
        by: sortBy,
        order: sortOrder,
      },
    });
  } catch (error) {
    console.error("Get ministry skills error:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Internal server error",
        message: "Failed to fetch ministry skills",
      },
      { status: 500 }
    );
  }
}

// POST - Create new ministry skill
export async function POST(request: NextRequest) {
  try {
    // Parse the JSON body
    const body = await request.json();

    // Validate the request data against our schema
    const validatedData = ministrySkillsSchema.parse(body);

    // Save to database
    const [savedSkill] = await db
      .insert(ministrySkills)
      .values({
        name: validatedData.name,
        description: validatedData.description,
      })
      .returning();

    // Return success response
    return NextResponse.json({
      success: true,
      message: "Ministry skill added successfully",
      data: savedSkill,
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

    // Handle duplicate key errors
    if (error instanceof Error && error.message.includes("duplicate key")) {
      return NextResponse.json(
        {
          success: false,
          error: "Duplicate entry",
          message: "A ministry skill with this name already exists",
        },
        { status: 409 }
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
