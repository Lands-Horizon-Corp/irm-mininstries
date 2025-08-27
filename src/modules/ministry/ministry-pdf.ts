import { format } from "date-fns";
import jsPDF from "jspdf";

// Types for the PDF generation
interface MinisterPDFData {
  // Personal Information
  firstName: string;
  middleName?: string | null;
  lastName: string;
  suffix?: string | null;
  nickname?: string | null;
  dateOfBirth?: Date | null;
  placeOfBirth?: string | null;
  gender: "male" | "female";
  civilStatus: "single" | "married" | "widowed" | "separated" | "divorced";
  heightFeet?: string | null;
  weightKg?: string | null;
  imageUrl?: string | null;

  // Contact Information
  email?: string | null;
  telephone?: string | null;
  address: string;
  presentAddress: string;
  permanentAddress?: string | null;
  passportNumber?: string | null;
  sssNumber?: string | null;
  philhealth?: string | null;
  tin?: string | null;

  // Family Information
  fatherName?: string | null;
  fatherProvince?: string | null;
  fatherBirthday?: Date | null;
  fatherOccupation?: string | null;
  motherName?: string | null;
  motherProvince?: string | null;
  motherBirthday?: Date | null;
  motherOccupation?: string | null;
  spouseName?: string | null;
  spouseProvince?: string | null;
  spouseBirthday?: Date | null;
  spouseOccupation?: string | null;
  weddingDate?: Date | null;

  // Children
  children?: Array<{
    name: string;
    dateOfBirth: Date;
    gender: "male" | "female";
    placeOfBirth: string;
  }>;

  // Emergency Contacts
  emergencyContacts?: Array<{
    name: string;
    relationship: string;
    address: string;
    contactNumber: string;
  }>;

  // Skills & Interests
  skills?: string | null;
  hobbies?: string | null;
  sports?: string | null;
  otherReligiousSecularTraining?: string | null;

  // Education
  educationBackgrounds?: Array<{
    schoolName: string;
    educationalAttainment: string;
    course?: string | null;
    dateGraduated?: Date | null;
    description?: string | null;
  }>;

  // Employment
  employmentRecords?: Array<{
    companyName: string;
    position: string;
    fromYear: string;
    toYear?: string | null;
  }>;

  // Ministry Experience
  ministryExperiences?: Array<{
    ministryRankId: number;
    fromYear: string;
    toYear?: string | null;
    description?: string | null;
  }>;

  // Ministry Skills
  ministrySkills?: Array<{
    ministrySkillId: number;
  }>;

  // Ministry Records
  ministryRecords?: Array<{
    churchLocationId: number;
    fromYear: string;
    toYear?: string | null;
    contribution?: string | null;
  }>;

  // Awards & Recognitions
  awardsRecognitions?: Array<{
    year?: string | null;
    description: string;
  }>;

  // Seminars & Conferences
  seminarsConferences?: Array<{
    title: string;
    year?: string | null;
    numberOfHours?: number | null;
    place?: string | null;
    description?: string | null;
  }>;

  // Certification
  certifiedBy?: string | null;
  signatureImageUrl?: string | null;
  signatureByCertifiedImageUrl?: string | null;
}

// Lookup data interfaces
interface Church {
  id: number;
  name: string;
}

interface MinistryRank {
  id: number;
  name: string;
}

interface MinistrySkill {
  id: number;
  name: string;
}

interface LookupData {
  churches?: Church[];
  ministryRanks?: MinistryRank[];
  ministrySkills?: MinistrySkill[];
}

