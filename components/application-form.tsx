"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { format } from "date-fns"
import { CalendarIcon, Loader2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { toast } from "@/components/ui/use-toast"
import { Card, CardContent } from "@/components/ui/card"

// Define the form schema with Zod
const formSchema = z.object({
  fullName: z.string().min(2, { message: "Full name must be at least 2 characters." }),
  email: z.string().email({ message: "Please enter a valid email address." }),
  dateOfBirth: z.date({
    required_error: "Date of birth is required.",
  }),
  gender: z.enum(["MALE", "FEMALE", "OTHER", "PREFER_NOT_TO_SAY"], {
    required_error: "Please select a gender.",
  }),
  phone: z.string().min(10, { message: "Phone number must be at least 10 digits." }),
  nationality: z.string().min(2, { message: "Nationality is required." }),
  refugeeStatus: z.boolean().default(false),
  refugeeId: z.string().optional(),

  hasDisability: z.boolean().default(false),
  disabilityType: z
    .enum([
      "PHYSICAL_IMPAIRMENT",
      "VISUAL_IMPAIRMENT",
      "HEARING_IMPAIRMENT",
      "MENTAL_IMPAIRMENT",
      "SHORT_STATURE",
      "ALBINISM",
      "DEAF_BLIND",
      "AUTISM",
      "MULTIPLE_DISABILITIES",
    ])
    .optional(),
  disabilityDetails: z.string().optional(),

  residence: z.string().min(2, { message: "Residence is required." }),
  emergencyContactName: z.string().min(2, { message: "Emergency contact name is required." }),
  emergencyContactRelation: z.string().min(2, { message: "Relationship is required." }),
  emergencyContactPhone: z.string().min(10, { message: "Emergency contact phone is required." }),

  hasYoungChild: z.boolean().default(false),
  hasChildcareSupport: z.boolean().optional(),

  hasLaptop: z.boolean().default(false),
  currentOccupation: z.enum(["STUDENT", "EMPLOYED", "UNEMPLOYED", "FREELANCER", "ENTREPRENEUR", "OTHER"], {
    required_error: "Please select your current occupation.",
  }),

  educationBackground: z.enum(
    [
      "HIGH_SCHOOL",
      "TECHNICAL_SCHOOL",
      "YEAR_1_UNIVERSITY",
      "YEAR_2_UNIVERSITY",
      "YEAR_3_UNIVERSITY",
      "YEAR_4_UNIVERSITY",
      "FINAL_YEAR_UNIVERSITY",
      "BACHELORS",
      "MASTERS",
      "PHD",
      "OTHER",
    ],
    {
      required_error: "Please select your education background.",
    },
  ),
  university: z.string().optional(),
  academicBackground: z.string().min(2, { message: "Academic background is required." }),
  englishProficiency: z.enum(["BEGINNER", "INTERMEDIATE", "ADVANCED", "FLUENT", "NATIVE"], {
    required_error: "Please select your English proficiency.",
  }),

  linkedInProfile: z.string().url({ message: "Please enter a valid LinkedIn URL." }).optional().or(z.literal("")),
  githubProfile: z.string().url({ message: "Please enter a valid GitHub URL." }).optional().or(z.literal("")),

  howDidYouKnow: z.string().min(2, { message: "Please tell us how you heard about us." }),
  motivation: z.string().min(50, { message: "Motivation must be at least 50 characters." }),
  additionalFeedback: z.string().optional(),

  courseId: z.string({
    required_error: "Please select a course.",
  }),
})

type FormValues = z.infer<typeof formSchema>

type Course = {
  id: string
  name: string
  description: string | null
}

export default function ApplicationForm() {
  const router = useRouter()
  const [courses, setCourses] = useState<Course[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Fetch courses from the API
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await fetch("/api/courses")
        if (!response.ok) {
          throw new Error("Failed to fetch courses")
        }
        const data = await response.json()
        setCourses(data)
      } catch (error) {
        console.error("Error fetching courses:", error)
        toast({
          title: "Error",
          description: "Failed to load courses. Please try again later.",
          variant: "destructive",
        })
      }
    }

    fetchCourses()
  }, [])

  // Initialize the form
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: "",
      email: "",
      phone: "",
      nationality: "",
      refugeeStatus: false,
      hasDisability: false,
      residence: "",
      emergencyContactName: "",
      emergencyContactRelation: "",
      emergencyContactPhone: "",
      hasYoungChild: false,
      hasLaptop: false,
      academicBackground: "",
      howDidYouKnow: "",
      motivation: "",
      linkedInProfile: "",
      githubProfile: "",
    },
  })

  // Watch form values for conditional fields
  const refugeeStatus = form.watch("refugeeStatus")
  const hasDisability = form.watch("hasDisability")
  const hasYoungChild = form.watch("hasYoungChild")
  const educationBackground = form.watch("educationBackground")

  // Handle form submission
  async function onSubmit(data: FormValues) {
    setIsSubmitting(true)
    try {
      const response = await fetch("/api/applications", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || "Failed to submit application")
      }

      toast({
        title: "Application Submitted",
        description: "Your application has been successfully submitted.",
      })

      // Redirect to success page or home
      router.push("/apply/success")
    } catch (error) {
      console.error("Error submitting application:", error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to submit application",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card>
      <CardContent className="pt-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            {/* Personal Information Section */}
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-semibold">Personal Information</h2>
                <p className="text-sm text-muted-foreground">Please provide your personal details</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="fullName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Name</FormLabel>
                      <FormControl>
                        <Input placeholder="John Doe" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="john.doe@example.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="dateOfBirth"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Date of Birth</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={"outline"}
                              className={`w-full pl-3 text-left font-normal ${!field.value ? "text-muted-foreground" : ""}`}
                            >
                              {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            disabled={(date) => date > new Date() || date < new Date("1900-01-01")}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="gender"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Gender</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select gender" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="MALE">Male</SelectItem>
                          <SelectItem value="FEMALE">Female</SelectItem>
                          <SelectItem value="OTHER">Other</SelectItem>
                          <SelectItem value="PREFER_NOT_TO_SAY">Prefer not to say</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone Number</FormLabel>
                      <FormControl>
                        <Input placeholder="+1234567890" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="nationality"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nationality</FormLabel>
                      <FormControl>
                        <Input placeholder="Your nationality" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="refugeeStatus"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                      <FormControl>
                        <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>I am a refugee</FormLabel>
                        <FormDescription>Check this box if you have refugee status</FormDescription>
                      </div>
                    </FormItem>
                  )}
                />

                {refugeeStatus && (
                  <FormField
                    control={form.control}
                    name="refugeeId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Refugee ID</FormLabel>
                        <FormControl>
                          <Input placeholder="Your refugee ID" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
              </div>
            </div>

            {/* Disability Information */}
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-semibold">Disability Information</h2>
                <p className="text-sm text-muted-foreground">Please provide information about any disabilities</p>
              </div>

              <FormField
                control={form.control}
                name="hasDisability"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                    <FormControl>
                      <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>I have a disability</FormLabel>
                      <FormDescription>Check this box if you have any disability</FormDescription>
                    </div>
                  </FormItem>
                )}
              />

              {hasDisability && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="disabilityType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Disability Type</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select disability type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="PHYSICAL_IMPAIRMENT">Physical impairment</SelectItem>
                            <SelectItem value="VISUAL_IMPAIRMENT">Visual impairment</SelectItem>
                            <SelectItem value="HEARING_IMPAIRMENT">Hearing impairment</SelectItem>
                            <SelectItem value="MENTAL_IMPAIRMENT">Mental impairment</SelectItem>
                            <SelectItem value="SHORT_STATURE">Short Stature/Little people</SelectItem>
                            <SelectItem value="ALBINISM">People with Albinism</SelectItem>
                            <SelectItem value="DEAF_BLIND">Deaf blind</SelectItem>
                            <SelectItem value="AUTISM">Autism</SelectItem>
                            <SelectItem value="MULTIPLE_DISABILITIES">Multiple disabilities</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="disabilityDetails"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Disability Details</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Please provide details about your disability"
                            className="resize-none"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              )}
            </div>

            {/* Contact Information */}
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-semibold">Contact Information</h2>
                <p className="text-sm text-muted-foreground">
                  Please provide your residence and emergency contact details
                </p>
              </div>

              <div className="grid grid-cols-1 gap-6">
                <FormField
                  control={form.control}
                  name="residence"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Residence</FormLabel>
                      <FormControl>
                        <Input placeholder="Province, District, Sector, Cell, Village" {...field} />
                      </FormControl>
                      <FormDescription>Format: Province, District, Sector, Cell, Village</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <FormField
                  control={form.control}
                  name="emergencyContactName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Emergency Contact Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Contact name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="emergencyContactRelation"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Relationship</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Parent, Spouse, Sibling" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="emergencyContactPhone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Emergency Contact Phone</FormLabel>
                      <FormControl>
                        <Input placeholder="+1234567890" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Family and Equipment */}
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-semibold">Family and Equipment</h2>
                <p className="text-sm text-muted-foreground">Information about childcare and equipment</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="hasYoungChild"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                      <FormControl>
                        <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>I have a young child</FormLabel>
                        <FormDescription>Check this box if you have a young child</FormDescription>
                      </div>
                    </FormItem>
                  )}
                />

                {hasYoungChild && (
                  <FormField
                    control={form.control}
                    name="hasChildcareSupport"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                        <FormControl>
                          <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel>I have childcare support</FormLabel>
                          <FormDescription>Check this box if you have childcare support</FormDescription>
                        </div>
                      </FormItem>
                    )}
                  />
                )}

                <FormField
                  control={form.control}
                  name="hasLaptop"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                      <FormControl>
                        <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>I have a laptop</FormLabel>
                        <FormDescription>Check this box if you have a laptop for the course</FormDescription>
                      </div>
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Education and Occupation */}
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-semibold">Education and Occupation</h2>
                <p className="text-sm text-muted-foreground">Information about your education and current occupation</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="currentOccupation"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Current Occupation</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select your occupation" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="STUDENT">Student</SelectItem>
                          <SelectItem value="EMPLOYED">Employed</SelectItem>
                          <SelectItem value="UNEMPLOYED">Unemployed</SelectItem>
                          <SelectItem value="FREELANCER">Freelancer</SelectItem>
                          <SelectItem value="ENTREPRENEUR">Entrepreneur</SelectItem>
                          <SelectItem value="OTHER">Other</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="educationBackground"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Education Background</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select your education level" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="HIGH_SCHOOL">High School</SelectItem>
                          <SelectItem value="TECHNICAL_SCHOOL">Technical School</SelectItem>
                          <SelectItem value="YEAR_1_UNIVERSITY">Year 1 University</SelectItem>
                          <SelectItem value="YEAR_2_UNIVERSITY">Year 2 University</SelectItem>
                          <SelectItem value="YEAR_3_UNIVERSITY">Year 3 University</SelectItem>
                          <SelectItem value="YEAR_4_UNIVERSITY">Year 4 University</SelectItem>
                          <SelectItem value="FINAL_YEAR_UNIVERSITY">Final Year University</SelectItem>
                          <SelectItem value="BACHELORS">Bachelor's Degree</SelectItem>
                          <SelectItem value="MASTERS">Master's Degree</SelectItem>
                          <SelectItem value="PHD">PhD</SelectItem>
                          <SelectItem value="OTHER">Other</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {educationBackground &&
                  [
                    "YEAR_1_UNIVERSITY",
                    "YEAR_2_UNIVERSITY",
                    "YEAR_3_UNIVERSITY",
                    "YEAR_4_UNIVERSITY",
                    "FINAL_YEAR_UNIVERSITY",
                    "BACHELORS",
                    "MASTERS",
                    "PHD",
                  ].includes(educationBackground) && (
                    <FormField
                      control={form.control}
                      name="university"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>University/Institution</FormLabel>
                          <FormControl>
                            <Input placeholder="Name of your university/institution" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}

                <FormField
                  control={form.control}
                  name="academicBackground"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Academic Background</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Briefly describe your academic background"
                          className="resize-none"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="englishProficiency"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>English Proficiency</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select your English level" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="BEGINNER">Beginner</SelectItem>
                          <SelectItem value="INTERMEDIATE">Intermediate</SelectItem>
                          <SelectItem value="ADVANCED">Advanced</SelectItem>
                          <SelectItem value="FLUENT">Fluent</SelectItem>
                          <SelectItem value="NATIVE">Native</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Course Selection */}
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-semibold">Course Selection</h2>
                <p className="text-sm text-muted-foreground">Select the course you want to apply for</p>
              </div>

              <FormField
                control={form.control}
                name="courseId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Course</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a course" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {courses.length > 0 ? (
                          courses.map((course) => (
                            <SelectItem key={course.id} value={course.id}>
                              {course.name}
                            </SelectItem>
                          ))
                        ) : (
                          <SelectItem value="loading" disabled>
                            Loading courses...
                          </SelectItem>
                        )}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Additional Information */}
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-semibold">Additional Information</h2>
                <p className="text-sm text-muted-foreground">Please provide additional details about yourself</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="linkedInProfile"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>LinkedIn Profile (Optional)</FormLabel>
                      <FormControl>
                        <Input placeholder="https://linkedin.com/in/username" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="githubProfile"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>GitHub Profile (Optional)</FormLabel>
                      <FormControl>
                        <Input placeholder="https://github.com/username" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="howDidYouKnow"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>How did you hear about us?</FormLabel>
                    <FormControl>
                      <Input placeholder="Friend, Social Media, Website, etc." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="motivation"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Motivation</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Please describe your motivation for applying to this course"
                        className="min-h-[120px]"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Minimum 50 characters. Explain why you want to join this course and what you hope to achieve.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="additionalFeedback"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Additional Feedback (Optional)</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Any additional information you'd like to share"
                        className="resize-none"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Submitting...
                </>
              ) : (
                "Submit Application"
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
