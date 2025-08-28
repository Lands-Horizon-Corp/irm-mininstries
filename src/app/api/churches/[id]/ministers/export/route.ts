import { NextResponse } from "next/server";

import { asc, eq } from "drizzle-orm";
import * as XLSX from "xlsx";

import { db } from "@/db/drizzle";
import { churches } from "@/modules/church/church-schema";
import { ministers } from "@/modules/ministry/ministry-schema";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const churchId = parseInt(params.id);

    if (isNaN(churchId)) {
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
      .where(eq(churches.id, churchId))
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

    // Get all ministers for this church ordered by creation date
    const ministersData = await db
      .select({
        id: ministers.id,
        firstName: ministers.firstName,
        lastName: ministers.lastName,
        middleName: ministers.middleName,
        suffix: ministers.suffix,
        nickname: ministers.nickname,
        dateOfBirth: ministers.dateOfBirth,
        placeOfBirth: ministers.placeOfBirth,
        address: ministers.address,
        presentAddress: ministers.presentAddress,
        permanentAddress: ministers.permanentAddress,
        gender: ministers.gender,
        heightFeet: ministers.heightFeet,
        weightKg: ministers.weightKg,
        civilStatus: ministers.civilStatus,
        email: ministers.email,
        telephone: ministers.telephone,
        passportNumber: ministers.passportNumber,
        sssNumber: ministers.sssNumber,
        philhealth: ministers.philhealth,
        tin: ministers.tin,
        biography: ministers.biography,
        fatherName: ministers.fatherName,
        fatherProvince: ministers.fatherProvince,
        fatherBirthday: ministers.fatherBirthday,
        fatherOccupation: ministers.fatherOccupation,
        motherName: ministers.motherName,
        motherProvince: ministers.motherProvince,
        motherBirthday: ministers.motherBirthday,
        motherOccupation: ministers.motherOccupation,
        spouseName: ministers.spouseName,
        spouseProvince: ministers.spouseProvince,
        spouseBirthday: ministers.spouseBirthday,
        spouseOccupation: ministers.spouseOccupation,
        weddingDate: ministers.weddingDate,
        skills: ministers.skills,
        hobbies: ministers.hobbies,
        sports: ministers.sports,
        otherReligiousSecularTraining: ministers.otherReligiousSecularTraining,
        certifiedBy: ministers.certifiedBy,
        createdAt: ministers.createdAt,
        updatedAt: ministers.updatedAt,
      })
      .from(ministers)
      .where(eq(ministers.churchId, churchId))
      .orderBy(asc(ministers.createdAt));

    // Transform data for Excel export
    const exportData = ministersData.map((minister) => {
      const fullName = [minister.firstName];
      if (minister.middleName) fullName.push(minister.middleName);
      fullName.push(minister.lastName);
      if (minister.suffix) fullName.push(minister.suffix);

      // Helper function to truncate text to Excel's limit
      const truncateText = (text: string | null, maxLength = 32000) => {
        if (!text) return "";
        return text.length > maxLength
          ? text.substring(0, maxLength) + "..."
          : text;
      };

      const formatDate = (date: Date | null) => {
        return date ? new Date(date).toLocaleDateString() : "";
      };

      return {
        ID: minister.id,
        "Full Name": truncateText(fullName.join(" ")),
        "First Name": truncateText(minister.firstName),
        "Middle Name": truncateText(minister.middleName || ""),
        "Last Name": truncateText(minister.lastName),
        Suffix: truncateText(minister.suffix || ""),
        Nickname: truncateText(minister.nickname || ""),
        "Date of Birth": formatDate(minister.dateOfBirth),
        "Place of Birth": truncateText(minister.placeOfBirth || ""),
        Address: truncateText(minister.address || "", 500),
        "Present Address": truncateText(minister.presentAddress || "", 500),
        "Permanent Address": truncateText(minister.permanentAddress || "", 500),
        Gender: minister.gender,
        "Height (Feet)": truncateText(minister.heightFeet || ""),
        "Weight (Kg)": truncateText(minister.weightKg || ""),
        "Civil Status": minister.civilStatus,
        Email: truncateText(minister.email || ""),
        Telephone: truncateText(minister.telephone || ""),
        "Passport Number": truncateText(minister.passportNumber || ""),
        "SSS Number": truncateText(minister.sssNumber || ""),
        Philhealth: truncateText(minister.philhealth || ""),
        TIN: truncateText(minister.tin || ""),
        Biography: truncateText(minister.biography || "", 1000),
        "Father Name": truncateText(minister.fatherName || ""),
        "Father Province": truncateText(minister.fatherProvince || ""),
        "Father Birthday": formatDate(minister.fatherBirthday),
        "Father Occupation": truncateText(minister.fatherOccupation || ""),
        "Mother Name": truncateText(minister.motherName || ""),
        "Mother Province": truncateText(minister.motherProvince || ""),
        "Mother Birthday": formatDate(minister.motherBirthday),
        "Mother Occupation": truncateText(minister.motherOccupation || ""),
        "Spouse Name": truncateText(minister.spouseName || ""),
        "Spouse Province": truncateText(minister.spouseProvince || ""),
        "Spouse Birthday": formatDate(minister.spouseBirthday),
        "Spouse Occupation": truncateText(minister.spouseOccupation || ""),
        "Wedding Date": formatDate(minister.weddingDate),
        Skills: truncateText(minister.skills || "", 1000),
        Hobbies: truncateText(minister.hobbies || "", 500),
        Sports: truncateText(minister.sports || "", 500),
        "Other Religious/Secular Training": truncateText(
          minister.otherReligiousSecularTraining || "",
          1000
        ),
        "Certified By": truncateText(minister.certifiedBy || ""),
        "Registration Date": formatDate(minister.createdAt),
        "Registration Time": minister.createdAt
          ? new Date(minister.createdAt).toLocaleTimeString()
          : "",
        "Last Updated": formatDate(minister.updatedAt),
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
      { wch: 15 }, // Suffix
      { wch: 20 }, // Nickname
      { wch: 15 }, // Date of Birth
      { wch: 30 }, // Place of Birth
      { wch: 40 }, // Address
      { wch: 40 }, // Present Address
      { wch: 40 }, // Permanent Address
      { wch: 10 }, // Gender
      { wch: 15 }, // Height (Feet)
      { wch: 15 }, // Weight (Kg)
      { wch: 15 }, // Civil Status
      { wch: 30 }, // Email
      { wch: 18 }, // Telephone
      { wch: 20 }, // Passport Number
      { wch: 15 }, // SSS Number
      { wch: 20 }, // Philhealth
      { wch: 15 }, // TIN
      { wch: 50 }, // Biography
      { wch: 25 }, // Father Name
      { wch: 20 }, // Father Province
      { wch: 15 }, // Father Birthday
      { wch: 25 }, // Father Occupation
      { wch: 25 }, // Mother Name
      { wch: 20 }, // Mother Province
      { wch: 15 }, // Mother Birthday
      { wch: 25 }, // Mother Occupation
      { wch: 25 }, // Spouse Name
      { wch: 20 }, // Spouse Province
      { wch: 15 }, // Spouse Birthday
      { wch: 25 }, // Spouse Occupation
      { wch: 15 }, // Wedding Date
      { wch: 50 }, // Skills
      { wch: 30 }, // Hobbies
      { wch: 30 }, // Sports
      { wch: 50 }, // Other Religious/Secular Training
      { wch: 25 }, // Certified By
      { wch: 18 }, // Registration Date
      { wch: 18 }, // Registration Time
      { wch: 18 }, // Last Updated
    ];

    // Add worksheet to workbook
    const churchName = church[0].name.toLowerCase().replace(/[^a-z0-9]/g, "-");
    XLSX.utils.book_append_sheet(workbook, worksheet, "Ministers");

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
      `attachment; filename="${churchName}-ministers-${new Date().toISOString().split("T")[0]}.xlsx"`
    );

    return response;
  } catch (error) {
    console.error("Export church ministers error:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Internal server error",
        message: "Failed to export church ministers",
      },
      { status: 500 }
    );
  }
}
