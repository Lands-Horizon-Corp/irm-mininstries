import { NextResponse } from "next/server";

import { asc } from "drizzle-orm";

import { db } from "@/db/drizzle";
import { createExcelExport, createExcelResponse } from "@/lib/excel-export";
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
      id: contact.id,
      name: contact.name,
      email: contact.email,
      subject: contact.subject,
      message: contact.description,
      prayerRequest: contact.prayerRequest || "No",
      supportEmail: contact.supportEmail,
      submittedDate: contact.createdAt
        ? new Date(contact.createdAt).toLocaleDateString()
        : "",
      submittedTime: contact.createdAt
        ? new Date(contact.createdAt).toLocaleTimeString()
        : "",
    }));

    // Define Excel columns
    const columns = [
      { header: "ID", key: "id", width: 5 },
      { header: "Name", key: "name", width: 25 },
      { header: "Email", key: "email", width: 30 },
      { header: "Subject", key: "subject", width: 40 },
      { header: "Message", key: "message", width: 50 },
      { header: "Prayer Request", key: "prayerRequest", width: 15 },
      { header: "Support Email", key: "supportEmail", width: 30 },
      { header: "Submitted Date", key: "submittedDate", width: 15 },
      { header: "Submitted Time", key: "submittedTime", width: 15 },
    ];

    // Generate Excel buffer
    const excelBuffer = await createExcelExport({
      sheetName: "Contact Submissions",
      columns,
      data: exportData,
    });

    // Create filename
    const filename = `contact-submissions-${new Date().toISOString().split("T")[0]}.xlsx`;

    // Return Excel response
    return createExcelResponse(excelBuffer, filename);
  } catch {
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
