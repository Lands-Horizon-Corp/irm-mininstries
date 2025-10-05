import type { NextRequest } from "next/server";

import { eq, ilike, or, sql } from "drizzle-orm";

import { db } from "@/db/drizzle";
import { churches, ministers } from "@/db/schema";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("q");

    if (!query || query.length < 2) {
      return Response.json({
        success: false,
        message: "Query must be at least 2 characters long",
        data: [],
      });
    }

    // Split the query into words for flexible searching
    const queryWords = query
      .trim()
      .split(/\s+/)
      .filter((word) => word.length > 0);

    // Build search conditions for name matching
    const nameSearchConditions = queryWords.flatMap((word) => [
      ilike(ministers.firstName, `%${word}%`),
      ilike(ministers.lastName, `%${word}%`),
      ilike(ministers.middleName, `%${word}%`),
    ]);

    // Also search for full name combinations
    const fullNameConditions = [
      ilike(
        sql`CONCAT(${ministers.firstName}, ' ', COALESCE(${ministers.middleName}, ''), ' ', ${ministers.lastName})`,
        `%${query}%`
      ),
      ilike(
        sql`CONCAT(${ministers.firstName}, ' ', ${ministers.lastName})`,
        `%${query}%`
      ),
      ilike(
        sql`CONCAT(${ministers.lastName}, ', ', ${ministers.firstName})`,
        `%${query}%`
      ),
    ];

    const searchResults = await db
      .select({
        id: ministers.id,
        firstName: ministers.firstName,
        lastName: ministers.lastName,
        middleName: ministers.middleName,
        imageUrl: ministers.imageUrl,
        dateOfBirth: ministers.dateOfBirth,
        churchName: churches.name,
        email: ministers.email,
        telephone: ministers.telephone,
        gender: ministers.gender,
        civilStatus: ministers.civilStatus,
      })
      .from(ministers)
      .leftJoin(churches, eq(ministers.churchId, churches.id))
      .where(or(...nameSearchConditions, ...fullNameConditions))
      .limit(20)
      .orderBy(ministers.firstName, ministers.lastName);

    return Response.json({
      success: true,
      data: searchResults,
    });
  } catch {
    return Response.json(
      {
        success: false,
        message: "Failed to search ministers",
        data: [],
      },
      { status: 500 }
    );
  }
}
