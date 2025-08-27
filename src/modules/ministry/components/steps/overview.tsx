"use client";

import React, { useState } from "react";
import Image from "next/image";

import { format } from "date-fns";
import jsPDF from "jspdf";
import {
  Award,
  BookOpen,
  Briefcase,
  Calendar,
  Church,
  Contact,
  Download,
  FileText,
  GraduationCap,
  Heart,
  IdCard,
  Mail,
  MapPin,
  Phone,
  Star,
  User,
  Users,
  Zap,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ImageViewer } from "@/components/ui/image-viewer";
import { Separator } from "@/components/ui/separator";
import { useChurches } from "@/modules/church/church-service";
import { useMinistryRanks } from "@/modules/ministry-ranks/ministry-ranks-service";
import { useMinistrySkills } from "@/modules/ministry-skills/ministry-skills-service";

import type { StepProps } from "../../ministry-validation";

export function Overview({
  formData,
  isSubmitting,
  onNext,
  onBack,
}: StepProps) {
  // State for image viewer
  const [imageViewer, setImageViewer] = useState<{
    isOpen: boolean;
    src: string;
    alt: string;
  }>({
    isOpen: false,
    src: "",
    alt: "",
  });

  // Function to open image viewer
  const openImageViewer = (src: string, alt: string) => {
    setImageViewer({
      isOpen: true,
      src,
      alt,
    });
  };

  // Function to close image viewer
  const closeImageViewer = () => {
    setImageViewer({
      isOpen: false,
      src: "",
      alt: "",
    });
  };

  // Function to export PDF
  const exportToPDF = async () => {
    const pdf = new jsPDF("p", "mm", "a4");
    let yPosition = 25;
    const pageHeight = pdf.internal.pageSize.height;
    const pageWidth = pdf.internal.pageSize.width;
    const margin = 20;
    const contentWidth = pageWidth - 2 * margin;

    // Helper function to convert image URL to base64
    const getImageAsBase64 = async (imageUrl: string): Promise<string> => {
      try {
        const response = await fetch(imageUrl);
        const blob = await response.blob();
        return new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result as string);
          reader.onerror = reject;
          reader.readAsDataURL(blob);
        });
      } catch (error) {
        console.error("Error converting image to base64:", error);
        return "";
      }
    };

    // Helper function to add new page if needed
    const checkPageBreak = (requiredSpace = 25) => {
      // Reserve extra space for footer (30mm from bottom)
      const footerSpace = 30;
      if (yPosition + requiredSpace > pageHeight - margin - footerSpace) {
        pdf.addPage();
        yPosition = 25;
        return true;
      }
      return false;
    };

    // Helper function to add title
    const addTitle = (text: string, fontSize = 20) => {
      checkPageBreak(30);
      pdf.setFontSize(fontSize);
      pdf.setFont("helvetica", "bold");
      pdf.setTextColor(50, 50, 150);
      const textWidth = pdf.getTextWidth(text);
      const centerX = (pageWidth - textWidth) / 2;
      pdf.text(text, centerX, yPosition);

      // Add decorative line under title
      pdf.setDrawColor(50, 50, 150);
      pdf.setLineWidth(0.3);
      pdf.line(centerX, yPosition + 2, centerX + textWidth, yPosition + 2);

      yPosition += 15;
    };

    // Helper function to add section header
    const addSectionHeader = (title: string) => {
      checkPageBreak(45); // Ensure more space for section headers
      yPosition += 10; // More spacing before section

      // Add background rectangle
      pdf.setFillColor(240, 240, 250);
      pdf.rect(margin, yPosition - 8, contentWidth, 12, "F");

      pdf.setFontSize(14);
      pdf.setFont("helvetica", "bold");
      pdf.setTextColor(50, 50, 150);
      pdf.text(title, margin + 5, yPosition);

      // Add decorative line
      pdf.setDrawColor(50, 50, 150);
      pdf.setLineWidth(0.2);
      pdf.line(margin, yPosition + 2, pageWidth - margin, yPosition + 2);

      yPosition += 15; // More spacing after section header
    };

    // Helper function to add field in two columns
    const addField = (
      label: string,
      value: string | null | undefined,
      isLeftColumn = true,
      customY?: number
    ) => {
      if (!value) return;

      const currentY = customY || yPosition;
      const columnWidth = contentWidth / 2 - 5;
      const xPosition = isLeftColumn ? margin + 10 : margin + columnWidth + 15;

      // Label
      pdf.setFontSize(9);
      pdf.setFont("helvetica", "bold");
      pdf.setTextColor(80, 80, 80);
      pdf.text(label + ":", xPosition, currentY);

      // Value with word wrap
      pdf.setFont("helvetica", "normal");
      pdf.setTextColor(40, 40, 40);
      const lines = pdf.splitTextToSize(value, columnWidth - 10);
      pdf.text(lines, xPosition, currentY + 4);

      if (!customY) {
        yPosition += Math.max(8, lines.length * 4 + 4);
      }

      return lines.length * 4 + 8;
    };

    // Helper function to add image
    const addImage = async (
      imageUrl: string,
      alt: string,
      width = 40,
      height = 40,
      centered = false
    ) => {
      try {
        const base64Image = await getImageAsBase64(imageUrl);
        if (base64Image) {
          checkPageBreak(height + 10);
          const x = centered ? (pageWidth - width) / 2 : margin + 10;

          // Add image border
          pdf.setDrawColor(200, 200, 200);
          pdf.setLineWidth(0.2);
          pdf.rect(x - 1, yPosition - 1, width + 2, height + 2);

          pdf.addImage(base64Image, "JPEG", x, yPosition, width, height);

          // Add caption
          pdf.setFontSize(8);
          pdf.setFont("helvetica", "italic");
          pdf.setTextColor(100, 100, 100);
          const captionX = centered
            ? (pageWidth - pdf.getTextWidth(alt)) / 2
            : x;
          pdf.text(alt, captionX, yPosition + height + 5);

          yPosition += height + 12;
        }
      } catch (error) {
        console.error("Error adding image to PDF:", error);
      }
    };

    try {
      // Add decorative header line
      pdf.setDrawColor(50, 50, 150);
      pdf.setLineWidth(0.5);
      pdf.line(margin, 15, pageWidth - margin, 15);

      // Main title
      addTitle("MINISTRY APPLICATION OVERVIEW", 22);
      yPosition += 5;

      // Applicant name as subtitle
      const fullName = [
        formData.firstName,
        formData.middleName,
        formData.lastName,
        formData.suffix,
      ]
        .filter(Boolean)
        .join(" ");

      pdf.setFontSize(16);
      pdf.setFont("helvetica", "normal");
      pdf.setTextColor(80, 80, 80);
      const nameWidth = pdf.getTextWidth(fullName);
      pdf.text(fullName, (pageWidth - nameWidth) / 2, yPosition);
      yPosition += 15;

      // Add application date
      pdf.setFontSize(10);
      pdf.setTextColor(120, 120, 120);
      const dateText = `Application Date: ${format(new Date(), "MMMM dd, yyyy")}`;
      const dateWidth = pdf.getTextWidth(dateText);
      pdf.text(dateText, (pageWidth - dateWidth) / 2, yPosition);
      yPosition += 20;

      // Personal Information Section
      addSectionHeader("PERSONAL INFORMATION");

      // Add profile photo if available
      if (formData.imageUrl) {
        await addImage(formData.imageUrl, "Profile Photo", 35, 45, true);
      }

      // Personal details in two columns
      const personalStartY = yPosition;
      addField("Full Name", fullName, true, personalStartY);
      addField("Nickname", formData.nickname, false, personalStartY);

      const dobY = personalStartY + 12;
      addField("Date of Birth", formatDate(formData.dateOfBirth), true, dobY);
      addField("Place of Birth", formData.placeOfBirth, false, dobY);

      const genderY = personalStartY + 24;
      addField("Gender", formatGender(formData.gender), true, genderY);
      addField(
        "Civil Status",
        formatCivilStatus(formData.civilStatus),
        false,
        genderY
      );

      const physicalY = personalStartY + 36;
      addField(
        "Height",
        formData.heightFeet ? `${formData.heightFeet} ft` : null,
        true,
        physicalY
      );
      addField(
        "Weight",
        formData.weightKg ? `${formData.weightKg} kg` : null,
        false,
        physicalY
      );

      yPosition = Math.max(personalStartY + 48, yPosition);

      // Contact & Government Information
      addSectionHeader("CONTACT & GOVERNMENT INFORMATION");

      const contactStartY = yPosition;
      addField("Email Address", formData.email, true, contactStartY);
      addField("Telephone", formData.telephone, false, contactStartY);

      const addressY = contactStartY + 12;
      addField("Current Address", formData.address, true, addressY);
      addField("Present Address", formData.presentAddress, false, addressY);

      const permAddressY = contactStartY + 24;
      addField(
        "Permanent Address",
        formData.permanentAddress || "Same as present address",
        true,
        permAddressY
      );
      addField("Passport Number", formData.passportNumber, false, permAddressY);

      const govIdY = contactStartY + 36;
      addField("SSS Number", formData.sssNumber, true, govIdY);
      addField("PhilHealth", formData.philhealth, false, govIdY);

      const tinY = contactStartY + 48;
      addField("TIN", formData.tin, true, tinY);

      yPosition = Math.max(contactStartY + 60, yPosition);

      // Family Information
      addSectionHeader("FAMILY INFORMATION");

      // Father Information
      pdf.setFontSize(11);
      pdf.setFont("helvetica", "bold");
      pdf.setTextColor(60, 60, 60);
      pdf.text("Father Information", margin + 5, yPosition);
      yPosition += 8;

      const fatherStartY = yPosition;
      addField("Name", formData.fatherName, true, fatherStartY);
      addField("Province", formData.fatherProvince, false, fatherStartY);
      addField(
        "Birthday",
        formatDate(formData.fatherBirthday),
        true,
        fatherStartY + 12
      );
      addField(
        "Occupation",
        formData.fatherOccupation,
        false,
        fatherStartY + 12
      );
      yPosition = fatherStartY + 28;

      // Mother Information
      checkPageBreak(40); // Ensure enough space for mother section
      yPosition += 5; // Add some spacing
      pdf.setFontSize(11);
      pdf.setFont("helvetica", "bold");
      pdf.setTextColor(60, 60, 60);
      pdf.text("Mother Information", margin + 5, yPosition);
      yPosition += 8;

      const motherStartY = yPosition;
      addField("Name", formData.motherName, true, motherStartY);
      addField("Province", formData.motherProvince, false, motherStartY);
      addField(
        "Birthday",
        formatDate(formData.motherBirthday),
        true,
        motherStartY + 12
      );
      addField(
        "Occupation",
        formData.motherOccupation,
        false,
        motherStartY + 12
      );
      yPosition = motherStartY + 28;

      // Spouse Information (if married)
      if (formData.civilStatus === "married") {
        checkPageBreak(50); // Ensure enough space for spouse section
        yPosition += 5; // Add some spacing
        pdf.setFontSize(11);
        pdf.setFont("helvetica", "bold");
        pdf.setTextColor(60, 60, 60);
        pdf.text("Spouse Information", margin + 5, yPosition);
        yPosition += 8;

        const spouseStartY = yPosition;
        addField("Name", formData.spouseName, true, spouseStartY);
        addField("Province", formData.spouseProvince, false, spouseStartY);
        addField(
          "Birthday",
          formatDate(formData.spouseBirthday),
          true,
          spouseStartY + 12
        );
        addField(
          "Occupation",
          formData.spouseOccupation,
          false,
          spouseStartY + 12
        );
        addField(
          "Wedding Date",
          formatDate(formData.weddingDate),
          true,
          spouseStartY + 24
        );
        yPosition = spouseStartY + 36;
      }

      // Children
      if (formData.children && formData.children.length > 0) {
        checkPageBreak(50); // Ensure enough space for children section
        yPosition += 5; // Add some spacing
        pdf.setFontSize(11);
        pdf.setFont("helvetica", "bold");
        pdf.setTextColor(60, 60, 60);
        pdf.text("Children", margin + 5, yPosition);
        yPosition += 8;

        formData.children.forEach((child, index) => {
          checkPageBreak(35); // More space for each child
          pdf.setFontSize(10);
          pdf.setFont("helvetica", "bold");
          pdf.setTextColor(80, 80, 80);
          pdf.text(`Child ${index + 1}:`, margin + 10, yPosition);
          yPosition += 6;

          const childStartY = yPosition;
          addField("Name", child.name, true, childStartY);
          addField(
            "Date of Birth",
            formatDate(child.dateOfBirth),
            false,
            childStartY
          );
          addField(
            "Gender",
            formatGender(child.gender),
            true,
            childStartY + 12
          );
          addField(
            "Place of Birth",
            child.placeOfBirth,
            false,
            childStartY + 12
          );
          yPosition = childStartY + 28;
        });
      }

      // Emergency Contacts
      if (formData.emergencyContacts && formData.emergencyContacts.length > 0) {
        addSectionHeader("EMERGENCY CONTACTS");

        formData.emergencyContacts.forEach((contact, index) => {
          checkPageBreak(30);
          pdf.setFontSize(10);
          pdf.setFont("helvetica", "bold");
          pdf.setTextColor(80, 80, 80);
          pdf.text(`Contact ${index + 1}:`, margin + 5, yPosition);
          yPosition += 6;

          const contactStartY = yPosition;
          addField("Name", contact.name, true, contactStartY);
          addField("Relationship", contact.relationship, false, contactStartY);
          addField("Address", contact.address, true, contactStartY + 12);
          addField(
            "Contact Number",
            contact.contactNumber,
            false,
            contactStartY + 12
          );
          yPosition = contactStartY + 28;
        });
      }

      // Skills & Interests
      addSectionHeader("SKILLS & INTERESTS");
      const skillsStartY = yPosition;
      addField("Skills", formData.skills, true, skillsStartY);
      addField("Hobbies", formData.hobbies, false, skillsStartY);
      addField("Sports", formData.sports, true, skillsStartY + 12);
      addField(
        "Other Religious/Secular Training",
        formData.otherReligiousSecularTraining,
        false,
        skillsStartY + 12
      );
      yPosition = skillsStartY + 28;

      // Education Background
      if (
        formData.educationBackgrounds &&
        formData.educationBackgrounds.length > 0
      ) {
        addSectionHeader("EDUCATION BACKGROUND");

        formData.educationBackgrounds.forEach((education, index) => {
          checkPageBreak(40);
          pdf.setFontSize(10);
          pdf.setFont("helvetica", "bold");
          pdf.setTextColor(80, 80, 80);
          pdf.text(`Education ${index + 1}:`, margin + 5, yPosition);
          yPosition += 6;

          const eduStartY = yPosition;
          addField("School Name", education.schoolName, true, eduStartY);
          addField(
            "Educational Attainment",
            education.educationalAttainment,
            false,
            eduStartY
          );
          addField("Course", education.course, true, eduStartY + 12);
          addField(
            "Date Graduated",
            formatDate(education.dateGraduated),
            false,
            eduStartY + 12
          );

          if (education.description) {
            addField(
              "Description",
              education.description,
              true,
              eduStartY + 24
            );
            yPosition = eduStartY + 36;
          } else {
            yPosition = eduStartY + 28;
          }
        });
      }

      // Employment Records
      if (formData.employmentRecords && formData.employmentRecords.length > 0) {
        addSectionHeader("EMPLOYMENT RECORDS");

        formData.employmentRecords.forEach((employment, index) => {
          checkPageBreak(30);
          pdf.setFontSize(10);
          pdf.setFont("helvetica", "bold");
          pdf.setTextColor(80, 80, 80);
          pdf.text(`Employment ${index + 1}:`, margin + 5, yPosition);
          yPosition += 6;

          const empStartY = yPosition;
          addField("Company Name", employment.companyName, true, empStartY);
          addField("Position", employment.position, false, empStartY);
          addField(
            "Duration",
            `${employment.fromYear} - ${employment.toYear || "Present"}`,
            true,
            empStartY + 12
          );
          yPosition = empStartY + 24;
        });
      }

      // Ministry Experience
      if (
        formData.ministryExperiences &&
        formData.ministryExperiences.length > 0
      ) {
        addSectionHeader("MINISTRY EXPERIENCE");

        formData.ministryExperiences.forEach((experience, index) => {
          checkPageBreak(30);
          pdf.setFontSize(10);
          pdf.setFont("helvetica", "bold");
          pdf.setTextColor(80, 80, 80);
          pdf.text(`Experience ${index + 1}:`, margin + 5, yPosition);
          yPosition += 6;

          const expStartY = yPosition;
          addField(
            "Ministry Rank",
            getMinistryRankName(experience.ministryRankId),
            true,
            expStartY
          );
          addField(
            "Duration",
            `${experience.fromYear} - ${experience.toYear || "Present"}`,
            false,
            expStartY
          );

          if (experience.description) {
            addField(
              "Description",
              experience.description,
              true,
              expStartY + 12
            );
            yPosition = expStartY + 24;
          } else {
            yPosition = expStartY + 16;
          }
        });
      }

      // Ministry Skills
      if (formData.ministrySkills && formData.ministrySkills.length > 0) {
        addSectionHeader("MINISTRY SKILLS");
        const skillNames = formData.ministrySkills
          .map((skill) => getMinistrySkillName(skill.ministrySkillId))
          .join(", ");
        addField("Skills", skillNames);
      }

      // Ministry Records
      if (formData.ministryRecords && formData.ministryRecords.length > 0) {
        addSectionHeader("MINISTRY RECORDS");

        formData.ministryRecords.forEach((record, index) => {
          checkPageBreak(30);
          pdf.setFontSize(10);
          pdf.setFont("helvetica", "bold");
          pdf.setTextColor(80, 80, 80);
          pdf.text(`Record ${index + 1}:`, margin + 5, yPosition);
          yPosition += 6;

          const recStartY = yPosition;
          addField(
            "Church",
            getChurchName(record.churchLocationId),
            true,
            recStartY
          );
          addField(
            "Duration",
            `${record.fromYear} - ${record.toYear || "Present"}`,
            false,
            recStartY
          );

          if (record.contribution) {
            addField("Contribution", record.contribution, true, recStartY + 12);
            yPosition = recStartY + 24;
          } else {
            yPosition = recStartY + 16;
          }
        });
      }

      // Awards & Recognitions
      if (
        formData.awardsRecognitions &&
        formData.awardsRecognitions.length > 0
      ) {
        addSectionHeader("AWARDS & RECOGNITIONS");

        formData.awardsRecognitions.forEach((award, index) => {
          checkPageBreak(25);
          pdf.setFontSize(10);
          pdf.setFont("helvetica", "bold");
          pdf.setTextColor(80, 80, 80);
          pdf.text(`Award ${index + 1}:`, margin + 5, yPosition);
          yPosition += 6;

          const awardStartY = yPosition;
          addField("Year", award.year?.toString(), true, awardStartY);
          addField("Description", award.description, false, awardStartY);
          yPosition = awardStartY + 16;
        });
      }

      // Seminars & Conferences
      if (
        formData.seminarsConferences &&
        formData.seminarsConferences.length > 0
      ) {
        addSectionHeader("SEMINARS & CONFERENCES");

        formData.seminarsConferences.forEach((seminar, index) => {
          checkPageBreak(40);
          pdf.setFontSize(10);
          pdf.setFont("helvetica", "bold");
          pdf.setTextColor(80, 80, 80);
          pdf.text(`Seminar ${index + 1}:`, margin + 5, yPosition);
          yPosition += 6;

          const semStartY = yPosition;
          addField("Title", seminar.title, true, semStartY);
          addField("Year", seminar.year?.toString(), false, semStartY);
          addField(
            "Hours",
            seminar.numberOfHours?.toString(),
            true,
            semStartY + 12
          );
          addField("Place", seminar.place, false, semStartY + 12);

          if (seminar.description) {
            addField("Description", seminar.description, true, semStartY + 24);
            yPosition = semStartY + 36;
          } else {
            yPosition = semStartY + 28;
          }
        });
      }

      // Certification & Signatures
      addSectionHeader("CERTIFICATION & SIGNATURES");
      addField("Certified By", formData.certifiedBy);
      yPosition += 10;

      // Add signature images side by side
      if (formData.signatureImageUrl || formData.signatureByCertifiedImageUrl) {
        checkPageBreak(60);

        const sigStartY = yPosition;

        if (formData.signatureImageUrl) {
          pdf.setFontSize(10);
          pdf.setFont("helvetica", "bold");
          pdf.setTextColor(80, 80, 80);
          pdf.text("Applicant Signature:", margin + 10, sigStartY);

          const base64Image = await getImageAsBase64(
            formData.signatureImageUrl
          );
          if (base64Image) {
            pdf.setDrawColor(200, 200, 200);
            pdf.setLineWidth(0.2);
            pdf.rect(margin + 9, sigStartY + 4, 62, 22);
            pdf.addImage(
              base64Image,
              "JPEG",
              margin + 10,
              sigStartY + 5,
              60,
              20
            );
          }
        }

        if (formData.signatureByCertifiedImageUrl) {
          pdf.setFontSize(10);
          pdf.setFont("helvetica", "bold");
          pdf.setTextColor(80, 80, 80);
          const certX = pageWidth / 2 + 10;
          pdf.text("Certified By Signature:", certX, sigStartY);

          const base64Image = await getImageAsBase64(
            formData.signatureByCertifiedImageUrl
          );
          if (base64Image) {
            pdf.setDrawColor(200, 200, 200);
            pdf.setLineWidth(0.2);
            pdf.rect(certX - 1, sigStartY + 4, 62, 22);
            pdf.addImage(base64Image, "JPEG", certX, sigStartY + 5, 60, 20);
          }
        }

        yPosition = sigStartY + 35;
      }

      // Add footer to each page
      const totalPages = pdf.internal.pages.length - 1;
      for (let i = 1; i <= totalPages; i++) {
        pdf.setPage(i);

        // Footer line
        pdf.setDrawColor(200, 200, 200);
        pdf.setLineWidth(0.3);
        pdf.line(margin, pageHeight - 15, pageWidth - margin, pageHeight - 15);

        // Footer text
        pdf.setFontSize(8);
        pdf.setTextColor(100, 100, 100);
        pdf.text(
          `Ministry Application - ${fullName} - Generated on ${format(new Date(), "MMM dd, yyyy")}`,
          margin,
          pageHeight - 8
        );

        pdf.text(
          `Page ${i} of ${totalPages}`,
          pageWidth - margin - 20,
          pageHeight - 8
        );
      }

      // Generate filename with timestamp
      const timestamp = format(new Date(), "yyyy-MM-dd_HH-mm-ss");
      const filename = `Ministry_Application_${fullName.replace(/\s+/g, "_")}_${timestamp}.pdf`;

      // Save the PDF
      pdf.save(filename);
    } catch (error) {
      console.error("Error generating PDF:", error);
      alert("Error generating PDF. Please try again.");
    }
  };

  // Fetch lookup data for display
  const { data: churchesResponse } = useChurches({
    page: 1,
    limit: 100,
  });
  const churches = churchesResponse?.data || [];

  const { data: ministryRanksResponse } = useMinistryRanks({
    page: 1,
    limit: 100,
  });
  const ministryRanks = ministryRanksResponse?.data || [];

  const { data: ministrySkillsResponse } = useMinistrySkills({
    page: 1,
    limit: 200,
  });
  const ministrySkillsData = ministrySkillsResponse?.data || [];

  // Helper functions
  const formatDate = (date: Date | null | undefined) => {
    if (!date) return "Not provided";
    return format(new Date(date), "MMM dd, yyyy");
  };

  const getChurchName = (id: number) => {
    return (
      churches.find((church) => church.id === id)?.name || "Unknown Church"
    );
  };

  const getMinistryRankName = (id: number) => {
    return ministryRanks.find((rank) => rank.id === id)?.name || "Unknown Rank";
  };

  const getMinistrySkillName = (id: number) => {
    return (
      ministrySkillsData.find((skill) => skill.id === id)?.name ||
      "Unknown Skill"
    );
  };

  const formatGender = (gender: string) => {
    return gender === "male" ? "Male" : "Female";
  };

  const formatCivilStatus = (status: string) => {
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  return (
    <div className="mx-auto w-full max-w-5xl space-y-6 p-3 sm:space-y-8 sm:p-6">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-2xl font-bold sm:text-3xl">Application Overview</h2>
        <p className="text-muted-foreground mt-2">
          Please review all your information before submitting
        </p>
      </div>

      {/* Personal Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Personal Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">Profile Photo</label>
                {formData.imageUrl ? (
                  <div className="mt-2">
                    <Image
                      alt="Profile"
                      className="h-32 w-32 cursor-pointer rounded-lg object-cover transition-opacity hover:opacity-80"
                      height={128}
                      src={formData.imageUrl}
                      width={128}
                      onClick={() =>
                        openImageViewer(formData.imageUrl!, "Profile Photo")
                      }
                    />
                  </div>
                ) : (
                  <p className="text-muted-foreground mt-2 text-sm">
                    No photo uploaded
                  </p>
                )}
              </div>
              <div>
                <label className="text-sm font-medium">Full Name</label>
                <p className="mt-1">
                  {[
                    formData.firstName,
                    formData.middleName,
                    formData.lastName,
                    formData.suffix,
                  ]
                    .filter(Boolean)
                    .join(" ")}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium">Nickname</label>
                <p className="mt-1">{formData.nickname || "Not provided"}</p>
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">Date of Birth</label>
                <p className="mt-1">{formatDate(formData.dateOfBirth)}</p>
              </div>
              <div>
                <label className="text-sm font-medium">Place of Birth</label>
                <p className="mt-1">{formData.placeOfBirth}</p>
              </div>
              <div>
                <label className="text-sm font-medium">Gender</label>
                <p className="mt-1">{formatGender(formData.gender)}</p>
              </div>
              <div>
                <label className="text-sm font-medium">Civil Status</label>
                <p className="mt-1">
                  {formatCivilStatus(formData.civilStatus)}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium">Height & Weight</label>
                <p className="mt-1">
                  {formData.heightFeet} ft, {formData.weightKg} kg
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Contact & Government Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Contact className="h-5 w-5" />
            Contact & Government Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                <div>
                  <label className="text-sm font-medium">Email</label>
                  <p className="mt-1">{formData.email || "Not provided"}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4" />
                <div>
                  <label className="text-sm font-medium">Telephone</label>
                  <p className="mt-1">{formData.telephone || "Not provided"}</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <MapPin className="mt-1 h-4 w-4" />
                <div>
                  <label className="text-sm font-medium">Address</label>
                  <p className="mt-1">{formData.address}</p>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium">Present Address</label>
                <p className="mt-1">{formData.presentAddress}</p>
              </div>
              <div>
                <label className="text-sm font-medium">Permanent Address</label>
                <p className="mt-1">
                  {formData.permanentAddress || "Same as present address"}
                </p>
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <IdCard className="h-4 w-4" />
                <div>
                  <label className="text-sm font-medium">Passport Number</label>
                  <p className="mt-1">
                    {formData.passportNumber || "Not provided"}
                  </p>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium">SSS Number</label>
                <p className="mt-1">{formData.sssNumber || "Not provided"}</p>
              </div>
              <div>
                <label className="text-sm font-medium">PhilHealth</label>
                <p className="mt-1">{formData.philhealth || "Not provided"}</p>
              </div>
              <div>
                <label className="text-sm font-medium">TIN</label>
                <p className="mt-1">{formData.tin || "Not provided"}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Family Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Family Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {/* Father Information */}
            <div className="space-y-4">
              <h4 className="font-medium">Father Information</h4>
              <div>
                <label className="text-sm font-medium">Name</label>
                <p className="mt-1">{formData.fatherName}</p>
              </div>
              <div>
                <label className="text-sm font-medium">Province</label>
                <p className="mt-1">{formData.fatherProvince}</p>
              </div>
              <div>
                <label className="text-sm font-medium">Birthday</label>
                <p className="mt-1">{formatDate(formData.fatherBirthday)}</p>
              </div>
              <div>
                <label className="text-sm font-medium">Occupation</label>
                <p className="mt-1">{formData.fatherOccupation}</p>
              </div>
            </div>
            {/* Mother Information */}
            <div className="space-y-4">
              <h4 className="font-medium">Mother Information</h4>
              <div>
                <label className="text-sm font-medium">Name</label>
                <p className="mt-1">{formData.motherName}</p>
              </div>
              <div>
                <label className="text-sm font-medium">Province</label>
                <p className="mt-1">{formData.motherProvince}</p>
              </div>
              <div>
                <label className="text-sm font-medium">Birthday</label>
                <p className="mt-1">{formatDate(formData.motherBirthday)}</p>
              </div>
              <div>
                <label className="text-sm font-medium">Occupation</label>
                <p className="mt-1">{formData.motherOccupation}</p>
              </div>
            </div>
          </div>

          {/* Spouse Information */}
          {formData.civilStatus === "married" && (
            <>
              <Separator />
              <div>
                <h4 className="mb-4 flex items-center gap-2 font-medium">
                  <Heart className="h-4 w-4" />
                  Spouse Information
                </h4>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div>
                    <label className="text-sm font-medium">Name</label>
                    <p className="mt-1">
                      {formData.spouseName || "Not provided"}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Province</label>
                    <p className="mt-1">
                      {formData.spouseProvince || "Not provided"}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Birthday</label>
                    <p className="mt-1">
                      {formatDate(formData.spouseBirthday)}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Occupation</label>
                    <p className="mt-1">
                      {formData.spouseOccupation || "Not provided"}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Wedding Date</label>
                    <p className="mt-1">{formatDate(formData.weddingDate)}</p>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* Children */}
          {formData.children && formData.children.length > 0 && (
            <>
              <Separator />
              <div>
                <h4 className="mb-4 font-medium">Children</h4>
                <div className="space-y-4">
                  {formData.children.map((child, index) => (
                    <div
                      className="rounded-lg border p-4"
                      key={child.id || index}
                    >
                      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                        <div>
                          <label className="text-sm font-medium">Name</label>
                          <p className="mt-1">{child.name}</p>
                        </div>
                        <div>
                          <label className="text-sm font-medium">
                            Date of Birth
                          </label>
                          <p className="mt-1">
                            {formatDate(child.dateOfBirth)}
                          </p>
                        </div>
                        <div>
                          <label className="text-sm font-medium">Gender</label>
                          <p className="mt-1">{formatGender(child.gender)}</p>
                        </div>
                        <div className="md:col-span-3">
                          <label className="text-sm font-medium">
                            Place of Birth
                          </label>
                          <p className="mt-1">{child.placeOfBirth}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Emergency Contacts & Skills */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5" />
            Emergency Contacts & Skills
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Emergency Contacts */}
          {formData.emergencyContacts &&
            formData.emergencyContacts.length > 0 && (
              <div>
                <h4 className="mb-4 font-medium">Emergency Contacts</h4>
                <div className="space-y-4">
                  {formData.emergencyContacts.map((contact, index) => (
                    <div
                      className="rounded-lg border p-4"
                      key={contact.id || index}
                    >
                      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <div>
                          <label className="text-sm font-medium">Name</label>
                          <p className="mt-1">{contact.name}</p>
                        </div>
                        <div>
                          <label className="text-sm font-medium">
                            Relationship
                          </label>
                          <p className="mt-1">{contact.relationship}</p>
                        </div>
                        <div>
                          <label className="text-sm font-medium">Address</label>
                          <p className="mt-1">{contact.address}</p>
                        </div>
                        <div>
                          <label className="text-sm font-medium">
                            Contact Number
                          </label>
                          <p className="mt-1">{contact.contactNumber}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

          {/* Skills & Interests */}
          <Separator />
          <div>
            <h4 className="mb-4 font-medium">Skills & Interests</h4>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <label className="text-sm font-medium">Skills</label>
                <p className="mt-1">{formData.skills || "Not provided"}</p>
              </div>
              <div>
                <label className="text-sm font-medium">Hobbies</label>
                <p className="mt-1">{formData.hobbies || "Not provided"}</p>
              </div>
              <div>
                <label className="text-sm font-medium">Sports</label>
                <p className="mt-1">{formData.sports || "Not provided"}</p>
              </div>
              <div>
                <label className="text-sm font-medium">
                  Other Religious/Secular Training
                </label>
                <p className="mt-1">
                  {formData.otherReligiousSecularTraining || "Not provided"}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Education & Employment */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <GraduationCap className="h-5 w-5" />
            Education & Employment
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Education */}
          {formData.educationBackgrounds &&
            formData.educationBackgrounds.length > 0 && (
              <div>
                <h4 className="mb-4 font-medium">Education Background</h4>
                <div className="space-y-4">
                  {formData.educationBackgrounds.map((education, index) => (
                    <div
                      className="rounded-lg border p-4"
                      key={education.id || index}
                    >
                      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <div>
                          <label className="text-sm font-medium">
                            School Name
                          </label>
                          <p className="mt-1">{education.schoolName}</p>
                        </div>
                        <div>
                          <label className="text-sm font-medium">
                            Educational Attainment
                          </label>
                          <p className="mt-1">
                            {education.educationalAttainment}
                          </p>
                        </div>
                        <div>
                          <label className="text-sm font-medium">Course</label>
                          <p className="mt-1">
                            {education.course || "Not specified"}
                          </p>
                        </div>
                        <div>
                          <label className="text-sm font-medium">
                            Date Graduated
                          </label>
                          <p className="mt-1">
                            {formatDate(education.dateGraduated)}
                          </p>
                        </div>
                        {education.description && (
                          <div className="md:col-span-2">
                            <label className="text-sm font-medium">
                              Description
                            </label>
                            <p className="mt-1">{education.description}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

          {/* Employment */}
          {formData.employmentRecords &&
            formData.employmentRecords.length > 0 && (
              <>
                <Separator />
                <div>
                  <h4 className="mb-4 flex items-center gap-2 font-medium">
                    <Briefcase className="h-4 w-4" />
                    Employment Records
                  </h4>
                  <div className="space-y-4">
                    {formData.employmentRecords.map((employment, index) => (
                      <div
                        className="rounded-lg border p-4"
                        key={employment.id || index}
                      >
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                          <div>
                            <label className="text-sm font-medium">
                              Company Name
                            </label>
                            <p className="mt-1">{employment.companyName}</p>
                          </div>
                          <div>
                            <label className="text-sm font-medium">
                              Position
                            </label>
                            <p className="mt-1">{employment.position}</p>
                          </div>
                          <div>
                            <label className="text-sm font-medium">
                              Duration
                            </label>
                            <p className="mt-1">
                              {employment.fromYear} -{" "}
                              {employment.toYear || "Present"}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}
        </CardContent>
      </Card>

      {/* Ministry Experience & Skills */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Church className="h-5 w-5" />
            Ministry Experience & Skills
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Ministry Experience */}
          {formData.ministryExperiences &&
            formData.ministryExperiences.length > 0 && (
              <div>
                <h4 className="mb-4 font-medium">Ministry Experience</h4>
                <div className="space-y-4">
                  {formData.ministryExperiences.map((experience, index) => (
                    <div
                      className="rounded-lg border p-4"
                      key={experience.id || index}
                    >
                      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <div>
                          <label className="text-sm font-medium">
                            Ministry Rank
                          </label>
                          <p className="mt-1">
                            {getMinistryRankName(experience.ministryRankId)}
                          </p>
                        </div>
                        <div>
                          <label className="text-sm font-medium">
                            Duration
                          </label>
                          <p className="mt-1">
                            {experience.fromYear} -{" "}
                            {experience.toYear || "Present"}
                          </p>
                        </div>
                        {experience.description && (
                          <div className="md:col-span-2">
                            <label className="text-sm font-medium">
                              Description
                            </label>
                            <p className="mt-1">{experience.description}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

          {/* Ministry Skills */}
          {formData.ministrySkills && formData.ministrySkills.length > 0 && (
            <>
              <Separator />
              <div>
                <h4 className="mb-4 font-medium">Ministry Skills</h4>
                <div className="flex flex-wrap gap-2">
                  {formData.ministrySkills.map((skill, index) => (
                    <span
                      className="bg-primary/10 text-primary rounded-full px-3 py-1 text-sm"
                      key={skill.id || index}
                    >
                      {getMinistrySkillName(skill.ministrySkillId)}
                    </span>
                  ))}
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Ministry Records & Awards */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="h-5 w-5" />
            Ministry Records & Awards
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Ministry Records */}
          {formData.ministryRecords && formData.ministryRecords.length > 0 && (
            <div>
              <h4 className="mb-4 font-medium">Ministry Records</h4>
              <div className="space-y-4">
                {formData.ministryRecords.map((record, index) => (
                  <div
                    className="rounded-lg border p-4"
                    key={record.id || index}
                  >
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                      <div>
                        <label className="text-sm font-medium">Church</label>
                        <p className="mt-1">
                          {getChurchName(record.churchLocationId)}
                        </p>
                      </div>
                      <div>
                        <label className="text-sm font-medium">Duration</label>
                        <p className="mt-1">
                          {record.fromYear} - {record.toYear || "Present"}
                        </p>
                      </div>
                      {record.contribution && (
                        <div className="md:col-span-2">
                          <label className="text-sm font-medium">
                            Contribution
                          </label>
                          <p className="mt-1">{record.contribution}</p>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Awards & Recognitions */}
          {formData.awardsRecognitions &&
            formData.awardsRecognitions.length > 0 && (
              <>
                <Separator />
                <div>
                  <h4 className="mb-4 flex items-center gap-2 font-medium">
                    <Star className="h-4 w-4" />
                    Awards & Recognitions
                  </h4>
                  <div className="space-y-4">
                    {formData.awardsRecognitions.map((award, index) => (
                      <div
                        className="rounded-lg border p-4"
                        key={award.id || index}
                      >
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                          <div>
                            <label className="text-sm font-medium">Year</label>
                            <p className="mt-1">{award.year}</p>
                          </div>
                          <div className="md:col-span-2">
                            <label className="text-sm font-medium">
                              Description
                            </label>
                            <p className="mt-1">{award.description}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}
        </CardContent>
      </Card>

      {/* Seminars & Conferences */}
      {formData.seminarsConferences &&
        formData.seminarsConferences.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5" />
                Seminars & Conferences
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {formData.seminarsConferences.map((seminar, index) => (
                  <div
                    className="rounded-lg border p-4"
                    key={seminar.id || index}
                  >
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                      <div>
                        <label className="text-sm font-medium">Title</label>
                        <p className="mt-1">{seminar.title}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium">Year</label>
                        <p className="mt-1">{seminar.year}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium">Hours</label>
                        <p className="mt-1">{seminar.numberOfHours} hours</p>
                      </div>
                      {seminar.place && (
                        <div>
                          <label className="text-sm font-medium">Place</label>
                          <p className="mt-1">{seminar.place}</p>
                        </div>
                      )}
                      {seminar.description && (
                        <div className="md:col-span-2">
                          <label className="text-sm font-medium">
                            Description
                          </label>
                          <p className="mt-1">{seminar.description}</p>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

      {/* Certification & Signatures */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Certification & Signatures
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div>
              <label className="text-sm font-medium">Certified By</label>
              <p className="mt-1">{formData.certifiedBy || "Not provided"}</p>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">
                  Applicant Signature
                </label>
                {formData.signatureImageUrl ? (
                  <div className="mt-2">
                    <Image
                      alt="Applicant Signature"
                      className="h-20 w-auto cursor-pointer rounded border transition-opacity hover:opacity-80"
                      height={80}
                      src={formData.signatureImageUrl}
                      width={200}
                      onClick={() =>
                        openImageViewer(
                          formData.signatureImageUrl!,
                          "Applicant Signature"
                        )
                      }
                    />
                  </div>
                ) : (
                  <p className="text-muted-foreground mt-2 text-sm">
                    No signature provided
                  </p>
                )}
              </div>
              <div>
                <label className="text-sm font-medium">
                  Certified By Signature
                </label>
                {formData.signatureByCertifiedImageUrl ? (
                  <div className="mt-2">
                    <Image
                      alt="Certified By Signature"
                      className="h-20 w-auto cursor-pointer rounded border transition-opacity hover:opacity-80"
                      height={80}
                      src={formData.signatureByCertifiedImageUrl}
                      width={200}
                      onClick={() =>
                        openImageViewer(
                          formData.signatureByCertifiedImageUrl!,
                          "Certified By Signature"
                        )
                      }
                    />
                  </div>
                ) : (
                  <p className="text-muted-foreground mt-2 text-sm">
                    No signature provided
                  </p>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex flex-col gap-3 border-t px-3 pt-6 sm:flex-row sm:justify-between sm:gap-4 sm:px-0">
        <div className="flex flex-col gap-3 sm:flex-row sm:gap-4">
          <Button
            disabled={isSubmitting}
            type="button"
            variant="outline"
            onClick={onBack}
          >
            Back to Edit
          </Button>
          <Button
            disabled={isSubmitting}
            type="button"
            variant="outline"
            onClick={exportToPDF}
          >
            <Download className="mr-2 h-4 w-4" />
            Export as PDF
          </Button>
        </div>
        <Button disabled={isSubmitting} size="lg" onClick={() => onNext()}>
          {isSubmitting ? (
            <>
              <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
              Submitting Application...
            </>
          ) : (
            <>
              <Calendar className="mr-2 h-4 w-4" />
              Submit Application
            </>
          )}
        </Button>
      </div>

      {/* Image Viewer */}
      <ImageViewer
        alt={imageViewer.alt}
        isOpen={imageViewer.isOpen}
        src={imageViewer.src}
        onClose={closeImageViewer}
      />
    </div>
  );
}
