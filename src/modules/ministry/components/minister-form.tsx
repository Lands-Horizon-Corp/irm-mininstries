"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";

import { useCreateMinister, useUpdateMinister } from "../ministry-service";
import type { Minister, StepProps } from "../ministry-validation";

import { CertificationSignatures } from "./steps/certification-signatures";
import { ContactGovernmentInfo } from "./steps/contact-government-info";
import { EducationEmployment } from "./steps/education-employment";
import { EmergencyContactsSkills } from "./steps/emergency-contacts-skills";
import { FamilySpouseInformation } from "./steps/family-spouse-information";
import { MinistryExperienceSkills } from "./steps/ministry-experience-skills";
import { MinistryRecordsAwards } from "./steps/ministry-records-awards";
import { Overview } from "./steps/overview";
import { PersonalInformation } from "./steps/personal-information";
import { SeminarsConferences } from "./steps/seminars-conferences";
import { StepIndicator } from "./step-indicator";
import { SuccessDialog } from "./success-dialog";
enum FormStep {
  PERSONAL_INFORMATION = "PERSONAL_INFORMATION",
  CONTACT_GOVERNMENT_INFO = "CONTACT_GOVERNMENT_INFO",
  FAMILY_SPOUSE_INFORMATION = "FAMILY_SPOUSE_INFORMATION",
  EMERGENCY_CONTACTS_SKILLS = "EMERGENCY_CONTACTS_SKILLS",
  EDUCATION_EMPLOYMENT = "EDUCATION_EMPLOYMENT",
  MINISTRY_EXPERIENCE_SKILLS = "MINISTRY_EXPERIENCE_SKILLS",
  MINISTRY_RECORDS_AWARDS = "MINISTRY_RECORDS_AWARDS",
  SEMINARS_CONFERENCES = "SEMINARS_CONFERENCES",
  CERTIFICATION_SIGNATURES = "CERTIFICATION_SIGNATURES",
  OVERVIEW = "OVERVIEW",
}

const formSteps = [
  { key: FormStep.PERSONAL_INFORMATION, label: "Personal Information" },
  { key: FormStep.CONTACT_GOVERNMENT_INFO, label: "Contact & Government Info" },
  {
    key: FormStep.FAMILY_SPOUSE_INFORMATION,
    label: "Family, Spouse & Children",
  },
  {
    key: FormStep.EMERGENCY_CONTACTS_SKILLS,
    label: "Emergency Contacts & Skills",
  },
  {
    key: FormStep.EDUCATION_EMPLOYMENT,
    label: "Education & Employment",
  },
  {
    key: FormStep.MINISTRY_EXPERIENCE_SKILLS,
    label: "Ministry Experience & Skills",
  },
  {
    key: FormStep.MINISTRY_RECORDS_AWARDS,
    label: "Ministry Records & Awards",
  },
  { key: FormStep.SEMINARS_CONFERENCES, label: "Seminars & Conferences" },
  { key: FormStep.CERTIFICATION_SIGNATURES, label: "Certification" },
  { key: FormStep.OVERVIEW, label: "Review & Submit" },
] as const;

type FormStepComponents = {
  [FormStep.PERSONAL_INFORMATION]: React.ComponentType<StepProps>;
  [FormStep.CONTACT_GOVERNMENT_INFO]: React.ComponentType<StepProps>;
  [FormStep.FAMILY_SPOUSE_INFORMATION]: React.ComponentType<StepProps>;
  [FormStep.EMERGENCY_CONTACTS_SKILLS]: React.ComponentType<StepProps>;
  [FormStep.EDUCATION_EMPLOYMENT]: React.ComponentType<StepProps>;
  [FormStep.MINISTRY_EXPERIENCE_SKILLS]: React.ComponentType<StepProps>;
  [FormStep.MINISTRY_RECORDS_AWARDS]: React.ComponentType<StepProps>;
  [FormStep.SEMINARS_CONFERENCES]: React.ComponentType<StepProps>;
  [FormStep.CERTIFICATION_SIGNATURES]: React.ComponentType<StepProps>;
  [FormStep.OVERVIEW]: React.ComponentType<StepProps>;
};

interface MinisterFormProps {
  onClose?: () => void;
  isDialog?: boolean;
  mode?: "create" | "edit";
  initialData?: Minister;
  onSuccess?: () => void;
}

