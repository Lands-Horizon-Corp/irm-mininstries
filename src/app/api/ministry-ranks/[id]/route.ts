import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import { eq } from "drizzle-orm";
import { z } from "zod";

import { db } from "@/db/drizzle";
import { ministryRanks } from "@/modules/ministry-ranks/ministry-ranks-schema";
import { ministryRanksSchema } from "@/modules/ministry-ranks/ministry-ranks-validation";

// GET - Get ministry rank by ID
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

    const [rank] = await db
      .select()
      .from(ministryRanks)
      .where(eq(ministryRanks.id, id));

    if (!rank) {
      return NextResponse.json(
        {
          success: false,
          error: "Not found",
          message: "Ministry rank not found",
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: rank,
    });
  } catch (error) {
    console.error("Get ministry rank by ID error:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Internal server error",
        message: "Failed to fetch ministry rank",
      },
      { status: 500 }
    );
  }
}

// PUT - Update ministry rank by ID
export async function PUT(
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

    // Parse the JSON body
    const body = await request.json();

    // Validate the request data against our schema
    const validatedData = ministryRanksSchema.parse(body);

    // Check if the rank exists
    const [existingRank] = await db
      .select()
      .from(ministryRanks)
      .where(eq(ministryRanks.id, id));

    if (!existingRank) {
      return NextResponse.json(
        {
          success: false,
          error: "Not found",
          message: "Ministry rank not found",
        },
        { status: 404 }
      );
    }

    // Update the rank
    const [updatedRank] = await db
      .update(ministryRanks)
      .set({
        name: validatedData.name,
        description: validatedData.description || null,
        updatedAt: new Date(),
      })
      .where(eq(ministryRanks.id, id))
      .returning();

    return NextResponse.json({
      success: true,
      message: "Ministry rank updated successfully",
      data: updatedRank,
    });
  } catch (error) {
    console.error("Update ministry rank error:", error);

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
        message: "Something went wrong while updating the ministry rank",
      },
      { status: 500 }
    );
  }
}

// DELETE - Delete ministry rank by ID
export async function DELETE(
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

    // Check if the rank exists
    const [existingRank] = await db
      .select()
      .from(ministryRanks)
      .where(eq(ministryRanks.id, id));

    if (!existingRank) {
      return NextResponse.json(
        {
          success: false,
          error: "Not found",
          message: "Ministry rank not found",
        },
        { status: 404 }
      );
    }

    // TODO: Check if the rank is being used by any ministers
    // You might want to prevent deletion if it's in use
    // const ministersWithRank = await db
    //   .select()
    //   .from(ministers)
    //   .where(eq(ministers.ministryRankId, id));

    // if (ministersWithRank.length > 0) {
    //   return NextResponse.json(
    //     {
    //       success: false,
    //       error: "Cannot delete",
    //       message: "This ministry rank is being used by one or more ministers",
    //     },
    //     { status: 409 }
    //   );
    // }

    // Delete the rank
    await db.delete(ministryRanks).where(eq(ministryRanks.id, id));

    return NextResponse.json({
      success: true,
      message: "Ministry rank deleted successfully",
      data: {
        id: existingRank.id,
        name: existingRank.name,
      },
    });
  } catch (error) {
    console.error("Delete ministry rank error:", error);

    // Handle foreign key constraint errors
    if (
      error instanceof Error &&
      error.message.includes("foreign key constraint")
    ) {
      return NextResponse.json(
        {
          success: false,
          error: "Cannot delete",
          message: "This ministry rank is being used and cannot be deleted",
        },
        { status: 409 }
      );
    }

    // Handle other errors
    return NextResponse.json(
      {
        success: false,
        error: "Internal server error",
        message: "Something went wrong while deleting the ministry rank",
      },
      { status: 500 }
    );
  }
}
