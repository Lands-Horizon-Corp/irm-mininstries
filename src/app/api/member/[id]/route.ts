import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import { eq } from "drizzle-orm";
import { z } from "zod";

import { db } from "@/db/drizzle";
import { members } from "@/modules/member/member-schema";
import { memberSchema } from "@/modules/member/member-validation";

// GET - Get member by ID with full details
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

    // Get the member record
    const [member] = await db.select().from(members).where(eq(members.id, id));

    if (!member) {
      return NextResponse.json(
        {
          success: false,
          error: "Not found",
          message: "Member not found",
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: member,
    });
  } catch {
    return NextResponse.json(
      {
        success: false,
        error: "Internal server error",
        message: "Failed to fetch member",
      },
      { status: 500 }
    );
  }
}

// PUT - Update member by ID
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
    const validatedData = memberSchema.parse(body);

    // Check if the member exists
    const [existingMember] = await db
      .select()
      .from(members)
      .where(eq(members.id, id));

    if (!existingMember) {
      return NextResponse.json(
        {
          success: false,
          error: "Not found",
          message: "Member not found",
        },
        { status: 404 }
      );
    }

    // Update the member record
    const [updatedMember] = await db
      .update(members)
      .set({
        churchId: validatedData.churchId,
        profilePicture: validatedData.profilePicture,
        firstName: validatedData.firstName,
        lastName: validatedData.lastName,
        middleName: validatedData.middleName,
        gender: validatedData.gender,
        birthdate: validatedData.birthdate,
        yearJoined: validatedData.yearJoined,
        ministryInvolvement: validatedData.ministryInvolvement,
        occupation: validatedData.occupation,
        educationalAttainment: validatedData.educationalAttainment,
        school: validatedData.school,
        degree: validatedData.degree,
        mobileNumber: validatedData.mobileNumber,
        email: validatedData.email,
        homeAddress: validatedData.homeAddress,
        facebookLink: validatedData.facebookLink,
        xLink: validatedData.xLink,
        instagramLink: validatedData.instagramLink,
        tiktokLink: validatedData.tiktokLink,
        notes: validatedData.notes,
        isActive: validatedData.isActive,
        updatedAt: new Date(),
      })
      .where(eq(members.id, id))
      .returning();

    return NextResponse.json({
      success: true,
      message: "Member updated successfully",
      data: updatedMember,
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

    // Handle database errors
    if (error instanceof Error) {
      return NextResponse.json(
        {
          success: false,
          error: "Database error",
          message: error.message,
        },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        error: "Internal server error",
        message: "An unexpected error occurred",
      },
      { status: 500 }
    );
  }
}

// DELETE - Delete member by ID
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

    // Check if the member exists
    const [existingMember] = await db
      .select()
      .from(members)
      .where(eq(members.id, id));

    if (!existingMember) {
      return NextResponse.json(
        {
          success: false,
          error: "Not found",
          message: "Member not found",
        },
        { status: 404 }
      );
    }

    // Delete the member
    await db.delete(members).where(eq(members.id, id));

    return NextResponse.json({
      success: true,
      message: "Member deleted successfully",
    });
  } catch {
    return NextResponse.json(
      {
        success: false,
        error: "Internal server error",
        message: "Failed to delete member",
      },
      { status: 500 }
    );
  }
}
