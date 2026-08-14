"use client";

import Link from "next/link";
import { Send } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import DialogContactSuccess from "@/components/dialog/dialog-contact-success";
import { Checkbox } from "@/components/ui/checkbox";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { submitSupportRequest } from "@/lib/email/support-action";
import type { SupportItem } from "@/lib/support";
import { contactFormSchema, type ContactFormValues } from "@/lib/validations";

type PageSupportFormProps = {
  item: SupportItem;
};

export default function PageSupportForm({ item }: PageSupportFormProps) {
  const [submitStatus, setSubmitStatus] = useState<
    "idle" | "success" | "error" | "unavailable"
  >("idle");
  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContactFormValues>({
    resolver: zodResolver(contactFormSchema),
    mode: "onBlur",
    defaultValues: {
      name: "",
      email: "",
      subject: "",
      relatedUrl: "",
      content: "",
      privacyConsent: false,
    },
  });

  const onSubmit = async (values: ContactFormValues) => {
    setSubmitStatus("idle");

    const result = await submitSupportRequest(values, item.label);

    if (!result.success) {
      setSubmitStatus(result.unavailable ? "unavailable" : "error");
      return;
    }

    reset();
    setSubmitStatus("success");
  };

  return (
    <section
      aria-labelledby="support-form-title"
      className="rounded-2xl border bg-background p-5 sm:p-8"
    >
      <div className="border-b pb-6">
        <h2
          id="support-form-title"
          className="font-paperlogy text-2xl font-semibold tracking-tight sm:text-3xl"
        >
          {item.formTitle}
        </h2>
        <p className="mt-2 break-keep font-anyvid text-sm leading-6 text-muted-foreground">
          {item.formDescription}
        </p>
      </div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        noValidate
        className="mt-7 space-y-6"
      >
        {submitStatus === "error" && (
          <p
            role="alert"
            className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 font-anyvid text-sm text-red-700"
          >
            문의를 접수하지 못했습니다. 잠시 후 다시 시도해 주세요.
          </p>
        )}
        {submitStatus === "unavailable" && (
          <p
            role="alert"
            className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 font-anyvid text-sm text-amber-800"
          >
            현재 문의 접수 기능을 준비하고 있습니다. 잠시 후 다시 이용해
            주세요.
          </p>
        )}
        <div className="grid gap-5 sm:grid-cols-2">
          <Field data-invalid={Boolean(errors.name)}>
            <FieldLabel htmlFor="support-name" className="font-anyvid">
              이름 <span className="text-brand">*</span>
            </FieldLabel>
            <Input
              id="support-name"
              autoComplete="name"
              aria-invalid={Boolean(errors.name)}
              className="h-11 rounded-lg px-3"
              placeholder="이름을 입력하세요"
              {...register("name")}
            />
            <FieldError errors={[errors.name]} />
          </Field>
          <Field data-invalid={Boolean(errors.email)}>
            <FieldLabel htmlFor="support-email" className="font-anyvid">
              이메일 <span className="text-brand">*</span>
            </FieldLabel>
            <Input
              id="support-email"
              type="email"
              autoComplete="email"
              aria-invalid={Boolean(errors.email)}
              className="h-11 rounded-lg px-3"
              placeholder="reply@example.com"
              {...register("email")}
            />
            <FieldError errors={[errors.email]} />
          </Field>
        </div>

        <Field data-invalid={Boolean(errors.subject)}>
          <FieldLabel htmlFor="support-subject" className="font-anyvid">
            제목 <span className="text-brand">*</span>
          </FieldLabel>
          <Input
            id="support-subject"
            aria-invalid={Boolean(errors.subject)}
            className="h-11 rounded-lg px-3"
            placeholder={item.subjectPlaceholder}
            {...register("subject")}
          />
          <FieldError errors={[errors.subject]} />
        </Field>

        <Field data-invalid={Boolean(errors.relatedUrl)}>
          <FieldLabel htmlFor="support-related-url" className="font-anyvid">
            관련 페이지 주소{" "}
            <span className="font-normal text-muted-foreground">(선택)</span>
          </FieldLabel>
          <Input
            id="support-related-url"
            type="url"
            inputMode="url"
            aria-invalid={Boolean(errors.relatedUrl)}
            className="h-11 rounded-lg px-3"
            placeholder="https://"
            {...register("relatedUrl")}
          />
          <FieldError errors={[errors.relatedUrl]} />
        </Field>

        <Field data-invalid={Boolean(errors.content)}>
          <FieldLabel htmlFor="support-content" className="font-anyvid">
            {item.contentLabel} <span className="text-brand">*</span>
          </FieldLabel>
          <Textarea
            id="support-content"
            rows={8}
            aria-invalid={Boolean(errors.content)}
            className="min-h-48 resize-y rounded-lg px-3 py-3 font-anyvid leading-6"
            placeholder={item.contentPlaceholder}
            {...register("content")}
          />
          <FieldError errors={[errors.content]} />
        </Field>

        <div className="flex flex-col gap-5 border-t pt-6 sm:flex-row sm:items-start sm:justify-between">
          <Controller
            name="privacyConsent"
            control={control}
            render={({ field }) => (
              <Field
                data-invalid={Boolean(errors.privacyConsent)}
                className="min-w-0 flex-1 gap-2"
              >
                <div className="flex items-start gap-2.5">
                  <Checkbox
                    id="support-privacy-consent"
                    checked={field.value}
                    onCheckedChange={field.onChange}
                    aria-invalid={Boolean(errors.privacyConsent)}
                    className="mt-0.5"
                  />
                  <FieldLabel
                    htmlFor="support-privacy-consent"
                    className="items-start font-anyvid text-sm font-normal"
                  >
                    <span className="font-medium text-foreground">
                      (필수){" "}
                      <Link
                        href="/privacy#items"
                        target="_blank"
                        className="text-brand underline underline-offset-4"
                      >
                        개인정보처리방침
                      </Link>
                      에 동의합니다. <span className="text-brand">*</span>
                    </span>
                  </FieldLabel>
                </div>
                <FieldError errors={[errors.privacyConsent]} />
              </Field>
            )}
          />
          <Button
            type="submit"
            size="lg"
            disabled={isSubmitting}
            className="bg-brand px-5 text-white hover:bg-brand/85"
          >
            {isSubmitting ? "접수 중..." : "문의하기"}
            <Send aria-hidden="true" />
          </Button>
        </div>
      </form>
      <DialogContactSuccess
        open={submitStatus === "success"}
        onOpenChange={(open) => !open && setSubmitStatus("idle")}
      />
    </section>
  );
}
