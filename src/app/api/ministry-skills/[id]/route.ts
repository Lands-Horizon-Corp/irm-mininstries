import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import { eq } from "drizzle-orm";
import { z } from "zod";

import { db } from "@/db/drizzle";
import { ministrySkills } from "@/modules/ministry-skills/ministry-skills-schema";
import { ministrySkillsSchema } from "@/modules/ministry-skills/ministry-skills-validation";

interface RouteParams {
  params: {
    id: string;
  };
}

// GET - Get ministry skill by ID
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const id = parseInt(params.id);

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

    const [skill] = await db
      .select()
      .from(ministrySkills)
      .where(eq(ministrySkills.id, id));

    if (!skill) {
      return NextResponse.json(
        {
          success: false,
          error: "Not found",
          message: "Ministry skill not found",
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: skill,
    });
  } catch (error) {
    console.error("Get ministry skill by ID error:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Internal server error",
        message: "Failed to fetch ministry skill",
      },
      { status: 500 }
    );
  }
}

// PUT - Update ministry skill by ID
export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const id = parseInt(params.id);

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
    const validatedData = ministrySkillsSchema.parse(body);

    // Check if the skill exists
    const [existingSkill] = await db
      .select()
      .from(ministrySkills)
      .where(eq(ministrySkills.id, id));

    if (!existingSkill) {
      return NextResponse.json(
        {
          success: false,
          error: "Not found",
          message: "Ministry skill not found",
        },
        { status: 404 }
      );
    }

    // Update the skill
    const [updatedSkill] = await db
      .update(ministrySkills)
      .set({
        name: validatedData.name,
        description: validatedData.description,
        updatedAt: new Date(),
      })
      .where(eq(ministrySkills.id, id))
      .returning();

    return NextResponse.json({
      success: true,
      message: "Ministry skill updated successfully",
      data: updatedSkill,
    });
  } catch (error) {
    console.error("Update ministry skill error:", error);

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
        message: "Something went wrong while updating the ministry skill",
      },
      { status: 500 }
    );
  }
}

// DELETE - Delete ministry skill by ID
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const id = parseInt(params.id);

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

    // Check if the skill exists
    const [existingSkill] = await db
      .select()
      .from(ministrySkills)
      .where(eq(ministrySkills.id, id));

    if (!existingSkill) {
      return NextResponse.json(
        {
          success: false,
          error: "Not found",
          message: "Ministry skill not found",
        },
        { status: 404 }
      );
    }

    // TODO: Check if the skill is being used by any ministers
    // You might want to prevent deletion if it's in use
    // const ministersUsingSkill = await db
    //   .select()
    //   .from(ministerMinistrySkills)
    //   .where(eq(ministerMinistrySkills.ministrySkillId, id));

    // if (ministersUsingSkill.length > 0) {
    //   return NextResponse.json(
    //     {
    //       success: false,
    //       error: "Cannot delete",
    //       message: "This ministry skill is being used by one or more ministers",
    //     },
    //     { status: 409 }
    //   );
    // }

    // Delete the skill
    await db.delete(ministrySkills).where(eq(ministrySkills.id, id));

    return NextResponse.json({
      success: true,
      message: "Ministry skill deleted successfully",
      data: {
        id: existingSkill.id,
        name: existingSkill.name,
      },
    });
  } catch (error) {
    console.error("Delete ministry skill error:", error);

    // Handle foreign key constraint errors
    if (
      error instanceof Error &&
      error.message.includes("foreign key constraint")
    ) {
      return NextResponse.json(
        {
          success: false,
          error: "Cannot delete",
          message: "This ministry skill is being used and cannot be deleted",
        },
        { status: 409 }
      );
    }

    // Handle other errors
    return NextResponse.json(
      {
        success: false,
        error: "Internal server error",
        message: "Something went wrong while deleting the ministry skill",
      },
      { status: 500 }
    );
  }
}
