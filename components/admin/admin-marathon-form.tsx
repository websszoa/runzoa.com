"use client";

import { useActionState, type ComponentProps, type ReactNode } from "react";
import { LoaderCircle, Save } from "lucide-react";

import {
  createMarathon,
  type CreateMarathonState,
} from "@/app/admin/marathons/actions";
import { Button } from "@/components/ui/button";
import { Field, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const initialState: CreateMarathonState = {};

export default function AdminMarathonForm({ onCancel }: { onCancel?: () => void }) {
  const [state, formAction, pending] = useActionState(
    createMarathon,
    initialState,
  );

  return (
    <form action={formAction} className="space-y-6 font-anyvid">
        <div className="rounded-lg border bg-white px-5 py-4">
          <h2 className="font-paperlogy text-lg font-semibold">마라톤 등록</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            등록한 정보는 marathons_2026.json에 바로 저장됩니다.
          </p>
        </div>
        {state.error && (
          <p role="alert" className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {state.error}
          </p>
        )}

        <FormSection title="기본 정보" description="대회명과 종목 정보를 입력하세요.">
          <FormInput label="대회명" name="name" required placeholder="제33회 경주 벚꽃 마라톤대회" className="sm:col-span-2" />
          <FormInput label="슬러그" name="slug" placeholder="비워두면 대회명으로 자동 생성" />
          <FormInput label="대회 유형" name="type" defaultValue="마라톤" required />
          <FormInput label="참가 규모" name="scale" type="number" min="0" placeholder="15000" />
          <FormInput label="프로그램·종목" name="program" placeholder="5km, 10km, 하프" />
          <FormInput label="공원" name="park" />
          <FormInput label="기념품" name="souvenir" />
          <FormTextarea label="설명" name="description" placeholder="대회에 대한 소개를 입력하세요." className="sm:col-span-2" />
          <FormTextarea label="메모" name="memo" className="sm:col-span-2" />
        </FormSection>

        <FormSection title="개최 정보" description="실제 대회가 열리는 날짜와 홈페이지 정보입니다.">
          <FormInput label="개최 시작일" name="eventStartDate" type="date" required />
          <FormInput label="개최 종료일" name="eventEndDate" type="date" />
          <FormInput label="시작 시간" name="eventStartTime" type="time" />
          <FormInput label="종료 시간" name="eventEndTime" type="time" />
          <FormInput label="공식 홈페이지" name="eventSite" type="url" placeholder="https://example.com" className="sm:col-span-2" />
          <FormTextarea
            label="세부 일정"
            name="schedule"
            placeholder={"06:30: 참가자 집결\n08:00: 대회 시작\n11:00: 대회 종료"}
            description="한 줄에 시간: 내용 형식으로 입력하세요."
            className="sm:col-span-2"
          />
        </FormSection>

        <FormSection title="접수 정보" description="참가 신청 기간과 종목별 참가비를 입력하세요.">
          <FormInput label="접수 시작일" name="registrationStartDate" type="date" />
          <FormInput label="접수 종료일" name="registrationEndDate" type="date" />
          <FormInput label="접수 시작 시간" name="registrationStartTime" type="time" />
          <FormInput label="접수 종료 시간" name="registrationEndTime" type="time" />
          <FormInput label="접수 홈페이지" name="registrationSite" type="url" placeholder="https://example.com" />
          <FormInput label="접수 상태" name="registrationStatus" placeholder="접수 예정, 접수 중, 접수 마감" />
          <FormTextarea
            label="종목별 참가비"
            name="price"
            placeholder={"5km: 30000\n10km: 50000\n하프: 50000"}
            description="한 줄에 종목: 금액 형식으로 입력하세요."
            className="sm:col-span-2"
          />
        </FormSection>

        <FormSection title="장소 정보" description="대회 개최 지역과 좌표를 입력하세요.">
          <FormInput label="국가" name="country" defaultValue="KR" />
          <FormInput label="지역" name="region" placeholder="경북" />
          <FormInput label="장소" name="venue" placeholder="보문관광단지" />
          <FormInput label="주소" name="address" />
          <FormInput label="위도" name="latitude" type="number" step="any" />
          <FormInput label="경도" name="longitude" type="number" step="any" />
        </FormSection>

        <FormSection title="주최 정보" description="운영 단체와 연락처를 입력하세요.">
          <FormInput label="주최" name="organizer" />
          <FormInput label="주관" name="manager" />
          <FormInput label="후원" name="sponsor" />
          <FormInput label="전화번호" name="phone" type="tel" />
          <FormInput label="이메일" name="email" type="email" />
          <FormInput label="인스타그램" name="instagram" type="url" />
          <FormTextarea
            label="블로그 주소"
            name="blog"
            placeholder={"https://blog.naver.com/example\nhttps://example.com/news"}
            description="주소가 여러 개라면 한 줄에 하나씩 입력하세요."
            className="sm:col-span-2"
          />
        </FormSection>

        <div className="flex justify-end gap-2 border-t pt-6">
          <Button type="button" variant="outline" onClick={onCancel}>
            취소
          </Button>
          <Button type="submit" disabled={pending}>
            {pending ? <LoaderCircle className="size-4 animate-spin" /> : <Save className="size-4" />}
            {pending ? "저장 중" : "대회 등록"}
          </Button>
        </div>
    </form>
  );
}

function FormSection({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: ReactNode;
}) {
  return (
    <section className="rounded-lg border bg-white p-5 sm:p-6">
      <div className="mb-6 border-b pb-4">
        <h2 className="font-paperlogy text-lg font-semibold">{title}</h2>
        <p className="mt-1 text-sm text-muted-foreground">{description}</p>
      </div>
      <div className="grid gap-5 sm:grid-cols-2">{children}</div>
    </section>
  );
}

function FormInput({ label, className, ...props }: ComponentProps<typeof Input> & { label: string }) {
  const id = String(props.name);
  return (
    <Field className={className}>
      <FieldLabel htmlFor={id}>{label}{props.required && <span className="text-brand"> *</span>}</FieldLabel>
      <Input id={id} {...props} />
    </Field>
  );
}

function FormTextarea({
  label,
  description,
  className,
  ...props
}: ComponentProps<typeof Textarea> & { label: string; description?: string }) {
  const id = String(props.name);
  return (
    <Field className={className}>
      <FieldLabel htmlFor={id}>{label}</FieldLabel>
      <Textarea id={id} rows={4} {...props} />
      {description && <p className="text-xs text-muted-foreground">{description}</p>}
    </Field>
  );
}
