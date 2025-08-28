import { format } from "date-fns";
import jsPDF from "jspdf";

// Types for the PDF generation
interface MinisterPDFData {
  // Church Information
  churchId?: number;
  churchName?: string;
  churchAddress?: string;

  // Personal Information
  biography?: string | null;
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

  // Case Reports
  caseReports?: Array<{
    description: string;
    year?: string | null;
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
  address?: string;
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
  let yPosition = 30;
  const pageHeight = pdf.internal.pageSize.height;
  const pageWidth = pdf.internal.pageSize.width;
  const margin = 20;
  const contentWidth = pageWidth - 2 * margin;
  const primaryColor = [65, 105, 225]; // Royal blue
  const accentColor = [220, 220, 250]; // Light lavender
  const textColor = [50, 50, 50];
  const lightTextColor = [100, 100, 100];

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
      yPosition = 30;

      // Add header to new page
      pdf.setFillColor(accentColor[0], accentColor[1], accentColor[2]);
      pdf.rect(0, 0, pageWidth, 20, "F");

      pdf.setFontSize(16);
      pdf.setFont("helvetica", "bold");
      pdf.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
      pdf.text(
        "I AM REDEEMER AND MASTER EVANGELICAL CHURCH",
        pageWidth / 2,
        15,
        {
          align: "center",
        }
      );

      pdf.setDrawColor(primaryColor[0], primaryColor[1], primaryColor[2]);
      pdf.setLineWidth(0.5);
      pdf.line(margin, 22, pageWidth - margin, 22);

      return true;
    }
    return false;
  };

  // Helper function to add title
  const addTitle = (text: string, fontSize = 20) => {
    checkPageBreak(30);
    pdf.setFontSize(fontSize);
    pdf.setFont("helvetica", "bold");
    pdf.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    const textWidth = pdf.getTextWidth(text);
    const centerX = (pageWidth - textWidth) / 2;
    pdf.text(text, centerX, yPosition);

    pdf.setDrawColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    pdf.setLineWidth(0.3);
    pdf.line(centerX, yPosition + 2, centerX + textWidth, yPosition + 2);

    yPosition += 15;
  };

  // Helper function to add section header
  const addSectionHeader = (title: string) => {
    checkPageBreak(15);
    yPosition += 10;

    pdf.setFillColor(accentColor[0], accentColor[1], accentColor[2]);
    pdf.rect(margin, yPosition - 5, contentWidth, 10, "F");

    pdf.setFontSize(12);
    pdf.setFont("helvetica", "bold");
    pdf.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    pdf.text(title, margin + 5, yPosition + 2);

    yPosition += 12;
  };

  // Helper function to add field in two columns
  const addField = (
    label: string,
    value: string | null | undefined,
    isLeftColumn = true,
    customY?: number
  ) => {
    if (!value) return 0;

    const currentY = customY || yPosition;
    const columnWidth = contentWidth / 2 - 5;
    const xPosition = isLeftColumn ? margin + 5 : margin + columnWidth + 10;

    pdf.setFontSize(10);
    pdf.setFont("helvetica", "bold");
    pdf.setTextColor(textColor[0], textColor[1], textColor[2]);
    pdf.text(`${label}:`, xPosition, currentY);

    pdf.setFont("helvetica", "normal");
    pdf.setTextColor(textColor[0], textColor[1], textColor[2]);
    const lines = pdf.splitTextToSize(value, columnWidth - 15);
    pdf.text(lines, xPosition + 2, currentY + 5);

    const fieldHeight = Math.max(10, lines.length * 5 + 5);

    if (!customY) {
      yPosition += fieldHeight;
    }

    return fieldHeight;
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
        checkPageBreak(height + 15);
        const x = centered ? (pageWidth - width) / 2 : margin + 10;

        pdf.setDrawColor(200, 200, 200);
        pdf.setLineWidth(0.2);
        pdf.rect(x - 1, yPosition - 1, width + 2, height + 2);

        pdf.addImage(base64Image, "JPEG", x, yPosition, width, height);

        pdf.setFontSize(8);
        pdf.setFont("helvetica", "italic");
        pdf.setTextColor(
          lightTextColor[0],
          lightTextColor[1],
          lightTextColor[2]
        );
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
    const statusMap: Record<string, string> = {
      single: "Single",
      married: "Married",
      widowed: "Widowed",
      separated: "Separated",
      divorced: "Divorced",
    };
    return statusMap[status] || status;
  };

  const _getChurchName = (id: number) => {
    const church = lookupData.churches?.find((church) => church.id === id);
    if (church) {
      return church.address
        ? `${church.name} - ${church.address}`
        : church.name;
    }
    return "Unknown Church";
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
    // Add header
    pdf.setFillColor(accentColor[0], accentColor[1], accentColor[2]);
    pdf.rect(0, 0, pageWidth, 20, "F");

    pdf.setFontSize(16);
    pdf.setFont("helvetica", "bold");
    pdf.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    pdf.text("I AM REDEEMER AND MASTER EVANGELICAL CHURCH", pageWidth / 2, 15, {
      align: "center",
    });

    pdf.setDrawColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    pdf.setLineWidth(0.5);
    pdf.line(margin, 22, pageWidth - margin, 22);

    // Main title
    addTitle("MINISTRY APPLICATION FORM", 18);
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

    pdf.setFontSize(14);
    pdf.setFont("helvetica", "bold");
    pdf.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    const nameWidth = pdf.getTextWidth(fullName);
    pdf.text(fullName, (pageWidth - nameWidth) / 2, yPosition);
    yPosition += 10;

    // Add application date
    pdf.setFontSize(9);
    pdf.setTextColor(lightTextColor[0], lightTextColor[1], lightTextColor[2]);
    const dateText = `Generated on ${format(new Date(), "MMMM dd, yyyy")}`;
    const dateWidth = pdf.getTextWidth(dateText);
    pdf.text(dateText, (pageWidth - dateWidth) / 2, yPosition);
    yPosition += 15;

    // Church Information Section
    if (ministerData.churchName) {
      addSectionHeader("CHURCH DESIGNATION");

      const churchStartY = yPosition;
      let maxHeight = 0;

      const churchNameFieldHeight = addField(
        "Church Name",
        ministerData.churchName,
        true,
        churchStartY
      );
      const churchAddressFieldHeight = addField(
        "Church Address",
        ministerData.churchAddress,
        false,
        churchStartY
      );
      maxHeight = Math.max(
        maxHeight,
        churchNameFieldHeight,
        churchAddressFieldHeight
      );

      yPosition = churchStartY + maxHeight + 10;
    }

    // Personal Information Section
    addSectionHeader("PERSONAL INFORMATION");

    // Add profile photo if available
    if (ministerData.imageUrl) {
      await addImage(ministerData.imageUrl, "Profile Photo", 35, 45, true);
      yPosition += 5;
    }

    // Personal details in two columns
    const personalStartY = yPosition;
    let maxHeight = 0;

    const nameFieldHeight = addField(
      "Full Name",
      fullName,
      true,
      personalStartY
    );
    const nicknameFieldHeight = addField(
      "Nickname",
      ministerData.nickname,
      false,
      personalStartY
    );
    maxHeight = Math.max(maxHeight, nameFieldHeight, nicknameFieldHeight);

    const dobY = personalStartY + maxHeight + 2;
    const dobFieldHeight = addField(
      "Date of Birth",
      formatDate(ministerData.dateOfBirth),
      true,
      dobY
    );
    const pobFieldHeight = addField(
      "Place of Birth",
      ministerData.placeOfBirth,
      false,
      dobY
    );
    maxHeight += Math.max(dobFieldHeight, pobFieldHeight) + 2;

    const genderY = personalStartY + maxHeight + 2;
    const genderFieldHeight = addField(
      "Gender",
      formatGender(ministerData.gender),
      true,
      genderY
    );
    const statusFieldHeight = addField(
      "Civil Status",
      formatCivilStatus(ministerData.civilStatus),
      false,
      genderY
    );
    maxHeight += Math.max(genderFieldHeight, statusFieldHeight) + 2;

    const physicalY = personalStartY + maxHeight + 2;
    const heightFieldHeight = addField(
      "Height",
      ministerData.heightFeet ? `${ministerData.heightFeet} ft` : null,
      true,
      physicalY
    );
    const weightFieldHeight = addField(
      "Weight",
      ministerData.weightKg ? `${ministerData.weightKg} kg` : null,
      false,
      physicalY
    );
    maxHeight += Math.max(heightFieldHeight, weightFieldHeight) + 2;

    yPosition = personalStartY + maxHeight + 10;

    // Biography field (full width)
    if (ministerData.biography) {
      checkPageBreak(30);
      pdf.setFontSize(10);
      pdf.setFont("helvetica", "bold");
      pdf.setTextColor(textColor[0], textColor[1], textColor[2]);
      pdf.text("Biography:", margin, yPosition);

      pdf.setFont("helvetica", "normal");
      const bioLines = pdf.splitTextToSize(
        ministerData.biography,
        contentWidth
      );
      pdf.text(bioLines, margin, yPosition + 6);

      yPosition += bioLines.length * 5 + 12;
    }

    // Contact & Government Information
    addSectionHeader("CONTACT & GOVERNMENT INFORMATION");

    const contactStartY = yPosition;
    maxHeight = 0;

    const emailFieldHeight = addField(
      "Email Address",
      ministerData.email,
      true,
      contactStartY
    );
    const telFieldHeight = addField(
      "Telephone",
      ministerData.telephone,
      false,
      contactStartY
    );
    maxHeight = Math.max(maxHeight, emailFieldHeight, telFieldHeight);

    const addressY = contactStartY + maxHeight + 2;
    const addressFieldHeight = addField(
      "Current Address",
      ministerData.address,
      true,
      addressY
    );
    const presentAddressFieldHeight = addField(
      "Present Address",
      ministerData.presentAddress,
      false,
      addressY
    );
    maxHeight += Math.max(addressFieldHeight, presentAddressFieldHeight) + 2;

    const permAddressY = contactStartY + maxHeight + 2;
    const permAddressFieldHeight = addField(
      "Permanent Address",
      ministerData.permanentAddress || "Same as present address",
      true,
      permAddressY
    );
    const passportFieldHeight = addField(
      "Passport Number",
      ministerData.passportNumber,
      false,
      permAddressY
    );
    maxHeight += Math.max(permAddressFieldHeight, passportFieldHeight) + 2;

    const govIdY = contactStartY + maxHeight + 2;
    const sssFieldHeight = addField(
      "SSS Number",
      ministerData.sssNumber,
      true,
      govIdY
    );
    const philhealthFieldHeight = addField(
      "PhilHealth",
      ministerData.philhealth,
      false,
      govIdY
    );
    maxHeight += Math.max(sssFieldHeight, philhealthFieldHeight) + 2;

    const tinY = contactStartY + maxHeight + 2;
    const tinFieldHeight = addField("TIN", ministerData.tin, true, tinY);
    maxHeight += tinFieldHeight + 2;

    yPosition = contactStartY + maxHeight + 10;

    // Family Information
    addSectionHeader("FAMILY INFORMATION");

    // Father Information
    pdf.setFontSize(11);
    pdf.setFont("helvetica", "bold");
    pdf.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    pdf.text("Father Information", margin, yPosition);
    yPosition += 8;

    const fatherStartY = yPosition;
    maxHeight = 0;

    const fatherNameHeight = addField(
      "Name",
      ministerData.fatherName,
      true,
      fatherStartY
    );
    const fatherProvinceHeight = addField(
      "Province",
      ministerData.fatherProvince,
      false,
      fatherStartY
    );
    maxHeight = Math.max(maxHeight, fatherNameHeight, fatherProvinceHeight);

    const fatherDobY = fatherStartY + maxHeight + 2;
    const fatherDobHeight = addField(
      "Birthday",
      formatDate(ministerData.fatherBirthday),
      true,
      fatherDobY
    );
    const fatherOccupationHeight = addField(
      "Occupation",
      ministerData.fatherOccupation,
      false,
      fatherDobY
    );
    maxHeight += Math.max(fatherDobHeight, fatherOccupationHeight) + 2;

    yPosition = fatherStartY + maxHeight + 15;

    // Mother Information
    checkPageBreak(20);
    pdf.setFontSize(11);
    pdf.setFont("helvetica", "bold");
    pdf.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    pdf.text("Mother Information", margin, yPosition);
    yPosition += 8;

    const motherStartY = yPosition;
    maxHeight = 0;

    const motherNameHeight = addField(
      "Name",
      ministerData.motherName,
      true,
      motherStartY
    );
    const motherProvinceHeight = addField(
      "Province",
      ministerData.motherProvince,
      false,
      motherStartY
    );
    maxHeight = Math.max(maxHeight, motherNameHeight, motherProvinceHeight);

    const motherDobY = motherStartY + maxHeight + 2;
    const motherDobHeight = addField(
      "Birthday",
      formatDate(ministerData.motherBirthday),
      true,
      motherDobY
    );
    const motherOccupationHeight = addField(
      "Occupation",
      ministerData.motherOccupation,
      false,
      motherDobY
    );
    maxHeight += Math.max(motherDobHeight, motherOccupationHeight) + 2;

    yPosition = motherStartY + maxHeight + 15;

    // Spouse Information (if married)
    if (ministerData.civilStatus === "married") {
      checkPageBreak(20);
      pdf.setFontSize(11);
      pdf.setFont("helvetica", "bold");
      pdf.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
      pdf.text("Spouse Information", margin, yPosition);
      yPosition += 8;

      const spouseStartY = yPosition;
      maxHeight = 0;

      const spouseNameHeight = addField(
        "Name",
        ministerData.spouseName,
        true,
        spouseStartY
      );
      const spouseProvinceHeight = addField(
        "Province",
        ministerData.spouseProvince,
        false,
        spouseStartY
      );
      maxHeight = Math.max(maxHeight, spouseNameHeight, spouseProvinceHeight);

      const spouseDobY = spouseStartY + maxHeight + 2;
      const spouseDobHeight = addField(
        "Birthday",
        formatDate(ministerData.spouseBirthday),
        true,
        spouseDobY
      );
      const spouseOccupationHeight = addField(
        "Occupation",
        ministerData.spouseOccupation,
        false,
        spouseDobY
      );
      maxHeight += Math.max(spouseDobHeight, spouseOccupationHeight) + 2;

      const weddingY = spouseStartY + maxHeight + 2;
      const weddingHeight = addField(
        "Wedding Date",
        formatDate(ministerData.weddingDate),
        true,
        weddingY
      );
      maxHeight += weddingHeight + 2;

      yPosition = spouseStartY + maxHeight + 15;
    }

    // Children
    if (ministerData.children && ministerData.children.length > 0) {
      checkPageBreak(20);
      pdf.setFontSize(11);
      pdf.setFont("helvetica", "bold");
      pdf.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
      pdf.text("Children", margin, yPosition);
      yPosition += 8;

      ministerData.children.forEach((child, index) => {
        checkPageBreak(30);
        pdf.setFontSize(10);
        pdf.setFont("helvetica", "bold");
        pdf.setTextColor(textColor[0], textColor[1], textColor[2]);
        pdf.text(`Child ${index + 1}:`, margin, yPosition);
        yPosition += 6;

        const childStartY = yPosition;
        maxHeight = 0;

        const childNameHeight = addField("Name", child.name, true, childStartY);
        const childDobHeight = addField(
          "Date of Birth",
          formatDate(child.dateOfBirth),
          false,
          childStartY
        );
        maxHeight = Math.max(maxHeight, childNameHeight, childDobHeight);

        const childGenderY = childStartY + maxHeight + 2;
        const childGenderHeight = addField(
          "Gender",
          formatGender(child.gender),
          true,
          childGenderY
        );
        const childPobHeight = addField(
          "Place of Birth",
          child.placeOfBirth,
          false,
          childGenderY
        );
        maxHeight += Math.max(childGenderHeight, childPobHeight) + 2;

        yPosition = childStartY + maxHeight + 15;
      });
    }

    // Emergency Contacts
    if (
      ministerData.emergencyContacts &&
      ministerData.emergencyContacts.length > 0
    ) {
      addSectionHeader("EMERGENCY CONTACTS");

      ministerData.emergencyContacts.forEach((contact, index) => {
        checkPageBreak(30);
        pdf.setFontSize(10);
        pdf.setFont("helvetica", "bold");
        pdf.setTextColor(textColor[0], textColor[1], textColor[2]);
        pdf.text(`Contact ${index + 1}:`, margin, yPosition);
        yPosition += 6;

        const contactStartY = yPosition;
        maxHeight = 0;

        const contactNameHeight = addField(
          "Name",
          contact.name,
          true,
          contactStartY
        );
        const contactRelHeight = addField(
          "Relationship",
          contact.relationship,
          false,
          contactStartY
        );
        maxHeight = Math.max(maxHeight, contactNameHeight, contactRelHeight);

        const contactAddressY = contactStartY + maxHeight + 2;
        const contactAddressHeight = addField(
          "Address",
          contact.address,
          true,
          contactAddressY
        );
        const contactNumberHeight = addField(
          "Contact Number",
          contact.contactNumber,
          false,
          contactAddressY
        );
        maxHeight += Math.max(contactAddressHeight, contactNumberHeight) + 2;

        yPosition = contactStartY + maxHeight + 15;
      });
    }

    // Skills & Interests
    if (
      ministerData.skills ||
      ministerData.hobbies ||
      ministerData.sports ||
      ministerData.otherReligiousSecularTraining
    ) {
      addSectionHeader("SKILLS & INTERESTS");

      const skillsStartY = yPosition;
      maxHeight = 0;

      const skillsHeight = addField(
        "Skills",
        ministerData.skills,
        true,
        skillsStartY
      );
      const hobbiesHeight = addField(
        "Hobbies",
        ministerData.hobbies,
        false,
        skillsStartY
      );
      maxHeight = Math.max(maxHeight, skillsHeight, hobbiesHeight);

      const sportsY = skillsStartY + maxHeight + 2;
      const sportsHeight = addField(
        "Sports",
        ministerData.sports,
        true,
        sportsY
      );
      const trainingHeight = addField(
        "Other Religious/Secular Training",
        ministerData.otherReligiousSecularTraining,
        false,
        sportsY
      );
      maxHeight += Math.max(sportsHeight, trainingHeight) + 2;

      yPosition = skillsStartY + maxHeight + 10;
    }

    // Educational Background
    if (
      ministerData.educationBackgrounds &&
      ministerData.educationBackgrounds.length > 0
    ) {
      addSectionHeader("EDUCATIONAL BACKGROUND");

      ministerData.educationBackgrounds.forEach((education, index) => {
        checkPageBreak(30);
        pdf.setFontSize(10);
        pdf.setFont("helvetica", "bold");
        pdf.setTextColor(textColor[0], textColor[1], textColor[2]);
        pdf.text(`Education ${index + 1}:`, margin, yPosition);
        yPosition += 6;

        const eduStartY = yPosition;
        maxHeight = 0;

        const schoolHeight = addField(
          "School Name",
          education.schoolName,
          true,
          eduStartY
        );
        const attainmentHeight = addField(
          "Educational Attainment",
          education.educationalAttainment,
          false,
          eduStartY
        );
        maxHeight = Math.max(maxHeight, schoolHeight, attainmentHeight);

        const courseY = eduStartY + maxHeight + 2;
        const courseHeight = addField(
          "Course",
          education.course,
          true,
          courseY
        );
        const gradDateHeight = addField(
          "Date Graduated",
          formatDate(education.dateGraduated),
          false,
          courseY
        );
        maxHeight += Math.max(courseHeight, gradDateHeight) + 2;

        if (education.description) {
          const descY = eduStartY + maxHeight + 2;
          pdf.setFontSize(10);
          pdf.setFont("helvetica", "bold");
          pdf.setTextColor(textColor[0], textColor[1], textColor[2]);
          pdf.text("Description:", margin, descY);

          pdf.setFont("helvetica", "normal");
          const descLines = pdf.splitTextToSize(
            education.description,
            contentWidth
          );
          pdf.text(descLines, margin, descY + 5);

          maxHeight += descLines.length * 5 + 10;
        }

        yPosition = eduStartY + maxHeight + 15;
      });
    }

    // Employment Records
    if (
      ministerData.employmentRecords &&
      ministerData.employmentRecords.length > 0
    ) {
      addSectionHeader("EMPLOYMENT HISTORY");

      ministerData.employmentRecords.forEach((employment, index) => {
        checkPageBreak(25);
        pdf.setFontSize(10);
        pdf.setFont("helvetica", "bold");
        pdf.setTextColor(textColor[0], textColor[1], textColor[2]);
        pdf.text(`Employment ${index + 1}:`, margin, yPosition);
        yPosition += 6;

        const empStartY = yPosition;
        maxHeight = 0;

        const companyHeight = addField(
          "Company Name",
          employment.companyName,
          true,
          empStartY
        );
        const positionHeight = addField(
          "Position",
          employment.position,
          false,
          empStartY
        );
        maxHeight = Math.max(maxHeight, companyHeight, positionHeight);

        const periodY = empStartY + maxHeight + 2;
        const fromHeight = addField(
          "From Year",
          employment.fromYear,
          true,
          periodY
        );
        const toHeight = addField(
          "To Year",
          employment.toYear || "Present",
          false,
          periodY
        );
        maxHeight += Math.max(fromHeight, toHeight) + 2;

        yPosition = empStartY + maxHeight + 15;
      });
    }

    // Ministry Experience
    if (
      ministerData.ministryExperiences &&
      ministerData.ministryExperiences.length > 0
    ) {
      addSectionHeader("MINISTRY EXPERIENCE");

      ministerData.ministryExperiences.forEach((experience, index) => {
        checkPageBreak(30);
        pdf.setFontSize(10);
        pdf.setFont("helvetica", "bold");
        pdf.setTextColor(textColor[0], textColor[1], textColor[2]);
        pdf.text(`Ministry Experience ${index + 1}:`, margin, yPosition);
        yPosition += 6;

        const expStartY = yPosition;
        maxHeight = 0;

        const rankHeight = addField(
          "Ministry Rank",
          _getMinistryRankName(experience.ministryRankId),
          true,
          expStartY
        );
        const fromHeight = addField(
          "From Year",
          experience.fromYear,
          false,
          expStartY
        );
        maxHeight = Math.max(maxHeight, rankHeight, fromHeight);

        const toY = expStartY + maxHeight + 2;
        const toHeight = addField(
          "To Year",
          experience.toYear || "Present",
          true,
          toY
        );
        maxHeight += toHeight + 2;

        if (experience.description) {
          const descY = expStartY + maxHeight + 2;
          pdf.setFontSize(10);
          pdf.setFont("helvetica", "bold");
          pdf.setTextColor(textColor[0], textColor[1], textColor[2]);
          pdf.text("Description:", margin, descY);

          pdf.setFont("helvetica", "normal");
          const descLines = pdf.splitTextToSize(
            experience.description,
            contentWidth
          );
          pdf.text(descLines, margin, descY + 5);

          maxHeight += descLines.length * 5 + 10;
        }

        yPosition = expStartY + maxHeight + 15;
      });
    }

    // Ministry Skills
    if (ministerData.ministrySkills && ministerData.ministrySkills.length > 0) {
      addSectionHeader("MINISTRY SKILLS");

      const skillsPerRow = 2;
      const skillsStartY = yPosition;

      ministerData.ministrySkills.forEach((skill, index) => {
        const isLeftColumn = index % skillsPerRow === 0;
        const row = Math.floor(index / skillsPerRow);
        const rowY = skillsStartY + row * 8;

        if (isLeftColumn && row > 0) {
          checkPageBreak(10);
        }

        addField(
          `Skill ${index + 1}`,
          _getMinistrySkillName(skill.ministrySkillId),
          isLeftColumn,
          rowY
        );
      });

      const totalRows = Math.ceil(
        ministerData.ministrySkills.length / skillsPerRow
      );
      yPosition = skillsStartY + totalRows * 8 + 10;
    }

    // Ministry Records
    if (
      ministerData.ministryRecords &&
      ministerData.ministryRecords.length > 0
    ) {
      addSectionHeader("MINISTRY RECORDS");

      ministerData.ministryRecords.forEach((record, index) => {
        checkPageBreak(30);
        pdf.setFontSize(10);
        pdf.setFont("helvetica", "bold");
        pdf.setTextColor(textColor[0], textColor[1], textColor[2]);
        pdf.text(`Ministry Record ${index + 1}:`, margin, yPosition);
        yPosition += 6;

        const recordStartY = yPosition;
        maxHeight = 0;

        const churchHeight = addField(
          "Church Location",
          _getChurchName(record.churchLocationId),
          true,
          recordStartY
        );
        const fromHeight = addField(
          "From Year",
          record.fromYear,
          false,
          recordStartY
        );
        maxHeight = Math.max(maxHeight, churchHeight, fromHeight);

        const toY = recordStartY + maxHeight + 2;
        const toHeight = addField(
          "To Year",
          record.toYear || "Present",
          true,
          toY
        );
        maxHeight += toHeight + 2;

        if (record.contribution) {
          const contribY = recordStartY + maxHeight + 2;
          pdf.setFontSize(10);
          pdf.setFont("helvetica", "bold");
          pdf.setTextColor(textColor[0], textColor[1], textColor[2]);
          pdf.text("Contribution:", margin, contribY);

          pdf.setFont("helvetica", "normal");
          const contribLines = pdf.splitTextToSize(
            record.contribution,
            contentWidth
          );
          pdf.text(contribLines, margin, contribY + 5);

          maxHeight += contribLines.length * 5 + 10;
        }

        yPosition = recordStartY + maxHeight + 15;
      });
    }

    // Awards & Recognitions
    if (
      ministerData.awardsRecognitions &&
      ministerData.awardsRecognitions.length > 0
    ) {
      addSectionHeader("AWARDS & RECOGNITIONS");

      ministerData.awardsRecognitions.forEach((award, index) => {
        checkPageBreak(20);
        pdf.setFontSize(10);
        pdf.setFont("helvetica", "bold");
        pdf.setTextColor(textColor[0], textColor[1], textColor[2]);
        pdf.text(`Award ${index + 1}:`, margin, yPosition);
        yPosition += 6;

        const awardStartY = yPosition;
        maxHeight = 0;

        const yearHeight = addField(
          "Year",
          award.year || "Not specified",
          true,
          awardStartY
        );
        const descHeight = addField(
          "Description",
          award.description,
          false,
          awardStartY
        );
        maxHeight = Math.max(maxHeight, yearHeight, descHeight);

        yPosition = awardStartY + maxHeight + 12;
      });
    }

    // Seminars & Conferences
    if (
      ministerData.seminarsConferences &&
      ministerData.seminarsConferences.length > 0
    ) {
      addSectionHeader("SEMINARS & CONFERENCES");

      ministerData.seminarsConferences.forEach((seminar, index) => {
        checkPageBreak(35);
        pdf.setFontSize(10);
        pdf.setFont("helvetica", "bold");
        pdf.setTextColor(textColor[0], textColor[1], textColor[2]);
        pdf.text(`Seminar/Conference ${index + 1}:`, margin, yPosition);
        yPosition += 6;

        const seminarStartY = yPosition;
        maxHeight = 0;

        const titleHeight = addField(
          "Title",
          seminar.title,
          true,
          seminarStartY
        );
        const yearHeight = addField(
          "Year",
          seminar.year || "Not specified",
          false,
          seminarStartY
        );
        maxHeight = Math.max(maxHeight, titleHeight, yearHeight);

        const hoursY = seminarStartY + maxHeight + 2;
        const hoursHeight = addField(
          "Number of Hours",
          seminar.numberOfHours
            ? `${seminar.numberOfHours} hours`
            : "Not specified",
          true,
          hoursY
        );
        const placeHeight = addField(
          "Place",
          seminar.place || "Not specified",
          false,
          hoursY
        );
        maxHeight += Math.max(hoursHeight, placeHeight) + 2;

        if (seminar.description) {
          const descY = seminarStartY + maxHeight + 2;
          pdf.setFontSize(10);
          pdf.setFont("helvetica", "bold");
          pdf.setTextColor(textColor[0], textColor[1], textColor[2]);
          pdf.text("Description:", margin, descY);

          pdf.setFont("helvetica", "normal");
          const descLines = pdf.splitTextToSize(
            seminar.description,
            contentWidth
          );
          pdf.text(descLines, margin, descY + 5);

          maxHeight += descLines.length * 5 + 10;
        }

        yPosition = seminarStartY + maxHeight + 15;
      });
    }

    // Case Reports
    if (ministerData.caseReports && ministerData.caseReports.length > 0) {
      addSectionHeader("CASE REPORTS");

      ministerData.caseReports.forEach((caseReport, index) => {
        checkPageBreak(20);
        pdf.setFontSize(10);
        pdf.setFont("helvetica", "bold");
        pdf.setTextColor(textColor[0], textColor[1], textColor[2]);
        pdf.text(`Case Report ${index + 1}:`, margin, yPosition);
        yPosition += 6;

        const caseReportStartY = yPosition;
        maxHeight = 0;

        const yearHeight = addField(
          "Year",
          caseReport.year || "Not specified",
          true,
          caseReportStartY
        );
        const descHeight = addField(
          "Description",
          caseReport.description,
          false,
          caseReportStartY
        );
        maxHeight = Math.max(maxHeight, yearHeight, descHeight);

        yPosition = caseReportStartY + maxHeight + 12;
      });
    }

    // Certification Section
    if (
      ministerData.certifiedBy ||
      ministerData.signatureImageUrl ||
      ministerData.signatureByCertifiedImageUrl
    ) {
      addSectionHeader("CERTIFICATION");

      if (ministerData.certifiedBy) {
        addField("Certified By", ministerData.certifiedBy, true);
        yPosition += 10;
      }

      // Add signature images if available
      if (
        ministerData.signatureImageUrl ||
        ministerData.signatureByCertifiedImageUrl
      ) {
        checkPageBreak(60);

        pdf.setFontSize(11);
        pdf.setFont("helvetica", "bold");
        pdf.setTextColor(textColor[0], textColor[1], textColor[2]);
        pdf.text("Signatures:", margin, yPosition);
        yPosition += 15;

        const signaturesStartY = yPosition;
        const signatureWidth = 60;
        const signatureSpacing = 40;

        if (ministerData.signatureImageUrl) {
          pdf.setFontSize(10);
          pdf.setFont("helvetica", "normal");
          pdf.setTextColor(textColor[0], textColor[1], textColor[2]);
          pdf.text("Applicant Signature:", margin, signaturesStartY);

          await addImage(
            ministerData.signatureImageUrl,
            "",
            signatureWidth,
            25
          );
        }

        if (ministerData.signatureByCertifiedImageUrl) {
          const certifierX = margin + signatureWidth + signatureSpacing;

          pdf.setFontSize(10);
          pdf.setFont("helvetica", "normal");
          pdf.setTextColor(textColor[0], textColor[1], textColor[2]);
          pdf.text("Certifier Signature:", certifierX, signaturesStartY);

          try {
            const base64Image = await getImageAsBase64(
              ministerData.signatureByCertifiedImageUrl
            );
            if (base64Image) {
              pdf.addImage(
                base64Image,
                "JPEG",
                certifierX,
                signaturesStartY + 5,
                signatureWidth,
                25
              );
            }
          } catch (error) {
            console.error("Error adding certifier signature:", error);
          }
        }

        yPosition += 40;
      }
    }

    // Add footer to each page
    const totalPages = pdf.internal.pages.length - 1;
    for (let i = 1; i <= totalPages; i++) {
      pdf.setPage(i);

      // Footer line
      pdf.setDrawColor(200, 200, 200);
      pdf.setLineWidth(0.3);
      pdf.line(margin, pageHeight - 20, pageWidth - margin, pageHeight - 20);

      // Footer text
      pdf.setFontSize(8);
      pdf.setTextColor(lightTextColor[0], lightTextColor[1], lightTextColor[2]);
      pdf.text(
        `Ministry Application - ${fullName} - Generated on ${format(new Date(), "MMM dd, yyyy")}`,
        margin,
        pageHeight - 12
      );

      pdf.text(
        `Page ${i} of ${totalPages}`,
        pageWidth - margin - 20,
        pageHeight - 12
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
