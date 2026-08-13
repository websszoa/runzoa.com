import { ArrowRight, Mail } from "lucide-react";
import DialogNewsletter from "@/components/dialog/dialog-newsletter";

export default function MainNewsletter() {
  return (
    <section
      aria-labelledby="main-newsletter-title"
      className="bg-background border-t"
    >
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
        <div className="relative overflow-hidden rounded-3xl border-1 border-zinc-200 bg-[#fffdf9] px-6 py-16 text-center shadow-[0_18px_60px_rgba(75,32,20,0.06)] sm:px-10 sm:py-20 lg:py-24">
          <div
            className="absolute inset-x-0 top-0 h-2 bg-[repeating-linear-gradient(135deg,#f1170f_0_18px,#fffdf9_18px_28px,#fb923c_28px_46px,#fffdf9_46px_56px)]"
            aria-hidden="true"
          />
          <div
            className="absolute inset-x-0 bottom-0 h-2 bg-[repeating-linear-gradient(135deg,#f1170f_0_18px,#fffdf9_18px_28px,#fb923c_28px_46px,#fffdf9_46px_56px)]"
            aria-hidden="true"
          />
          <div
            className="pointer-events-none absolute inset-3 rounded-[18px] border border-dashed border-zinc-200"
            aria-hidden="true"
          />

          <div
            className="absolute top-8 right-8 hidden rotate-6 rounded-2xl border-2 border-brand/20 px-4 py-3 text-center sm:block"
            aria-hidden="true"
          >
            <p className="font-paperlogy text-2xl font-black tracking-tight text-brand/25">
              RZ
            </p>
            <p className="font-anyvid text-[9px] font-semibold tracking-[0.18em] text-brand/35 uppercase">
              Weekly post
            </p>
          </div>

          <div
            className="absolute bottom-9 left-8 hidden w-28 space-y-1.5 opacity-35 sm:block"
            aria-hidden="true"
          >
            <span className="block h-px w-full bg-zinc-400" />
            <span className="block h-px w-4/5 bg-zinc-400" />
            <span className="block h-px w-3/5 bg-zinc-400" />
          </div>

          <div className="relative mx-auto max-w-3xl">
            <p className="inline-flex items-center gap-2 rounded-full border border-brand/25 bg-white px-3 py-1.5 font-paperlogy text-xs font-semibold text-brand">
              <Mail className="size-3.5" aria-hidden="true" />
              RUNZOA NEWSLETTER
            </p>

            <h2
              id="main-newsletter-title"
              className="mt-6 font-paperlogy text-3xl leading-[1.12] font-semibold tracking-tight text-balance sm:text-5xl lg:text-5xl"
            >
              놓치기 아쉬운 러닝 소식,
              <br />
              런조아 뉴스레터에서 만나보세요!
            </h2>

            <p className="mx-auto mt-5 max-w-2xl font-anyvid text-sm leading-6 text-muted-foreground sm:text-[15px]">
              새롭게 등록된 대회와 접수 오픈 일정, 러너에게 필요한 이야기를
              한눈에 전해드려요.
            </p>

            <DialogNewsletter
              subscriptionSource="메인 구독 배너"
              className="mt-8 inline-flex h-11 items-center justify-center gap-2 rounded-full bg-brand px-6 font-anyvid text-sm font-semibold text-white transition-all hover:-translate-y-0.5 hover:bg-brand/90"
            >
              뉴스레터 구독하기
              <ArrowRight className="size-4" aria-hidden="true" />
            </DialogNewsletter>
          </div>
        </div>
      </div>
    </section>
  );
}
