import { NextResponse } from "next/server";
import { db } from "@/db/drizzle";
import { churches } from "@/modules/church/church-schema";
import { members } from "@/modules/member/member-schema";
import { ministers } from "@/modules/ministry/ministry-schema";
import { count, eq } from "drizzle-orm";
import * as XLSX from "xlsx";

export async function GET() {
  try {
    // Fetch all churches with their stats
    const allChurches = await db.select().from(churches);

    // Get member and minister counts for each church
    const churchData = await Promise.all(
      allChurches.map(async (church) => {
        // Get member count
        const memberCountResult = await db
          .select({ count: count() })
          .from(members)
          .where(eq(members.churchId, church.id));

        // Get minister count
        const ministerCountResult = await db
          .select({ count: count() })
          .from(ministers)
          .where(eq(ministers.churchId, church.id));

        const memberCount = memberCountResult[0]?.count || 0;
        const ministerCount = ministerCountResult[0]?.count || 0;

        return {
          ID: church.id,
          Name: church.name,
          Email: church.email || "",
          Address: church.address || "",
          Description: church.description || "",
          Latitude: church.latitude || "",
          Longitude: church.longitude || "",
          "Member Count": memberCount,
          "Minister Count": ministerCount,
          "Total Count": memberCount + ministerCount,
          "Created Date": new Date(church.createdAt).toLocaleDateString(),
          "Last Updated": new Date(church.updatedAt).toLocaleDateString(),
        };
      })
    );

    // Create workbook and worksheet
    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.json_to_sheet(churchData);

    // Set column widths
    worksheet["!cols"] = [
      { width: 5 }, // ID
      { width: 25 }, // Name
      { width: 30 }, // Email
      { width: 40 }, // Address
      { width: 35 }, // Description
      { width: 12 }, // Latitude
      { width: 12 }, // Longitude
      { width: 12 }, // Member Count
      { width: 12 }, // Minister Count
      { width: 12 }, // Total Count
      { width: 15 }, // Created Date
      { width: 15 }, // Last Updated
    ];

    // Add worksheet to workbook
    XLSX.utils.book_append_sheet(workbook, worksheet, "Churches");

    // Generate Excel file buffer
    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "buffer",
    });

    // Create response with proper headers
    const response = new NextResponse(excelBuffer, {
      status: 200,
      headers: {
        "Content-Type":
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "Content-Disposition": `attachment; filename="churches-export-${new Date().toISOString().split("T")[0]}.xlsx"`,
      },
    });

    return response;
  } catch (error) {
    console.error("Error exporting churches:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to export churches",
      },
      { status: 500 }
    );
  }
}
