import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import { asc, count, desc, ilike, or } from "drizzle-orm";
import { z } from "zod";

import { db } from "@/db/drizzle";
import { contactSubmissions } from "@/modules/contact-us/contact-us-schema";
import { contactUsFormSchema } from "@/modules/contact-us/contact-us-validation";

// GET - Get all contact submissions with pagination and search
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    // Extract query parameters
    const page = Math.max(1, parseInt(searchParams.get("page") || "1"));
    const limit = Math.min(
      100,
      Math.max(1, parseInt(searchParams.get("limit") || "10"))
    );
    const search = searchParams.get("search")?.trim() || "";
    const sortBy = searchParams.get("sortBy") || "createdAt";
    const sortOrder = searchParams.get("sortOrder") || "desc";

    const offset = (page - 1) * limit;

    // Build where clause for search
    const whereClause = search
      ? or(
          ilike(contactSubmissions.name, `%${search}%`),
          ilike(contactSubmissions.email, `%${search}%`),
          ilike(contactSubmissions.subject, `%${search}%`),
          ilike(contactSubmissions.description, `%${search}%`),
          ilike(contactSubmissions.supportEmail, `%${search}%`)
        )
      : undefined;

    // Build order clause
    const orderClause =
      sortOrder === "asc"
        ? asc(
            contactSubmissions[
              sortBy as keyof typeof contactSubmissions._.columns
            ] || contactSubmissions.createdAt
          )
        : desc(
            contactSubmissions[
              sortBy as keyof typeof contactSubmissions._.columns
            ] || contactSubmissions.createdAt
          );

    // Get total count for pagination
    const [totalResult] = await db
      .select({ count: count() })
      .from(contactSubmissions)
      .where(whereClause);

    const total = totalResult.count;

    // Get paginated results
    const results = await db
      .select()
      .from(contactSubmissions)
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
  } catch (error) {
    console.error("Get contact submissions error:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Internal server error",
        message: "Failed to fetch contact submissions",
      },
      { status: 500 }
    );
  }
}

// POST - Create new contact submission
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = contactUsFormSchema.parse(body);
    const [savedContact] = await db
      .insert(contactSubmissions)
      .values({
        name: validatedData.name,
        email: validatedData.email,
        subject: validatedData.subject,
        description: validatedData.description,
        prayerRequest: validatedData.prayerRequest || null,
        supportEmail: validatedData.supportEmail,
      })
      .returning();

    // Return success response
    return NextResponse.json({
      success: true,
      message: "Contact form submitted successfully",
      data: savedContact,
    });
  } catch (error) {
    console.error("Contact form submission error:", error);

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
          message: "A similar contact submission already exists",
        },
        { status: 409 }
      );
    }

    // Handle other errors
    return NextResponse.json(
      {
        success: false,
        error: "Internal server error",
        message: "Something went wrong while processing your request",
      },
      { status: 500 }
    );
  }
}
