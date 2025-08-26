import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import { z } from "zod";

import { db } from "@/db/drizzle";
import {
  ministerAwardsRecognitions,
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

export async function POST(request: NextRequest) {
  try {
    // Parse the JSON body
    const body = await request.json();

    // Validate the request data against our schema
    const validatedData = ministerSchema.parse(body);

    // Log the minister submission (for debugging - remove in production)
    console.log("Ministry submission:", {
      firstName: validatedData.firstName,
      lastName: validatedData.lastName,
      email: validatedData.email || "No email provided",
      dateOfBirth: validatedData.dateOfBirth,
      timestamp: new Date().toISOString(),
    });

    // Start a database transaction to ensure data consistency
    const result = await db.transaction(async (tx) => {
      // Insert the main minister record
      const [newMinister] = await tx
        .insert(ministers)
        .values({
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
        })
        .returning();

      const ministerId = newMinister.id;

      // Insert related data if provided
      if (validatedData.children && validatedData.children.length > 0) {
        await tx.insert(ministerChildren).values(
          validatedData.children.map((child) => ({
            ministerId,
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
        await tx.insert(ministerEmergencyContacts).values(
          validatedData.emergencyContacts.map((contact) => ({
            ministerId,
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
        await tx.insert(ministerEducationBackgrounds).values(
          validatedData.educationBackgrounds.map((education) => ({
            ministerId,
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
        await tx.insert(ministerMinistryExperiences).values(
          validatedData.ministryExperiences.map((experience) => ({
            ministerId,
            title: experience.title,
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
        await tx.insert(ministerMinistrySkills).values(
          validatedData.ministrySkills.map((skill) => ({
            ministerId,
            ministrySkillId: skill.ministrySkillId,
          }))
        );
      }

      if (
        validatedData.ministryRecords &&
        validatedData.ministryRecords.length > 0
      ) {
        await tx.insert(ministerMinistryRecords).values(
          validatedData.ministryRecords.map((record) => ({
            ministerId,
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
        await tx.insert(ministerAwardsRecognitions).values(
          validatedData.awardsRecognitions.map((award) => ({
            ministerId,
            year: award.year,
            description: award.description,
          }))
        );
      }

      if (
        validatedData.employmentRecords &&
        validatedData.employmentRecords.length > 0
      ) {
        await tx.insert(ministerEmploymentRecords).values(
          validatedData.employmentRecords.map((employment) => ({
            ministerId,
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
        await tx.insert(ministerSeminarsConferences).values(
          validatedData.seminarsConferences.map((seminar) => ({
            ministerId,
            title: seminar.title,
            description: seminar.description,
            place: seminar.place,
            year: seminar.year,
            numberOfHours: seminar.numberOfHours,
          }))
        );
      }

      return newMinister;
    });

    // Return success response
    return NextResponse.json({
      success: true,
      message: "Ministry added successfully",
      data: {
        id: result.id.toString(),
        name: `${result.firstName} ${result.lastName}`,
        email: result.email,
        timestamp: result.createdAt.toISOString(),
      },
    });
  } catch (error) {
    console.error("Ministry submission error:", error);

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
        message: "Something went wrong while processing your request",
      },
      { status: 500 }
    );
  }
}

// Handle unsupported methods
export async function GET() {
  return NextResponse.json(
    {
      success: false,
      error: "Method not allowed",
      message: "GET method is not supported for this endpoint",
    },
    { status: 405 }
  );
}

export async function PUT() {
  return NextResponse.json(
    {
      success: false,
      error: "Method not allowed",
      message: "PUT method is not supported for this endpoint",
    },
    { status: 405 }
  );
}

export async function DELETE() {
  return NextResponse.json(
    {
      success: false,
      error: "Method not allowed",
      message: "DELETE method is not supported for this endpoint",
    },
    { status: 405 }
  );
}
