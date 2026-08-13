import { Clock3, type LucideIcon } from "lucide-react";

type PageTitleProps = {
  icon: LucideIcon;
  eyebrow: string;
  title: string;
  description: string;
  meta?: string;
};

export default function PageTitle({
  icon: Icon,
  eyebrow,
  title,
  description,
  meta,
}: PageTitleProps) {
  return (
    <header className="relative overflow-hidden border-b bg-muted/20">
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[linear-gradient(to_right,var(--color-border)_1px,transparent_1px),linear-gradient(to_bottom,var(--color-border)_1px,transparent_1px)] bg-[size:40px_40px] opacity-30 [mask-image:linear-gradient(to_bottom,black,transparent)]"
      />
      <div className="relative mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-16 lg:px-8">
        <div className="flex size-11 items-center justify-center rounded-xl border bg-background text-brand">
          <Icon aria-hidden="true" className="size-5" />
        </div>
        <p className="mt-5 font-paperlogy text-xs font-semibold tracking-[0.18em] text-brand">
          {eyebrow}
        </p>
        <h1 className="mt-2 -ml-0.5 font-paperlogy text-3xl font-semibold tracking-tight sm:text-5xl">
          {title}
        </h1>
        <p className="mt-4 break-keep font-anyvid text-sm leading-6 text-muted-foreground sm:text-[15px]">
          {description}
        </p>
        {meta && (
          <p className="mt-5 flex items-center gap-2 font-anyvid text-xs text-muted-foreground">
            <Clock3 aria-hidden="true" className="size-3.5" />
            {meta}
          </p>
        )}
      </div>
    </header>
  );
}
