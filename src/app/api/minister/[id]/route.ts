import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import { eq } from "drizzle-orm";
import { z } from "zod";

import { db } from "@/db/drizzle";
import {
  ministerAwardsRecognitions,
  ministerCaseReports,
  ministerChildren,
  ministerEducationBackgrounds,
  ministerEmergencyContacts,
  ministerEmploymentRecords,
  ministerMinistryExperiences,
  ministerMinistryRecords,
  ministerMinistrySkills,
  ministers,
  ministerSeminarsConferences,
} from "@/modules/ministry/ministry-schema";
import { ministerSchema } from "@/modules/ministry/ministry-validation";

// GET - Get minister by ID with all related data
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: idString } = await params;
    const id = parseInt(idString);

    if (isNaN(id)) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid ID",
          message: "ID must be a valid number",
        },
        { status: 400 }
      );
    }

    // Get the main minister record
    const [minister] = await db
      .select()
      .from(ministers)
      .where(eq(ministers.id, id));

    if (!minister) {
      return NextResponse.json(
        {
          success: false,
          error: "Not found",
          message: "Minister not found",
        },
        { status: 404 }
      );
    }

    // Get all related data
    const [
      children,
      emergencyContacts,
      educationBackgrounds,
      ministryExperiences,
      ministrySkills,
      ministryRecords,
      awardsRecognitions,
      employmentRecords,
      seminarsConferences,
      caseReports,
    ] = await Promise.all([
      db
        .select()
        .from(ministerChildren)
        .where(eq(ministerChildren.ministerId, id)),
      db
        .select()
        .from(ministerEmergencyContacts)
        .where(eq(ministerEmergencyContacts.ministerId, id)),
      db
        .select()
        .from(ministerEducationBackgrounds)
        .where(eq(ministerEducationBackgrounds.ministerId, id)),
      db
        .select()
        .from(ministerMinistryExperiences)
        .where(eq(ministerMinistryExperiences.ministerId, id)),
      db
        .select()
        .from(ministerMinistrySkills)
        .where(eq(ministerMinistrySkills.ministerId, id)),
      db
        .select()
        .from(ministerMinistryRecords)
        .where(eq(ministerMinistryRecords.ministerId, id)),
      db
        .select()
        .from(ministerAwardsRecognitions)
        .where(eq(ministerAwardsRecognitions.ministerId, id)),
      db
        .select()
        .from(ministerEmploymentRecords)
        .where(eq(ministerEmploymentRecords.ministerId, id)),
      db
        .select()
        .from(ministerSeminarsConferences)
        .where(eq(ministerSeminarsConferences.ministerId, id)),
      db
        .select()
        .from(ministerCaseReports)
        .where(eq(ministerCaseReports.ministerId, id)),
    ]);

    // Combine all data
    const fullMinisterData = {
      ...minister,
      children,
      emergencyContacts,
      educationBackgrounds,
      ministryExperiences,
      ministrySkills,
      ministryRecords,
      awardsRecognitions,
      employmentRecords,
      seminarsConferences,
      caseReports,
    };

    return NextResponse.json({
      success: true,
      data: fullMinisterData,
    });
  } catch (error) {
    console.error("Get minister by ID error:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Internal server error",
        message: "Failed to fetch minister",
      },
      { status: 500 }
    );
  }
}

