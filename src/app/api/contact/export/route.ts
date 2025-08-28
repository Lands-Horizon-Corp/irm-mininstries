import { NextResponse } from "next/server";

import { asc } from "drizzle-orm";
import * as XLSX from "xlsx";

import { db } from "@/db/drizzle";
import { contactSubmissions } from "@/modules/contact-us/contact-us-schema";

// GET - Export all contact submissions to Excel
export async function GET() {
  try {
    // Get all contact submissions ordered by creation date
    const contacts = await db
      .select()
      .from(contactSubmissions)
      .orderBy(asc(contactSubmissions.createdAt));

    // Transform data for Excel export
    const exportData = contacts.map((contact) => ({
      ID: contact.id,
      Name: contact.name,
      Email: contact.email,
      Subject: contact.subject,
      Message: contact.description,
      "Prayer Request": contact.prayerRequest || "No",
      "Support Email": contact.supportEmail,
      "Submitted Date": contact.createdAt
        ? new Date(contact.createdAt).toLocaleDateString()
        : "",
      "Submitted Time": contact.createdAt
        ? new Date(contact.createdAt).toLocaleTimeString()
        : "",
    }));

    // Create workbook and worksheet
    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.json_to_sheet(exportData);

    // Set column widths
    worksheet["!cols"] = [
      { wch: 5 }, // ID
      { wch: 25 }, // Name
      { wch: 30 }, // Email
      { wch: 40 }, // Subject
      { wch: 50 }, // Message
      { wch: 15 }, // Prayer Request
      { wch: 30 }, // Support Email
      { wch: 15 }, // Submitted Date
      { wch: 15 }, // Submitted Time
    ];

    // Add worksheet to workbook
    XLSX.utils.book_append_sheet(workbook, worksheet, "Contact Submissions");

    // Generate Excel buffer
    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "buffer",
    });

    // Create response with proper headers
    const response = new NextResponse(excelBuffer);
    response.headers.set(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    response.headers.set(
      "Content-Disposition",
      `attachment; filename="contact-submissions-${new Date().toISOString().split("T")[0]}.xlsx"`
    );

    return response;
  } catch (error) {
    console.error("Export contact submissions error:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Internal server error",
        message: "Failed to export contact submissions",
      },
      { status: 500 }
    );
  }
}
