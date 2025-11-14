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
  maritalStatus?: "single" | "married" | "separated" | "widowed" | null;

  // Ministry & Work Information
  ministryInvolvement?: string | null;
  occupation?: string | null;
  organization?: string | null;

  // Life Group Information
  isLifegroupLeader?: boolean | null;
  lifegroupLeaderId?: number | null;

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
  tiktokLink?: string | null;
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
  const doc = new jsPDF();

  // Helper function to format organization for display
  const formatOrganization = (org: string | null | undefined): string => {
    if (!org) return "Not specified";
    
    const organizationLabels: { [key: string]: string } = {
      "children": "Children (12yrs below)",
      "ywap-teens": "YWAP Teens (13yrs - 17yrs)", 
      "ywap-young-people": "YWAP Young People (18yrs - 23yrs)",
      "ywap-young-adult": "YWAP Young Adult (24yrs - 39yrs)",
      "young-married": "Young Married (40 years below married)",
      "single-adult": "Single Adult (40 above with no spouse)",
      "kalkab-male": "Kalkab - Kalalakihan (Married Men 41 Above)",
      "kalkab-female": "Kalkab - Kababaihan (Married Women 41 Above)"
    };
    
    return organizationLabels[org] || org;
  };
  let yPosition = 20;
  const pageHeight = pdf.internal.pageSize.height;
  const pageWidth = pdf.internal.pageSize.width;
  const margin = 12;
  const contentWidth = pageWidth - 2 * margin;
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
  const checkPageBreak = (requiredSpace = 18) => {
    const footerSpace = 20;
    if (yPosition + requiredSpace > pageHeight - margin - footerSpace) {
      pdf.addPage();
      yPosition = 20;

      // Add header to new page
      pdf.setFontSize(12);
      pdf.setFont("helvetica", "bold");
      pdf.setTextColor(0, 0, 0);
      pdf.text(
        "I AM REDEEMER AND MASTER EVANGELICAL CHURCH",
        pageWidth / 2,
        12,
        {
          align: "center",
        }
      );

      pdf.setDrawColor(0, 0, 0);
      pdf.setLineWidth(0.5);
      pdf.line(margin, 15, pageWidth - margin, 15);

      return true;
    }
    return false;
  };

  // Helper function to add title
  const addTitle = (text: string, fontSize = 14) => {
    checkPageBreak(15);
    pdf.setFontSize(fontSize);
    pdf.setFont("helvetica", "bold");
    pdf.setTextColor(0, 0, 0);
    const textWidth = pdf.getTextWidth(text);
    const centerX = (pageWidth - textWidth) / 2;
    pdf.text(text, centerX, yPosition);

    pdf.setDrawColor(0, 0, 0);
    pdf.setLineWidth(0.3);
    pdf.line(centerX, yPosition + 1, centerX + textWidth, yPosition + 1);

    yPosition += 8;
  };

  // Helper function to add section header
  const addSectionHeader = (title: string) => {
    checkPageBreak(8);
    yPosition += 4;

    pdf.setFontSize(9);
    pdf.setFont("helvetica", "bold");
    pdf.setTextColor(0, 0, 0);
    pdf.text(title, margin, yPosition);

    pdf.setDrawColor(0, 0, 0);
    pdf.setLineWidth(0.2);
    pdf.line(margin, yPosition + 1, pageWidth - margin, yPosition + 1);

    yPosition += 6;
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
    const columnWidth = contentWidth / 2 - 3;
    const xPosition = isLeftColumn ? margin + 2 : margin + columnWidth + 6;

    pdf.setFontSize(8);
    pdf.setFont("helvetica", "bold");
    pdf.setTextColor(0, 0, 0);
    pdf.text(`${label}:`, xPosition, currentY);

    pdf.setFont("helvetica", "normal");
    pdf.setTextColor(0, 0, 0);
    const lines = pdf.splitTextToSize(value, columnWidth - 10);
    pdf.text(lines, xPosition + 1, currentY + 3);

    const fieldHeight = Math.max(6, lines.length * 3 + 2);

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

    checkPageBreak(12);

    pdf.setFontSize(8);
    pdf.setFont("helvetica", "bold");
    pdf.setTextColor(0, 0, 0);
    pdf.text(`${label}:`, margin, yPosition);

    pdf.setFont("helvetica", "normal");
    pdf.setTextColor(0, 0, 0);
    const lines = pdf.splitTextToSize(value, contentWidth - 5);
    pdf.text(lines, margin + 1, yPosition + 3.5);

    yPosition += lines.length * 3 + 6;
  };

  // Helper function to add image
  const addImage = async (
    imageUrl: string,
    alt: string,
    width = 30,
    height = 35,
    centered = false
  ) => {
    try {
      const base64Image = await getImageAsBase64(imageUrl);
      if (base64Image) {
        checkPageBreak(height + 8);
        const x = centered ? (pageWidth - width) / 2 : margin + 5;

        pdf.setDrawColor(200, 200, 200);
        pdf.setLineWidth(0.1);
        pdf.rect(x - 0.5, yPosition - 0.5, width + 1, height + 1);

        pdf.addImage(base64Image, "JPEG", x, yPosition, width, height);

        pdf.setFontSize(7);
        pdf.setFont("helvetica", "italic");
        pdf.setTextColor(
          lightTextColor[0],
          lightTextColor[1],
          lightTextColor[2]
        );
        const captionX = centered ? (pageWidth - pdf.getTextWidth(alt)) / 2 : x;
        pdf.text(alt, captionX, yPosition + height + 3);

        yPosition += height + 6;
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
    pdf.setFontSize(12);
    pdf.setFont("helvetica", "bold");
    pdf.setTextColor(0, 0, 0);
    pdf.text("I AM REDEEMER AND MASTER EVANGELICAL CHURCH", pageWidth / 2, 12, {
      align: "center",
    });

    pdf.setDrawColor(0, 0, 0);
    pdf.setLineWidth(0.5);
    pdf.line(margin, 15, pageWidth - margin, 15);

    // Main title
    addTitle("MEMBER INFORMATION", 12);
    yPosition += 1;

    // Member name as subtitle
    const fullName = [
      memberData.firstName,
      memberData.middleName,
      memberData.lastName,
    ]
      .filter(Boolean)
      .join(" ");

    pdf.setFontSize(10);
    pdf.setFont("helvetica", "bold");
    pdf.setTextColor(0, 0, 0);
    const nameWidth = pdf.getTextWidth(fullName);
    pdf.text(fullName, (pageWidth - nameWidth) / 2, yPosition);
    yPosition += 5;

    // Add generation date
    pdf.setFontSize(7);
    pdf.setTextColor(100, 100, 100);
    const dateText = `Generated on ${format(new Date(), "MMMM dd, yyyy")}`;
    const dateWidth = pdf.getTextWidth(dateText);
    pdf.text(dateText, (pageWidth - dateWidth) / 2, yPosition);
    yPosition += 8;

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

      yPosition = churchStartY + maxHeight + 3;
    }

    // Personal Information Section
    addSectionHeader("PERSONAL INFORMATION");

    // Add profile photo if available
    if (memberData.profilePicture) {
      await addImage(memberData.profilePicture, "Profile Photo", 25, 30, true);
      yPosition += 1;
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

    const dobY = personalStartY + maxHeight + 0.5;
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
    maxHeight += Math.max(dobFieldHeight, yearJoinedFieldHeight) + 0.5;

    // Add marital status
    const maritalStatusY = dobY + maxHeight + 0.5;
    const maritalStatusFieldHeight = addField(
      "Marital Status",
      memberData.maritalStatus ? memberData.maritalStatus.charAt(0).toUpperCase() + memberData.maritalStatus.slice(1) : "Single",
      true,
      maritalStatusY
    );
    maxHeight += maritalStatusFieldHeight + 0.5;

    yPosition = personalStartY + maxHeight + 3;

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

    yPosition = contactStartY + maxHeight + 3;

    // Home Address (full width)
    addFullWidthField("Home Address", memberData.homeAddress);

    // Social Media Links Section
    if (
      memberData.facebookLink ||
      memberData.xLink ||
      memberData.instagramLink ||
      memberData.tiktokLink
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
      const tikTokFieldHeight = addField(
        "TikTok",
        memberData.tiktokLink,
        false,
        socialStartY
      );
      maxHeight = Math.max(
        maxHeight,
        facebookFieldHeight,
        xFieldHeight,
        tikTokFieldHeight
      );

      const instagramY = socialStartY + maxHeight + 0.5;
      const instagramFieldHeight = addField(
        "Instagram",
        memberData.instagramLink,
        true,
        instagramY
      );
      maxHeight += instagramFieldHeight + 0.5;

      yPosition = socialStartY + maxHeight + 3;
    }

    // Work & Ministry Information Section
    if (memberData.occupation || memberData.ministryInvolvement || memberData.organization || memberData.isLifegroupLeader || memberData.lifegroupLeaderId) {
      addSectionHeader("WORK & MINISTRY INFORMATION");

      // Occupation
      addFullWidthField("Occupation", memberData.occupation);

      // Organization
      addFullWidthField("Organization", formatOrganization(memberData.organization));

      // Ministry Involvement
      addFullWidthField("Ministry Involvement", memberData.ministryInvolvement);

      // Life Group Leadership
      addFullWidthField("Life Group Leader", memberData.isLifegroupLeader ? "Yes" : "No");

      // Life Group Leader ID (if they have one)
      if (memberData.lifegroupLeaderId) {
        addFullWidthField("Life Group Leader ID", memberData.lifegroupLeaderId.toString());
      }
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

      yPosition = eduStartY + maxHeight + 3;

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

    yPosition = regStartY + maxHeight + 8;

    // Add footer to each page
    const totalPages = pdf.internal.pages.length - 1;
    for (let i = 1; i <= totalPages; i++) {
      pdf.setPage(i);

      // Footer line
      pdf.setDrawColor(200, 200, 200);
      pdf.setLineWidth(0.2);
      pdf.line(margin, pageHeight - 12, pageWidth - margin, pageHeight - 12);

      // Footer text
      pdf.setFontSize(6);
      pdf.setTextColor(lightTextColor[0], lightTextColor[1], lightTextColor[2]);
      pdf.text(
        `Member Information - ${fullName} - Generated on ${format(new Date(), "MMM dd, yyyy")}`,
        margin,
        pageHeight - 8
      );

      pdf.text(
        `Page ${i} of ${totalPages}`,
        pageWidth - margin - 15,
        pageHeight - 8
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
