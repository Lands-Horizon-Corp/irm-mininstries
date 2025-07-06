"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import {
  Award,
  BookOpen,
  Briefcase,
  ChevronDown,
  Church,
  FileText,
  GraduationCap,
  Mail,
  Phone,
  Plus,
  Trash2,
  User,
  Users,
} from "lucide-react"
import { useFieldArray, useForm } from "react-hook-form"
import { toast } from "sonner"

import { memberSchema, type Member } from "@/lib/member-schema"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"

interface MemberFormProps {
  open: boolean
  onClose: () => void
  onSubmit: (data: Member) => Promise<void>
  initialData?: Partial<Member> | null
  isLoading?: boolean
  ministrySkillsOptions: { id: number; name: string }[]
  ministryRanksOptions: { id: number; name: string }[]
}

export default function MemberForm({
  open,
  onClose,
  onSubmit,
  initialData,
  isLoading = false,
  ministrySkillsOptions,
}: MemberFormProps) {
  const [activeTab, setActiveTab] = useState("personal")
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    children: false,
    emergency: false,
    education: false,
    ministry: false,
    skills: false,
    records: false,
    awards: false,
    employment: false,
    seminars: false,
  })

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    control,
    watch,
    setValue, // Add setValue
  } = useForm<Member>({
    resolver: zodResolver(memberSchema),
    defaultValues: initialData || {},
  })

  // Field arrays
  const {
    fields: childrenFields,
    append: appendChild,
    remove: removeChild,
  } = useFieldArray({ control, name: "children" })

  const {
    fields: emergencyFields,
    append: appendEmergency,
    remove: removeEmergency,
  } = useFieldArray({ control, name: "emergencyContacts" })

  const {
    fields: educationFields,
    append: appendEducation,
    remove: removeEducation,
  } = useFieldArray({ control, name: "educationBackgrounds" })

  const {
    fields: ministryExperienceFields,
    append: appendMinistryExperience,
    remove: removeMinistryExperience,
  } = useFieldArray({ control, name: "ministryExperiences" })

  const {
    fields: ministrySkillFields,
    append: appendMinistrySkill,
    remove: removeMinistrySkill,
  } = useFieldArray({ control, name: "ministrySkills" })

  const {
    fields: ministryRecordFields,
    append: appendMinistryRecord,
    remove: removeMinistryRecord,
  } = useFieldArray({ control, name: "ministryRecords" })

  const {
    fields: awardFields,
    append: appendAward,
    remove: removeAward,
  } = useFieldArray({ control, name: "awardsRecognitions" })

  const {
    fields: employmentFields,
    append: appendEmployment,
    remove: removeEmployment,
  } = useFieldArray({ control, name: "employmentRecords" })

  const {
    fields: seminarFields,
    append: appendSeminar,
    remove: removeSeminar,
  } = useFieldArray({ control, name: "seminarsConferences" })

  useEffect(() => {
    if (initialData) {
      reset(initialData)
    } else {
      reset({})
    }
  }, [initialData, reset])

  const toggleSection = (section: string) => {
    setOpenSections(prev => ({ ...prev, [section]: !prev[section] }))
  }

  const FormField = ({
    label,
    id,
    error,
    children,
    required = false,
  }: {
    label: string
    id: string
    error?: import("react-hook-form").FieldError | undefined
    children: React.ReactNode
    required?: boolean
  }) => (
    <div className='space-y-2'>
      <Label htmlFor={id} className='text-sm font-medium'>
        {label} {required && <span className='text-red-500'>*</span>}
      </Label>
      {children}
      {error && <p className='text-red-500 text-xs'>{error.message}</p>}
    </div>
  )

  const DynamicSection = ({
    title,
    icon: Icon,
    sectionKey,
    children,
  }: {
    title: string
    icon: React.ElementType
    sectionKey: string
    children: React.ReactNode
  }) => (
    <Card className='w-full'>
      <Collapsible
        open={openSections[sectionKey]}
        onOpenChange={() => toggleSection(sectionKey)}
      >
        <CollapsibleTrigger asChild>
          <CardHeader className='cursor-pointer hover:bg-muted/50 transition-colors'>
            <CardTitle className='flex items-center gap-2 text-lg'>
              <Icon className='h-5 w-5' />
              {title}
              <ChevronDown
                className={`h-4 w-4 ml-auto transition-transform ${openSections[sectionKey] ? "rotate-180" : ""}`}
              />
            </CardTitle>
          </CardHeader>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <CardContent className='pt-0 space-y-4'>{children}</CardContent>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  )

  const onFormSubmit = async (data: Member) => {
    console.log("Form submitted with data:", data)
    console.log("Form errors:", errors)

    try {
      await onSubmit(data)
      toast.success(
        `Member ${initialData ? "updated" : "created"} successfully!`
      )
    } catch (error) {
      console.error("Form submission error:", error)
      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to save member. Please try again."
      )
    }
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className='max-w-full min-w-6xl h-[90vh] p-0 flex flex-col'>
        <DialogHeader className='px-6 py-4 border-b flex-shrink-0'>
          <DialogTitle className='flex items-center gap-2 text-xl'>
            <User className='h-6 w-6' />
            {initialData ? "Edit Member" : "Add New Member"}
          </DialogTitle>
        </DialogHeader>

        <form
          onSubmit={handleSubmit(onFormSubmit)}
          className='flex flex-col flex-1 min-h-0'
        >
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className='flex flex-col flex-1 min-h-0'
          >
            <div className='px-6 py-2 border-b flex-shrink-0'>
              <TabsList className='grid w-full grid-cols-5'>
                <TabsTrigger
                  value='personal'
                  className='flex items-center gap-2'
                >
                  <User className='h-4 w-4' />
                  Personal
                </TabsTrigger>
                <TabsTrigger value='family' className='flex items-center gap-2'>
                  <Users className='h-4 w-4' />
                  Family
                </TabsTrigger>
                <TabsTrigger
                  value='education'
                  className='flex items-center gap-2'
                >
                  <GraduationCap className='h-4 w-4' />
                  Education
                </TabsTrigger>
                <TabsTrigger
                  value='ministry'
                  className='flex items-center gap-2'
                >
                  <Church className='h-4 w-4' />
                  Ministry
                </TabsTrigger>
                <TabsTrigger
                  value='additional'
                  className='flex items-center gap-2'
                >
                  <FileText className='h-4 w-4' />
                  Additional
                </TabsTrigger>
              </TabsList>
            </div>

            <div className='flex-1 min-h-0 overflow-hidden'>
              <ScrollArea className='h-full'>
                <div className='px-6 py-6 space-y-6'>
                  {/* Personal Information Tab */}
                  <TabsContent value='personal' className='mt-0 space-y-6'>
                    <Card>
                      <CardHeader>
                        <CardTitle className='flex items-center gap-2'>
                          <User className='h-5 w-5' />
                          Basic Information
                        </CardTitle>
                        <CardDescription>
                          Enter the member&apos;s personal details and contact
                          information.
                        </CardDescription>
                      </CardHeader>
                      <CardContent className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
                        <FormField
                          label='First Name'
                          id='firstName'
                          error={errors.firstName}
                          required
                        >
                          <Input
                            id='firstName'
                            autoComplete='given-name'
                            {...register("firstName")}
                            disabled={isLoading}
                            placeholder='Enter first name'
                          />
                        </FormField>

                        <FormField
                          label='Last Name'
                          id='lastName'
                          error={errors.lastName}
                          required
                        >
                          <Input
                            id='lastName'
                            autoComplete='family-name'
                            {...register("lastName")}
                            disabled={isLoading}
                            placeholder='Enter last name'
                          />
                        </FormField>

                        <FormField label='Middle Name' id='middleName'>
                          <Input
                            id='middleName'
                            autoComplete='additional-name'
                            {...register("middleName")}
                            disabled={isLoading}
                            placeholder='Enter middle name'
                          />
                        </FormField>

                        <FormField label='Suffix' id='suffix'>
                          <Input
                            id='suffix'
                            autoComplete='honorific-suffix'
                            {...register("suffix")}
                            disabled={isLoading}
                            placeholder='Jr., Sr., III, etc.'
                          />
                        </FormField>

                        <FormField label='Nickname' id='nickname'>
                          <Input
                            id='nickname'
                            autoComplete='nickname'
                            {...register("nickname")}
                            disabled={isLoading}
                            placeholder='Enter nickname'
                          />
                        </FormField>

                        <FormField
                          label='Date of Birth'
                          id='dateOfBirth'
                          required
                        >
                          <Input
                            id='dateOfBirth'
                            autoComplete='bday'
                            type='date'
                            {...register("dateOfBirth")}
                            disabled={isLoading}
                          />
                        </FormField>

                        <FormField
                          label='Place of Birth'
                          id='placeOfBirth'
                          required
                        >
                          <Input
                            id='placeOfBirth'
                            autoComplete='birthplace'
                            {...register("placeOfBirth")}
                            disabled={isLoading}
                            placeholder='Enter place of birth'
                          />
                        </FormField>

                        <FormField
                          label='Gender'
                          id='gender'
                          error={errors.gender}
                          required
                        >
                          <Select
                            value={watch("gender") || ""}
                            onValueChange={val =>
                              setValue("gender", val as Member["gender"])
                            }
                            disabled={isLoading}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder='Select gender' />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value='male'>Male</SelectItem>
                              <SelectItem value='female'>Female</SelectItem>
                            </SelectContent>
                          </Select>
                        </FormField>

                        <FormField
                          label='Civil Status'
                          id='civilStatus'
                          error={errors.civilStatus}
                          required
                        >
                          <Select
                            value={watch("civilStatus") || ""}
                            onValueChange={val =>
                              setValue(
                                "civilStatus",
                                val as Member["civilStatus"]
                              )
                            }
                            disabled={isLoading}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder='Select civil status' />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value='single'>Single</SelectItem>
                              <SelectItem value='married'>Married</SelectItem>
                              <SelectItem value='widowed'>Widowed</SelectItem>
                              <SelectItem value='separated'>
                                Separated
                              </SelectItem>
                              <SelectItem value='divorced'>Divorced</SelectItem>
                            </SelectContent>
                          </Select>
                        </FormField>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle className='flex items-center gap-2'>
                          <Mail className='h-5 w-5' />
                          Contact Information
                        </CardTitle>
                      </CardHeader>
                      <CardContent className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                        <FormField label='Email Address' id='email'>
                          <Input
                            id='email'
                            autoComplete='email'
                            type='email'
                            {...register("email")}
                            disabled={isLoading}
                            placeholder='Enter email address'
                          />
                        </FormField>

                        <FormField label='Telephone' id='telephone'>
                          <Input
                            id='telephone'
                            autoComplete='tel'
                            {...register("telephone")}
                            disabled={isLoading}
                            placeholder='Enter telephone number'
                          />
                        </FormField>

                        <FormField
                          label='Present Address'
                          id='presentAddress'
                          required
                        >
                          <Textarea
                            id='presentAddress'
                            autoComplete='street-address'
                            {...register("presentAddress")}
                            disabled={isLoading}
                            placeholder='Enter present address'
                            rows={2}
                          />
                        </FormField>

                        <FormField
                          label='Permanent Address'
                          id='permanentAddress'
                        >
                          <Textarea
                            id='permanentAddress'
                            autoComplete='street-address'
                            {...register("permanentAddress")}
                            disabled={isLoading}
                            placeholder='Enter permanent address'
                            rows={2}
                          />
                        </FormField>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle>Physical Details & IDs</CardTitle>
                      </CardHeader>
                      <CardContent className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
                        <FormField label='Height (ft)' id='heightFeet' required>
                          <Input
                            id='heightFeet'
                            autoComplete='off'
                            {...register("heightFeet")}
                            disabled={isLoading}
                            placeholder='e.g., 5.6'
                          />
                        </FormField>

                        <FormField label='Weight (kg)' id='weightKg' required>
                          <Input
                            id='weightKg'
                            autoComplete='off'
                            {...register("weightKg")}
                            disabled={isLoading}
                            placeholder='e.g., 70'
                          />
                        </FormField>

                        <FormField label='Passport Number' id='passportNumber'>
                          <Input
                            id='passportNumber'
                            autoComplete='passport-number'
                            {...register("passportNumber")}
                            disabled={isLoading}
                            placeholder='Enter passport number'
                          />
                        </FormField>

                        <FormField label='SSS Number' id='sssNumber'>
                          <Input
                            id='sssNumber'
                            autoComplete='off'
                            {...register("sssNumber")}
                            disabled={isLoading}
                            placeholder='Enter SSS number'
                          />
                        </FormField>

                        <FormField label='PhilHealth' id='philhealth'>
                          <Input
                            id='philhealth'
                            autoComplete='off'
                            {...register("philhealth")}
                            disabled={isLoading}
                            placeholder='Enter PhilHealth number'
                          />
                        </FormField>

                        <FormField label='TIN' id='tin'>
                          <Input
                            id='tin'
                            autoComplete='off'
                            {...register("tin")}
                            disabled={isLoading}
                            placeholder='Enter TIN'
                          />
                        </FormField>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  {/* Family Information Tab */}
                  <TabsContent value='family' className='mt-0 space-y-6'>
                    <Card>
                      <CardHeader>
                        <CardTitle className='flex items-center gap-2'>
                          <Users className='h-5 w-5' />
                          Parents Information
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
                          <div className='space-y-4'>
                            <h4 className='font-medium text-sm text-muted-foreground uppercase tracking-wide'>
                              Father&apos;s Information
                            </h4>
                            <div className='space-y-4'>
                              <FormField
                                label="Father's Name"
                                id='fatherName'
                                required
                              >
                                <Input
                                  id='fatherName'
                                  {...register("fatherName")}
                                  disabled={isLoading}
                                  placeholder="Enter father's full name"
                                />
                              </FormField>
                              <FormField
                                label="Father's Province"
                                id='fatherProvince'
                                required
                              >
                                <Input
                                  id='fatherProvince'
                                  {...register("fatherProvince")}
                                  disabled={isLoading}
                                  placeholder="Enter father's province"
                                />
                              </FormField>
                              <FormField
                                label="Father's Birthday"
                                id='fatherBirthday'
                                required
                              >
                                <Input
                                  id='fatherBirthday'
                                  type='date'
                                  {...register("fatherBirthday")}
                                  disabled={isLoading}
                                />
                              </FormField>
                              <FormField
                                label="Father's Occupation"
                                id='fatherOccupation'
                                required
                              >
                                <Input
                                  id='fatherOccupation'
                                  {...register("fatherOccupation")}
                                  disabled={isLoading}
                                  placeholder="Enter father's occupation"
                                />
                              </FormField>
                            </div>
                          </div>

                          <div className='space-y-4'>
                            <h4 className='font-medium text-sm text-muted-foreground uppercase tracking-wide'>
                              Mother&apos;s Information
                            </h4>
                            <div className='space-y-4'>
                              <FormField
                                label="Mother's Name"
                                id='motherName'
                                required
                              >
                                <Input
                                  id='motherName'
                                  {...register("motherName")}
                                  disabled={isLoading}
                                  placeholder="Enter mother's full name"
                                />
                              </FormField>
                              <FormField
                                label="Mother's Province"
                                id='motherProvince'
                                required
                              >
                                <Input
                                  id='motherProvince'
                                  {...register("motherProvince")}
                                  disabled={isLoading}
                                  placeholder="Enter mother's province"
                                />
                              </FormField>
                              <FormField
                                label="Mother's Birthday"
                                id='motherBirthday'
                                required
                              >
                                <Input
                                  id='motherBirthday'
                                  type='date'
                                  {...register("motherBirthday")}
                                  disabled={isLoading}
                                />
                              </FormField>
                              <FormField
                                label="Mother's Occupation"
                                id='motherOccupation'
                                required
                              >
                                <Input
                                  id='motherOccupation'
                                  {...register("motherOccupation")}
                                  disabled={isLoading}
                                  placeholder="Enter mother's occupation"
                                />
                              </FormField>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle>Spouse Information</CardTitle>
                      </CardHeader>
                      <CardContent className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                        <FormField label='Spouse Name' id='spouseName'>
                          <Input
                            id='spouseName'
                            {...register("spouseName")}
                            disabled={isLoading}
                            placeholder="Enter spouse's full name"
                          />
                        </FormField>
                        <FormField label='Spouse Province' id='spouseProvince'>
                          <Input
                            id='spouseProvince'
                            {...register("spouseProvince")}
                            disabled={isLoading}
                            placeholder="Enter spouse's province"
                          />
                        </FormField>
                        <FormField label='Spouse Birthday' id='spouseBirthday'>
                          <Input
                            id='spouseBirthday'
                            type='date'
                            {...register("spouseBirthday")}
                            disabled={isLoading}
                          />
                        </FormField>
                        <FormField
                          label='Spouse Occupation'
                          id='spouseOccupation'
                        >
                          <Input
                            id='spouseOccupation'
                            {...register("spouseOccupation")}
                            disabled={isLoading}
                            placeholder="Enter spouse's occupation"
                          />
                        </FormField>
                        <FormField label='Wedding Date' id='weddingDate'>
                          <Input
                            id='weddingDate'
                            type='date'
                            {...register("weddingDate")}
                            disabled={isLoading}
                          />
                        </FormField>
                      </CardContent>
                    </Card>

                    {/* Children Section */}
                    <DynamicSection
                      title='Children'
                      icon={Users}
                      sectionKey='children'
                    >
                      <div className='space-y-4'>
                        {childrenFields.map((field, idx) => (
                          <Card key={field.id} className='p-4'>
                            <div className='flex items-center justify-between mb-4'>
                              <Badge variant='secondary'>Child {idx + 1}</Badge>
                              <Button
                                type='button'
                                variant='ghost'
                                size='sm'
                                onClick={() => removeChild(idx)}
                                disabled={isLoading}
                              >
                                <Trash2 className='h-4 w-4' />
                              </Button>
                            </div>
                            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                              <FormField
                                label='Name'
                                id={`children.${idx}.name`}
                              >
                                <Input
                                  placeholder="Enter child's name"
                                  {...register(`children.${idx}.name`)}
                                  disabled={isLoading}
                                />
                              </FormField>
                              <FormField
                                label='Place of Birth'
                                id={`children.${idx}.placeOfBirth`}
                              >
                                <Input
                                  placeholder='Enter place of birth'
                                  {...register(`children.${idx}.placeOfBirth`)}
                                  disabled={isLoading}
                                />
                              </FormField>
                              <FormField
                                label='Date of Birth'
                                id={`children.${idx}.dateOfBirth`}
                              >
                                <Input
                                  type='date'
                                  {...register(`children.${idx}.dateOfBirth`)}
                                  disabled={isLoading}
                                />
                              </FormField>
                            </div>
                          </Card>
                        ))}
                        <Button
                          type='button'
                          variant='outline'
                          onClick={() =>
                            appendChild({
                              name: "",
                              placeOfBirth: "",
                              dateOfBirth: new Date(),
                              gender: "male",
                            })
                          }
                          disabled={isLoading}
                          className='w-full'
                        >
                          <Plus className='h-4 w-4 mr-2' />
                          Add Child
                        </Button>
                      </div>
                    </DynamicSection>

                    {/* Emergency Contacts Section */}
                    <DynamicSection
                      title='Emergency Contacts'
                      icon={Phone}
                      sectionKey='emergency'
                    >
                      <div className='space-y-4'>
                        {emergencyFields.map((field, idx) => (
                          <Card key={field.id} className='p-4'>
                            <div className='flex items-center justify-between mb-4'>
                              <Badge variant='secondary'>
                                Contact {idx + 1}
                              </Badge>
                              <Button
                                type='button'
                                variant='ghost'
                                size='sm'
                                onClick={() => removeEmergency(idx)}
                                disabled={isLoading}
                              >
                                <Trash2 className='h-4 w-4' />
                              </Button>
                            </div>
                            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                              <FormField
                                label='Name'
                                id={`emergencyContacts.${idx}.name`}
                              >
                                <Input
                                  placeholder='Enter contact name'
                                  {...register(`emergencyContacts.${idx}.name`)}
                                  disabled={isLoading}
                                />
                              </FormField>
                              <FormField
                                label='Relationship'
                                id={`emergencyContacts.${idx}.relationship`}
                              >
                                <Input
                                  placeholder='e.g., Brother, Sister, Friend'
                                  {...register(
                                    `emergencyContacts.${idx}.relationship`
                                  )}
                                  disabled={isLoading}
                                />
                              </FormField>
                              <FormField
                                label='Address'
                                id={`emergencyContacts.${idx}.address`}
                              >
                                <Input
                                  placeholder='Enter address'
                                  {...register(
                                    `emergencyContacts.${idx}.address`
                                  )}
                                  disabled={isLoading}
                                />
                              </FormField>
                              <FormField
                                label='Contact Number'
                                id={`emergencyContacts.${idx}.contactNumber`}
                              >
                                <Input
                                  placeholder='Enter phone number'
                                  {...register(
                                    `emergencyContacts.${idx}.contactNumber`
                                  )}
                                  disabled={isLoading}
                                />
                              </FormField>
                            </div>
                          </Card>
                        ))}
                        <Button
                          type='button'
                          variant='outline'
                          onClick={() =>
                            appendEmergency({
                              name: "",
                              relationship: "",
                              address: "",
                              contactNumber: "",
                            })
                          }
                          disabled={isLoading}
                          className='w-full'
                        >
                          <Plus className='h-4 w-4 mr-2' />
                          Add Emergency Contact
                        </Button>
                      </div>
                    </DynamicSection>
                  </TabsContent>

                  {/* Education Tab */}
                  <TabsContent value='education' className='mt-0 space-y-6'>
                    <DynamicSection
                      title='Education Background'
                      icon={GraduationCap}
                      sectionKey='education'
                    >
                      <div className='space-y-4'>
                        {educationFields.map((field, idx) => (
                          <Card key={field.id} className='p-4'>
                            <div className='flex items-center justify-between mb-4'>
                              <Badge variant='secondary'>
                                Education {idx + 1}
                              </Badge>
                              <Button
                                type='button'
                                variant='ghost'
                                size='sm'
                                onClick={() => removeEducation(idx)}
                                disabled={isLoading}
                              >
                                <Trash2 className='h-4 w-4' />
                              </Button>
                            </div>
                            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                              <FormField
                                label='School Name'
                                id={`educationBackgrounds.${idx}.schoolName`}
                              >
                                <Input
                                  placeholder='Enter school name'
                                  {...register(
                                    `educationBackgrounds.${idx}.schoolName`
                                  )}
                                  disabled={isLoading}
                                />
                              </FormField>
                              <FormField
                                label='Educational Attainment'
                                id={`educationBackgrounds.${idx}.educationalAttainment`}
                              >
                                <Input
                                  placeholder="e.g., Bachelor's Degree, Master's"
                                  {...register(
                                    `educationBackgrounds.${idx}.educationalAttainment`
                                  )}
                                  disabled={isLoading}
                                />
                              </FormField>
                              <FormField
                                label='Course'
                                id={`educationBackgrounds.${idx}.course`}
                              >
                                <Input
                                  placeholder='Enter course/program'
                                  {...register(
                                    `educationBackgrounds.${idx}.course`
                                  )}
                                  disabled={isLoading}
                                />
                              </FormField>
                              <FormField
                                label='Date Graduated'
                                id={`educationBackgrounds.${idx}.dateGraduated`}
                              >
                                <Input
                                  type='date'
                                  {...register(
                                    `educationBackgrounds.${idx}.dateGraduated`
                                  )}
                                  disabled={isLoading}
                                />
                              </FormField>
                              <div className='md:col-span-2'>
                                <FormField
                                  label='Description'
                                  id={`educationBackgrounds.${idx}.description`}
                                >
                                  <Textarea
                                    placeholder='Additional details about education'
                                    {...register(
                                      `educationBackgrounds.${idx}.description`
                                    )}
                                    disabled={isLoading}
                                    rows={2}
                                  />
                                </FormField>
                              </div>
                            </div>
                          </Card>
                        ))}
                        <Button
                          type='button'
                          variant='outline'
                          onClick={() =>
                            appendEducation({
                              schoolName: "",
                              educationalAttainment: "",
                              dateGraduated: new Date(),
                              description: "",
                              course: "",
                            })
                          }
                          disabled={isLoading}
                          className='w-full'
                        >
                          <Plus className='h-4 w-4 mr-2' />
                          Add Education
                        </Button>
                      </div>
                    </DynamicSection>

                    <DynamicSection
                      title='Employment Records'
                      icon={Briefcase}
                      sectionKey='employment'
                    >
                      <div className='space-y-4'>
                        {employmentFields.map((field, idx) => (
                          <Card key={field.id} className='p-4'>
                            <div className='flex items-center justify-between mb-4'>
                              <Badge variant='secondary'>
                                Employment {idx + 1}
                              </Badge>
                              <Button
                                type='button'
                                variant='ghost'
                                size='sm'
                                onClick={() => removeEmployment(idx)}
                                disabled={isLoading}
                              >
                                <Trash2 className='h-4 w-4' />
                              </Button>
                            </div>
                            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                              <FormField
                                label='Company Name'
                                id={`employmentRecords.${idx}.companyName`}
                              >
                                <Input
                                  placeholder='Enter company name'
                                  {...register(
                                    `employmentRecords.${idx}.companyName`
                                  )}
                                  disabled={isLoading}
                                />
                              </FormField>
                              <FormField
                                label='Position'
                                id={`employmentRecords.${idx}.position`}
                              >
                                <Input
                                  placeholder='Enter job position'
                                  {...register(
                                    `employmentRecords.${idx}.position`
                                  )}
                                  disabled={isLoading}
                                />
                              </FormField>
                              <FormField
                                label='From Year'
                                id={`employmentRecords.${idx}.fromYear`}
                              >
                                <Input
                                  placeholder='e.g., 2020'
                                  {...register(
                                    `employmentRecords.${idx}.fromYear`
                                  )}
                                  disabled={isLoading}
                                />
                              </FormField>
                              <FormField
                                label='To Year'
                                id={`employmentRecords.${idx}.toYear`}
                              >
                                <Input
                                  placeholder='e.g., 2023 or Present'
                                  {...register(
                                    `employmentRecords.${idx}.toYear`
                                  )}
                                  disabled={isLoading}
                                />
                              </FormField>
                            </div>
                          </Card>
                        ))}
                        <Button
                          type='button'
                          variant='outline'
                          onClick={() =>
                            appendEmployment({
                              companyName: "",
                              fromYear: "",
                              toYear: "",
                              position: "",
                            })
                          }
                          disabled={isLoading}
                          className='w-full'
                        >
                          <Plus className='h-4 w-4 mr-2' />
                          Add Employment
                        </Button>
                      </div>
                    </DynamicSection>

                    <DynamicSection
                      title='Seminars & Conferences'
                      icon={BookOpen}
                      sectionKey='seminars'
                    >
                      <div className='space-y-4'>
                        {seminarFields.map((field, idx) => (
                          <Card key={field.id} className='p-4'>
                            <div className='flex items-center justify-between mb-4'>
                              <Badge variant='secondary'>
                                Seminar {idx + 1}
                              </Badge>
                              <Button
                                type='button'
                                variant='ghost'
                                size='sm'
                                onClick={() => removeSeminar(idx)}
                                disabled={isLoading}
                              >
                                <Trash2 className='h-4 w-4' />
                              </Button>
                            </div>
                            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                              <FormField
                                label='Title'
                                id={`seminarsConferences.${idx}.title`}
                              >
                                <Input
                                  placeholder='Enter seminar/conference title'
                                  {...register(
                                    `seminarsConferences.${idx}.title`
                                  )}
                                  disabled={isLoading}
                                />
                              </FormField>
                              <FormField
                                label='Year'
                                id={`seminarsConferences.${idx}.year`}
                              >
                                <Input
                                  placeholder='e.g., 2023'
                                  {...register(
                                    `seminarsConferences.${idx}.year`
                                  )}
                                  disabled={isLoading}
                                />
                              </FormField>
                              <FormField
                                label='Number of Hours'
                                id={`seminarsConferences.${idx}.numberOfHours`}
                              >
                                <Input
                                  type='number'
                                  placeholder='e.g., 8'
                                  {...register(
                                    `seminarsConferences.${idx}.numberOfHours`
                                  )}
                                  disabled={isLoading}
                                />
                              </FormField>
                              <FormField
                                label='Place'
                                id={`seminarsConferences.${idx}.place`}
                              >
                                <Input
                                  placeholder='Enter venue/location'
                                  {...register(
                                    `seminarsConferences.${idx}.place`
                                  )}
                                  disabled={isLoading}
                                />
                              </FormField>
                              <div className='md:col-span-2'>
                                <FormField
                                  label='Description'
                                  id={`seminarsConferences.${idx}.description`}
                                >
                                  <Textarea
                                    placeholder='Additional details about the seminar'
                                    {...register(
                                      `seminarsConferences.${idx}.description`
                                    )}
                                    disabled={isLoading}
                                    rows={2}
                                  />
                                </FormField>
                              </div>
                            </div>
                          </Card>
                        ))}
                        <Button
                          type='button'
                          variant='outline'
                          onClick={() =>
                            appendSeminar({
                              title: "",
                              year: "",
                              numberOfHours: 0,
                              place: "",
                              description: "",
                            })
                          }
                          disabled={isLoading}
                          className='w-full'
                        >
                          <Plus className='h-4 w-4 mr-2' />
                          Add Seminar/Conference
                        </Button>
                      </div>
                    </DynamicSection>
                  </TabsContent>

                  {/* Ministry Tab */}
                  <TabsContent value='ministry' className='mt-0 space-y-6'>
                    <DynamicSection
                      title='Ministry Experiences'
                      icon={Church}
                      sectionKey='ministry'
                    >
                      <div className='space-y-4'>
                        {ministryExperienceFields.map((field, idx) => (
                          <Card key={field.id} className='p-4'>
                            <div className='flex items-center justify-between mb-4'>
                              <Badge variant='secondary'>
                                Experience {idx + 1}
                              </Badge>
                              <Button
                                type='button'
                                variant='ghost'
                                size='sm'
                                onClick={() => removeMinistryExperience(idx)}
                                disabled={isLoading}
                              >
                                <Trash2 className='h-4 w-4' />
                              </Button>
                            </div>
                            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                              <FormField
                                label='Title'
                                id={`ministryExperiences.${idx}.title`}
                              >
                                <Input
                                  placeholder='Enter ministry title/position'
                                  {...register(
                                    `ministryExperiences.${idx}.title`
                                  )}
                                  disabled={isLoading}
                                />
                              </FormField>
                              <div className='grid grid-cols-2 gap-2'>
                                <FormField
                                  label='From Year'
                                  id={`ministryExperiences.${idx}.fromYear`}
                                >
                                  <Input
                                    placeholder='e.g., 2020'
                                    {...register(
                                      `ministryExperiences.${idx}.fromYear`
                                    )}
                                    disabled={isLoading}
                                  />
                                </FormField>
                                <FormField
                                  label='To Year'
                                  id={`ministryExperiences.${idx}.toYear`}
                                >
                                  <Input
                                    placeholder='e.g., 2023'
                                    {...register(
                                      `ministryExperiences.${idx}.toYear`
                                    )}
                                    disabled={isLoading}
                                  />
                                </FormField>
                              </div>
                              <div className='md:col-span-2'>
                                <FormField
                                  label='Description'
                                  id={`ministryExperiences.${idx}.description`}
                                >
                                  <Textarea
                                    placeholder='Describe the ministry experience'
                                    {...register(
                                      `ministryExperiences.${idx}.description`
                                    )}
                                    disabled={isLoading}
                                    rows={2}
                                  />
                                </FormField>
                              </div>
                            </div>
                          </Card>
                        ))}
                        <Button
                          type='button'
                          variant='outline'
                          onClick={() =>
                            appendMinistryExperience({
                              title: "",
                              fromYear: "",
                              toYear: "",
                              description: "",
                            })
                          }
                          disabled={isLoading}
                          className='w-full'
                        >
                          <Plus className='h-4 w-4 mr-2' />
                          Add Ministry Experience
                        </Button>
                      </div>
                    </DynamicSection>

                    <DynamicSection
                      title='Ministry Skills'
                      icon={Award}
                      sectionKey='skills'
                    >
                      <div className='space-y-4'>
                        {ministrySkillFields.map((field, idx) => (
                          <Card key={field.id} className='p-4'>
                            <div className='flex items-center justify-between mb-4'>
                              <Badge variant='secondary'>Skill {idx + 1}</Badge>
                              <Button
                                type='button'
                                variant='ghost'
                                size='sm'
                                onClick={() => removeMinistrySkill(idx)}
                                disabled={isLoading}
                              >
                                <Trash2 className='h-4 w-4' />
                              </Button>
                            </div>
                            <FormField
                              label='Ministry Skill'
                              id={`ministrySkills.${idx}.ministrySkillId`}
                            >
                              <Select
                                value={
                                  watch(
                                    `ministrySkills.${idx}.ministrySkillId`
                                  )?.toString() || ""
                                }
                                onValueChange={val => {
                                  setValue(
                                    `ministrySkills.${idx}.ministrySkillId`,
                                    Number(val)
                                  )
                                }}
                                disabled={isLoading}
                              >
                                <SelectTrigger>
                                  <SelectValue placeholder='Select a skill' />
                                </SelectTrigger>
                                <SelectContent>
                                  {ministrySkillsOptions.map(opt => (
                                    <SelectItem
                                      key={opt.id}
                                      value={opt.id.toString()}
                                    >
                                      {opt.name}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </FormField>
                          </Card>
                        ))}
                        <Button
                          type='button'
                          variant='outline'
                          onClick={() =>
                            appendMinistrySkill({
                              ministrySkillId:
                                ministrySkillsOptions[0]?.id || 0,
                            })
                          }
                          disabled={isLoading}
                          className='w-full'
                        >
                          <Plus className='h-4 w-4 mr-2' />
                          Add Ministry Skill
                        </Button>
                      </div>
                    </DynamicSection>

                    <DynamicSection
                      title='Ministry Records'
                      icon={FileText}
                      sectionKey='records'
                    >
                      <div className='space-y-4'>
                        {ministryRecordFields.map((field, idx) => (
                          <Card key={field.id} className='p-4'>
                            <div className='flex items-center justify-between mb-4'>
                              <Badge variant='secondary'>
                                Record {idx + 1}
                              </Badge>
                              <Button
                                type='button'
                                variant='ghost'
                                size='sm'
                                onClick={() => removeMinistryRecord(idx)}
                                disabled={isLoading}
                              >
                                <Trash2 className='h-4 w-4' />
                              </Button>
                            </div>
                            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                              <FormField
                                label='Church Location ID'
                                id={`ministryRecords.${idx}.churchLocationId`}
                              >
                                <Input
                                  placeholder='Enter church location ID'
                                  {...register(
                                    `ministryRecords.${idx}.churchLocationId`
                                  )}
                                  disabled={isLoading}
                                />
                              </FormField>
                              <div className='grid grid-cols-2 gap-2'>
                                <FormField
                                  label='From Year'
                                  id={`ministryRecords.${idx}.fromYear`}
                                >
                                  <Input
                                    placeholder='e.g., 2020'
                                    {...register(
                                      `ministryRecords.${idx}.fromYear`
                                    )}
                                    disabled={isLoading}
                                  />
                                </FormField>
                                <FormField
                                  label='To Year'
                                  id={`ministryRecords.${idx}.toYear`}
                                >
                                  <Input
                                    placeholder='e.g., 2023'
                                    {...register(
                                      `ministryRecords.${idx}.toYear`
                                    )}
                                    disabled={isLoading}
                                  />
                                </FormField>
                              </div>
                              <div className='md:col-span-2'>
                                <FormField
                                  label='Contribution'
                                  id={`ministryRecords.${idx}.contribution`}
                                >
                                  <Textarea
                                    placeholder='Describe contributions made'
                                    {...register(
                                      `ministryRecords.${idx}.contribution`
                                    )}
                                    disabled={isLoading}
                                    rows={2}
                                  />
                                </FormField>
                              </div>
                            </div>
                          </Card>
                        ))}
                        <Button
                          type='button'
                          variant='outline'
                          onClick={() =>
                            appendMinistryRecord({
                              churchLocationId: 0,
                              fromYear: "",
                              toYear: "",
                              contribution: "",
                            })
                          }
                          disabled={isLoading}
                          className='w-full'
                        >
                          <Plus className='h-4 w-4 mr-2' />
                          Add Ministry Record
                        </Button>
                      </div>
                    </DynamicSection>
                  </TabsContent>

                  {/* Additional Information Tab */}
                  <TabsContent value='additional' className='mt-0 space-y-6'>
                    <Card>
                      <CardHeader>
                        <CardTitle>Personal Interests & Skills</CardTitle>
                      </CardHeader>
                      <CardContent className='space-y-4'>
                        <FormField label='Skills' id='skills'>
                          <Textarea
                            id='skills'
                            {...register("skills")}
                            disabled={isLoading}
                            placeholder='List your skills and abilities'
                            rows={3}
                          />
                        </FormField>
                        <FormField label='Hobbies' id='hobbies'>
                          <Textarea
                            id='hobbies'
                            {...register("hobbies")}
                            disabled={isLoading}
                            placeholder='List your hobbies and interests'
                            rows={3}
                          />
                        </FormField>
                        <FormField label='Sports' id='sports'>
                          <Textarea
                            id='sports'
                            {...register("sports")}
                            disabled={isLoading}
                            placeholder='List sports you play or follow'
                            rows={2}
                          />
                        </FormField>
                      </CardContent>
                    </Card>

                    <DynamicSection
                      title='Awards & Recognitions'
                      icon={Award}
                      sectionKey='awards'
                    >
                      <div className='space-y-4'>
                        {awardFields.map((field, idx) => (
                          <Card key={field.id} className='p-4'>
                            <div className='flex items-center justify-between mb-4'>
                              <Badge variant='secondary'>Award {idx + 1}</Badge>
                              <Button
                                type='button'
                                variant='ghost'
                                size='sm'
                                onClick={() => removeAward(idx)}
                                disabled={isLoading}
                              >
                                <Trash2 className='h-4 w-4' />
                              </Button>
                            </div>
                            <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
                              <FormField
                                label='Year'
                                id={`awardsRecognitions.${idx}.year`}
                              >
                                <Input
                                  placeholder='e.g., 2023'
                                  {...register(
                                    `awardsRecognitions.${idx}.year`
                                  )}
                                  disabled={isLoading}
                                />
                              </FormField>
                              <div className='md:col-span-2'>
                                <FormField
                                  label='Description'
                                  id={`awardsRecognitions.${idx}.description`}
                                >
                                  <Input
                                    placeholder='Describe the award or recognition'
                                    {...register(
                                      `awardsRecognitions.${idx}.description`
                                    )}
                                    disabled={isLoading}
                                  />
                                </FormField>
                              </div>
                            </div>
                          </Card>
                        ))}
                        <Button
                          type='button'
                          variant='outline'
                          onClick={() =>
                            appendAward({ year: "", description: "" })
                          }
                          disabled={isLoading}
                          className='w-full'
                        >
                          <Plus className='h-4 w-4 mr-2' />
                          Add Award
                        </Button>
                      </div>
                    </DynamicSection>

                    <Card>
                      <CardHeader>
                        <CardTitle>
                          Additional Training & Certification
                        </CardTitle>
                      </CardHeader>
                      <CardContent className='space-y-4'>
                        <FormField
                          label='Other Religious/Secular Training'
                          id='otherReligiousSecularTraining'
                        >
                          <Textarea
                            id='otherReligiousSecularTraining'
                            {...register("otherReligiousSecularTraining")}
                            disabled={isLoading}
                            placeholder='Describe any additional training or certifications'
                            rows={4}
                          />
                        </FormField>
                        <FormField label='Certified By' id='certifiedBy'>
                          <Input
                            id='certifiedBy'
                            {...register("certifiedBy")}
                            disabled={isLoading}
                            placeholder='Enter certifying authority'
                          />
                        </FormField>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle>Images & Signatures</CardTitle>
                      </CardHeader>
                      <CardContent className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                        <FormField label='Profile Image URL' id='imageUrl'>
                          <Input
                            id='imageUrl'
                            {...register("imageUrl")}
                            disabled={isLoading}
                            placeholder='Enter profile image URL'
                          />
                        </FormField>
                        <FormField
                          label='Signature Image URL'
                          id='signatureImageUrl'
                        >
                          <Input
                            id='signatureImageUrl'
                            {...register("signatureImageUrl")}
                            disabled={isLoading}
                            placeholder='Enter signature image URL'
                          />
                        </FormField>
                        <FormField
                          label='Certified Signature Image URL'
                          id='signatureByCertifiedImageUrl'
                        >
                          <Input
                            id='signatureByCertifiedImageUrl'
                            {...register("signatureByCertifiedImageUrl")}
                            disabled={isLoading}
                            placeholder='Enter certified signature image URL'
                          />
                        </FormField>
                      </CardContent>
                    </Card>
                  </TabsContent>
                </div>
              </ScrollArea>
            </div>
          </Tabs>

          {/* Add this temporarily after the form tag for debugging */}
          <div className='p-4 text-xs'>
            <p>Form Valid: {Object.keys(errors).length === 0 ? "Yes" : "No"}</p>
            <p>Errors: {JSON.stringify(errors, null, 2)}</p>
            <p>Watch Data: {JSON.stringify(watch(), null, 2)}</p>
          </div>

          <div className='border-t bg-background px-6 py-4 flex-shrink-0'>
            <div className='flex justify-between items-center'>
              <div className='flex items-center gap-2 text-sm text-muted-foreground'>
                <span>
                  Tab{" "}
                  {[
                    "personal",
                    "family",
                    "education",
                    "ministry",
                    "additional",
                  ].indexOf(activeTab) + 1}{" "}
                  of 5
                </span>
              </div>
              <div className='flex gap-2'>
                <Button
                  type='button'
                  variant='outline'
                  onClick={onClose}
                  disabled={isLoading}
                >
                  Cancel
                </Button>
                <Button type='submit' disabled={isLoading}>
                  {isLoading
                    ? "Saving..."
                    : initialData
                      ? "Update Member"
                      : "Create Member"}
                </Button>
              </div>
            </div>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
