import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import { count, eq } from "drizzle-orm";

import { db } from "@/db/drizzle";
import { churches } from "@/modules/church/church-schema";
import { members } from "@/modules/member/member-schema";
import { ministers } from "@/modules/ministry/ministry-schema";

// GET - Get church statistics (member count, minister count)
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: idString } = await params;
    const id = parseInt(idString);

    if (isNaN(id)) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid ID",
          message: "ID must be a valid number",
        },
        { status: 400 }
      );
    }

    // Check if church exists
    const [church] = await db
      .select()
      .from(churches)
      .where(eq(churches.id, id));

    if (!church) {
      return NextResponse.json(
        {
          success: false,
          error: "Not found",
          message: "Church not found",
        },
        { status: 404 }
      );
    }

    // Get member count for this church
    const [memberCountResult] = await db
      .select({ count: count() })
      .from(members)
      .where(eq(members.churchId, id));

    // Get minister count for this church
    const [ministerCountResult] = await db
      .select({ count: count() })
      .from(ministers)
      .where(eq(ministers.churchId, id));

    const memberCount = memberCountResult.count;
    const ministerCount = ministerCountResult.count;

    return NextResponse.json({
      success: true,
      data: {
        churchId: id,
        memberCount,
        ministerCount,
        totalPeople: memberCount + ministerCount,
      },
    });
  } catch (error) {
    console.error("Get church stats error:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Internal server error",
        message: "Failed to fetch church statistics",
      },
      { status: 500 }
    );
  }
}
