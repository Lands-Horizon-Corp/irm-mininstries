import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import { asc, count, desc, ilike, or } from "drizzle-orm";
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

// GET - Get all ministers with pagination and search
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    // Extract query parameters
    const page = Math.max(1, parseInt(searchParams.get("page") || "1"));
    const limit = Math.min(
      100,
      Math.max(1, parseInt(searchParams.get("limit") || "10"))
    );
    const search = searchParams.get("search")?.trim() || "";
    const sortBy = searchParams.get("sortBy") || "createdAt";
    const sortOrder = searchParams.get("sortOrder") || "desc";

    const offset = (page - 1) * limit;

    // Build where clause for search
    const whereClause = search
      ? or(
          ilike(ministers.firstName, `%${search}%`),
          ilike(ministers.lastName, `%${search}%`),
          ilike(ministers.middleName, `%${search}%`),
          ilike(ministers.email, `%${search}%`),
          ilike(ministers.address, `%${search}%`),
          ilike(ministers.presentAddress, `%${search}%`),
          ilike(ministers.telephone, `%${search}%`)
        )
      : undefined;

    // Build order clause
    const orderClause =
      sortOrder === "asc"
        ? asc(
            ministers[sortBy as keyof typeof ministers._.columns] ||
              ministers.createdAt
          )
        : desc(
            ministers[sortBy as keyof typeof ministers._.columns] ||
              ministers.createdAt
          );

    // Get total count for pagination
    const [totalResult] = await db
      .select({ count: count() })
      .from(ministers)
      .where(whereClause);

    const total = totalResult.count;

    // Get paginated results (basic info only for performance)
    const results = await db
      .select({
        id: ministers.id,
        firstName: ministers.firstName,
        lastName: ministers.lastName,
        middleName: ministers.middleName,
        email: ministers.email,
        telephone: ministers.telephone,
        gender: ministers.gender,
        civilStatus: ministers.civilStatus,
        address: ministers.address,
        presentAddress: ministers.presentAddress,
        imageUrl: ministers.imageUrl,
        createdAt: ministers.createdAt,
        updatedAt: ministers.updatedAt,
      })
      .from(ministers)
      .where(whereClause)
      .orderBy(orderClause)
      .limit(limit)
      .offset(offset);

    const totalPages = Math.ceil(total / limit);

    return NextResponse.json({
      success: true,
      data: results,
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1,
      },
      search: search || null,
      sort: {
        by: sortBy,
        order: sortOrder,
      },
    });
  } catch (error) {
    console.error("Get ministers error:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Internal server error",
        message: "Failed to fetch ministers",
      },
      { status: 500 }
    );
  }
}

// POST - Create new minister
export async function POST(request: NextRequest) {
  try {
    // Parse the JSON body
    const body = await request.json();

    // Validate the request data against our schema
    const validatedData = ministerSchema.parse(body);

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
      data: result,
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
