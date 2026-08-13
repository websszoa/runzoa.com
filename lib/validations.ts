import { z } from "zod";

export const contactFormSchema = z.object({
  name: z.string().trim().min(1, "이름을 입력해 주세요.").max(50),
  email: z
    .string()
    .trim()
    .min(1, "이메일을 입력해 주세요.")
    .email("올바른 이메일 형식을 입력해 주세요."),
  subject: z.string().trim().min(1, "제목을 입력해 주세요.").max(100),
  relatedUrl: z
    .string()
    .trim()
    .refine(
      (value) => value === "" || URL.canParse(value),
      "올바른 주소를 입력해 주세요.",
    ),
  content: z.string().trim().min(10, "내용을 10자 이상 입력해 주세요.").max(5000),
  privacyConsent: z.boolean().refine((value) => value, {
    message: "개인정보 수집 및 이용에 동의해 주세요.",
  }),
});

export type ContactFormValues = z.infer<typeof contactFormSchema>;