// Note: Component imports would need to be added when components are created
const formComponents: Partial<FormStepComponents> = {
  [FormStep.PERSONAL_INFORMATION]: PersonalInformation,
  [FormStep.CONTACT_GOVERNMENT_INFO]: ContactGovernmentInfo,
  [FormStep.FAMILY_SPOUSE_INFORMATION]: FamilySpouseInformation,
  [FormStep.EMERGENCY_CONTACTS_SKILLS]: EmergencyContactsSkills,
  [FormStep.EDUCATION_EMPLOYMENT]: EducationEmployment,
  [FormStep.MINISTRY_EXPERIENCE_SKILLS]: MinistryExperienceSkills,
  [FormStep.MINISTRY_RECORDS_AWARDS]: MinistryRecordsAwards,
  [FormStep.SEMINARS_CONFERENCES]: SeminarsConferences,
  [FormStep.CERTIFICATION_SIGNATURES]: CertificationSignatures,
  [FormStep.OVERVIEW]: Overview,
};

export function MinisterForm({
  onClose,
  isDialog = false,
  mode = "create",
  initialData,
  onSuccess,
}: MinisterFormProps) {
  const router = useRouter();
  const cardRef = useRef<HTMLDivElement>(null);
  const createMinister = useCreateMinister();
  const updateMinisterMutation = useUpdateMinister();

  const isEdit = mode === "edit" && initialData;

  const [currentStep, setCurrentStep] = useState<FormStep>(
    FormStep.PERSONAL_INFORMATION
  );
  const [formData, setMinister] = useState<Minister>(() => {
    if (isEdit && initialData) {
      return { ...initialData };
    }

    return {
      // Personal Information
      firstName: "",
      lastName: "",
      middleName: "",
      suffix: "",
      nickname: "",
      dateOfBirth: new Date(),
      placeOfBirth: "",
      gender: "male",
      heightFeet: "",
      weightKg: "",
      civilStatus: "single",
      imageUrl: "",

      // Contact Information
      email: "",
      telephone: "",
      address: "",
      presentAddress: "",
      permanentAddress: "",

      // Government & Identification
      passportNumber: "",
      sssNumber: "",
      philhealth: "",
      tin: "",

      // Family Information
      fatherName: "",
      fatherProvince: "",
      fatherBirthday: new Date(),
      fatherOccupation: "",
      motherName: "",
      motherProvince: "",
      motherBirthday: new Date(),
      motherOccupation: "",

      // Spouse Information
      spouseName: "",
      spouseProvince: "",
      spouseBirthday: undefined,
      spouseOccupation: "",
      weddingDate: undefined,

      // Skills & Interests
      skills: "",
      hobbies: "",
      sports: "",
      otherReligiousSecularTraining: "",

      // Certification & Signatures
      certifiedBy: "",
      signatureImageUrl: "",
      signatureByCertifiedImageUrl: "",

      // Relations (initially empty arrays)
      children: [],
      emergencyContacts: [],
      educationBackgrounds: [],
      ministryExperiences: [],
      ministrySkills: [],
      ministryRecords: [],
      awardsRecognitions: [],
      employmentRecords: [],
      seminarsConferences: [],
      caseReports: [],
    };
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionError, setSubmissionError] = useState<string | null>(null);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [createdMinisterId, setCreatedMinisterId] = useState<number | null>(
    null
  );

  // Handle cancel button click
  const handleCancel = async () => {
    if (isDialog && onClose) {
      onClose();
    } else {
      router.push("/");
    }
  };

  const scrollToCard = () => {
    // cardRef.current?.scrollIntoView({ behavior: 'smooth' })
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const handleNext = async () => {
    // Save progress with the NEXT step we're moving to

    const currentIndex = formSteps.findIndex(
      (step) => step.key === currentStep
    );

    if (currentIndex < formSteps.length) {
      const nextStep = formSteps[currentIndex + 1].key;

      setCurrentStep(nextStep);
      scrollToCard();
    }
  };

  const handleBack = () => {
    const currentIndex = formSteps.findIndex(
      (step) => step.key === currentStep
    );
    if (currentIndex > 0) {
      setCurrentStep(formSteps[currentIndex - 1].key);
    }
  };

  const updateMinister = (
    field: keyof Minister,
    value: string | boolean | Date
  ) => {
    setMinister((prev: Minister) => ({
      ...prev,
      [field]: value,
    }));
  };

  // Helper function to update minister data
  const updateMinisterData = (
    field: keyof Minister,
    value: string | boolean | Date | string[] | File | null
  ) => {
    setMinister((prev: Minister) => {
      const updatedMinister = { ...prev, [field]: value };
      return updatedMinister;
    });
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setSubmissionError(null);

    try {
      if (isEdit && initialData?.id) {
        // Update existing minister
        const result = await updateMinisterMutation.mutateAsync({
          id: initialData.id,
          data: formData,
        });

        if (result.success) {
          if (onSuccess) {
            onSuccess();
          } else if (isDialog && onClose) {
            onClose();
          } else {
            setCreatedMinisterId(initialData.id);
            setShowSuccessDialog(true);
          }
        }
      } else {
        // Create new minister
        const result = await createMinister.mutateAsync(formData);

        if (result.success && result.data) {
          if (onSuccess) {
            onSuccess();
          } else if (isDialog && onClose) {
            onClose();
          } else {
            setCreatedMinisterId(result.data.id || null);
            setShowSuccessDialog(true);
          }
        }
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      setSubmissionError(
        error instanceof Error
          ? error.message
          : `An error occurred while ${isEdit ? "updating" : "submitting"} the form. Please try again.`
      );
    } finally {
      setIsSubmitting(false);
    }
  };
  const renderCurrentStep = () => {
    const StepComponent = formComponents[currentStep];

    if (!StepComponent) {
      return <div>Step component not implemented yet.</div>;
    }

    const props = {
      [FormStep.PERSONAL_INFORMATION]: {
        formData,
        updateMinister,
        updateMinisterData,
        updateFormData: updateMinisterData,
        onNext: handleNext,
        onBack: () => {
          if (isDialog && onClose) {
            onClose();
          } else {
            router.push("/form");
          }
        },
        onCancel: handleCancel,
        error: submissionError,
        isSubmitting,
      },
      [FormStep.CONTACT_GOVERNMENT_INFO]: {
        formData,
        updateMinister,
        updateMinisterData,
        updateFormData: updateMinisterData,
        onNext: handleNext,
        onBack: handleBack,
        onCancel: handleCancel,
        error: submissionError,
        isSubmitting,
      },
      [FormStep.FAMILY_SPOUSE_INFORMATION]: {
        formData,
        updateMinister,
        updateMinisterData,
        updateFormData: updateMinisterData,
        onNext: handleNext,
        onBack: handleBack,
        onCancel: handleCancel,
        error: submissionError,
        isSubmitting,
      },
      [FormStep.EMERGENCY_CONTACTS_SKILLS]: {
        formData,
        updateMinister,
        updateMinisterData,
        updateFormData: updateMinisterData,
        onNext: handleNext,
        onBack: handleBack,
        onCancel: handleCancel,
        error: submissionError,
        isSubmitting,
      },
      [FormStep.EDUCATION_EMPLOYMENT]: {
        formData,
        updateMinister,
        updateMinisterData,
        updateFormData: updateMinisterData,
        onNext: handleNext,
        onBack: handleBack,
        onCancel: handleCancel,
        error: submissionError,
        isSubmitting,
      },
      [FormStep.MINISTRY_EXPERIENCE_SKILLS]: {
        formData,
        updateMinister,
        updateMinisterData,
        updateFormData: updateMinisterData,
        onNext: handleNext,
        onBack: handleBack,
        onCancel: handleCancel,
        error: submissionError,
        isSubmitting,
      },
      [FormStep.MINISTRY_RECORDS_AWARDS]: {
        formData,
        updateMinister,
        updateMinisterData,
        updateFormData: updateMinisterData,
        onNext: handleNext,
        onBack: handleBack,
        onCancel: handleCancel,
        error: submissionError,
        isSubmitting,
      },
      [FormStep.SEMINARS_CONFERENCES]: {
        formData,
        updateMinister,
        updateMinisterData,
        updateFormData: updateMinisterData,
        onNext: handleNext,
        onBack: handleBack,
        onCancel: handleCancel,
        error: submissionError,
        isSubmitting,
      },
      [FormStep.CERTIFICATION_SIGNATURES]: {
        formData,
        updateMinister,
        updateMinisterData,
        updateFormData: updateMinisterData,
        onNext: handleNext,
        onBack: handleBack,
        onCancel: handleCancel,
        error: submissionError,
        isSubmitting,
      },
      [FormStep.OVERVIEW]: {
        formData,
        updateMinister,
        updateMinisterData,
        updateFormData: updateMinisterData,
        onNext: handleSubmit,
        onBack: handleBack,
        onCancel: handleCancel,
        error: submissionError,
        isSubmitting,
      },
    }[currentStep];

    return <StepComponent {...(props as unknown as StepProps)} />;
  };

  return (
    <>
      <StepIndicator
        currentStep={Math.min(
          formSteps.findIndex((step) => step.key === currentStep) + 1,
          formSteps.length
        )}
        steps={formSteps.map((step) => step.label)}
      />
      <div ref={cardRef}>{renderCurrentStep()}</div>

      <SuccessDialog
        isOpen={showSuccessDialog}
        ministerId={createdMinisterId}
        ministerName={`${formData.firstName} ${formData.lastName}`}
        mode={mode}
        onClose={() => setShowSuccessDialog(false)}
      />
    </>
  );
}