// PUT - Update minister by ID
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: idString } = await params;
    const id = parseInt(idString);

    if (isNaN(id)) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid ID",
          message: "ID must be a valid number",
        },
        { status: 400 }
      );
    }

    // Parse the JSON body
    const body = await request.json();

    // Validate the request data against our schema
    const validatedData = ministerSchema.parse(body);

    // Check if the minister exists
    const [existingMinister] = await db
      .select()
      .from(ministers)
      .where(eq(ministers.id, id));

    if (!existingMinister) {
      return NextResponse.json(
        {
          success: false,
          error: "Not found",
          message: "Minister not found",
        },
        { status: 404 }
      );
    }

    // Update the main minister record
    const [updatedMinister] = await db
      .update(ministers)
      .set({
        firstName: validatedData.firstName,
        lastName: validatedData.lastName,
        middleName: validatedData.middleName,
        suffix: validatedData.suffix,
        nickname: validatedData.nickname,
        dateOfBirth: validatedData.dateOfBirth,
        placeOfBirth: validatedData.placeOfBirth,
        address: validatedData.address,
        gender: validatedData.gender,
        heightFeet: validatedData.heightFeet,
        weightKg: validatedData.weightKg,
        civilStatus: validatedData.civilStatus,
        email: validatedData.email,
        telephone: validatedData.telephone,
        passportNumber: validatedData.passportNumber,
        sssNumber: validatedData.sssNumber,
        philhealth: validatedData.philhealth,
        tin: validatedData.tin,
        presentAddress: validatedData.presentAddress,
        permanentAddress: validatedData.permanentAddress,
        fatherName: validatedData.fatherName,
        fatherProvince: validatedData.fatherProvince,
        fatherBirthday: validatedData.fatherBirthday,
        fatherOccupation: validatedData.fatherOccupation,
        motherName: validatedData.motherName,
        motherProvince: validatedData.motherProvince,
        motherBirthday: validatedData.motherBirthday,
        motherOccupation: validatedData.motherOccupation,
        spouseName: validatedData.spouseName,
        spouseProvince: validatedData.spouseProvince,
        spouseBirthday: validatedData.spouseBirthday,
        spouseOccupation: validatedData.spouseOccupation,
        weddingDate: validatedData.weddingDate,
        skills: validatedData.skills,
        hobbies: validatedData.hobbies,
        sports: validatedData.sports,
        otherReligiousSecularTraining:
          validatedData.otherReligiousSecularTraining,
        certifiedBy: validatedData.certifiedBy,
        signatureImageUrl: validatedData.signatureImageUrl,
        signatureByCertifiedImageUrl:
          validatedData.signatureByCertifiedImageUrl,
        imageUrl: validatedData.imageUrl,
        updatedAt: new Date(),
      })
      .where(eq(ministers.id, id))
      .returning();

    // Delete existing related records and insert new ones
    try {
      // Delete existing related records
      await Promise.all([
        db.delete(ministerChildren).where(eq(ministerChildren.ministerId, id)),
        db
          .delete(ministerEmergencyContacts)
          .where(eq(ministerEmergencyContacts.ministerId, id)),
        db
          .delete(ministerEducationBackgrounds)
          .where(eq(ministerEducationBackgrounds.ministerId, id)),
        db
          .delete(ministerMinistryExperiences)
          .where(eq(ministerMinistryExperiences.ministerId, id)),
        db
          .delete(ministerMinistrySkills)
          .where(eq(ministerMinistrySkills.ministerId, id)),
        db
          .delete(ministerMinistryRecords)
          .where(eq(ministerMinistryRecords.ministerId, id)),
        db
          .delete(ministerAwardsRecognitions)
          .where(eq(ministerAwardsRecognitions.ministerId, id)),
        db
          .delete(ministerEmploymentRecords)
          .where(eq(ministerEmploymentRecords.ministerId, id)),
        db
          .delete(ministerSeminarsConferences)
          .where(eq(ministerSeminarsConferences.ministerId, id)),
        db
          .delete(ministerCaseReports)
          .where(eq(ministerCaseReports.ministerId, id)),
      ]);

      // Insert updated related data if provided
      if (validatedData.children && validatedData.children.length > 0) {
        await db.insert(ministerChildren).values(
          validatedData.children.map((child) => ({
            ministerId: id,
            name: child.name,
            placeOfBirth: child.placeOfBirth,
            dateOfBirth: child.dateOfBirth,
            gender: child.gender,
          }))
        );
      }

      if (
        validatedData.emergencyContacts &&
        validatedData.emergencyContacts.length > 0
      ) {
        await db.insert(ministerEmergencyContacts).values(
          validatedData.emergencyContacts.map((contact) => ({
            ministerId: id,
            name: contact.name,
            relationship: contact.relationship,
            address: contact.address,
            contactNumber: contact.contactNumber,
          }))
        );
      }

      if (
        validatedData.educationBackgrounds &&
        validatedData.educationBackgrounds.length > 0
      ) {
        await db.insert(ministerEducationBackgrounds).values(
          validatedData.educationBackgrounds.map((education) => ({
            ministerId: id,
            schoolName: education.schoolName,
            educationalAttainment: education.educationalAttainment,
            dateGraduated: education.dateGraduated,
            description: education.description,
            course: education.course,
          }))
        );
      }

      if (
        validatedData.ministryExperiences &&
        validatedData.ministryExperiences.length > 0
      ) {
        await db.insert(ministerMinistryExperiences).values(
          validatedData.ministryExperiences.map((experience) => ({
            ministerId: id,
            ministryRankId: experience.ministryRankId,
            description: experience.description,
            fromYear: experience.fromYear,
            toYear: experience.toYear,
          }))
        );
      }

      if (
        validatedData.ministrySkills &&
        validatedData.ministrySkills.length > 0
      ) {
        await db.insert(ministerMinistrySkills).values(
          validatedData.ministrySkills.map((skill) => ({
            ministerId: id,
            ministrySkillId: skill.ministrySkillId,
          }))
        );
      }

      if (
        validatedData.ministryRecords &&
        validatedData.ministryRecords.length > 0
      ) {
        await db.insert(ministerMinistryRecords).values(
          validatedData.ministryRecords.map((record) => ({
            ministerId: id,
            churchLocationId: record.churchLocationId,
            fromYear: record.fromYear,
            toYear: record.toYear,
            contribution: record.contribution,
          }))
        );
      }

      if (
        validatedData.awardsRecognitions &&
        validatedData.awardsRecognitions.length > 0
      ) {
        await db.insert(ministerAwardsRecognitions).values(
          validatedData.awardsRecognitions.map((award) => ({
            ministerId: id,
            year: award.year,
            description: award.description,
          }))
        );
      }

      if (
        validatedData.employmentRecords &&
        validatedData.employmentRecords.length > 0
      ) {
        await db.insert(ministerEmploymentRecords).values(
          validatedData.employmentRecords.map((employment) => ({
            ministerId: id,
            companyName: employment.companyName,
            fromYear: employment.fromYear,
            toYear: employment.toYear,
            position: employment.position,
          }))
        );
      }

      if (
        validatedData.seminarsConferences &&
        validatedData.seminarsConferences.length > 0
      ) {
        await db.insert(ministerSeminarsConferences).values(
          validatedData.seminarsConferences.map((seminar) => ({
            ministerId: id,
            title: seminar.title,
            description: seminar.description,
            place: seminar.place,
            year: seminar.year,
            numberOfHours: seminar.numberOfHours,
          }))
        );
      }

      if (validatedData.caseReports && validatedData.caseReports.length > 0) {
        await db.insert(ministerCaseReports).values(
          validatedData.caseReports.map((caseReport) => ({
            ministerId: id,
            description: caseReport.description,
            year: caseReport.year,
          }))
        );
      }
    } catch (relatedDataError) {
      console.error("Error updating related data:", relatedDataError);
      // The main minister record has been updated, but some related data may have failed
    }

    return NextResponse.json({
      success: true,
      message: "Minister updated successfully",
      data: updatedMinister,
    });
  } catch (error) {
    console.error("Update minister error:", error);

    // Handle Zod validation errors
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          success: false,
          error: "Validation failed",
          details: error.issues.map((err) => ({
            field: err.path.join("."),
            message: err.message,
          })),
        },
        { status: 400 }
      );
    }

    // Handle database errors
    if (error instanceof Error) {
      return NextResponse.json(
        {
          success: false,
          error: "Database error",
          message: error.message,
        },
        { status: 500 }
      );
    }

    // Handle other errors
    return NextResponse.json(
      {
        success: false,
        error: "Internal server error",
        message: "Something went wrong while updating the minister",
      },
      { status: 500 }
    );
  }
}

