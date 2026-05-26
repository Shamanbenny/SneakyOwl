"use client";

import { Children, isValidElement, useMemo, useState } from "react";
import type { ReactNode } from "react";
import { FaRegCopy } from "react-icons/fa6";

type BlogCodeBlockProps = {
  children: ReactNode;
};

type CodeElementProps = {
  children?: ReactNode;
  className?: string;
};

const extractTextContent = (node: ReactNode): string => {
  if (typeof node === "string" || typeof node === "number") {
    return String(node);
  }

  if (Array.isArray(node)) {
    return node.map((child) => extractTextContent(child)).join("");
  }

  if (isValidElement<CodeElementProps>(node)) {
    return extractTextContent(node.props.children);
  }

  return "";
};

export default function BlogCodeBlock({ children }: BlogCodeBlockProps) {
  const [copyState, setCopyState] = useState<"idle" | "copied">("idle");
  const codeText = useMemo(() => extractTextContent(children).replace(/\n$/, ""), [children]);
  const firstChild = Children.toArray(children)[0];
  const languageClassName =
    isValidElement<CodeElementProps>(firstChild) && typeof firstChild.props.className === "string"
      ? firstChild.props.className
      : "";
  const languageLabel = languageClassName.startsWith("language-")
    ? languageClassName.replace("language-", "")
    : null;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(codeText);
      setCopyState("copied");
      window.setTimeout(() => setCopyState("idle"), 1600);
    } catch {
      setCopyState("idle");
    }
  };

  return (
    <div className="blog-code-block">
      <div className="blog-code-block-toolbar">
        <span className="blog-code-block-language">{languageLabel ?? "code"}</span>
        <button
          type="button"
          className="blog-code-copy-button"
          onClick={handleCopy}
          aria-label={copyState === "copied" ? "Code copied" : "Copy code to clipboard"}
        >
          <FaRegCopy className="h-4 w-4" />
          <span className="blog-code-copy-tooltip" role="status">
            {copyState === "copied" ? "Copied" : "Copy code"}
          </span>
        </button>
      </div>
      <pre>{children}</pre>
    </div>
  );
}
