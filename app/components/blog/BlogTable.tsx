import type { ComponentPropsWithoutRef } from "react";

type BlogTableProps = ComponentPropsWithoutRef<"table">;

export default function BlogTable({ children, ...props }: BlogTableProps) {
  return (
    <div className="blog-table-scroll" tabIndex={0}>
      <table {...props}>{children}</table>
    </div>
  );
}
