import type { NextRequest } from "next/server";

import { and, count, desc, eq, ilike, or } from "drizzle-orm";

import { db } from "@/db/drizzle";
import { ministers } from "@/modules/ministry/ministry-schema";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const churchId = parseInt(id);

    if (isNaN(churchId)) {
      return Response.json({ error: "Invalid church ID" }, { status: 400 });
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") ?? "1");
    const limit = parseInt(searchParams.get("limit") ?? "10");
    const search = searchParams.get("search");
    const sortBy = searchParams.get("sortBy") ?? "createdAt";
    const sortOrder = searchParams.get("sortOrder") ?? "desc";

    const offset = (page - 1) * limit;

    // Build where conditions
    const whereConditions = [eq(ministers.churchId, churchId)];

    if (search) {
      whereConditions.push(
        or(
          ilike(ministers.firstName, `%${search}%`),
          ilike(ministers.lastName, `%${search}%`),
          ilike(ministers.email, `%${search}%`)
        )!
      );
    }

    // Get total count
    const [{ totalCount }] = await db
      .select({ totalCount: count() })
      .from(ministers)
      .where(and(...whereConditions));

    // Build sort column
    let sortColumn;
    switch (sortBy) {
      case "firstName":
        sortColumn = ministers.firstName;
        break;
      case "lastName":
        sortColumn = ministers.lastName;
        break;
      case "email":
        sortColumn = ministers.email;
        break;
      case "createdAt":
        sortColumn = ministers.createdAt;
        break;
      default:
        sortColumn = ministers.createdAt;
    }

    // Get paginated results
    const ministerList = await db
      .select()
      .from(ministers)
      .where(and(...whereConditions))
      .orderBy(sortOrder === "asc" ? sortColumn : desc(sortColumn))
      .limit(limit)
      .offset(offset);

    const totalPages = Math.ceil(totalCount / limit);

    return Response.json({
      data: ministerList,
      pagination: {
        page,
        limit,
        total: totalCount,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1,
      },
    });
  } catch (error) {
    console.error("Error fetching church ministers:", error);
    return Response.json(
      { error: "Failed to fetch church ministers" },
      { status: 500 }
    );
  }
}