// DELETE - Delete minister by ID
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: idString } = await params;
    const id = parseInt(idString);

    if (isNaN(id)) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid ID",
          message: "ID must be a valid number",
        },
        { status: 400 }
      );
    }

    // Check if the minister exists
    const [existingMinister] = await db
      .select()
      .from(ministers)
      .where(eq(ministers.id, id));

    if (!existingMinister) {
      return NextResponse.json(
        {
          success: false,
          error: "Not found",
          message: "Minister not found",
        },
        { status: 404 }
      );
    }

    // Delete the minister and all related data
    try {
      // Delete all related records first
      await Promise.all([
        db.delete(ministerChildren).where(eq(ministerChildren.ministerId, id)),
        db
          .delete(ministerEmergencyContacts)
          .where(eq(ministerEmergencyContacts.ministerId, id)),
        db
          .delete(ministerEducationBackgrounds)
          .where(eq(ministerEducationBackgrounds.ministerId, id)),
        db
          .delete(ministerMinistryExperiences)
          .where(eq(ministerMinistryExperiences.ministerId, id)),
        db
          .delete(ministerMinistrySkills)
          .where(eq(ministerMinistrySkills.ministerId, id)),
        db
          .delete(ministerMinistryRecords)
          .where(eq(ministerMinistryRecords.ministerId, id)),
        db
          .delete(ministerAwardsRecognitions)
          .where(eq(ministerAwardsRecognitions.ministerId, id)),
        db
          .delete(ministerEmploymentRecords)
          .where(eq(ministerEmploymentRecords.ministerId, id)),
        db
          .delete(ministerSeminarsConferences)
          .where(eq(ministerSeminarsConferences.ministerId, id)),
      ]);

      // Delete the main minister record
      await db.delete(ministers).where(eq(ministers.id, id));
    } catch (deleteError) {
      console.error("Error deleting minister:", deleteError);
      throw deleteError;
    }

    return NextResponse.json({
      success: true,
      message: "Minister deleted successfully",
      data: {
        id: existingMinister.id,
        name: `${existingMinister.firstName} ${existingMinister.lastName}`,
        email: existingMinister.email,
      },
    });
  } catch (error) {
    console.error("Delete minister error:", error);

    // Handle foreign key constraint errors
    if (
      error instanceof Error &&
      error.message.includes("foreign key constraint")
    ) {
      return NextResponse.json(
        {
          success: false,
          error: "Cannot delete",
          message: "This minister has related records and cannot be deleted",
        },
        { status: 409 }
      );
    }

    // Handle other errors
    return NextResponse.json(
      {
        success: false,
        error: "Internal server error",
        message: "Something went wrong while deleting the minister",
      },
      { status: 500 }
    );
  }
}
