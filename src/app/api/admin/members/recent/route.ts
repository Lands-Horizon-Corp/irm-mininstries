import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import { desc, gte, sql } from "drizzle-orm";

import { db } from "@/db/drizzle";
import { churches, members } from "@/db/schema";

export async function GET(_request: NextRequest) {
  try {
    // Calculate the date 31 days ago
    const thirtyOneDaysAgo = new Date();
    thirtyOneDaysAgo.setDate(thirtyOneDaysAgo.getDate() - 31);

    // Fetch recent members with their church information
    const recentMembers = await db
      .select({
        id: members.id,
        firstName: members.firstName,
        lastName: members.lastName,
        email: members.email,
        mobileNumber: members.mobileNumber,
        createdAt: members.createdAt,
        churchId: members.churchId,
        churchName: churches.name,
        churchAddress: churches.address,
        profilePicture: members.profilePicture,
        gender: members.gender,
        yearJoined: members.yearJoined,
        occupation: members.occupation,
      })
      .from(members)
      .leftJoin(churches, sql`${members.churchId} = ${churches.id}`)
      .where(gte(members.createdAt, thirtyOneDaysAgo))
      .orderBy(desc(members.createdAt))
      .limit(50); // Limit to 50 recent members

    return NextResponse.json({
      success: true,
      data: recentMembers,
      count: recentMembers.length,
    });
  } catch {
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch recent members",
      },
      { status: 500 }
    );
  }
}
