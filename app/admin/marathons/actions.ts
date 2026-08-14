"use server";

import { readFile, rename, writeFile } from "node:fs/promises";
import path from "node:path";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

import type { Marathon } from "@/lib/marathons";
import { createClient } from "@/lib/supabase/server";

export type CreateMarathonState = {
  error?: string;
};

const optionalText = z.string().trim().transform((value) => value || null);
const createMarathonSchema = z.object({
  name: z.string().trim().min(2, "대회명을 입력해 주세요.").max(150),
  slug: z.string().trim().max(180),
  description: optionalText,
  type: z.string().trim().min(1).max(30),
  scale: z.string().trim(),
  park: optionalText,
  souvenir: optionalText,
  program: optionalText,
  memo: optionalText,
  eventStartDate: z.iso.date("개최 시작일을 입력해 주세요."),
  eventEndDate: z.string().trim(),
  eventStartTime: z.string().trim(),
  eventEndTime: z.string().trim(),
  eventSite: z.string().trim(),
  schedule: z.string(),
  registrationStartDate: z.string().trim(),
  registrationEndDate: z.string().trim(),
  registrationStartTime: z.string().trim(),
  registrationEndTime: z.string().trim(),
  registrationSite: z.string().trim(),
  registrationStatus: z.string().trim().max(30),
  price: z.string(),
  country: z.string().trim().max(30),
  region: optionalText,
  venue: optionalText,
  address: optionalText,
  latitude: z.string().trim(),
  longitude: z.string().trim(),
  organizer: optionalText,
  manager: optionalText,
  sponsor: optionalText,
  phone: optionalText,
  email: z.string().trim(),
  instagram: optionalText,
  blog: z.string(),
});

const MARATHON_FILE = path.join(
  process.cwd(),
  "data",
  "marathons",
  "marathons_2026.json",
);

export async function createMarathon(
  _previousState: CreateMarathonState,
  formData: FormData,
): Promise<CreateMarathonState> {
  await requireAdmin();

  const parsed = createMarathonSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "입력값을 확인해 주세요." };
  }

  try {
    const values = parsed.data;
    const marathons = JSON.parse(await readFile(MARATHON_FILE, "utf-8")) as Marathon[];
    const baseSlug = values.slug
      ? normalizeSlug(values.slug) || `marathon-${values.eventStartDate.slice(0, 4)}`
      : createSlug(values.name, values.eventStartDate);
    const slug = makeUniqueSlug(baseSlug, marathons);
    const eventEndDate = nullableDate(values.eventEndDate) ?? values.eventStartDate;
    const email = values.email
      ? z.email().safeParse(values.email).success
        ? values.email
        : null
      : null;

    if (values.email && !email) return { error: "이메일 형식을 확인해 주세요." };

    const marathon: Marathon = {
      id: slug,
      slug,
      name: values.name,
      description: values.description,
      info: {
        type: values.type,
        scale: nullableNumber(values.scale),
        park: values.park,
        souvenir: values.souvenir,
        program: values.program,
        memo: values.memo,
      },
      event: {
        startDate: values.eventStartDate,
        endDate: eventEndDate,
        startTime: nullableTime(values.eventStartTime),
        endTime: nullableTime(values.eventEndTime),
        site: nullableUrl(values.eventSite),
        schedule: parseKeyValueLines(values.schedule, false),
      },
      registration: {
        startDate: nullableDate(values.registrationStartDate),
        endDate: nullableDate(values.registrationEndDate),
        startTime: nullableTime(values.registrationStartTime),
        endTime: nullableTime(values.registrationEndTime),
        site: nullableUrl(values.registrationSite),
        status: values.registrationStatus,
        price: parseKeyValueLines(values.price, true) ?? {},
      },
      location: {
        country: values.country || "KR",
        region: values.region,
        venue: values.venue,
        address: values.address,
        latitude: nullableNumber(values.latitude),
        longitude: nullableNumber(values.longitude),
      },
      hosts: {
        organizer: values.organizer,
        manager: values.manager,
        sponsor: values.sponsor,
        phone: values.phone,
        email,
        instagram: values.instagram,
        blog: values.blog.split("\n").map((item) => item.trim()).filter(Boolean),
      },
    };

    marathons.push(marathon);
    marathons.sort((a, b) => a.event.startDate.localeCompare(b.event.startDate));

    const temporaryFile = `${MARATHON_FILE}.tmp`;
    await writeFile(temporaryFile, `${JSON.stringify(marathons, null, 2)}\n`, "utf-8");
    await rename(temporaryFile, MARATHON_FILE);
  } catch (error) {
    console.error("로컬 마라톤 저장 실패:", error);
    return { error: "JSON 파일에 저장하지 못했습니다." };
  }

  revalidatePath("/admin/marathons");
  revalidatePath("/marathon-list");
  revalidatePath("/marathon-search");
  revalidatePath("/marathon-calendar");
  revalidatePath("/marathon-map");
  redirect("/admin/marathons?created=1");
}

async function requireAdmin() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("로그인이 필요합니다.");

  const { data: profile } = await supabase
    .from("profiles")
    .select("role, is_deleted")
    .eq("id", user.id)
    .maybeSingle();
  if (!profile || profile.role !== "admin" || profile.is_deleted) {
    throw new Error("관리자 권한이 필요합니다.");
  }
}

function createSlug(value: string, date: string) {
  const normalized = normalizeSlug(value);
  return `${normalized || "marathon"}-${date.slice(0, 4)}`;
}

function normalizeSlug(value: string) {
  return value
    .normalize("NFKC")
    .toLocaleLowerCase("ko-KR")
    .replace(/[^a-z0-9가-힣]+/g, "-")
    .replace(/^-|-$/g, "");
}

function makeUniqueSlug(base: string, marathons: Marathon[]) {
  const slugs = new Set(marathons.map((item) => item.slug));
  if (!slugs.has(base)) return base;
  let suffix = 2;
  while (slugs.has(`${base}-${suffix}`)) suffix += 1;
  return `${base}-${suffix}`;
}

function nullableDate(value: string) {
  return value && z.iso.date().safeParse(value).success ? value : null;
}

function nullableTime(value: string) {
  return value && /^([01]\d|2[0-3]):[0-5]\d$/.test(value) ? value : null;
}

function nullableUrl(value: string) {
  return value && z.url().safeParse(value).success ? value : null;
}

function nullableNumber(value: string) {
  if (!value) return null;
  const number = Number(value);
  return Number.isFinite(number) ? number : null;
}

function parseKeyValueLines(value: string, numeric: false): Record<string, string> | null;
function parseKeyValueLines(value: string, numeric: true): Record<string, number | string> | null;
function parseKeyValueLines(value: string, numeric: boolean) {
  const entries = value.split("\n").map((line) => line.trim()).filter(Boolean);
  if (entries.length === 0) return null;
  return Object.fromEntries(entries.map((line) => {
    const spacedSeparator = line.indexOf(": ");
    const separator = spacedSeparator >= 0 ? spacedSeparator : line.indexOf(":");
    const key = (separator >= 0 ? line.slice(0, separator) : line).trim();
    const raw = (separator >= 0 ? line.slice(separator + (spacedSeparator >= 0 ? 2 : 1)) : "").trim();
    return [key, numeric && Number.isFinite(Number(raw)) ? Number(raw) : raw];
  }));
}
