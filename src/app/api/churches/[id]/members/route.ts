import type { NextRequest } from "next/server";

import { and, count, desc, eq, ilike, or } from "drizzle-orm";

import { db } from "@/db/drizzle";
import { members } from "@/modules/member/member-schema";

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
    const whereConditions = [eq(members.churchId, churchId)];

    if (search) {
      whereConditions.push(
        or(
          ilike(members.firstName, `%${search}%`),
          ilike(members.lastName, `%${search}%`),
          ilike(members.email, `%${search}%`),
          ilike(members.occupation, `%${search}%`)
        )!
      );
    }

    // Get total count
    const [{ totalCount }] = await db
      .select({ totalCount: count() })
      .from(members)
      .where(and(...whereConditions));

    // Build sort column
    let sortColumn;
    switch (sortBy) {
      case "firstName":
        sortColumn = members.firstName;
        break;
      case "lastName":
        sortColumn = members.lastName;
        break;
      case "email":
        sortColumn = members.email;
        break;
      case "createdAt":
        sortColumn = members.createdAt;
        break;
      default:
        sortColumn = members.createdAt;
    }

    // Get paginated results
    const memberList = await db
      .select()
      .from(members)
      .where(and(...whereConditions))
      .orderBy(sortOrder === "asc" ? sortColumn : desc(sortColumn))
      .limit(limit)
      .offset(offset);

    const totalPages = Math.ceil(totalCount / limit);

    return Response.json({
      data: memberList,
      pagination: {
        page,
        limit,
        total: totalCount,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1,
      },
    });
  } catch {
    return Response.json(
      { error: "Failed to fetch church members" },
      { status: 500 }
    );
  }
}
