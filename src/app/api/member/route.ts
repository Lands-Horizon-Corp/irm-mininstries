import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import { and, asc, count, desc, eq, ilike, or } from "drizzle-orm";
import { z } from "zod";

import { db } from "@/db/drizzle";
import { members } from "@/modules/member/member-schema";
import { memberSchema } from "@/modules/member/member-validation";

// GET - Get all members with pagination and search
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    // Extract query parameters
    const page = Math.max(1, parseInt(searchParams.get("page") || "1"));
    const limit = Math.min(
      100,
      Math.max(1, parseInt(searchParams.get("limit") || "10"))
    );
    const search = searchParams.get("search");
    const isActiveParam = searchParams.get("isActive");
    const isActive = isActiveParam ? isActiveParam === "true" : undefined;
    const sortBy = searchParams.get("sortBy") || "createdAt";
    const sortOrder = searchParams.get("sortOrder") || "desc";

    const offset = (page - 1) * limit;

    // Build where clause for search and filters
    const whereConditions = [];

    // Add search condition
    if (search) {
      whereConditions.push(
        or(
          ilike(members.firstName, `%${search}%`),
          ilike(members.lastName, `%${search}%`),
          ilike(members.middleName, `%${search}%`),
          ilike(members.mobileNumber, `%${search}%`),
          ilike(members.email, `%${search}%`),
          ilike(members.occupation, `%${search}%`),
          ilike(members.ministryInvolvement, `%${search}%`)
        )
      );
    }

    // Add isActive filter
    if (isActive !== undefined) {
      whereConditions.push(eq(members.isActive, isActive));
    }

    const whereClause =
      whereConditions.length > 0 ? and(...whereConditions) : undefined;

    // Build order clause
    const orderClause =
      sortOrder === "asc"
        ? asc(
            members[sortBy as keyof typeof members._.columns] ||
              members.createdAt
          )
        : desc(
            members[sortBy as keyof typeof members._.columns] ||
              members.createdAt
          );

    // Get total count for pagination
    const [totalResult] = await db
      .select({ count: count() })
      .from(members)
      .where(whereClause);

    const total = totalResult.count;

    // Get paginated results (basic info only for performance)
    const results = await db
      .select({
        id: members.id,
        churchId: members.churchId,
        firstName: members.firstName,
        lastName: members.lastName,
        middleName: members.middleName,
        gender: members.gender,
        email: members.email,
        mobileNumber: members.mobileNumber,
        yearJoined: members.yearJoined,
        ministryInvolvement: members.ministryInvolvement,
        occupation: members.occupation,
        profilePicture: members.profilePicture,
        isActive: members.isActive,
        createdAt: members.createdAt,
        updatedAt: members.updatedAt,
      })
      .from(members)
      .where(whereClause)
      .orderBy(orderClause)
      .limit(limit)
      .offset(offset);

    const totalPages = Math.ceil(total / limit);

    return NextResponse.json({
      success: true,
      data: results,
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1,
      },
      search: search || null,
      sort: {
        by: sortBy,
        order: sortOrder,
      },
    });
  } catch {
    return NextResponse.json(
      {
        success: false,
        error: "Internal server error",
        message: "Failed to fetch members",
      },
      { status: 500 }
    );
  }
}

// POST - Create new member
export async function POST(request: NextRequest) {
  try {
    // Parse the JSON body
    const body = await request.json();

    // Validate the request data against our schema
    const validatedData = memberSchema.parse(body);

    // Insert the new member record
    const [newMember] = await db
      .insert(members)
      .values({
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
      })
      .returning();

    // Return success response
    return NextResponse.json({
      success: true,
      message: "Member added successfully",
      data: newMember,
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
