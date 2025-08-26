"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";

import type { Minister } from "../ministry-validation";

import { ContactGovernmentInfo } from "./steps/contact-government-info";
import { PersonalInformation } from "./steps/personal-information";
import { StepIndicator } from "./step-indicator";

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
] as const;

type FormStepComponents = {
  [FormStep.PERSONAL_INFORMATION]: React.ComponentType<StepComponentProps>;
  [FormStep.CONTACT_GOVERNMENT_INFO]: React.ComponentType<StepComponentProps>;
  [FormStep.FAMILY_SPOUSE_INFORMATION]: React.ComponentType<StepComponentProps>;
  [FormStep.EMERGENCY_CONTACTS_SKILLS]: React.ComponentType<StepComponentProps>;
  [FormStep.EDUCATION_EMPLOYMENT]: React.ComponentType<StepComponentProps>;
  [FormStep.MINISTRY_EXPERIENCE_SKILLS]: React.ComponentType<StepComponentProps>;
  [FormStep.MINISTRY_RECORDS_AWARDS]: React.ComponentType<StepComponentProps>;
  [FormStep.SEMINARS_CONFERENCES]: React.ComponentType<StepComponentProps>;
  [FormStep.CERTIFICATION_SIGNATURES]: React.ComponentType<StepComponentProps>;
};

// Note: Component imports would need to be added when components are created
const formComponents: Partial<FormStepComponents> = {
  [FormStep.PERSONAL_INFORMATION]: PersonalInformation,
  [FormStep.CONTACT_GOVERNMENT_INFO]: ContactGovernmentInfo,
};

type StepComponentProps = {
  formData: Minister;
  updateMinister: (
    field: keyof Minister,
    value?: string | Date | boolean | Minister
  ) => void;
  updateMinisterData: (
    field: keyof Minister,
    value: string | boolean | Date | string[] | File | null
  ) => void;
  onNext: (
    updatedMinister?: Minister,
    confirmation?: boolean
  ) => void | Promise<void>;
  onBack: () => void;
  onCancel: () => void;

  isSubmitting?: boolean;
  error?: string | null;
};

export function MinisterForm() {
  const router = useRouter();
  const cardRef = useRef<HTMLDivElement>(null);
  const [currentStep, setCurrentStep] = useState<FormStep>(
    FormStep.PERSONAL_INFORMATION
  );
  const [formData, setMinister] = useState<Minister>({
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
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionError, setSubmissionError] = useState<string | null>(null);

  // Handle cancel button click
  const handleCancel = async () => {
    router.push("/");
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
    try {
      setSubmissionError(null);
    } catch {
      setSubmissionError(
        "An error occurred while submitting the form. Please try again."
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
        onNext: handleNext,
        onBack: () => {
          router.push("/form");
        },
        onCancel: handleCancel,
        error: submissionError,
        isSubmitting,
      },
      [FormStep.CONTACT_GOVERNMENT_INFO]: {
        formData,
        updateMinister,
        updateMinisterData,
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
        onNext: handleSubmit,
        onBack: handleBack,
        onCancel: handleCancel,
        error: submissionError,
        isSubmitting,
      },
    }[currentStep];

    return <StepComponent {...(props as StepComponentProps)} />;
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
    </>
  );
}
