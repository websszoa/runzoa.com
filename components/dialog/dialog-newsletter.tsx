"use client";

import { z } from "zod";
import { cn } from "@/lib/utils";
import { APP_ENG_NAME } from "@/lib/constants";
import { createClient } from "@/lib/supabase/client";
import { useEffect, useState, type ReactNode } from "react";
import { Heart, MailCheck, Send, Sparkles, TentTree } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const ages = ["10대", "20대", "30대", "40대", "50대", "60대 이상"];
const acquisitionSources = [
  "검색",
  "인스타그램·SNS",
  "러닝 크루·지인 추천",
  "커뮤니티·카페",
  "대회 또는 행사",
  "기타",
];

const newsletterSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, "이메일을 입력해 주세요.")
    .email("올바른 이메일 형식을 입력해 주세요."),
  age: z.string().min(1, "나이대를 선택해 주세요."),
  acquisitionSource: z.string().min(1, "알게 된 경로를 선택해 주세요."),
  contentPreference: z.string().trim().max(500, "500자 이하로 입력해 주세요."),
  consent: z.literal(true, { error: "뉴스레터 수신에 동의해 주세요." }),
});

type NewsletterField = keyof z.infer<typeof newsletterSchema>;
type NewsletterErrors = Partial<Record<NewsletterField, string>>;
export default function DialogNewsletter({
  children,
  className,
  subscriptionSource,
}: {
  children: ReactNode;
  className?: string;
  subscriptionSource: "메인 구독 배너" | "뉴스레터 페이지" | "대회 상세페이지";
}) {
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [age, setAge] = useState<string | null>(null);
  const [acquisitionSource, setAcquisitionSource] = useState<string | null>(
    null,
  );
  const [contentPreference, setContentPreference] = useState("");
  const [consent, setConsent] = useState(false);
  const [status, setStatus] = useState<
    "form" | "submitting" | "success" | "error"
  >("form");
  const [errors, setErrors] = useState<NewsletterErrors>({});

  useEffect(() => {
    if (!open) return;

    let active = true;
    const loadUserEmail = async () => {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (active && user?.email) {
        setEmail((currentEmail) => currentEmail || user.email || "");
      }
    };

    void loadUserEmail();
    return () => {
      active = false;
    };
  }, [open]);

  const resetDialog = () => {
    setEmail("");
    setAge(null);
    setAcquisitionSource(null);
    setContentPreference("");
    setConsent(false);
    setStatus("form");
    setErrors({});
  };

  const handleOpenChange = (nextOpen: boolean) => {
    setOpen(nextOpen);
    if (!nextOpen) resetDialog();
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (status === "submitting") return;
    const validation = newsletterSchema.safeParse({
      email,
      age: age ?? "",
      acquisitionSource: acquisitionSource ?? "",
      contentPreference,
      consent,
    });

    if (!validation.success) {
      const fieldErrors = validation.error.flatten().fieldErrors;
      setErrors(
        Object.fromEntries(
          Object.entries(fieldErrors).map(([field, messages]) => [
            field,
            messages?.[0],
          ]),
        ) as NewsletterErrors,
      );
      return;
    }

    setErrors({});

    setStatus("submitting");
    const supabase = createClient();
    const { error } = await supabase.rpc("subscribe_newsletter", {
      subscriber_email: email,
      subscriber_age: age,
      subscriber_acquisition_source: acquisitionSource,
      subscriber_content_preference: contentPreference.trim() || null,
      subscriber_subscription_source: subscriptionSource,
      privacy_agreed: true,
      ads_agreed: true,
    });

    setStatus(error ? "error" : "success");
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <button
        type="button"
        className={cn(className)}
        onClick={() => setOpen(true)}
      >
        {children}
      </button>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-md">
        {status === "success" ? (
          <NewsletterSuccess onClose={() => handleOpenChange(false)} />
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            <DialogHeader className="border-b pb-4 text-center">
              <div className="mx-auto flex items-center gap-2 font-paperlogy text-lg font-extrabold text-brand uppercase">
                <TentTree className="size-7" aria-hidden="true" />
                {APP_ENG_NAME}
              </div>
              <DialogTitle className="font-paperlogy text-xl">
                놓치기 아쉬운 러닝 소식 💌
              </DialogTitle>
              <DialogDescription className="break-keep font-anyvid leading-6">
                필요한 소식만 골라서 가볍게 보내드릴게요.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-2">
              <Label htmlFor="newsletter-email" className="font-anyvid">
                이메일 <span className="text-brand">*</span>
              </Label>
              <Input
                id="newsletter-email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                aria-invalid={Boolean(errors.email)}
                placeholder="runner@example.com"
                className="h-11"
              />
              <FieldMessage message={errors.email} />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <NewsletterSelect
                label="나이대"
                required
                value={age}
                onValueChange={setAge}
                items={ages}
                placeholder="선택해 주세요"
                error={errors.age}
              />
              <NewsletterSelect
                label="알게 된 경로"
                required
                value={acquisitionSource}
                onValueChange={setAcquisitionSource}
                items={acquisitionSources}
                placeholder="선택해 주세요"
                error={errors.acquisitionSource}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="newsletter-preference" className="font-anyvid">
                가장 받고 싶은 정보{" "}
                <span className="font-normal text-muted-foreground">
                  (선택)
                </span>
              </Label>
              <Input
                id="newsletter-preference"
                value={contentPreference}
                onChange={(event) => setContentPreference(event.target.value)}
                maxLength={500}
                aria-invalid={Boolean(errors.contentPreference)}
                placeholder="예: 서울 지역 하프마라톤 접수 소식"
                className="h-11"
              />
              <FieldMessage message={errors.contentPreference} />
            </div>

            <label className="flex cursor-pointer items-start gap-2.5 rounded-lg bg-brand/5 p-3 font-anyvid text-sm leading-5">
              <Checkbox
                checked={consent}
                onCheckedChange={(checked) => setConsent(checked === true)}
                aria-invalid={Boolean(errors.consent)}
                className="mt-0.5 data-checked:!border-brand data-checked:!bg-brand data-checked:!text-white"
              />
              <span>
                <strong className="font-medium text-brand">(필수)</strong>{" "}
                개인정보 수집 및 뉴스레터 수신에 동의합니다.
              </span>
            </label>
            <FieldMessage message={errors.consent} />

            {status === "error" && (
              <p
                role="alert"
                className="rounded-lg border border-red-200 bg-red-50 p-3 text-center font-anyvid text-sm text-red-700"
              >
                구독 신청을 완료하지 못했습니다. 잠시 후 다시 시도해 주세요.
              </p>
            )}

            <Button
              type="submit"
              size="lg"
              aria-disabled={status === "submitting"}
              className="w-full bg-brand font-anyvid text-white hover:bg-brand/90"
            >
              {status === "submitting" ? "신청 중..." : "뉴스레터 구독하기"}
              <Send className="size-4" aria-hidden="true" />
            </Button>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}

function NewsletterSelect({
  label,
  required = false,
  value,
  onValueChange,
  items,
  placeholder,
  error,
}: {
  label: string;
  required?: boolean;
  value: string | null;
  onValueChange: (value: string | null) => void;
  items: string[];
  placeholder: string;
  error?: string;
}) {
  return (
    <div className="space-y-2">
      <Label className="font-anyvid">
        {label} {required && <span className="text-brand">*</span>}
      </Label>
      <Select value={value} onValueChange={onValueChange}>
        <SelectTrigger
          className="h-11 w-full font-anyvid"
          aria-invalid={Boolean(error)}
        >
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {items.map((item) => (
            <SelectItem key={item} value={item} className="font-anyvid">
              {item}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <FieldMessage message={error} />
    </div>
  );
}

function FieldMessage({ message }: { message?: string }) {
  return message ? (
    <p className="font-anyvid text-sm text-destructive">{message}</p>
  ) : null;
}

function NewsletterSuccess({ onClose }: { onClose: () => void }) {
  return (
    <div className="space-y-5 text-center">
      <DialogHeader>
        <div className="mx-auto flex items-center gap-2 font-paperlogy text-lg font-extrabold text-brand uppercase">
          <TentTree className="size-7" aria-hidden="true" />
          {APP_ENG_NAME}
        </div>
        <DialogTitle className="font-paperlogy text-xl">
          구독 신청이 완료됐어요! 🌱
        </DialogTitle>
        <DialogDescription className="break-keep font-anyvid leading-6">
          반가운 러닝 소식을 정성껏 모아 보내드릴게요.
        </DialogDescription>
      </DialogHeader>
      <div
        className="relative mx-auto flex h-36 w-52 items-center justify-center overflow-hidden"
        aria-hidden="true"
      >
        <span className="contact-success-cloud absolute bottom-5 left-5 h-7 w-16 rounded-full bg-sky-100" />
        <span className="contact-success-cloud contact-success-cloud--right absolute right-3 bottom-8 h-6 w-14 rounded-full bg-emerald-100" />
        <div className="contact-success-mail relative z-10 flex size-20 items-center justify-center rounded-[1.6rem] border border-emerald-200 bg-linear-to-br from-white to-emerald-50 shadow-[0_12px_30px_rgba(16,185,129,0.16)]">
          <MailCheck className="size-10 text-emerald-500" />
        </div>
        <Sparkles className="contact-success-spark contact-success-spark--one absolute top-6 left-8 size-5 text-amber-400" />
        <Heart className="contact-success-spark contact-success-spark--two absolute top-4 right-8 size-4 fill-rose-300 text-rose-300" />
      </div>
      <Button
        type="button"
        size="lg"
        onClick={onClose}
        className="w-full bg-brand font-anyvid text-white hover:bg-brand/90"
      >
        확인
      </Button>
    </div>
  );
}
