import type { BlogPostHeading } from "@/app/blog/blogPosts";
import { FaArrowUp } from "react-icons/fa6";

type BlogPostSidebarProps = {
  headings: BlogPostHeading[];
};

export default function BlogPostSidebar({ headings }: BlogPostSidebarProps) {
  return (
    <aside className="blog-sidebar">
      <div className="blog-sidebar-panel">
        <div className="blog-sidebar-header">
          <p className="blog-sidebar-title blog-sidebar-title--nav">#Quick Nav</p>
          <a href="#top" className="blog-return-top-link blog-return-top-link--inline">
            <FaArrowUp className="h-3.5 w-3.5" aria-hidden="true" />
            Scroll to top
          </a>
        </div>
        <nav aria-label="Table of contents">
          <ul className="blog-toc-list">
            {headings.map((heading) => (
              <li key={heading.id}>
                <a
                  href={`#${heading.id}`}
                  className={`blog-toc-link ${heading.level === 3 ? "blog-toc-link--nested" : ""}`}
                >
                  {heading.text}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </aside>
  );
}
