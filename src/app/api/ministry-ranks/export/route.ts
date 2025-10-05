import { NextResponse } from "next/server";

import { asc } from "drizzle-orm";
import * as XLSX from "xlsx";

import { db } from "@/db/drizzle";
import { ministryRanks } from "@/modules/ministry-ranks/ministry-ranks-schema";

// GET - Export all ministry ranks to Excel
export async function GET() {
  try {
    // Get all ministry ranks ordered by creation date
    const ranks = await db
      .select()
      .from(ministryRanks)
      .orderBy(asc(ministryRanks.createdAt));

    // Transform data for Excel export
    const exportData = ranks.map((rank) => {
      // Helper function to truncate text to Excel's limit
      const truncateText = (text: string | null, maxLength = 32000) => {
        if (!text) return "";
        return text.length > maxLength
          ? text.substring(0, maxLength) + "..."
          : text;
      };

      return {
        ID: rank.id,
        "Rank Name": truncateText(rank.name),
        Description: truncateText(rank.description || "", 1000), // Limit descriptions to 1000 chars
        "Created Date": rank.createdAt
          ? new Date(rank.createdAt).toLocaleDateString()
          : "",
        "Created Time": rank.createdAt
          ? new Date(rank.createdAt).toLocaleTimeString()
          : "",
        "Last Updated Date": rank.updatedAt
          ? new Date(rank.updatedAt).toLocaleDateString()
          : "",
        "Last Updated Time": rank.updatedAt
          ? new Date(rank.updatedAt).toLocaleTimeString()
          : "",
      };
    });

    // Create workbook and worksheet
    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.json_to_sheet(exportData);

    // Set column widths for better readability
    worksheet["!cols"] = [
      { wch: 5 }, // ID
      { wch: 30 }, // Rank Name
      { wch: 60 }, // Description
      { wch: 18 }, // Created Date
      { wch: 15 }, // Created Time
      { wch: 18 }, // Last Updated Date
      { wch: 15 }, // Last Updated Time
    ];

    // Add worksheet to workbook
    XLSX.utils.book_append_sheet(workbook, worksheet, "Ministry Ranks");

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
      `attachment; filename="ministry-ranks-${new Date().toISOString().split("T")[0]}.xlsx"`
    );

    return response;
  } catch {
    return NextResponse.json(
      {
        success: false,
        error: "Internal server error",
        message: "Failed to export ministry ranks",
      },
      { status: 500 }
    );
  }
}
