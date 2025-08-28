import { NextResponse } from "next/server";

import { asc } from "drizzle-orm";
import * as XLSX from "xlsx";

import { db } from "@/db/drizzle";
import { ministrySkills } from "@/modules/ministry-skills/ministry-skills-schema";

// GET - Export all ministry skills to Excel
export async function GET() {
  try {
    // Get all ministry skills ordered by creation date
    const skills = await db
      .select()
      .from(ministrySkills)
      .orderBy(asc(ministrySkills.createdAt));

    // Transform data for Excel export
    const exportData = skills.map((skill) => {
      // Helper function to truncate text to Excel's limit
      const truncateText = (text: string | null, maxLength = 32000) => {
        if (!text) return "";
        return text.length > maxLength
          ? text.substring(0, maxLength) + "..."
          : text;
      };

      return {
        ID: skill.id,
        "Skill Name": truncateText(skill.name),
        Description: truncateText(skill.description || "", 1000), // Limit descriptions to 1000 chars
        "Created Date": skill.createdAt
          ? new Date(skill.createdAt).toLocaleDateString()
          : "",
        "Created Time": skill.createdAt
          ? new Date(skill.createdAt).toLocaleTimeString()
          : "",
        "Last Updated Date": skill.updatedAt
          ? new Date(skill.updatedAt).toLocaleDateString()
          : "",
        "Last Updated Time": skill.updatedAt
          ? new Date(skill.updatedAt).toLocaleTimeString()
          : "",
      };
    });

    // Create workbook and worksheet
    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.json_to_sheet(exportData);

    // Set column widths for better readability
    worksheet["!cols"] = [
      { wch: 5 }, // ID
      { wch: 30 }, // Skill Name
      { wch: 60 }, // Description
      { wch: 18 }, // Created Date
      { wch: 15 }, // Created Time
      { wch: 18 }, // Last Updated Date
      { wch: 15 }, // Last Updated Time
    ];

    // Add worksheet to workbook
    XLSX.utils.book_append_sheet(workbook, worksheet, "Ministry Skills");

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
      `attachment; filename="ministry-skills-${new Date().toISOString().split("T")[0]}.xlsx"`
    );

    return response;
  } catch (error) {
    console.error("Export ministry skills error:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Internal server error",
        message: "Failed to export ministry skills",
      },
      { status: 500 }
    );
  }
}