export async function generateMinisterPDF(
  ministerData: MinisterPDFData,
  lookupData: LookupData = {}
): Promise<void> {
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

    pdf.setDrawColor(50, 50, 150);
    pdf.setLineWidth(0.3);
    pdf.line(centerX, yPosition + 2, centerX + textWidth, yPosition + 2);

    yPosition += 15;
  };

  // Helper function to add section header
  const addSectionHeader = (title: string) => {
    checkPageBreak(45);
    yPosition += 10;

    pdf.setFillColor(240, 240, 250);
    pdf.rect(margin, yPosition - 8, contentWidth, 12, "F");

    pdf.setFontSize(14);
    pdf.setFont("helvetica", "bold");
    pdf.setTextColor(50, 50, 150);
    pdf.text(title, margin + 5, yPosition);

    pdf.setDrawColor(50, 50, 150);
    pdf.setLineWidth(0.2);
    pdf.line(margin, yPosition + 2, pageWidth - margin, yPosition + 2);

    yPosition += 15;
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

    pdf.setFontSize(9);
    pdf.setFont("helvetica", "bold");
    pdf.setTextColor(80, 80, 80);
    pdf.text(label + ":", xPosition, currentY);

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

        pdf.setDrawColor(200, 200, 200);
        pdf.setLineWidth(0.2);
        pdf.rect(x - 1, yPosition - 1, width + 2, height + 2);

        pdf.addImage(base64Image, "JPEG", x, yPosition, width, height);

        pdf.setFontSize(8);
        pdf.setFont("helvetica", "italic");
        pdf.setTextColor(100, 100, 100);
        const captionX = centered ? (pageWidth - pdf.getTextWidth(alt)) / 2 : x;
        pdf.text(alt, captionX, yPosition + height + 5);

        yPosition += height + 12;
      }
    } catch (error) {
      console.error("Error adding image to PDF:", error);
    }
  };

  // Helper functions for formatting and lookups
  const formatDate = (date: Date | null | undefined) => {
    if (!date) return "Not provided";
    return format(new Date(date), "MMM dd, yyyy");
  };

  const formatGender = (gender: string) => {
    return gender === "male" ? "Male" : "Female";
  };

  const formatCivilStatus = (status: string) => {
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  const _getChurchName = (id: number) => {
    return (
      lookupData.churches?.find((church) => church.id === id)?.name ||
      "Unknown Church"
    );
  };

  const _getMinistryRankName = (id: number) => {
    return (
      lookupData.ministryRanks?.find((rank) => rank.id === id)?.name ||
      "Unknown Rank"
    );
  };

  const _getMinistrySkillName = (id: number) => {
    return (
      lookupData.ministrySkills?.find((skill) => skill.id === id)?.name ||
      "Unknown Skill"
    );
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
      ministerData.firstName,
      ministerData.middleName,
      ministerData.lastName,
      ministerData.suffix,
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
    const dateText = `Generated on ${format(new Date(), "MMMM dd, yyyy")}`;
    const dateWidth = pdf.getTextWidth(dateText);
    pdf.text(dateText, (pageWidth - dateWidth) / 2, yPosition);
    yPosition += 20;

    // Personal Information Section
    addSectionHeader("PERSONAL INFORMATION");

    // Add profile photo if available
    if (ministerData.imageUrl) {
      await addImage(ministerData.imageUrl, "Profile Photo", 35, 45, true);
    }

    // Personal details in two columns
    const personalStartY = yPosition;
    addField("Full Name", fullName, true, personalStartY);
    addField("Nickname", ministerData.nickname, false, personalStartY);

    const dobY = personalStartY + 12;
    addField("Date of Birth", formatDate(ministerData.dateOfBirth), true, dobY);
    addField("Place of Birth", ministerData.placeOfBirth, false, dobY);

    const genderY = personalStartY + 24;
    addField("Gender", formatGender(ministerData.gender), true, genderY);
    addField(
      "Civil Status",
      formatCivilStatus(ministerData.civilStatus),
      false,
      genderY
    );

    const physicalY = personalStartY + 36;
    addField(
      "Height",
      ministerData.heightFeet ? `${ministerData.heightFeet} ft` : null,
      true,
      physicalY
    );
    addField(
      "Weight",
      ministerData.weightKg ? `${ministerData.weightKg} kg` : null,
      false,
      physicalY
    );

    yPosition = Math.max(personalStartY + 48, yPosition);

    // Contact & Government Information
    addSectionHeader("CONTACT & GOVERNMENT INFORMATION");

    const contactStartY = yPosition;
    addField("Email Address", ministerData.email, true, contactStartY);
    addField("Telephone", ministerData.telephone, false, contactStartY);

    const addressY = contactStartY + 12;
    addField("Current Address", ministerData.address, true, addressY);
    addField("Present Address", ministerData.presentAddress, false, addressY);

    const permAddressY = contactStartY + 24;
    addField(
      "Permanent Address",
      ministerData.permanentAddress || "Same as present address",
      true,
      permAddressY
    );
    addField(
      "Passport Number",
      ministerData.passportNumber,
      false,
      permAddressY
    );

    const govIdY = contactStartY + 36;
    addField("SSS Number", ministerData.sssNumber, true, govIdY);
    addField("PhilHealth", ministerData.philhealth, false, govIdY);

    const tinY = contactStartY + 48;
    addField("TIN", ministerData.tin, true, tinY);

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
    addField("Name", ministerData.fatherName, true, fatherStartY);
    addField("Province", ministerData.fatherProvince, false, fatherStartY);
    addField(
      "Birthday",
      formatDate(ministerData.fatherBirthday),
      true,
      fatherStartY + 12
    );
    addField(
      "Occupation",
      ministerData.fatherOccupation,
      false,
      fatherStartY + 12
    );
    yPosition = fatherStartY + 28;

    // Mother Information
    checkPageBreak(40);
    yPosition += 5;
    pdf.setFontSize(11);
    pdf.setFont("helvetica", "bold");
    pdf.setTextColor(60, 60, 60);
    pdf.text("Mother Information", margin + 5, yPosition);
    yPosition += 8;

    const motherStartY = yPosition;
    addField("Name", ministerData.motherName, true, motherStartY);
    addField("Province", ministerData.motherProvince, false, motherStartY);
    addField(
      "Birthday",
      formatDate(ministerData.motherBirthday),
      true,
      motherStartY + 12
    );
    addField(
      "Occupation",
      ministerData.motherOccupation,
      false,
      motherStartY + 12
    );
    yPosition = motherStartY + 28;

    // Spouse Information (if married)
    if (ministerData.civilStatus === "married") {
      checkPageBreak(50);
      yPosition += 5;
      pdf.setFontSize(11);
      pdf.setFont("helvetica", "bold");
      pdf.setTextColor(60, 60, 60);
      pdf.text("Spouse Information", margin + 5, yPosition);
      yPosition += 8;

      const spouseStartY = yPosition;
      addField("Name", ministerData.spouseName, true, spouseStartY);
      addField("Province", ministerData.spouseProvince, false, spouseStartY);
      addField(
        "Birthday",
        formatDate(ministerData.spouseBirthday),
        true,
        spouseStartY + 12
      );
      addField(
        "Occupation",
        ministerData.spouseOccupation,
        false,
        spouseStartY + 12
      );
      addField(
        "Wedding Date",
        formatDate(ministerData.weddingDate),
        true,
        spouseStartY + 24
      );
      yPosition = spouseStartY + 36;
    }

    // Children
    if (ministerData.children && ministerData.children.length > 0) {
      checkPageBreak(50);
      yPosition += 5;
      pdf.setFontSize(11);
      pdf.setFont("helvetica", "bold");
      pdf.setTextColor(60, 60, 60);
      pdf.text("Children", margin + 5, yPosition);
      yPosition += 8;

      ministerData.children.forEach((child, index) => {
        checkPageBreak(35);
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
        addField("Gender", formatGender(child.gender), true, childStartY + 12);
        addField("Place of Birth", child.placeOfBirth, false, childStartY + 12);
        yPosition = childStartY + 28;
      });
    }

    // Add remaining sections (Emergency Contacts, Skills, etc.) if they exist
    if (
      ministerData.emergencyContacts &&
      ministerData.emergencyContacts.length > 0
    ) {
      addSectionHeader("EMERGENCY CONTACTS");
      // Add emergency contacts logic...
    }

    if (ministerData.skills || ministerData.hobbies || ministerData.sports) {
      addSectionHeader("SKILLS & INTERESTS");
      const skillsStartY = yPosition;
      addField("Skills", ministerData.skills, true, skillsStartY);
      addField("Hobbies", ministerData.hobbies, false, skillsStartY);
      addField("Sports", ministerData.sports, true, skillsStartY + 12);
      yPosition = skillsStartY + 24;
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
    throw new Error("Failed to generate PDF");
  }
}
