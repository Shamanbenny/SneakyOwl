import { Suspense } from "react";

import BiteTrailJoinPanel from "@/app/components/tools/bite-trail/BiteTrailJoinPanel";
import NavBar from "@/app/components/shared/navigation/NavBar";

export default function BiteTrailJoinPage() {
  return (
    <div className="site-page-shell min-h-screen">
      <NavBar />
      <main className="mx-auto flex min-h-screen items-center px-4 pt-[100px] max-sm:w-[300px] max-xs:w-[230px] sm:w-[560px] md:w-[680px] lg:w-[910px]">
        <Suspense
          fallback={
            <div className="site-surface-card rounded-[26px] p-6 text-[color:var(--site-text-muted)]">
              Loading friend link...
            </div>
          }
        >
          <BiteTrailJoinPanel />
        </Suspense>
      </main>
    </div>
  );
}
