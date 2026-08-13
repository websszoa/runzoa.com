import type { MarathonHeaderContent } from "@/lib/marathons";

type MarathonHeaderProps = MarathonHeaderContent;

export default function MarathonHeader({
  icon: Icon,
  eyebrow,
  title,
  description,
  features,
}: MarathonHeaderProps) {
  return (
    <section className="relative overflow-hidden">
      <div
        aria-hidden="true"
        className="absolute -top-40 right-[4%] -z-10 size-96 rounded-full bg-brand/10 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="absolute -bottom-48 -left-28 -z-10 size-80 rounded-full bg-orange-200/30 blur-3xl"
      />
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-18 lg:px-8 lg:py-22">
        <div className="max-w-3xl">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border bg-background px-3 py-1.5 font-anyvid text-sm text-muted-foreground">
            <Icon aria-hidden="true" className="size-3.5 text-brand" />
            {eyebrow}
          </div>
          <h1 className="font-paperlogy text-4xl leading-[1.2] font-semibold tracking-tight text-balance sm:text-5xl lg:text-6xl">
            {title.map((line, index) => (
              <span key={line}>
                {index > 0 ? <br /> : null}
                {line}
              </span>
            ))}
          </h1>
          <p className="mt-5 max-w-2xl font-anyvid text-sm leading-6 text-muted-foreground sm:text-[15px]">
            {description.map((line, index) => (
              <span key={line} className={index > 0 ? "hidden sm:inline" : undefined}>
                {index > 0 ? <br className="hidden sm:block" /> : null}
                {line}
              </span>
            ))}
          </p>
          <div className="mt-7 flex flex-wrap gap-x-6 gap-y-3 font-anyvid text-sm text-muted-foreground">
            {features.map(({ icon: FeatureIcon, label }) => (
              <span key={label} className="flex items-center gap-2">
                <FeatureIcon
                  aria-hidden="true"
                  className="size-4 text-brand"
                />
                {label}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
