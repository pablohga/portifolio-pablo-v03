"use client";

import { RecoverPasswordForm } from "@/components/recover-password-form";
import { ResetPasswordForm } from "@/components/reset-password-form";
import { FormProvider, useForm } from "react-hook-form";


export default function RecoverPasswordPage() {
  const formMethods = useForm(); // Criando instância do formulário
  return (
    <FormProvider {...formMethods}>
      <ResetPasswordForm />
    </FormProvider>
  );
}
