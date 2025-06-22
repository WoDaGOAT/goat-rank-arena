
import React from "react";
import { UseFormReturn } from "react-hook-form";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Clock, Globe, Info, Calendar } from "lucide-react";
import { format } from "date-fns";
import { QuizFormValues } from "@/types/quiz-form";

interface PublicationSettingsSectionProps {
  form: UseFormReturn<QuizFormValues>;
}

const TIMEZONES = [
  { value: "UTC", label: "UTC (Coordinated Universal Time)" },
  { value: "America/New_York", label: "Eastern Time (ET)" },
  { value: "America/Chicago", label: "Central Time (CT)" },
  { value: "America/Denver", label: "Mountain Time (MT)" },
  { value: "America/Los_Angeles", label: "Pacific Time (PT)" },
  { value: "Europe/London", label: "Greenwich Mean Time (GMT)" },
  { value: "Europe/Paris", label: "Central European Time (CET)" },
  { value: "Asia/Tokyo", label: "Japan Standard Time (JST)" },
  { value: "Asia/Shanghai", label: "China Standard Time (CST)" },
  { value: "Australia/Sydney", label: "Australian Eastern Time (AET)" },
];

const getStatusDescription = (status: string) => {
  switch (status) {
    case 'draft': return 'Save quiz without publishing';
    case 'scheduled': return 'Schedule quiz for automatic publication';
    case 'published': return 'Publish quiz immediately';
    default: return '';
  }
};

export const PublicationSettingsSection: React.FC<PublicationSettingsSectionProps> = ({ form }) => {
  const watchedDate = form.watch("active_date");
  const watchedTime = form.watch("publication_time");
  const watchedTimezone = form.watch("timezone");
  const watchedStatus = form.watch("status");

  return (
    <Card className="bg-white/80 backdrop-blur-sm shadow-lg border border-white/20">
      <CardHeader className="border-b border-gray-100">
        <CardTitle className="flex items-center gap-2 text-gray-800">
          <Clock className="h-5 w-5 text-purple-600" />
          Publication Settings
        </CardTitle>
        <CardDescription className="text-gray-600">
          Configure when and how this quiz will be published
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6 pt-6">
        <FormField
          control={form.control}
          name="status"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-gray-700 font-medium">Publication Status</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger className="bg-white/70 border-gray-200 focus:border-purple-400">
                    <SelectValue placeholder="Select publication status" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent className="bg-white shadow-xl border">
                  <SelectItem value="draft">📝 Draft</SelectItem>
                  <SelectItem value="scheduled">⏰ Scheduled</SelectItem>
                  <SelectItem value="published">🚀 Published</SelectItem>
                </SelectContent>
              </Select>
              <FormDescription className="text-gray-500">
                {getStatusDescription(field.value)}
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="publication_time"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-gray-700 font-medium">Publication Time</FormLabel>
                <FormControl>
                  <Input 
                    type="time" 
                    {...field}
                    className="w-full bg-white/70 border-gray-200 focus:border-purple-400"
                  />
                </FormControl>
                <FormDescription className="text-gray-500">
                  Time when the quiz will be published
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="timezone"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center gap-2 text-gray-700 font-medium">
                  <Globe className="h-4 w-4" />
                  Timezone
                </FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger className="bg-white/70 border-gray-200 focus:border-purple-400">
                      <SelectValue placeholder="Select timezone" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent className="max-h-60 bg-white shadow-xl border">
                    {TIMEZONES.map((tz) => (
                      <SelectItem key={tz.value} value={tz.value}>
                        {tz.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormDescription className="text-gray-500">
                  Timezone for publication time
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {watchedStatus === "scheduled" && watchedDate && (
          <Alert className="bg-yellow-50 border-yellow-200 shadow-sm">
            <Calendar className="h-4 w-4 text-yellow-600" />
            <AlertDescription className="text-yellow-800">
              <strong>Scheduled Publication:</strong> This quiz will be automatically published on{" "}
              {format(watchedDate, "PPP")} at {watchedTime} ({watchedTimezone}).
            </AlertDescription>
          </Alert>
        )}

        {watchedStatus === "published" && (
          <Alert className="bg-green-50 border-green-200 shadow-sm">
            <Info className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-800">
              <strong>Immediate Publication:</strong> This quiz will be published immediately and available to users.
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
};
