import { Suspense } from "react";

import BiteTrailAddPanel from "@/app/components/tools/bite-trail/BiteTrailAddPanel";
import NavBar from "@/app/components/shared/navigation/NavBar";

export default function BiteTrailAddPage() {
  return (
    <div className="site-page-shell min-h-screen">
      <NavBar />
      <main className="mx-auto flex min-h-screen items-center px-4 pt-[100px] max-sm:w-[300px] max-xs:w-[230px] sm:w-[560px] md:w-[680px] lg:w-[910px]">
        <Suspense
          fallback={
            <div className="site-surface-card rounded-[26px] p-6 text-[color:var(--site-text-muted)]">
              Loading BiteTrail add link...
            </div>
          }
        >
          <BiteTrailAddPanel />
        </Suspense>
      </main>
    </div>
  );
}
