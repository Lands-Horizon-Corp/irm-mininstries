import { NextResponse } from "next/server";

import { asc, eq } from "drizzle-orm";

import { db } from "@/db/drizzle";
import { createExcelExport, createExcelResponse } from "@/lib/excel-export";
import { churches } from "@/modules/church/church-schema";
import { members } from "@/modules/member/member-schema";
import { truncateText } from "@/lib/utils";

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
        tiktokLink: members.tiktokLink,
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

      return {
        id: member.id,
        fullName: truncateText(fullName.join(" ")),
        firstName: truncateText(member.firstName),
        middleName: truncateText(member.middleName || ""),
        lastName: truncateText(member.lastName),
        gender: member.gender,
        birthdate: member.birthdate
          ? new Date(member.birthdate).toLocaleDateString()
          : "",
        yearJoined: member.yearJoined,
        ministryInvolvement: truncateText(member.ministryInvolvement || ""),
        occupation: truncateText(member.occupation || ""),
        educationalAttainment: truncateText(member.educationalAttainment || ""),
        school: truncateText(member.school || ""),
        degree: truncateText(member.degree || ""),
        mobileNumber: truncateText(member.mobileNumber || ""),
        email: truncateText(member.email || ""),
        homeAddress: truncateText(member.homeAddress || "", 500),
        facebookLink: truncateText(member.facebookLink || ""),
        xLink: truncateText(member.xLink || ""),
        tiktokLink: truncateText(member.tiktokLink || ""),
        instagramLink: truncateText(member.instagramLink || ""),
        notes: truncateText(member.notes || "", 1000),
        registrationDate: member.createdAt
          ? new Date(member.createdAt).toLocaleDateString()
          : "",
        registrationTime: member.createdAt
          ? new Date(member.createdAt).toLocaleTimeString()
          : "",
        lastUpdated: member.updatedAt
          ? new Date(member.updatedAt).toLocaleDateString()
          : "",
      };
    });

    // Define Excel columns
    const columns = [
      { header: "ID", key: "id", width: 5 },
      { header: "Full Name", key: "fullName", width: 30 },
      { header: "First Name", key: "firstName", width: 20 },
      { header: "Middle Name", key: "middleName", width: 20 },
      { header: "Last Name", key: "lastName", width: 20 },
      { header: "Gender", key: "gender", width: 10 },
      { header: "Birthdate", key: "birthdate", width: 15 },
      { header: "Year Joined", key: "yearJoined", width: 12 },
      { header: "Ministry Involvement", key: "ministryInvolvement", width: 30 },
      { header: "Occupation", key: "occupation", width: 25 },
      {
        header: "Educational Attainment",
        key: "educationalAttainment",
        width: 20,
      },
      { header: "School", key: "school", width: 25 },
      { header: "Degree", key: "degree", width: 25 },
      { header: "Mobile Number", key: "mobileNumber", width: 18 },
      { header: "Email", key: "email", width: 30 },
      { header: "Home Address", key: "homeAddress", width: 40 },
      { header: "Facebook Link", key: "facebookLink", width: 25 },
      { header: "X Link", key: "xLink", width: 25 },
      { header: "TikTok Link", key: "tiktokLink", width: 25 },
      { header: "Instagram Link", key: "instagramLink", width: 25 },
      { header: "Notes", key: "notes", width: 50 },
      { header: "Registration Date", key: "registrationDate", width: 18 },
      { header: "Registration Time", key: "registrationTime", width: 18 },
      { header: "Last Updated", key: "lastUpdated", width: 18 },
    ];

    // Generate Excel buffer
    const excelBuffer = await createExcelExport({
      sheetName: "Members",
      columns,
      data: exportData,
    });

    // Create filename with church name
    const churchName = church[0].name.toLowerCase().replace(/[^a-z0-9]/g, "-");
    const filename = `${churchName}-members-${new Date().toISOString().split("T")[0]}.xlsx`;

    // Return Excel response
    return createExcelResponse(excelBuffer, filename);
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
