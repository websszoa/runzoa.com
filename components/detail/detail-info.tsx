import type { Marathon } from "@/lib/marathons";
import { Badge } from "@/components/ui/badge";
import {
  Activity,
  Building2,
  Camera,
  Calendar,
  CalendarCheck,
  Cherry,
  CircleDollarSign,
  Clock,
  Feather,
  Gift,
  Handshake,
  ListChecks,
  MapPin,
  Phone,
  Tag,
  Users,
} from "lucide-react";
import {
  formatMarathonDate,
  formatMarathonPrices,
  getMarathonDDay,
} from "@/lib/utils";

interface InfoRowProps {
  icon: React.ReactNode;
  label: string;
  value: React.ReactNode;
}

function InfoRow({ icon, label, value }: InfoRowProps) {
  return (
    <li className="flex items-start gap-3">
      <span className="mt-0.5" aria-hidden="true">
        {icon}
      </span>
      <span className="w-20 shrink-0 whitespace-nowrap text-muted-foreground">
        {label}
      </span>
      <span className="min-w-0 flex-1 break-keep text-muted-foreground">
        {value}
      </span>
    </li>
  );
}

export default function DetailInfo({ marathon }: { marathon: Marathon }) {
  const location = [marathon.location.region, marathon.location.venue]
    .filter(Boolean)
    .join(" · ");
  const distances = Object.keys(marathon.registration.price);
  const instagramHref = marathon.hosts.instagram
    ? marathon.hosts.instagram.startsWith("http")
      ? marathon.hosts.instagram
      : `https://www.instagram.com/${marathon.hosts.instagram.replace(/^@/, "")}`
    : null;
  const rows = [
    marathon.info.type
      ? {
          icon: <Tag className="size-4 shrink-0 text-violet-500" />,
          label: "대회 유형",
          value: marathon.info.type,
        }
      : null,
    {
      icon: <Calendar className="size-4 shrink-0 text-blue-500" />,
      label: "대회 기간",
      value: formatPeriod(
        marathon.event.startDate,
        marathon.event.endDate,
        null,
      ),
    },
    marathon.registration.startDate
      ? {
          icon: <CalendarCheck className="size-4 shrink-0 text-indigo-500" />,
          label: "접수 기간",
          value: formatPeriod(
            marathon.registration.startDate,
            marathon.registration.endDate,
            marathon.registration.startTime,
          ),
        }
      : null,
    location
      ? {
          icon: <MapPin className="size-4 shrink-0 text-rose-500" />,
          label: "장소",
          value: location,
        }
      : null,
    distances.length
      ? {
          icon: <Activity className="size-4 shrink-0 text-orange-500" />,
          label: "종목",
          value: distances.join(", "),
        }
      : null,
    distances.length
      ? {
          icon: (
            <CircleDollarSign className="size-4 shrink-0 text-emerald-500" />
          ),
          label: "참가비",
          value: formatMarathonPrices(marathon.registration.price),
        }
      : null,
    marathon.info.scale
      ? {
          icon: <Users className="size-4 shrink-0 text-sky-500" />,
          label: "규모",
          value: `약 ${marathon.info.scale.toLocaleString("ko-KR")}명`,
        }
      : null,
    marathon.info.souvenir
      ? {
          icon: <Gift className="size-4 shrink-0 text-pink-500" />,
          label: "기념품",
          value: marathon.info.souvenir,
        }
      : null,
    marathon.hosts.organizer
      ? {
          icon: <Building2 className="size-4 shrink-0 text-rose-500" />,
          label: "주최",
          value: marathon.hosts.organizer,
        }
      : null,
    marathon.hosts.manager
      ? {
          icon: <Handshake className="size-4 shrink-0 text-orange-500" />,
          label: "주관",
          value: marathon.hosts.manager,
        }
      : null,
    marathon.hosts.phone
      ? {
          icon: <Phone className="size-4 shrink-0 text-emerald-500" />,
          label: "연락처",
          value: (
            <a
              href={`tel:${marathon.hosts.phone.replaceAll("-", "")}`}
              className="underline underline-offset-4 hover:text-brand"
            >
              {marathon.hosts.phone}
            </a>
          ),
        }
      : null,
    instagramHref
      ? {
          icon: <Camera className="size-4 shrink-0 text-pink-500" />,
          label: "인스타",
          value: (
            <a
              href={instagramHref}
              target="_blank"
              rel="noreferrer"
              className="underline underline-offset-4 hover:text-brand"
            >
              Instagram
            </a>
          ),
        }
      : null,
    marathon.info.park
      ? {
          icon: <Feather className="size-4 shrink-0 text-violet-500" />,
          label: "주차",
          value: marathon.info.park,
        }
      : null,
    marathon.info.program
      ? {
          icon: <ListChecks className="size-4 shrink-0 text-violet-500" />,
          label: "프로그램",
          value: marathon.info.program,
        }
      : null,
    marathon.info.memo
      ? {
          icon: <Cherry className="size-4 shrink-0 text-violet-500" />,
          label: "메모",
          value: marathon.info.memo,
        }
      : null,
  ].filter(Boolean) as InfoRowProps[];

  return (
    <div className="h-full overflow-hidden rounded-2xl border bg-card shadow-none">
      <div className="flex min-h-16 items-center gap-2.5 border-b px-5 sm:px-6">
        <Clock className="size-5 shrink-0 text-brand" aria-hidden="true" />
        <h2 className="font-paperlogy text-lg font-semibold">대회 정보</h2>
        <Badge className="ml-auto bg-brand font-anyvid text-white">
          {getMarathonDDay(marathon.event.startDate)}
        </Badge>
      </div>

      <div className="p-4 md:p-6">
        <ul
          className="space-y-3 font-anyvid text-sm"
          aria-label="대회 정보 목록"
        >
          {rows.map((row) => (
            <InfoRow key={row.label} {...row} />
          ))}
        </ul>
      </div>
    </div>
  );
}

function formatPeriod(
  startDate: string,
  endDate: string | null,
  startTime: string | null,
) {
  const start = `${formatMarathonDate(startDate)}${startTime ? ` ${startTime}` : ""}`;
  if (!endDate || endDate === startDate) return start;
  return `${start} ~ ${formatMarathonDate(endDate)}`;
}
