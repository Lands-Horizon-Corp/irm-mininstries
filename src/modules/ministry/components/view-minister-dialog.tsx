"use client";

import { useState } from "react";
import Image from "next/image";

import { format } from "date-fns";
import {
  Award,
  BookOpen,
  Briefcase,
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ImageViewer } from "@/components/ui/image-viewer";
import { Separator } from "@/components/ui/separator";
import { useChurches } from "@/modules/church/church-service";
import { useMinistryRanks } from "@/modules/ministry-ranks/ministry-ranks-service";
import { useMinistrySkills } from "@/modules/ministry-skills/ministry-skills-service";

import { generateMinisterPDF } from "../ministry-pdf";
import { useMinister } from "../ministry-service";
import type { Minister } from "../ministry-validation";
import { toast } from "sonner";

interface ViewMinisterDialogProps {
  isOpen: boolean;
  onClose: () => void;
  ministerId: number;
}

export function ViewMinisterDialog({
  isOpen,
  onClose,
  ministerId,
}: ViewMinisterDialogProps) {
  const [imageViewer, setImageViewer] = useState<{
    isOpen: boolean;
    src: string;
    alt: string;
  }>({
    isOpen: false,
    src: "",
    alt: "",
  });
  const [isExportingPDF, setIsExportingPDF] = useState(false);

  const { data: ministerResponse, isLoading, error } = useMinister(ministerId);

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
    if (!formData) return;

    setIsExportingPDF(true);
    try {
      // Fetch lookup data for churches, ministry ranks, and skills
      const [churchesResponse, ranksResponse, skillsResponse] =
        await Promise.all([
          fetch("/api/churches?limit=100").then((res) => res.json()),
          fetch("/api/ministry-ranks?limit=100").then((res) => res.json()),
          fetch("/api/ministry-skills?limit=200").then((res) => res.json()),
        ]);

      const lookupData = {
        churches: churchesResponse.success ? churchesResponse.data : [],
        ministryRanks: ranksResponse.success ? ranksResponse.data : [],
        ministrySkills: skillsResponse.success ? skillsResponse.data : [],
      };

      // Generate and download PDF
      await generateMinisterPDF(formData, lookupData);
    } catch {
      toast.error("Failed to export minister PDF");
    } finally {
      setIsExportingPDF(false);
    }
  };

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

  if (isLoading) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-h-screen min-w-7xl overflow-auto">
          <DialogHeader>
            <DialogTitle>View Minister</DialogTitle>
          </DialogHeader>
          <div className="flex items-center justify-center py-8">
            <div className="text-center">
              <div className="border-primary mx-auto mb-2 h-8 w-8 animate-spin rounded-full border-b-2"></div>
              <p className="text-muted-foreground text-sm">
                Loading minister data...
              </p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  if (error || !ministerResponse?.success || !ministerResponse.data) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Error</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p className="text-destructive text-sm">
              Failed to load minister data: {error?.message || "Unknown error"}
            </p>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  const formData: Minister = ministerResponse.data;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-h-screen min-w-7xl overflow-auto">
        <DialogHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <DialogTitle>Minister Profile s</DialogTitle>
          <Button
            disabled={isExportingPDF}
            size="sm"
            variant="outline"
            onClick={exportToPDF}
          >
            <Download className="mr-2 h-4 w-4" />
            {isExportingPDF ? "Exporting..." : "Export PDF"}
          </Button>
        </DialogHeader>

        <div className="space-y-6">
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
                    <p className="mt-1">
                      {formData.nickname || "Not provided"}
                    </p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium">Date of Birth</label>
                    <p className="mt-1">{formatDate(formData.dateOfBirth)}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium">
                      Place of Birth
                    </label>
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
                    <label className="text-sm font-medium">
                      Height & Weight
                    </label>
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
                      <p className="mt-1">
                        {formData.telephone || "Not provided"}
                      </p>
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
                    <label className="text-sm font-medium">
                      Present Address
                    </label>
                    <p className="mt-1">{formData.presentAddress}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium">
                      Permanent Address
                    </label>
                    <p className="mt-1">
                      {formData.permanentAddress || "Same as present address"}
                    </p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <IdCard className="h-4 w-4" />
                    <div>
                      <label className="text-sm font-medium">
                        Passport Number
                      </label>
                      <p className="mt-1">
                        {formData.passportNumber || "Not provided"}
                      </p>
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium">SSS Number</label>
                    <p className="mt-1">
                      {formData.sssNumber || "Not provided"}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium">PhilHealth</label>
                    <p className="mt-1">
                      {formData.philhealth || "Not provided"}
                    </p>
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
                    <p className="mt-1">
                      {formatDate(formData.fatherBirthday)}
                    </p>
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
                    <p className="mt-1">
                      {formatDate(formData.motherBirthday)}
                    </p>
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
                        <label className="text-sm font-medium">
                          Occupation
                        </label>
                        <p className="mt-1">
                          {formData.spouseOccupation || "Not provided"}
                        </p>
                      </div>
                      <div>
                        <label className="text-sm font-medium">
                          Wedding Date
                        </label>
                        <p className="mt-1">
                          {formatDate(formData.weddingDate)}
                        </p>
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
                              <label className="text-sm font-medium">
                                Name
                              </label>
                              <p className="mt-1">{child.name}</p>
                            </div>
                            <div>
                              <label className="text-sm font-medium">Age</label>
                              <p className="mt-1">
                                {child.dateOfBirth
                                  ? new Date().getFullYear() -
                                    new Date(child.dateOfBirth).getFullYear()
                                  : "N/A"}
                              </p>
                            </div>
                            <div>
                              <label className="text-sm font-medium">
                                Gender
                              </label>
                              <p className="mt-1">
                                {formatGender(child.gender)}
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
                              <label className="text-sm font-medium">
                                Name
                              </label>
                              <p className="mt-1">{contact.name}</p>
                            </div>
                            <div>
                              <label className="text-sm font-medium">
                                Relationship
                              </label>
                              <p className="mt-1">{contact.relationship}</p>
                            </div>
                            <div>
                              <label className="text-sm font-medium">
                                Phone
                              </label>
                              <p className="mt-1">{contact.contactNumber}</p>
                            </div>
                            <div>
                              <label className="text-sm font-medium">
                                Address
                              </label>
                              <p className="mt-1">{contact.address}</p>
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
                                Level
                              </label>
                              <p className="mt-1">
                                {education.educationalAttainment}
                              </p>
                            </div>
                            <div>
                              <label className="text-sm font-medium">
                                School
                              </label>
                              <p className="mt-1">{education.schoolName}</p>
                            </div>
                            <div>
                              <label className="text-sm font-medium">
                                Course
                              </label>
                              <p className="mt-1">{education.course}</p>
                            </div>
                            <div>
                              <label className="text-sm font-medium">
                                Year Graduated
                              </label>
                              <p className="mt-1">
                                {education.dateGraduated
                                  ? formatDate(education.dateGraduated)
                                  : "Not provided"}
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
                                  Company
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
                                Church
                              </label>
                              <p className="mt-1">Not specified</p>
                            </div>
                            <div>
                              <label className="text-sm font-medium">
                                Position
                              </label>
                              <p className="mt-1">
                                {getMinistryRankName(experience.ministryRankId)}
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
              {formData.ministrySkills &&
                formData.ministrySkills.length > 0 && (
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
              {formData.ministryRecords &&
                formData.ministryRecords.length > 0 && (
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
                              <label className="text-sm font-medium">
                                Church
                              </label>
                              <p className="mt-1">
                                {getChurchName(record.churchLocationId)}
                              </p>
                            </div>
                            <div>
                              <label className="text-sm font-medium">
                                Position
                              </label>
                              <p className="mt-1">Not specified</p>
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
                                <label className="text-sm font-medium">
                                  Title
                                </label>
                                <p className="mt-1">{award.description}</p>
                              </div>
                              <div>
                                <label className="text-sm font-medium">
                                  Organization
                                </label>
                                <p className="mt-1">Not specified</p>
                              </div>
                              <div>
                                <label className="text-sm font-medium">
                                  Year
                                </label>
                                <p className="mt-1">{award.year}</p>
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
                            <p className="mt-1">
                              {seminar.numberOfHours} hours
                            </p>
                          </div>
                          {seminar.place && (
                            <div>
                              <label className="text-sm font-medium">
                                Place
                              </label>
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
                  <p className="mt-1">
                    {formData.certifiedBy || "Not provided"}
                  </p>
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
        </div>

        {/* Image Viewer */}
        <ImageViewer
          alt={imageViewer.alt}
          isOpen={imageViewer.isOpen}
          src={imageViewer.src}
          onClose={closeImageViewer}
        />
      </DialogContent>
    </Dialog>
  );
}
