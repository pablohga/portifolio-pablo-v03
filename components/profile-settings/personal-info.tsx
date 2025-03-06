"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { useSession } from "next-auth/react";
import Image from "next/image";

const profileSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  image: z.string().url("Must be a valid URL").optional(),
});

interface PersonalInfoProps {
  user: any;
  onAvatarUpdate: (newAvatar: string) => void;
}

export function PersonalInfo({ user }: PersonalInfoProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false); // New state for image upload
  const { toast } = useToast();
  const { data: session } = useSession();

  const form = useForm<z.infer<typeof profileSchema>>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: user.name || "",
      email: user.email || "",
      image: user.image || "",
    },
  });

  async function onSubmit(values: z.infer<typeof profileSchema>) {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/users/${user._id}/profile`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error);
      }

      toast({
        title: "Success",
        description: "Profile updated successfully",
        variant: "success",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }

  // Function to handle image upload
  async function handleImageUpload(file: File) {
    const userId = session?.user?.id;
    if (!userId) {
      toast({
        title: "Error",
        description: "User ID not found.",
        variant: "destructive",
      });
      return;
    }

    const currentDate = new Date();
    const timestamp = currentDate.toISOString().replace(/[-:.TZ]/g, "");
    const newFileName = `${userId}-profile-${timestamp}.${file.type.split("/")[1]}`;
    const renamedFile = new File([file], newFileName, { type: file.type });

    const formData = new FormData();
    formData.append("file", renamedFile);
    formData.append("upload_preset", "user-profile-pictures"); // Adjust preset as needed
    formData.append("folder", `user_uploads/profile-pictures/${userId}`); // Adjust folder as needed

    try {
      setIsUploading(true);
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (data.secure_url) {
        form.setValue("image", data.secure_url); // Update the form state with the uploaded URL
        toast({
          title: "Success",
          description: "Profile picture updated successfully!",
          variant: "success",
        });
      } else {
        throw new Error("Failed to upload image.");
      }
    } catch (error) {
      console.error("Upload error:", error);
      toast({
        title: "Error",
        description: "An error occurred while uploading the image.",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold mb-4">Personal Information</h2>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Name Field */}
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Email Field */}
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Profile Picture Field */}
          <FormField
            control={form.control}
            name="image"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Profile Picture URL</FormLabel>
                <FormControl>
                  <div className="flex flex-col gap-2">
                    <Input placeholder="https://example.com/avatar.jpg" {...field} readOnly />
                    <input
                      type="file"
                      accept="image/*"
                      onChange={async (e) => {
                        const selectedFile = e.target.files?.[0];
                        if (selectedFile) {
                          await handleImageUpload(selectedFile); // Trigger the upload function
                        }
                      }}
                      disabled={isUploading}
                    />
                    {field.value && (
                      <Image
                        src={field.value}
                        alt="Uploaded Preview"
                        className="w-[350px] aspect-[1/1] bg-cover bg-center"
                        height={350}
                        width={350}
                      />
                    )}
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Submit Button */}
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Saving..." : "Save Changes"}
          </Button>
        </form>
      </Form>
    </div>
  );
}