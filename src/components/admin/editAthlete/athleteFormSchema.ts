
import * as z from "zod";

export const athleteSchema = z.object({
  name: z.string().min(1, "Name is required"),
  country_of_origin: z.string().optional(),
  nationality: z.string().optional(),
  year_of_birth: z.number().min(1800).max(new Date().getFullYear()).optional(),
  date_of_death: z.string().optional(),
  is_active: z.boolean(),
  profile_picture_url: z.string().optional(),
  career_start_year: z.number().min(1800).max(new Date().getFullYear()).optional(),
  career_end_year: z.number().min(1800).max(new Date().getFullYear()).optional(),
}).refine((data) => {
  if (data.career_start_year && data.career_end_year) {
    return data.career_end_year >= data.career_start_year;
  }
  return true;
}, {
  message: "Career end year must be greater than or equal to career start year",
  path: ["career_end_year"],
});

export type AthleteFormData = z.infer<typeof athleteSchema>;
