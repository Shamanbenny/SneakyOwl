import BiteTrailAuthPanel from "@/app/components/tools/bite-trail/BiteTrailAuthPanel";
import BiteTrailSparklesTitle from "@/app/components/tools/bite-trail/BiteTrailSparklesTitle";
import BiteTrailWorkspace from "@/app/components/tools/bite-trail/BiteTrailWorkspace";
import NavBar from "@/app/components/shared/navigation/NavBar";

export default function BiteTrailPage() {
  return (
    <div className="site-page-shell min-h-screen">
      <NavBar />
      <main
        className="mx-auto grid min-h-screen content-center gap-6 pt-[100px] max-sm:w-[300px]
          max-sm:pt-4 max-xs:w-[230px] sm:w-[560px] md:w-[680px]
          lg:w-[910px] xl:w-[1160px] xxl:w-[1480px]"
      >
        <BiteTrailSparklesTitle>
          <section className="grid gap-6 lg:items-stretch xl:grid-cols-[minmax(0,1.4fr)_minmax(360px,0.7fr)] xxl:grid-cols-[minmax(0,1.15fr)_minmax(360px,0.85fr)]">
            <div className="site-surface-card flex min-h-[200px] flex-col justify-between overflow-hidden rounded-[26px] border-[color:var(--site-accent-border-subtle)] p-6 shadow-[0_18px_45px_rgba(0,0,0,0.24),0_0_18px_rgba(16,185,129,0.035)] sm:p-6">
              <div>
                <h2 className="font-semibold leading-tight text-[color:var(--site-text-strong)] xs:text-[1.9rem] sm:text-[2rem] md:text-[2.2rem] lg:text-[3rem] xl:text-[2.9rem] xxl:text-[3.4rem]">
                  <span className="text-[color:var(--site-accent)]">
                    Your meal map
                  </span>{" "}
                  starts here.
                </h2>
                <p className="mt-5 text-[1rem] leading-8 text-[color:var(--site-text)]">
                  Insert general description about Bite Trail here. This should
                  not only work when the user is logged in, but should also make
                  sense when the user is not logged in.
                </p>
              </div>
            </div>

            <BiteTrailAuthPanel />
          </section>
          <div className="mt-6">
            <BiteTrailWorkspace />
          </div>
        </BiteTrailSparklesTitle>
      </main>
    </div>
  );
}
