import { cn } from "@/lib/utils";

function Skeleton({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        "animate-pulse rounded-md border border-[color:var(--site-border)] bg-[color:var(--site-bg-soft)]",
        className,
      )}
      {...props}
    />
  );
}

export { Skeleton };
