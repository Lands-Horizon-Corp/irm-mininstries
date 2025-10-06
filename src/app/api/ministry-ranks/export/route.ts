import { NextResponse } from "next/server";

import { asc } from "drizzle-orm";

import { db } from "@/db/drizzle";
import { createExcelExport, createExcelResponse } from "@/lib/excel-export";
import { ministryRanks } from "@/modules/ministry-ranks/ministry-ranks-schema";
import { truncateText } from "@/lib/utils";

// GET - Export all ministry ranks to Excel
export async function GET() {
  try {
    // Get all ministry ranks ordered by creation date
    const ranks = await db
      .select()
      .from(ministryRanks)
      .orderBy(asc(ministryRanks.createdAt));

    // Transform data for Excel export
    const exportData = ranks.map((rank) => ({
      id: rank.id,
      rankName: truncateText(rank.name),
      description: truncateText(rank.description || "", 1000),
      createdDate: rank.createdAt
        ? new Date(rank.createdAt).toLocaleDateString()
        : "",
      createdTime: rank.createdAt
        ? new Date(rank.createdAt).toLocaleTimeString()
        : "",
      lastUpdatedDate: rank.updatedAt
        ? new Date(rank.updatedAt).toLocaleDateString()
        : "",
      lastUpdatedTime: rank.updatedAt
        ? new Date(rank.updatedAt).toLocaleTimeString()
        : "",
    }));

    // Define Excel columns
    const columns = [
      { header: "ID", key: "id", width: 5 },
      { header: "Rank Name", key: "rankName", width: 30 },
      { header: "Description", key: "description", width: 60 },
      { header: "Created Date", key: "createdDate", width: 18 },
      { header: "Created Time", key: "createdTime", width: 15 },
      { header: "Last Updated Date", key: "lastUpdatedDate", width: 18 },
      { header: "Last Updated Time", key: "lastUpdatedTime", width: 15 },
    ];

    // Generate Excel buffer
    const excelBuffer = await createExcelExport({
      sheetName: "Ministry Ranks",
      columns,
      data: exportData,
    });

    // Create filename
    const filename = `ministry-ranks-${new Date().toISOString().split("T")[0]}.xlsx`;

    // Return Excel response
    return createExcelResponse(excelBuffer, filename);
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
