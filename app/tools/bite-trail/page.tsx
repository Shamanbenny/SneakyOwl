import { Poppins } from "next/font/google";
import Link from "next/link";
import { FaMapLocationDot } from "react-icons/fa6";

import BiteTrailAuthPanel from "@/app/components/tools/bite-trail/BiteTrailAuthPanel";
import NavBar from "@/app/components/shared/navigation/NavBar";

const biteTrailFont = Poppins({ weight: "400", subsets: ["latin"] });

export default function BiteTrailPage() {
  return (
    <div className={`site-page-shell min-h-screen ${biteTrailFont.className}`}>
      <NavBar />
      <main
        className="mx-auto grid min-h-screen content-center gap-6 pt-[96px]
          max-sm:w-[300px] max-xs:w-[230px] sm:w-[560px] md:w-[680px]
          lg:w-[910px] xl:w-[1160px] xxl:w-[1480px]"
      >
        <section className="grid gap-6 lg:grid-cols-[minmax(0,1.15fr)_minmax(360px,0.85fr)] lg:items-stretch">
          <div className="site-surface-card flex min-h-[420px] flex-col justify-between overflow-hidden rounded-[26px] p-6 sm:p-8">
            <div>
              <p className="mb-4 inline-flex items-center gap-4 rounded-[16px] border border-[color:var(--site-accent-border-soft)] bg-[color:rgba(16,185,129,0.1)] px-6 py-1.5 text-[2.4rem] font-semibold text-[color:var(--site-accent-soft)]">
                <FaMapLocationDot className="h-10 w-10" />
                BiteTrail
              </p>
              <h1 className="text-[2.2rem] font-semibold leading-tight text-[color:var(--site-text-strong)] sm:text-[3rem] lg:text-[3.4rem]">
                Your meal map starts here.
              </h1>
              <p className="mt-5 text-[1rem] leading-8 text-[color:var(--site-text)]">
                Sign in now to confirm the Firebase project is wired correctly.
                Map pins, sharing, QR invites, and friend watch lists will build
                on top of this account layer next.
              </p>
            </div>
            <div className="mt-8 grid grid-cols-1 gap-3 text-[0.82rem] text-[color:var(--site-text-muted)] sm:grid-cols-3">
              <div className="rounded-[16px] border border-[color:var(--site-border)] bg-[color:var(--site-bg-soft)] p-4">
                Google auth
              </div>
              <div className="rounded-[16px] border border-[color:var(--site-border)] bg-[color:var(--site-bg-soft)] p-4">
                Firebase sync
              </div>
              <div className="rounded-[16px] border border-[color:var(--site-border)] bg-[color:var(--site-bg-soft)] p-4">
                Map tools next
              </div>
            </div>
            <Link
              href="/privacy"
              className="mt-5 inline-flex w-fit text-[0.9rem] text-[color:var(--site-accent-soft)] underline-offset-4 hover:underline"
            >
              Privacy Policy
            </Link>
          </div>

          <BiteTrailAuthPanel />
        </section>
      </main>
    </div>
  );
}
