import { formatDate } from "@/lib/utils";
import { format } from "date-fns";
import jsPDF from "jspdf";

// Types for the PDF generation
interface MemberPDFData {
  // Church Information
  churchId?: number;
  churchName?: string;
  churchAddress?: string;

  // Personal Information
  profilePicture?: string | null;
  firstName: string;
  middleName?: string | null;
  lastName: string;
  gender: "male" | "female";
  birthdate?: string | null;
  yearJoined: number;

  // Ministry & Work Information
  ministryInvolvement?: string | null;
  occupation?: string | null;

  // Educational Information
  educationalAttainment?: string | null;
  school?: string | null;
  degree?: string | null;

  // Contact Information
  mobileNumber?: string | null;
  email?: string | null;
  homeAddress?: string | null;

  // Social Media Links
  facebookLink?: string | null;
  xLink?: string | null;
  instagramLink?: string | null;

  // Additional Information
  notes?: string | null;

  // Timestamps
  createdAt?: Date | null;
  updatedAt?: Date | null;
}

export async function generateMemberPDF(
  memberData: MemberPDFData
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
    } catch {
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

  // Helper function to add field that spans full width
  const addFullWidthField = (
    label: string,
    value: string | null | undefined
  ) => {
    if (!value) return;

    checkPageBreak(20);

    pdf.setFontSize(10);
    pdf.setFont("helvetica", "bold");
    pdf.setTextColor(textColor[0], textColor[1], textColor[2]);
    pdf.text(`${label}:`, margin, yPosition);

    pdf.setFont("helvetica", "normal");
    const lines = pdf.splitTextToSize(value, contentWidth - 10);
    pdf.text(lines, margin + 2, yPosition + 6);

    yPosition += lines.length * 5 + 12;
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
    } catch {
      throw new Error("Failed to add image to PDF");
    }
  };

  const formatGender = (gender: string) => {
    return gender === "male" ? "Male" : "Female";
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
    addTitle("MEMBER INFORMATION", 18);
    yPosition += 5;

    // Member name as subtitle
    const fullName = [
      memberData.firstName,
      memberData.middleName,
      memberData.lastName,
    ]
      .filter(Boolean)
      .join(" ");

    pdf.setFontSize(14);
    pdf.setFont("helvetica", "bold");
    pdf.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    const nameWidth = pdf.getTextWidth(fullName);
    pdf.text(fullName, (pageWidth - nameWidth) / 2, yPosition);
    yPosition += 10;

    // Add generation date
    pdf.setFontSize(9);
    pdf.setTextColor(lightTextColor[0], lightTextColor[1], lightTextColor[2]);
    const dateText = `Generated on ${format(new Date(), "MMMM dd, yyyy")}`;
    const dateWidth = pdf.getTextWidth(dateText);
    pdf.text(dateText, (pageWidth - dateWidth) / 2, yPosition);
    yPosition += 15;

    // Church Information Section
    if (memberData.churchName) {
      addSectionHeader("CHURCH INFORMATION");

      const churchStartY = yPosition;
      let maxHeight = 0;

      const churchNameFieldHeight = addField(
        "Church Name",
        memberData.churchName,
        true,
        churchStartY
      );
      const churchAddressFieldHeight = addField(
        "Church Address",
        memberData.churchAddress,
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
    if (memberData.profilePicture) {
      await addImage(memberData.profilePicture, "Profile Photo", 35, 45, true);
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
    const genderFieldHeight = addField(
      "Gender",
      formatGender(memberData.gender),
      false,
      personalStartY
    );
    maxHeight = Math.max(maxHeight, nameFieldHeight, genderFieldHeight);

    const dobY = personalStartY + maxHeight + 2;
    const dobFieldHeight = addField(
      "Date of Birth",
      formatDate(memberData.birthdate ?? null),
      true,
      dobY
    );
    const yearJoinedFieldHeight = addField(
      "Year Joined",
      memberData.yearJoined.toString(),
      false,
      dobY
    );
    maxHeight += Math.max(dobFieldHeight, yearJoinedFieldHeight) + 2;

    yPosition = personalStartY + maxHeight + 10;

    // Contact Information Section
    addSectionHeader("CONTACT INFORMATION");

    const contactStartY = yPosition;
    maxHeight = 0;

    const mobileFieldHeight = addField(
      "Mobile Number",
      memberData.mobileNumber,
      true,
      contactStartY
    );
    const emailFieldHeight = addField(
      "Email Address",
      memberData.email,
      false,
      contactStartY
    );
    maxHeight = Math.max(maxHeight, mobileFieldHeight, emailFieldHeight);

    yPosition = contactStartY + maxHeight + 10;

    // Home Address (full width)
    addFullWidthField("Home Address", memberData.homeAddress);

    // Social Media Links Section
    if (
      memberData.facebookLink ||
      memberData.xLink ||
      memberData.instagramLink
    ) {
      addSectionHeader("SOCIAL MEDIA LINKS");

      const socialStartY = yPosition;
      maxHeight = 0;

      const facebookFieldHeight = addField(
        "Facebook",
        memberData.facebookLink,
        true,
        socialStartY
      );
      const xFieldHeight = addField(
        "X (Twitter)",
        memberData.xLink,
        false,
        socialStartY
      );
      maxHeight = Math.max(maxHeight, facebookFieldHeight, xFieldHeight);

      const instagramY = socialStartY + maxHeight + 2;
      const instagramFieldHeight = addField(
        "Instagram",
        memberData.instagramLink,
        true,
        instagramY
      );
      maxHeight += instagramFieldHeight + 2;

      yPosition = socialStartY + maxHeight + 10;
    }

    // Work & Ministry Information Section
    if (memberData.occupation || memberData.ministryInvolvement) {
      addSectionHeader("WORK & MINISTRY INFORMATION");

      // Occupation
      addFullWidthField("Occupation", memberData.occupation);

      // Ministry Involvement
      addFullWidthField("Ministry Involvement", memberData.ministryInvolvement);
    }

    // Educational Information Section
    if (
      memberData.educationalAttainment ||
      memberData.school ||
      memberData.degree
    ) {
      addSectionHeader("EDUCATIONAL INFORMATION");

      const eduStartY = yPosition;
      maxHeight = 0;

      const attainmentFieldHeight = addField(
        "Educational Attainment",
        memberData.educationalAttainment,
        true,
        eduStartY
      );
      const schoolFieldHeight = addField(
        "School/University",
        memberData.school,
        false,
        eduStartY
      );
      maxHeight = Math.max(maxHeight, attainmentFieldHeight, schoolFieldHeight);

      yPosition = eduStartY + maxHeight + 10;

      // Degree (full width)
      addFullWidthField("Degree/Course", memberData.degree);
    }

    // Additional Information Section
    if (memberData.notes) {
      addSectionHeader("ADDITIONAL INFORMATION");
      addFullWidthField("Notes", memberData.notes);
    }

    // Registration Information Section
    addSectionHeader("REGISTRATION INFORMATION");

    const regStartY = yPosition;
    maxHeight = 0;

    const createdFieldHeight = addField(
      "Registration Date",
      memberData.createdAt
        ? format(memberData.createdAt, "MMM dd, yyyy")
        : "Not available",
      true,
      regStartY
    );
    const updatedFieldHeight = addField(
      "Last Updated",
      memberData.updatedAt
        ? format(memberData.updatedAt, "MMM dd, yyyy")
        : "Not available",
      false,
      regStartY
    );
    maxHeight = Math.max(maxHeight, createdFieldHeight, updatedFieldHeight);

    yPosition = regStartY + maxHeight + 20;

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
        `Member Information - ${fullName} - Generated on ${format(new Date(), "MMM dd, yyyy")}`,
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
    const filename = `Member_${fullName.replace(/\s+/g, "_")}_${timestamp}.pdf`;

    // Save the PDF
    pdf.save(filename);
  } catch {
    throw new Error("Failed to generate member PDF");
  }
}
