"use client";

import { useEffect } from "react";

type ConfirmationModalProps = {
  title: string;
  description: string;
  keepLabel: string;
  confirmLabel: string;
  onCancel: () => void;
  onConfirm: () => void;
};

const ConfirmationModal = ({
  title,
  description,
  keepLabel,
  confirmLabel,
  onCancel,
  onConfirm,
}: ConfirmationModalProps) => {
  useEffect(() => {
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") onCancel();
    };

    document.addEventListener("keydown", closeOnEscape);
    return () => document.removeEventListener("keydown", closeOnEscape);
  }, [onCancel]);

  return (
    <div
      className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/70 p-4"
      role="presentation"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onCancel();
      }}
    >
      <div
        className="site-surface-card w-full max-w-md rounded-[22px] border border-[color:var(--site-border-strong)] p-6 shadow-[0_24px_70px_rgba(0,0,0,0.5)]"
        role="dialog"
        aria-modal="true"
        aria-labelledby="confirmation-modal-title"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <h2
          id="confirmation-modal-title"
          className="m-0 text-xl font-semibold text-[color:var(--site-text-strong)]"
        >
          {title}
        </h2>
        <p className="mt-3 leading-6 text-[color:var(--site-text-muted)]">
          {description}
        </p>
        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          <button
            type="button"
            className="inline-flex min-h-11 items-center justify-center rounded-lg border border-[color:var(--site-border-strong)] px-4 font-semibold text-[color:var(--site-text-strong)] transition hover:border-[color:var(--site-accent-border-soft-hover)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--site-accent-focus-ring)]"
            onClick={onCancel}
          >
            {keepLabel}
          </button>
          <button
            type="button"
            className="inline-flex min-h-11 items-center justify-center rounded-lg border border-[color:var(--site-accent-red)] bg-[color:var(--site-accent-red)] px-4 font-semibold text-[color:var(--site-bg)] transition hover:brightness-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--site-accent-red)]"
            onClick={onConfirm}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;
