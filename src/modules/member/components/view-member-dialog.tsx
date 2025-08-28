"use client";

import Image from "next/image";

import { format } from "date-fns";
import { Download, Loader2, Mail, Phone, User } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";

import { useChurch } from "../../church/church-service";
import { generateMemberPDF } from "../member-pdf";
import { useMember } from "../member-service";

interface ViewMemberDialogProps {
  isOpen: boolean;
  memberId: number;
  onClose: () => void;
}

export function ViewMemberDialog({
  isOpen,
  memberId,
  onClose,
}: ViewMemberDialogProps) {
  const { data: memberResponse, isLoading } = useMember(memberId);
  const { data: churchResponse } = useChurch(
    memberResponse?.data?.churchId || 0
  );

  const handlePDFDownload = async () => {
    if (memberResponse?.success && memberResponse.data) {
      const member = memberResponse.data;
      const church = churchResponse?.data;

      try {
        await generateMemberPDF({
          ...member,
          churchName: church?.name || undefined,
          churchAddress: church?.address || undefined,
        });
      } catch (error) {
        console.error("Failed to download PDF:", error);
      }
    }
  };

  if (isLoading) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-4xl">
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  if (!memberResponse?.success || !memberResponse.data) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-4xl">
          <div className="py-8 text-center">
            <p className="text-muted-foreground">Member not found</p>
            <Button className="mt-4" onClick={onClose}>
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  const member = memberResponse.data;
  const fullName = [member.firstName, member.middleName, member.lastName]
    .filter(Boolean)
    .join(" ");

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-h-[90vh] max-w-4xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            {/* Profile Picture */}
            <div className="relative h-12 w-12 overflow-hidden rounded-full">
              {member.profilePicture ? (
                <Image
                  fill
                  alt={fullName}
                  className="object-cover"
                  src={member.profilePicture}
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-blue-100 dark:bg-blue-900">
                  <User className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
              )}
            </div>
            <div>
              <h2 className="text-xl font-semibold">{fullName}</h2>
              <div className="text-muted-foreground flex items-center gap-2 text-sm">
                <Badge
                  className={
                    member.gender === "male"
                      ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100"
                      : "bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-100"
                  }
                  variant="secondary"
                >
                  {member.gender}
                </Badge>
                <span>•</span>
                <span>Joined {member.yearJoined}</span>
              </div>
            </div>
          </DialogTitle>
          <DialogDescription>Member information and details</DialogDescription>
        </DialogHeader>

        <ScrollArea className="max-h-[70vh]">
          <div className="space-y-6 px-1">
            {/* Church Information */}
            {churchResponse?.data && (
              <Card>
                <CardHeader className="pb-4">
                  <CardTitle className="text-lg">Church Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div>
                      <label className="text-muted-foreground text-sm font-medium">
                        Church Name
                      </label>
                      <p className="mt-1 font-medium">
                        {churchResponse.data.name}
                      </p>
                    </div>

                    {churchResponse.data.address && (
                      <div>
                        <label className="text-muted-foreground text-sm font-medium">
                          Address
                        </label>
                        <p className="text-muted-foreground mt-1 text-sm">
                          {churchResponse.data.address}
                        </p>
                      </div>
                    )}
                  </div>

                  {churchResponse.data.email && (
                    <div>
                      <label className="text-muted-foreground text-sm font-medium">
                        Church Email
                      </label>
                      <p className="mt-1 font-medium">
                        {churchResponse.data.email}
                      </p>
                    </div>
                  )}

                  {churchResponse.data.description && (
                    <div>
                      <label className="text-muted-foreground text-sm font-medium">
                        Description
                      </label>
                      <p className="text-muted-foreground mt-1 text-sm">
                        {churchResponse.data.description}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Basic Information */}
            <Card>
              <CardHeader className="pb-4">
                <CardTitle className="text-lg">Basic Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div>
                    <label className="text-muted-foreground text-sm font-medium">
                      Full Name
                    </label>
                    <p className="mt-1 font-medium">{fullName}</p>
                  </div>

                  <div>
                    <label className="text-muted-foreground text-sm font-medium">
                      Gender
                    </label>
                    <div className="mt-1">
                      <Badge
                        className={
                          member.gender === "male"
                            ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100"
                            : "bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-100"
                        }
                      >
                        {member.gender}
                      </Badge>
                    </div>
                  </div>

                  {member.birthdate && (
                    <div>
                      <label className="text-muted-foreground text-sm font-medium">
                        Birthdate
                      </label>
                      <p className="mt-1">
                        {format(new Date(member.birthdate), "MMMM dd, yyyy")}
                      </p>
                    </div>
                  )}

                  <div>
                    <label className="text-muted-foreground text-sm font-medium">
                      Year Joined
                    </label>
                    <div className="mt-1">
                      <Badge variant="secondary">{member.yearJoined}</Badge>
                    </div>
                  </div>
                </div>

                <Separator />

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div>
                    <label className="text-muted-foreground text-sm font-medium">
                      Registration Date
                    </label>
                    <p className="mt-1">
                      {member.createdAt
                        ? format(new Date(member.createdAt), "MMMM dd, yyyy")
                        : "Not available"}
                    </p>
                  </div>

                  <div>
                    <label className="text-muted-foreground text-sm font-medium">
                      Last Updated
                    </label>
                    <p className="mt-1">
                      {member.updatedAt
                        ? format(new Date(member.updatedAt), "MMMM dd, yyyy")
                        : "Not available"}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Contact Information */}
            <Card>
              <CardHeader className="pb-4">
                <CardTitle className="text-lg">Contact Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div>
                    <label className="text-muted-foreground text-sm font-medium">
                      Mobile Number
                    </label>
                    {member.mobileNumber ? (
                      <div className="mt-1 flex items-center gap-2">
                        <Phone className="text-muted-foreground h-4 w-4" />
                        <span className="font-mono">{member.mobileNumber}</span>
                      </div>
                    ) : (
                      <p className="text-muted-foreground mt-1">Not provided</p>
                    )}
                  </div>

                  <div>
                    <label className="text-muted-foreground text-sm font-medium">
                      Email Address
                    </label>
                    {member.email ? (
                      <div className="mt-1 flex items-center gap-2">
                        <Mail className="text-muted-foreground h-4 w-4" />
                        <span className="font-mono">{member.email}</span>
                      </div>
                    ) : (
                      <p className="text-muted-foreground mt-1">Not provided</p>
                    )}
                  </div>
                </div>

                {member.homeAddress && (
                  <div>
                    <label className="text-muted-foreground text-sm font-medium">
                      Home Address
                    </label>
                    <p className="mt-1">{member.homeAddress}</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Ministry & Work Information */}
            {(member.ministryInvolvement || member.occupation) && (
              <Card>
                <CardHeader className="pb-4">
                  <CardTitle className="text-lg">
                    Ministry & Work Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {member.ministryInvolvement && (
                    <div>
                      <label className="text-muted-foreground text-sm font-medium">
                        Ministry Involvement
                      </label>
                      <p className="mt-1 whitespace-pre-wrap">
                        {member.ministryInvolvement}
                      </p>
                    </div>
                  )}

                  {member.occupation && (
                    <div>
                      <label className="text-muted-foreground text-sm font-medium">
                        Occupation
                      </label>
                      <p className="mt-1">{member.occupation}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Educational Information */}
            {(member.educationalAttainment ||
              member.school ||
              member.degree) && (
              <Card>
                <CardHeader className="pb-4">
                  <CardTitle className="text-lg">
                    Educational Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    {member.educationalAttainment && (
                      <div>
                        <label className="text-muted-foreground text-sm font-medium">
                          Educational Attainment
                        </label>
                        <p className="mt-1">{member.educationalAttainment}</p>
                      </div>
                    )}

                    {member.school && (
                      <div>
                        <label className="text-muted-foreground text-sm font-medium">
                          School/University
                        </label>
                        <p className="mt-1">{member.school}</p>
                      </div>
                    )}

                    {member.degree && (
                      <div className="md:col-span-2">
                        <label className="text-muted-foreground text-sm font-medium">
                          Degree/Course
                        </label>
                        <p className="mt-1">{member.degree}</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Social Media Links */}
            {(member.facebookLink || member.xLink || member.instagramLink) && (
              <Card>
                <CardHeader className="pb-4">
                  <CardTitle className="text-lg">Social Media Links</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    {member.facebookLink && (
                      <div>
                        <label className="text-muted-foreground text-sm font-medium">
                          Facebook
                        </label>
                        <p className="mt-1">
                          <a
                            className="text-blue-600 hover:underline"
                            href={
                              member.facebookLink.startsWith("http")
                                ? member.facebookLink
                                : `https://facebook.com/${member.facebookLink}`
                            }
                            rel="noopener noreferrer"
                            target="_blank"
                          >
                            {member.facebookLink}
                          </a>
                        </p>
                      </div>
                    )}

                    {member.xLink && (
                      <div>
                        <label className="text-muted-foreground text-sm font-medium">
                          X (Twitter)
                        </label>
                        <p className="mt-1">
                          <a
                            className="text-blue-600 hover:underline"
                            href={
                              member.xLink.startsWith("http")
                                ? member.xLink
                                : `https://x.com/${member.xLink}`
                            }
                            rel="noopener noreferrer"
                            target="_blank"
                          >
                            {member.xLink}
                          </a>
                        </p>
                      </div>
                    )}

                    {member.instagramLink && (
                      <div className="md:col-span-2">
                        <label className="text-muted-foreground text-sm font-medium">
                          Instagram
                        </label>
                        <p className="mt-1">
                          <a
                            className="text-blue-600 hover:underline"
                            href={
                              member.instagramLink.startsWith("http")
                                ? member.instagramLink
                                : `https://instagram.com/${member.instagramLink}`
                            }
                            rel="noopener noreferrer"
                            target="_blank"
                          >
                            {member.instagramLink}
                          </a>
                        </p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Additional Information */}
            {member.notes && (
              <Card>
                <CardHeader className="pb-4">
                  <CardTitle className="text-lg">
                    Additional Information
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div>
                    <label className="text-muted-foreground text-sm font-medium">
                      Notes
                    </label>
                    <p className="mt-1 whitespace-pre-wrap">{member.notes}</p>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </ScrollArea>

        {/* Dialog Footer */}
        <div className="flex justify-between border-t pt-4">
          <Button onClick={handlePDFDownload}>
            <Download className="mr-2 h-4 w-4" />
            Download PDF
          </Button>
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
