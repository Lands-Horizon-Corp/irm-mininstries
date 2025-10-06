import { NextResponse } from "next/server";

import { asc, eq } from "drizzle-orm";

import { db } from "@/db/drizzle";
import { createExcelExport, createExcelResponse } from "@/lib/excel-export";
import { churches } from "@/modules/church/church-schema";
import { ministers } from "@/modules/ministry/ministry-schema";
import { formatDate, truncateText } from "@/lib/utils";

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
      .where(eq(ministers.churchId, id))
      .orderBy(asc(ministers.createdAt));

    // Transform data for Excel export
    const exportData = ministersData.map((minister) => {
      const fullName = [minister.firstName];
      if (minister.middleName) fullName.push(minister.middleName);
      fullName.push(minister.lastName);
      if (minister.suffix) fullName.push(minister.suffix);

      return {
        id: minister.id,
        fullName: truncateText(fullName.join(" ")),
        firstName: truncateText(minister.firstName),
        middleName: truncateText(minister.middleName || ""),
        lastName: truncateText(minister.lastName),
        suffix: truncateText(minister.suffix || ""),
        nickname: truncateText(minister.nickname || ""),
        dateOfBirth: formatDate(minister.dateOfBirth),
        placeOfBirth: truncateText(minister.placeOfBirth || ""),
        address: truncateText(minister.address || "", 500),
        presentAddress: truncateText(minister.presentAddress || "", 500),
        permanentAddress: truncateText(minister.permanentAddress || "", 500),
        gender: minister.gender,
        heightFeet: truncateText(minister.heightFeet || ""),
        weightKg: truncateText(minister.weightKg || ""),
        civilStatus: minister.civilStatus,
        email: truncateText(minister.email || ""),
        telephone: truncateText(minister.telephone || ""),
        passportNumber: truncateText(minister.passportNumber || ""),
        sssNumber: truncateText(minister.sssNumber || ""),
        philhealth: truncateText(minister.philhealth || ""),
        tin: truncateText(minister.tin || ""),
        biography: truncateText(minister.biography || "", 1000),
        fatherName: truncateText(minister.fatherName || ""),
        fatherProvince: truncateText(minister.fatherProvince || ""),
        fatherBirthday: formatDate(minister.fatherBirthday),
        fatherOccupation: truncateText(minister.fatherOccupation || ""),
        motherName: truncateText(minister.motherName || ""),
        motherProvince: truncateText(minister.motherProvince || ""),
        motherBirthday: formatDate(minister.motherBirthday),
        motherOccupation: truncateText(minister.motherOccupation || ""),
        spouseName: truncateText(minister.spouseName || ""),
        spouseProvince: truncateText(minister.spouseProvince || ""),
        spouseBirthday: formatDate(minister.spouseBirthday),
        spouseOccupation: truncateText(minister.spouseOccupation || ""),
        weddingDate: formatDate(minister.weddingDate),
        skills: truncateText(minister.skills || "", 1000),
        hobbies: truncateText(minister.hobbies || "", 500),
        sports: truncateText(minister.sports || "", 500),
        otherReligiousSecularTraining: truncateText(
          minister.otherReligiousSecularTraining || "",
          1000
        ),
        certifiedBy: truncateText(minister.certifiedBy || ""),
        registrationDate: formatDate(minister.createdAt),
        registrationTime: minister.createdAt
          ? new Date(minister.createdAt).toLocaleTimeString()
          : "",
        lastUpdated: formatDate(minister.updatedAt),
      };
    });

    // Define Excel columns
    const columns = [
      { header: "ID", key: "id", width: 5 },
      { header: "Full Name", key: "fullName", width: 30 },
      { header: "First Name", key: "firstName", width: 20 },
      { header: "Middle Name", key: "middleName", width: 20 },
      { header: "Last Name", key: "lastName", width: 20 },
      { header: "Suffix", key: "suffix", width: 15 },
      { header: "Nickname", key: "nickname", width: 20 },
      { header: "Date of Birth", key: "dateOfBirth", width: 15 },
      { header: "Place of Birth", key: "placeOfBirth", width: 30 },
      { header: "Address", key: "address", width: 40 },
      { header: "Present Address", key: "presentAddress", width: 40 },
      { header: "Permanent Address", key: "permanentAddress", width: 40 },
      { header: "Gender", key: "gender", width: 10 },
      { header: "Height (Feet)", key: "heightFeet", width: 15 },
      { header: "Weight (Kg)", key: "weightKg", width: 15 },
      { header: "Civil Status", key: "civilStatus", width: 15 },
      { header: "Email", key: "email", width: 30 },
      { header: "Telephone", key: "telephone", width: 18 },
      { header: "Passport Number", key: "passportNumber", width: 20 },
      { header: "SSS Number", key: "sssNumber", width: 15 },
      { header: "Philhealth", key: "philhealth", width: 20 },
      { header: "TIN", key: "tin", width: 15 },
      { header: "Biography", key: "biography", width: 50 },
      { header: "Father Name", key: "fatherName", width: 25 },
      { header: "Father Province", key: "fatherProvince", width: 20 },
      { header: "Father Birthday", key: "fatherBirthday", width: 15 },
      { header: "Father Occupation", key: "fatherOccupation", width: 25 },
      { header: "Mother Name", key: "motherName", width: 25 },
      { header: "Mother Province", key: "motherProvince", width: 20 },
      { header: "Mother Birthday", key: "motherBirthday", width: 15 },
      { header: "Mother Occupation", key: "motherOccupation", width: 25 },
      { header: "Spouse Name", key: "spouseName", width: 25 },
      { header: "Spouse Province", key: "spouseProvince", width: 20 },
      { header: "Spouse Birthday", key: "spouseBirthday", width: 15 },
      { header: "Spouse Occupation", key: "spouseOccupation", width: 25 },
      { header: "Wedding Date", key: "weddingDate", width: 15 },
      { header: "Skills", key: "skills", width: 50 },
      { header: "Hobbies", key: "hobbies", width: 30 },
      { header: "Sports", key: "sports", width: 30 },
      {
        header: "Other Religious/Secular Training",
        key: "otherReligiousSecularTraining",
        width: 50,
      },
      { header: "Certified By", key: "certifiedBy", width: 25 },
      { header: "Registration Date", key: "registrationDate", width: 18 },
      { header: "Registration Time", key: "registrationTime", width: 18 },
      { header: "Last Updated", key: "lastUpdated", width: 18 },
    ];

    // Generate Excel buffer
    const excelBuffer = await createExcelExport({
      sheetName: "Ministers",
      columns,
      data: exportData,
    });

    // Create filename with church name
    const churchName = church[0].name.toLowerCase().replace(/[^a-z0-9]/g, "-");
    const filename = `${churchName}-ministers-${new Date().toISOString().split("T")[0]}.xlsx`;

    // Return Excel response
    return createExcelResponse(excelBuffer, filename);
  } catch {
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
