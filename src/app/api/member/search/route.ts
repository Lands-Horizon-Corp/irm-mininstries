import type { NextRequest } from "next/server";

import { eq, ilike, or, sql } from "drizzle-orm";

import { db } from "@/db/drizzle";
import { churches, members } from "@/db/schema";

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
      ilike(members.firstName, `%${word}%`),
      ilike(members.lastName, `%${word}%`),
      ilike(members.middleName, `%${word}%`),
    ]);

    // Also search for full name combinations
    const fullNameConditions = [
      ilike(
        sql`CONCAT(${members.firstName}, ' ', COALESCE(${members.middleName}, ''), ' ', ${members.lastName})`,
        `%${query}%`
      ),
      ilike(
        sql`CONCAT(${members.firstName}, ' ', ${members.lastName})`,
        `%${query}%`
      ),
      ilike(
        sql`CONCAT(${members.lastName}, ', ', ${members.firstName})`,
        `%${query}%`
      ),
    ];

    const searchResults = await db
      .select({
        id: members.id,
        firstName: members.firstName,
        lastName: members.lastName,
        middleName: members.middleName,
        profilePicture: members.profilePicture,
        birthdate: members.birthdate,
        churchName: churches.name,
        email: members.email,
        mobileNumber: members.mobileNumber,
        gender: members.gender,
        yearJoined: members.yearJoined,
        isActive: members.isActive,
      })
      .from(members)
      .leftJoin(churches, eq(members.churchId, churches.id))
      .where(or(...nameSearchConditions, ...fullNameConditions))
      .limit(20)
      .orderBy(members.firstName, members.lastName);

    return Response.json({
      success: true,
      data: searchResults,
    });
  } catch {
    return Response.json(
      {
        success: false,
        message: "Failed to search members",
        data: [],
      },
      { status: 500 }
    );
  }
}
