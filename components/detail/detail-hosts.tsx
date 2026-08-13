import type { Marathon } from "@/lib/marathons";
import {
  Building2,
  Camera,
  ExternalLink,
  Ghost,
  Globe,
  Handshake,
  Mail,
  Phone,
} from "lucide-react";

export default function DetailHosts({ marathon }: { marathon: Marathon }) {
  const { hosts } = marathon;
  const isEmpty =
    !hosts.organizer &&
    !hosts.manager &&
    !hosts.email &&
    !hosts.phone &&
    !marathon.event.site &&
    !hosts.instagram;
  const instagramHref = hosts.instagram
    ? hosts.instagram.startsWith("http")
      ? hosts.instagram
      : `https://www.instagram.com/${hosts.instagram.replace(/^@/, "")}`
    : null;

  return (
    <div className="overflow-hidden rounded-2xl border bg-card shadow-none">
      <div className="flex min-h-16 items-center gap-2.5 border-b px-5 sm:px-6">
        <Building2
          className="size-5 shrink-0 text-brand"
          aria-hidden="true"
        />
        <h2 className="font-paperlogy text-lg font-semibold">주최/주관</h2>
      </div>

      {isEmpty ? (
        <div className="p-4 md:p-6">
          <div className="rounded border border-dashed py-12 text-center font-anyvid text-sm text-muted-foreground">
            <Ghost
              className="mx-auto mb-2 size-14 text-brand"
              aria-hidden="true"
            />
            주최/주관 정보가 없습니다.
          </div>
        </div>
      ) : (
        <ul
          className="space-y-3 p-4 font-anyvid text-sm md:p-6"
          aria-label="주최 및 주관 정보"
        >
          {hosts.organizer ? (
            <HostRow
              icon={Building2}
              iconClassName="text-rose-500"
              label="주최"
            >
              {hosts.organizer}
            </HostRow>
          ) : null}
          {hosts.manager ? (
            <HostRow
              icon={Handshake}
              iconClassName="text-orange-500"
              label="주관"
            >
              {hosts.manager}
            </HostRow>
          ) : null}
          {hosts.email ? (
            <HostRow icon={Mail} iconClassName="text-blue-500" label="이메일">
              <a
                href={`mailto:${hosts.email}`}
                className="break-all underline underline-offset-4 hover:text-brand"
              >
                {hosts.email}
              </a>
            </HostRow>
          ) : null}
          {hosts.phone ? (
            <HostRow
              icon={Phone}
              iconClassName="text-emerald-500"
              label="연락처"
            >
              <a
                href={`tel:${hosts.phone.replaceAll("-", "")}`}
                className="underline underline-offset-4 hover:text-brand"
              >
                {hosts.phone}
              </a>
            </HostRow>
          ) : null}
          {marathon.event.site ? (
            <HostRow icon={Globe} iconClassName="text-sky-500" label="사이트">
              <a
                href={marathon.event.site}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 underline underline-offset-4 hover:text-brand"
              >
                공식 사이트
                <ExternalLink className="size-3.5" aria-hidden="true" />
              </a>
            </HostRow>
          ) : null}
          {instagramHref ? (
            <HostRow
              icon={Camera}
              iconClassName="text-pink-500"
              label="인스타"
            >
              <a
                href={instagramHref}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 underline underline-offset-4 hover:text-brand"
              >
                Instagram
                <ExternalLink className="size-3.5" aria-hidden="true" />
              </a>
            </HostRow>
          ) : null}
        </ul>
      )}
    </div>
  );
}

function HostRow({
  icon: Icon,
  iconClassName,
  label,
  children,
}: {
  icon: typeof Building2;
  iconClassName: string;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <li className="flex items-start gap-3 text-muted-foreground">
      <Icon
        className={`mt-0.5 size-4 shrink-0 ${iconClassName}`}
        aria-hidden="true"
      />
      <span className="w-12 shrink-0">{label}</span>
      <span className="min-w-0 flex-1 break-keep">{children}</span>
    </li>
  );
}
