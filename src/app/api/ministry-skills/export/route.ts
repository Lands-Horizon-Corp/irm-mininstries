import { NextResponse } from "next/server";

import { asc } from "drizzle-orm";

import { db } from "@/db/drizzle";
import { createExcelExport, createExcelResponse } from "@/lib/excel-export";
import { ministrySkills } from "@/modules/ministry-skills/ministry-skills-schema";
import { truncateText } from "@/lib/utils";

// GET - Export all ministry skills to Excel
export async function GET() {
  try {
    // Get all ministry skills ordered by creation date
    const skills = await db
      .select()
      .from(ministrySkills)
      .orderBy(asc(ministrySkills.createdAt));
    // Transform data for Excel export
    const exportData = skills.map((skill) => ({
      id: skill.id,
      skillName: truncateText(skill.name),
      description: truncateText(skill.description || "", 1000),
      createdDate: skill.createdAt
        ? new Date(skill.createdAt).toLocaleDateString()
        : "",
      createdTime: skill.createdAt
        ? new Date(skill.createdAt).toLocaleTimeString()
        : "",
      lastUpdatedDate: skill.updatedAt
        ? new Date(skill.updatedAt).toLocaleDateString()
        : "",
      lastUpdatedTime: skill.updatedAt
        ? new Date(skill.updatedAt).toLocaleTimeString()
        : "",
    }));

    // Define Excel columns
    const columns = [
      { header: "ID", key: "id", width: 5 },
      { header: "Skill Name", key: "skillName", width: 30 },
      { header: "Description", key: "description", width: 60 },
      { header: "Created Date", key: "createdDate", width: 18 },
      { header: "Created Time", key: "createdTime", width: 15 },
      { header: "Last Updated Date", key: "lastUpdatedDate", width: 18 },
      { header: "Last Updated Time", key: "lastUpdatedTime", width: 15 },
    ];

    // Generate Excel buffer
    const excelBuffer = await createExcelExport({
      sheetName: "Ministry Skills",
      columns,
      data: exportData,
    });

    // Create filename
    const filename = `ministry-skills-${new Date().toISOString().split("T")[0]}.xlsx`;

    // Return Excel response
    return createExcelResponse(excelBuffer, filename);
  } catch {
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
