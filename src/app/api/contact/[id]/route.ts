import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import { eq } from "drizzle-orm";
import { z } from "zod";

import { db } from "@/db/drizzle";
import { contactSubmissions } from "@/modules/contact-us/contact-us-schema";
import { contactUsFormSchema } from "@/modules/contact-us/contact-us-validation";

interface RouteParams {
  params: {
    id: string;
  };
}

// GET - Get contact submission by ID
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

    const [contact] = await db
      .select()
      .from(contactSubmissions)
      .where(eq(contactSubmissions.id, id));

    if (!contact) {
      return NextResponse.json(
        {
          success: false,
          error: "Not found",
          message: "Contact submission not found",
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: contact,
    });
  } catch (error) {
    console.error("Get contact submission by ID error:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Internal server error",
        message: "Failed to fetch contact submission",
      },
      { status: 500 }
    );
  }
}

// PUT - Update contact submission by ID
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
    const validatedData = contactUsFormSchema.parse(body);

    // Check if the contact submission exists
    const [existingContact] = await db
      .select()
      .from(contactSubmissions)
      .where(eq(contactSubmissions.id, id));

    if (!existingContact) {
      return NextResponse.json(
        {
          success: false,
          error: "Not found",
          message: "Contact submission not found",
        },
        { status: 404 }
      );
    }

    // Update the contact submission
    const [updatedContact] = await db
      .update(contactSubmissions)
      .set({
        name: validatedData.name,
        email: validatedData.email,
        subject: validatedData.subject,
        description: validatedData.description,
        prayerRequest: validatedData.prayerRequest || null,
        supportEmail: validatedData.supportEmail,
        updatedAt: new Date(),
      })
      .where(eq(contactSubmissions.id, id))
      .returning();

    return NextResponse.json({
      success: true,
      message: "Contact submission updated successfully",
      data: updatedContact,
    });
  } catch (error) {
    console.error("Update contact submission error:", error);

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
        message: "Something went wrong while updating the contact submission",
      },
      { status: 500 }
    );
  }
}

// DELETE - Delete contact submission by ID
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

    // Check if the contact submission exists
    const [existingContact] = await db
      .select()
      .from(contactSubmissions)
      .where(eq(contactSubmissions.id, id));

    if (!existingContact) {
      return NextResponse.json(
        {
          success: false,
          error: "Not found",
          message: "Contact submission not found",
        },
        { status: 404 }
      );
    }

    // Delete the contact submission
    await db.delete(contactSubmissions).where(eq(contactSubmissions.id, id));

    return NextResponse.json({
      success: true,
      message: "Contact submission deleted successfully",
      data: {
        id: existingContact.id,
        name: existingContact.name,
        email: existingContact.email,
        subject: existingContact.subject,
      },
    });
  } catch (error) {
    console.error("Delete contact submission error:", error);

    // Handle other errors
    return NextResponse.json(
      {
        success: false,
        error: "Internal server error",
        message: "Something went wrong while deleting the contact submission",
      },
      { status: 500 }
    );
  }
}
