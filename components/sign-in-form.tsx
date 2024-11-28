"use client";

import { signIn } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useRouter } from "next/navigation";

export function SignInForm() {
  const router = useRouter();

  const handleSignIn = async () => {
    const result = await signIn("google", {
      redirect: false,
    });

    if (!result?.error) {
      router.push("/dashboard");
      router.refresh();
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <Card className="w-[350px]">
        <CardHeader>
          <CardTitle className="text-2xl text-center">Sign In</CardTitle>
        </CardHeader>
        <CardContent>
          <Button
            className="w-full"
            onClick={handleSignIn}
          >
            Continue with Google
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}