import { Skeleton } from "@/app/components/shared/ui/skeleton";

const shellContainerClassName =
  "mx-auto max-sm:w-[300px] max-xs:w-[230px] sm:w-[560px] md:w-[680px] lg:w-[910px] xl:w-[1160px] xxl:w-[1480px]";

const sectionHeadingClassName =
  "mt-8 mb-6 h-8 xxl:h-10 w-[200px] rounded-full mx-auto md:w-[260px]";

export const ProfileHoloCardSkeleton = () => (
  <div className="flex w-full max-w-[350px] flex-col items-center gap-5">
    <Skeleton className="h-[450px] w-full rounded-[1.75rem] sm:h-[530px] xl:mt-[155px] xl:h-[470px] xxl:mt-12 xxl:h-[510px]" />
    <Skeleton className="h-11 w-[110px] rounded-[0.75rem] xxl:h-14 xxl:w-[130px]" />
  </div>
);

export const LandingPageSkeleton = () => (
  <div
    className="site-page-shell min-h-screen transition-colors duration-150 ease-linear xs:pt-[80px] sm:pt-[100px] xl:pt-[80px] xxl:pt-[130px]"
    aria-hidden="true"
  >
    <div
      className="mx-auto grid w-full items-start gap-6 pb-10
        max-sm:w-[300px] max-sm:grid-cols-1 max-xs:max-w-[230px]
        sm:max-w-[560px] sm:grid-cols-1 sm:px-5 md:max-w-[680px] md:px-5
        lg:max-w-[910px] lg:grid-cols-1 lg:px-10 xl:max-w-[1160px]
        xl:grid-cols-[7fr_3fr] xl:gap-10 xl:px-[40px]
        xxl:max-w-[1480px] xxl:grid-cols-[3fr_1fr] xxl:px-[40px]"
    >
      <div className="order-2 max-lg:mx-auto max-lg:w-full">
        {/* Name */}
        <Skeleton className="mt-[-5px] sm:mt-[0px] mb-2 sm:mb-4 h-6 sm:h-7 rounded-full max-md:mx-auto w-[240px] sm:w-[400px] md:w-[480px] md:h-10 lg:w-[480px] xl:mt-4 xl:h-10 xl:w-[75%] xxl:mt-6 xxl:h-14 xxl:w-[60%]" />
        <div className="mb-6 flex gap-3 max-md:flex-col max-lg:items-center">
          <Skeleton className="h-3 w-[250px] rounded-full sm:h-5 sm:w-[360px] md:w-[340px] lg:w-[400px] xl:w-[400px] xl:h-8 xxl:w-[520px]" />
          <Skeleton className="h-3 w-[150px] rounded-full sm:h-5 sm:w-[220px] md:w-[200px] lg:w-[260px] xl:w-[225px] xl:h-8 xxl:w-[260px]" />
        </div>
        {/* Bento Box */}
        <div className="mx-0 my-5 grid gap-2 sm:grid-cols-2 mx-5 lg:grid-cols-3 xxl:grid-cols-4">
          <Skeleton className="h-[290px] rounded-[1.5rem] sm:h-[200px] md:h-[215px] xl:h-[225px] xxl:h-[250px] sm:col-span-2" />
          <Skeleton className="h-[180px] rounded-[1.5rem] sm:h-[200px] md:h-[215px] xl:h-[225px] xxl:h-[250px]" />
          <Skeleton className="h-[190px] rounded-[1.5rem] sm:h-[200px] md:h-[215px] xl:h-[225px] xxl:h-[250px]" />
          <Skeleton className="h-[180px] rounded-[1.5rem] sm:h-[200px] md:h-[215px] xl:h-[225px] xxl:h-[250px]" />
          <Skeleton className="h-[180px] rounded-[1.5rem] sm:h-[200px] md:h-[215px] xl:h-[225px] xxl:h-[250px]" />
          <Skeleton className="h-[180px] rounded-[1.5rem] sm:h-[200px] md:h-[215px] xl:h-[225px] xxl:h-[250px]" />
          <Skeleton className="h-[180px] rounded-[1.5rem] sm:h-[200px] md:h-[215px] xl:h-[225px] xxl:h-[250px]" />
        </div>
      </div>

      <div className="order-1 flex justify-center pb-3 sm:pb-5 lg:pb-6 xl:order-2 xl:pb-0">
        <ProfileHoloCardSkeleton />
      </div>
    </div>

    {/* Projects Section */}
    <section className={`${shellContainerClassName} pb-10`}>
      <Skeleton className={sectionHeadingClassName} />
      <div className="grid gap-8 xl:grid-cols-[2fr_1fr]">
        <Skeleton className="h-[750px] xxl:h-[875px] rounded-[1.5rem]" />
        <Skeleton className="h-[750px] xxl:h-[875px] rounded-[1.5rem]" />
      </div>
    </section>

    {/* Skills Section */}
    <section className={`${shellContainerClassName} pb-10`}>
      <Skeleton className={sectionHeadingClassName} />
      <Skeleton className="mb-11 h-[110px] rounded-[1.5rem]" />
      <div className="grid gap-8 xl:grid-cols-[1fr_2fr]">
        <Skeleton className="h-[535px] rounded-[1.5rem]" />
        <Skeleton className="h-[535px] rounded-[1.5rem]" />
      </div>
    </section>
    
    {/* Timeline Section */}
    <section className={`${shellContainerClassName} pb-10`}>
      <Skeleton className={`${sectionHeadingClassName} mx-auto`} />
      <Skeleton className="my-4 h-[350px] rounded-[1.5rem]" />
      <Skeleton className="my-4 h-[350px] rounded-[1.5rem]" />
    </section>
  </div>
);

