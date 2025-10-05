import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import { asc, count, desc, ilike, or } from "drizzle-orm";
import { z } from "zod";

import { db } from "@/db/drizzle";
import { ministryRanks } from "@/modules/ministry-ranks/ministry-ranks-schema";
import { ministryRanksSchema } from "@/modules/ministry-ranks/ministry-ranks-validation";

// GET - Get all ministry ranks with pagination and search
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
          ilike(ministryRanks.name, `%${search}%`),
          ilike(ministryRanks.description, `%${search}%`)
        )
      : undefined;

    // Build order clause
    const orderClause =
      sortOrder === "asc"
        ? asc(
            ministryRanks[sortBy as keyof typeof ministryRanks._.columns] ||
              ministryRanks.createdAt
          )
        : desc(
            ministryRanks[sortBy as keyof typeof ministryRanks._.columns] ||
              ministryRanks.createdAt
          );

    // Get total count for pagination
    const [totalResult] = await db
      .select({ count: count() })
      .from(ministryRanks)
      .where(whereClause);

    const total = totalResult.count;

    // Get paginated results
    const results = await db
      .select()
      .from(ministryRanks)
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
  } catch {
    return NextResponse.json(
      {
        success: false,
        error: "Internal server error",
        message: "Failed to fetch ministry ranks",
      },
      { status: 500 }
    );
  }
}

// POST - Create new ministry rank
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
        description: validatedData.description || null,
      })
      .returning();

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

    // Handle duplicate key errors (unique constraint violation)
    if (error instanceof Error && error.message.includes("duplicate key")) {
      return NextResponse.json(
        {
          success: false,
          error: "Duplicate entry",
          message: "A ministry rank with this name already exists",
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
