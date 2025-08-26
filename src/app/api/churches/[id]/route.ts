import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import { eq } from "drizzle-orm";
import { z } from "zod";

import { db } from "@/db/drizzle";
import { churches } from "@/modules/church/church-schema";
import { churchSchema } from "@/modules/church/church-validation";

// GET - Get church by ID
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

    return NextResponse.json({
      success: true,
      data: church,
    });
  } catch (error) {
    console.error("Get church by ID error:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Internal server error",
        message: "Failed to fetch church",
      },
      { status: 500 }
    );
  }
}

// PUT - Update church by ID
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
    const validatedData = churchSchema.parse(body);

    // Check if the church exists
    const [existingChurch] = await db
      .select()
      .from(churches)
      .where(eq(churches.id, id));

    if (!existingChurch) {
      return NextResponse.json(
        {
          success: false,
          error: "Not found",
          message: "Church not found",
        },
        { status: 404 }
      );
    }

    // Update the church
    const [updatedChurch] = await db
      .update(churches)
      .set({
        imageUrl: validatedData.imageUrl,
        email: validatedData.email,
        address: validatedData.address,
        description: validatedData.description,
        latitude: validatedData.latitude,
        longitude: validatedData.longitude,
        updatedAt: new Date(),
      })
      .where(eq(churches.id, id))
      .returning();

    return NextResponse.json({
      success: true,
      message: "Church updated successfully",
      data: updatedChurch,
    });
  } catch (error) {
    console.error("Update church error:", error);

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
          message: "A church with this email already exists",
        },
        { status: 409 }
      );
    }

    // Handle other errors
    return NextResponse.json(
      {
        success: false,
        error: "Internal server error",
        message: "Something went wrong while updating the church",
      },
      { status: 500 }
    );
  }
}

// DELETE - Delete church by ID
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

    // Check if the church exists
    const [existingChurch] = await db
      .select()
      .from(churches)
      .where(eq(churches.id, id));

    if (!existingChurch) {
      return NextResponse.json(
        {
          success: false,
          error: "Not found",
          message: "Church not found",
        },
        { status: 404 }
      );
    }

    // TODO: Check if the church is being used by any ministers
    // You might want to prevent deletion if it's in use
    // const ministersInChurch = await db
    //   .select()
    //   .from(ministerMinistryRecords)
    //   .where(eq(ministerMinistryRecords.churchLocationId, id));

    // if (ministersInChurch.length > 0) {
    //   return NextResponse.json(
    //     {
    //       success: false,
    //       error: "Cannot delete",
    //       message: "This church is being used by one or more ministers",
    //     },
    //     { status: 409 }
    //   );
    // }

    // Delete the church
    await db.delete(churches).where(eq(churches.id, id));

    return NextResponse.json({
      success: true,
      message: "Church deleted successfully",
      data: {
        id: existingChurch.id,
        address: existingChurch.address,
        email: existingChurch.email,
      },
    });
  } catch (error) {
    console.error("Delete church error:", error);

    // Handle foreign key constraint errors
    if (
      error instanceof Error &&
      error.message.includes("foreign key constraint")
    ) {
      return NextResponse.json(
        {
          success: false,
          error: "Cannot delete",
          message: "This church is being used and cannot be deleted",
        },
        { status: 409 }
      );
    }

    // Handle other errors
    return NextResponse.json(
      {
        success: false,
        error: "Internal server error",
        message: "Something went wrong while deleting the church",
      },
      { status: 500 }
    );
  }
}
