import { NextResponse } from "next/server";

import { asc, eq } from "drizzle-orm";
import * as XLSX from "xlsx";

import { db } from "@/db/drizzle";
import { churches } from "@/modules/church/church-schema";
import { members } from "@/modules/member/member-schema";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: idString } = await params;
    const id = parseInt(idString);

    if (isNaN(id)) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid church ID",
          message: "Church ID must be a valid number",
        },
        { status: 400 }
      );
    }

    // Get church info first
    const church = await db
      .select({ name: churches.name })
      .from(churches)
      .where(eq(churches.id, id))
      .limit(1);

    if (church.length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: "Church not found",
          message: "The specified church does not exist",
        },
        { status: 404 }
      );
    }

    // Get all members for this church ordered by creation date
    const membersData = await db
      .select({
        id: members.id,
        firstName: members.firstName,
        lastName: members.lastName,
        middleName: members.middleName,
        gender: members.gender,
        birthdate: members.birthdate,
        yearJoined: members.yearJoined,
        ministryInvolvement: members.ministryInvolvement,
        occupation: members.occupation,
        educationalAttainment: members.educationalAttainment,
        school: members.school,
        degree: members.degree,
        mobileNumber: members.mobileNumber,
        email: members.email,
        homeAddress: members.homeAddress,
        facebookLink: members.facebookLink,
        xLink: members.xLink,
        instagramLink: members.instagramLink,
        notes: members.notes,
        createdAt: members.createdAt,
        updatedAt: members.updatedAt,
      })
      .from(members)
      .where(eq(members.churchId, id))
      .orderBy(asc(members.createdAt));

    // Transform data for Excel export
    const exportData = membersData.map((member) => {
      const fullName = [member.firstName];
      if (member.middleName) fullName.push(member.middleName);
      fullName.push(member.lastName);

      // Helper function to truncate text to Excel's limit
      const truncateText = (text: string | null, maxLength = 32000) => {
        if (!text) return "";
        return text.length > maxLength
          ? text.substring(0, maxLength) + "..."
          : text;
      };

      return {
        ID: member.id,
        "Full Name": truncateText(fullName.join(" ")),
        "First Name": truncateText(member.firstName),
        "Middle Name": truncateText(member.middleName || ""),
        "Last Name": truncateText(member.lastName),
        Gender: member.gender,
        Birthdate: member.birthdate
          ? new Date(member.birthdate).toLocaleDateString()
          : "",
        "Year Joined": member.yearJoined,
        "Ministry Involvement": truncateText(member.ministryInvolvement || ""),
        Occupation: truncateText(member.occupation || ""),
        "Educational Attainment": truncateText(
          member.educationalAttainment || ""
        ),
        School: truncateText(member.school || ""),
        Degree: truncateText(member.degree || ""),
        "Mobile Number": truncateText(member.mobileNumber || ""),
        Email: truncateText(member.email || ""),
        "Home Address": truncateText(member.homeAddress || "", 500),
        "Facebook Link": truncateText(member.facebookLink || ""),
        "X Link": truncateText(member.xLink || ""),
        "Instagram Link": truncateText(member.instagramLink || ""),
        Notes: truncateText(member.notes || "", 1000),
        "Registration Date": member.createdAt
          ? new Date(member.createdAt).toLocaleDateString()
          : "",
        "Registration Time": member.createdAt
          ? new Date(member.createdAt).toLocaleTimeString()
          : "",
        "Last Updated": member.updatedAt
          ? new Date(member.updatedAt).toLocaleDateString()
          : "",
      };
    });

    // Create workbook and worksheet
    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.json_to_sheet(exportData);

    // Set column widths for better readability
    worksheet["!cols"] = [
      { wch: 5 }, // ID
      { wch: 30 }, // Full Name
      { wch: 20 }, // First Name
      { wch: 20 }, // Middle Name
      { wch: 20 }, // Last Name
      { wch: 10 }, // Gender
      { wch: 15 }, // Birthdate
      { wch: 12 }, // Year Joined
      { wch: 30 }, // Ministry Involvement
      { wch: 25 }, // Occupation
      { wch: 20 }, // Educational Attainment
      { wch: 25 }, // School
      { wch: 25 }, // Degree
      { wch: 18 }, // Mobile Number
      { wch: 30 }, // Email
      { wch: 40 }, // Home Address
      { wch: 25 }, // Facebook Link
      { wch: 25 }, // X Link
      { wch: 25 }, // Instagram Link
      { wch: 50 }, // Notes
      { wch: 18 }, // Registration Date
      { wch: 18 }, // Registration Time
      { wch: 18 }, // Last Updated
    ];

    // Add worksheet to workbook
    const churchName = church[0].name.toLowerCase().replace(/[^a-z0-9]/g, "-");
    XLSX.utils.book_append_sheet(workbook, worksheet, "Members");

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
      `attachment; filename="${churchName}-members-${new Date().toISOString().split("T")[0]}.xlsx"`
    );

    return response;
  } catch {
    return NextResponse.json(
      {
        success: false,
        error: "Internal server error",
        message: "Failed to export church members",
      },
      { status: 500 }
    );
  }
}