export const ChessPageSkeleton = () => (
  <div
    className="site-page-shell min-h-screen pt-[92px] transition-colors duration-150 ease-linear sm:pt-[130px]"
    aria-hidden="true"
  >
    <div id="chess" className={`${shellContainerClassName} pb-[50px]`}>
      <div className="flex flex-col items-center">
        <Skeleton className="mt-5 h-14 w-[280px] rounded-full sm:w-[420px]" />
        <Skeleton className="mt-8 h-[220px] w-full rounded-[1.5rem]" />
        <Skeleton className="mt-6 h-8 w-[150px] rounded-full" />
        <Skeleton className="mt-4 aspect-square w-full max-w-[500px] rounded-[1rem]" />
        <Skeleton className="mt-6 h-11 w-full max-w-[550px] rounded-md" />
        <Skeleton className="mt-3 h-10 w-[140px] rounded-md" />
        <Skeleton className="mt-6 h-10 w-[220px] rounded-md" />
        <Skeleton className="mt-6 h-[260px] w-full rounded-[1.5rem]" />
      </div>
    </div>
  </div>
);

export const BlogListingSkeleton = () => (
  <div className="blog-list-page" aria-hidden="true">
    <div className="blog-shell">
      <div className="blog-hero">
        <Skeleton className="h-4 w-36 rounded-full" />
        <Skeleton className="mt-4 h-[150px] w-full rounded-[20px] sm:h-[190px] lg:h-[240px]" />
        <Skeleton className="h-5 w-full max-w-[520px] rounded-full" />
      </div>

      <div className="blog-filter-panel">
        <div className="blog-filter-group">
          <Skeleton className="h-4 w-14 rounded-full" />
          <div className="flex flex-wrap gap-3">
            <Skeleton className="h-10 w-20 rounded-full" />
            <Skeleton className="h-10 w-24 rounded-full" />
            <Skeleton className="h-10 w-24 rounded-full" />
          </div>
        </div>
        <div className="blog-filter-group">
          <Skeleton className="h-4 w-16 rounded-full" />
          <Skeleton className="h-11 w-full rounded-[1rem]" />
        </div>
        <div className="blog-filter-group">
          <Skeleton className="h-4 w-10 rounded-full" />
          <div className="flex flex-wrap gap-3">
            <Skeleton className="h-10 w-24 rounded-full" />
            <Skeleton className="h-10 w-24 rounded-full" />
            <Skeleton className="h-10 w-28 rounded-full" />
            <Skeleton className="h-10 w-20 rounded-full" />
          </div>
        </div>
      </div>

      <div className="blog-list-grid">
        {Array.from({ length: 4 }).map((_, index) => (
          <div key={index} className="blog-card">
            <Skeleton className="h-4 w-[240px] rounded-full" />
            <Skeleton className="mt-5 h-8 w-[80%] rounded-full" />
            <Skeleton className="mt-4 h-5 w-full rounded-full" />
            <Skeleton className="mt-2 h-5 w-[92%] rounded-full" />
            <div className="mt-5 flex flex-wrap gap-3">
              <Skeleton className="h-9 w-20 rounded-full" />
              <Skeleton className="h-9 w-24 rounded-full" />
              <Skeleton className="h-9 w-16 rounded-full" />
            </div>
            <Skeleton className="mt-6 h-5 w-28 rounded-full" />
          </div>
        ))}
      </div>
    </div>
  </div>
);

export const BlogPostSkeleton = () => (
  <div className="blog-post-page" aria-hidden="true">
    <div className="blog-shell">
      <div className="blog-control-row">
        <Skeleton className="h-11 w-32 rounded-full" />
        <Skeleton className="h-11 w-24 rounded-full" />
      </div>

      <div className="blog-post-header">
        <Skeleton className="h-4 w-[260px] rounded-full" />
        <Skeleton className="mt-5 h-12 w-full max-w-[780px] rounded-full" />
        <Skeleton className="mt-4 h-5 w-full max-w-[700px] rounded-full" />
        <Skeleton className="mt-2 h-5 w-full max-w-[660px] rounded-full" />
        <div className="mt-5 flex flex-wrap gap-3">
          <Skeleton className="h-9 w-20 rounded-full" />
          <Skeleton className="h-9 w-24 rounded-full" />
          <Skeleton className="h-9 w-28 rounded-full" />
        </div>
      </div>

      <div className="blog-article-grid">
        <div className="blog-sidebar">
          <div className="blog-sidebar-panel">
            <Skeleton className="h-5 w-24 rounded-full" />
            <Skeleton className="mt-5 h-4 w-full rounded-full" />
            <Skeleton className="mt-3 h-4 w-[88%] rounded-full" />
            <Skeleton className="mt-3 h-4 w-[70%] rounded-full" />
          </div>
        </div>
        <div className="blog-article-panel">
          <Skeleton className="h-8 w-[45%] rounded-full" />
          <Skeleton className="mt-6 h-5 w-full rounded-full" />
          <Skeleton className="mt-3 h-5 w-[96%] rounded-full" />
          <Skeleton className="mt-3 h-5 w-[92%] rounded-full" />
          <Skeleton className="mt-10 h-8 w-[38%] rounded-full" />
          <Skeleton className="mt-6 h-5 w-full rounded-full" />
          <Skeleton className="mt-3 h-5 w-[95%] rounded-full" />
          <Skeleton className="mt-3 h-5 w-[90%] rounded-full" />
          <Skeleton className="mt-10 h-36 w-full rounded-[1.2rem]" />
        </div>
      </div>
    </div>
  </div>
);
