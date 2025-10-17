import { NextResponse } from "next/server";

import { count, eq } from "drizzle-orm";

import { db } from "@/db/drizzle";
import { createExcelExport, createExcelResponse } from "@/lib/excel-export";
import { churches } from "@/modules/church/church-schema";
import { members } from "@/modules/member/member-schema";
import { ministers } from "@/modules/ministry/ministry-schema";

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
          id: church.id,
          name: church.name,
          email: church.email || "",
          address: church.address || "",
          description: church.description || "",
          link: church.link || "",
          latitude: church.latitude || "",
          longitude: church.longitude || "",
          memberCount: memberCount,
          ministerCount: ministerCount,
          totalCount: memberCount + ministerCount,
          createdDate: new Date(church.createdAt).toLocaleDateString(),
          lastUpdated: new Date(church.updatedAt).toLocaleDateString(),
        };
      })
    );

    // Define Excel columns
    const columns = [
      { header: "ID", key: "id", width: 5 },
      { header: "Name", key: "name", width: 25 },
      { header: "Email", key: "email", width: 30 },
      { header: "Address", key: "address", width: 40 },
      { header: "Description", key: "description", width: 35 },
      { header: "Link/Website", key: "link", width: 35 },
      { header: "Latitude", key: "latitude", width: 12 },
      { header: "Longitude", key: "longitude", width: 12 },
      { header: "Member Count", key: "memberCount", width: 12 },
      { header: "Minister Count", key: "ministerCount", width: 12 },
      { header: "Total Count", key: "totalCount", width: 12 },
      { header: "Created Date", key: "createdDate", width: 15 },
      { header: "Last Updated", key: "lastUpdated", width: 15 },
    ];

    // Generate Excel buffer
    const excelBuffer = await createExcelExport({
      sheetName: "Churches",
      columns,
      data: churchData,
    });

    // Create filename
    const filename = `churches-export-${new Date().toISOString().split("T")[0]}.xlsx`;

    // Return Excel response
    return createExcelResponse(excelBuffer, filename);
  } catch {
    return NextResponse.json(
      {
        success: false,
        error: "Failed to export churches",
      },
      { status: 500 }
    );
  }
}
