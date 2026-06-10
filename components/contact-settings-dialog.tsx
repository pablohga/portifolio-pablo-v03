"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { useContactSettings } from "@/hooks/use-contact-settings";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { useToast } from "@/components/ui/use-toast";

const contactSettingsSchema = z.object({
  emailTo: z.string().email("Invalid email address"),
  emailService: z.enum(["resend", "smtp"]),
  smtpSettings: z.object({
    host: z.string().optional(),
    port: z.number().optional(),
    secure: z.boolean().optional(),
    auth: z.object({
      user: z.string().optional(),
      pass: z.string().optional(),
    }),
  }).optional(),
  resendApiKey: z.string().optional(),
  imageUrl: z.string().optional(),
  phone: z.string().optional(),
  whatsapp: z.string().optional(),
  address: z.object({
    street: z.string().optional(),
    city: z.string().optional(),
    state: z.string().optional(),
  }).optional(),
  availability: z.string().optional(),
  languages: z.array(z.string()).optional(),
});

interface ContactSettingsDialogProps {
  userId?: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: any) => void;
}

export function ContactSettingsDialog({
  userId,
  open,
  onOpenChange,
  onSubmit,
}: ContactSettingsDialogProps) {
  const { data: session } = useSession();
  const { toast } = useToast();
  const { settings, isLoading } = useContactSettings(userId);

  const form = useForm<z.infer<typeof contactSettingsSchema>>({
    resolver: zodResolver(contactSettingsSchema),
    defaultValues: {
      emailTo: "",
      emailService: "resend",
      smtpSettings: {
        host: "",
        port: 587,
        secure: false,
        auth: {
          user: "",
          pass: "",
        },
      },
      resendApiKey: "",
      imageUrl: "",
      phone: "",
      whatsapp: "",
      address: {
        street: "",
        city: "",
        state: "",
      },
      availability: "",
      languages: [],
    },
  });

  useEffect(() => {
    if (settings) {
      form.reset(settings);
    }
  }, [settings, form]);

  const emailService = form.watch("emailService");

  function handleSubmit(values: z.infer<typeof contactSettingsSchema>) {
    onSubmit(values);
    onOpenChange(false);
  }

  if (isLoading) {
    return null;
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Contact Form Settings</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="imageUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Contact Image</FormLabel>
                  <FormControl>
                    <div className="space-y-2">
                      <input
                        type="file"
                        accept="image/*"
                        className="text-sm"
                        onChange={async (e) => {
                          const file = e.target.files?.[0];
                          if (!file) return;

                          const userId = session?.user?.id;
                          const currentDate = new Date();
                          const timestamp = currentDate.toISOString().replace(/[-:.TZ]/g, "");
                          const newFileName = `contact-${userId}-${timestamp}.${file.type.split("/")[1]}`;
                          const renamedFile = new File([file], newFileName, { type: file.type });

                          const formData = new FormData();
                          formData.append("file", renamedFile);
                          formData.append("upload_preset", "user-projects-imgs");
                          formData.append("folder", `user_uploads/contact/${userId}`);

                          try {
                            const res = await fetch("/api/upload", { method: "POST", body: formData });
                            const data = await res.json();
                            if (data.secure_url) {
                              field.onChange(data.secure_url);
                              toast({ title: "Success", description: "Image uploaded successfully!", variant: "success" });
                            } else {
                              toast({ title: "Error", description: "Failed to upload image.", variant: "destructive" });
                            }
                          } catch (error) {
                            console.error("Upload error:", error);
                            toast({ title: "Error", description: "An error occurred while uploading the image.", variant: "destructive" });
                          }
                        }}
                      />
                      {field.value && (
                        <div className="relative w-20 h-20 rounded-full overflow-hidden border">
                          <Image src={field.value} alt="Preview" fill className="object-cover" />
                        </div>
                      )}
                    </div>
                  </FormControl>
                  <FormDescription>
                    Image to display in the contact section (recommended: square image)
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone</FormLabel>
                    <FormControl>
                      <Input placeholder="+55 (11) 99999-9999" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="whatsapp"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>WhatsApp</FormLabel>
                    <FormControl>
                      <Input placeholder="+55 (11) 99999-9999" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="space-y-4 p-4 border rounded-lg bg-muted/30">
              <FormLabel className="text-base font-semibold">Address</FormLabel>
              <div className="grid grid-cols-1 gap-4">
                <FormField
                  control={form.control}
                  name="address.street"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs">Street</FormLabel>
                      <FormControl>
                        <Input placeholder="Main St, 123" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="address.city"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs">City</FormLabel>
                        <FormControl>
                          <Input placeholder="New York" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="address.state"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs">State/Region</FormLabel>
                        <FormControl>
                          <Input placeholder="NY" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            </div>

            <FormField
              control={form.control}
              name="availability"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Availability</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Mon-Fri: 9am - 6pm (GMT-3)"
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>Your working hours and availability</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="languages"
              render={({ field }) => {
                const commonLanguages = ["Portuguese", "English", "Spanish", "French", "German", "Japanese"];
                return (
                  <FormItem>
                    <FormLabel>Languages</FormLabel>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      {commonLanguages.map((lang) => (
                        <FormField
                          key={lang}
                          control={form.control}
                          name="languages"
                          render={({ field: langField }) => (
                            <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-2">
                              <FormControl>
                                <Checkbox
                                  checked={langField.value?.includes(lang)}
                                  onCheckedChange={(checked) => {
                                    return checked
                                      ? langField.onChange([...(langField.value || []), lang])
                                      : langField.onChange(
                                          langField.value?.filter((value) => value !== lang) || []
                                        );
                                  }}
                                />
                              </FormControl>
                              <div className="space-y-1 leading-none">
                                <FormLabel className="text-sm font-normal cursor-pointer">
                                  {lang}
                                </FormLabel>
                              </div>
                            </FormItem>
                          )}
                        />
                      ))}
                    </div>
                    <FormMessage />
                  </FormItem>
                );
              }}
            />

            <FormField
              control={form.control}
              name="emailTo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Recipient Email</FormLabel>
                  <FormControl>
                    <Input placeholder="your@email.com" {...field} />
                  </FormControl>
                  <FormDescription>
                    Contact form submissions will be sent to this email address
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="emailService"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email Service</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select email service" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="resend">Resend</SelectItem>
                      <SelectItem value="smtp">SMTP</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {emailService === "resend" && (
              <FormField
                control={form.control}
                name="resendApiKey"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Resend API Key</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="re_..."
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Get your API key from{" "}
                      <a
                        href="https://resend.com"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:underline"
                      >
                        Resend.com
                      </a>
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            {emailService === "smtp" && (
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="smtpSettings.host"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>SMTP Host</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="smtp.gmail.com"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="smtpSettings.port"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>SMTP Port</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="587"
                          {...field}
                          onChange={(e) =>
                            field.onChange(parseInt(e.target.value))
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="smtpSettings.auth.user"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>SMTP Username</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="your@email.com"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="smtpSettings.auth.pass"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>SMTP Password</FormLabel>
                      <FormControl>
                        <Input
                          type="password"
                          placeholder="Your password or app-specific password"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            )}

            <Button type="submit">Save Settings</Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}