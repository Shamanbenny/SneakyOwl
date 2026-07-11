import type { Metadata } from "next";
import { Poppins } from "next/font/google";

import NavBar from "@/app/components/shared/navigation/NavBar";

const privacyFont = Poppins({ weight: "400", subsets: ["latin"] });

const contactEmail = "macdonaldbenny1@gmail.com";

export const metadata: Metadata = {
  title: "Privacy Policy | SneakyOwl",
  description:
    "Privacy policy for SneakyOwl, its shared profile, and its tools including BiteTrail.",
};

const policySections = [
  {
    title: "Information We Collect",
    body: [
      "When you sign in with Google, SneakyOwl may receive your Google display name, email address, profile photo, and a Firebase authentication user ID.",
      "Tools may collect the information needed to provide their features. For BiteTrail, this includes food places you visited, map pin locations, meal cost per person, purchased items, ratings, comments, sharing codes, QR links, and friend watch-list preferences.",
      "The site may also receive basic technical information normally sent by your browser, such as device type, browser type, pages visited, timestamps, and approximate region.",
    ],
  },
  {
    title: "How We Use Information",
    body: [
      "We use account information to let you sign in, provide your shared profile, identify your tool data, and keep saved data attached to your account.",
      "Signing in gives you access to the tools supported by SneakyOwl and represents acceptance of their use as described by this policy. Tool-specific settings use sensible defaults and may be customized from your profile where available.",
      "We use BiteTrail entries to display your saved food places on a map and support list-sharing features you choose to use.",
      "We do not sell your personal information.",
    ],
  },
  {
    title: "Storage and Service Providers",
    body: [
      "SneakyOwl uses Firebase and Google Cloud services for Google authentication. The current profile and BiteTrail preview interfaces use mock values and are not connected to Firestore persistence yet.",
      "When persistence is enabled, Firebase or related backend services may store account profile preferences and tool data. These providers process data according to their own security and privacy practices. Access to project data is limited to what is needed to operate and maintain the site.",
    ],
  },
  {
    title: "Sharing",
    body: [
      "BiteTrail is planned to include sharing features, such as QR codes, list codes, and friend watch lists. Your list is shared only when you choose to create or give someone access to a sharing link or code.",
      "We may disclose information if required by law, to protect the site from abuse, or to investigate security issues.",
    ],
  },
  {
    title: "Data Controls",
    body: [
      "You may stop using Google sign-in at any time. The profile page is intended to provide account and tool-preference controls, while each tool will provide controls for its own data where available.",
      `To request account or data deletion, or to ask what account data is currently held, email ${contactEmail}.`,
    ],
  },
  {
    title: "Location Data",
    body: [
      "BiteTrail may let you place map pins at your current location or another location you choose. Location data is used to save and display your food-place entries when persistence is enabled.",
      "Do not save sensitive locations or private information in comments if you do not want them visible to people you share your list with.",
    ],
  },
  {
    title: "Children",
    body: [
      "SneakyOwl and BiteTrail are not intended for children under 13. We do not knowingly collect personal information from children under 13.",
    ],
  },
  {
    title: "Changes",
    body: [
      "This policy may be updated as SneakyOwl adds tools, storage, sharing, and account-management features. The effective date will be updated when meaningful changes are made.",
    ],
  },
];

export default function PrivacyPage() {
  return (
    <div className={`site-page-shell min-h-screen ${privacyFont.className}`}>
      <NavBar />
      <main
        className="mx-auto flex min-h-screen flex-col gap-8 pb-20 pt-[120px]
          max-sm:w-[300px] max-xs:w-[230px] sm:w-[560px] md:w-[680px]
          lg:w-[910px] xl:w-[980px]"
      >
        <h1 className="mb-4 text-center text-[3.4rem] font-semibold uppercase tracking-[0.16em] text-[color:var(--site-accent-soft)]">
          Sneaky Owl
        </h1>
        <header className="site-surface-card rounded-[26px] p-6 sm:p-8">
          <h1 className="text-[2.2rem] font-semibold leading-tight text-[color:var(--site-text-strong)] sm:text-[3rem]">
            Privacy Policy
          </h1>
          <p className="mt-5 max-w-[72ch] text-[1rem] leading-8 text-[color:var(--site-text)]">
            This policy explains how SneakyOwl and the BiteTrail tool collect,
            use, store, and share information.
          </p>
          <p className="mt-4 text-[0.88rem] text-[color:var(--site-text-muted)]">
            Effective date: July 10, 2026
          </p>
        </header>

        <section className="grid gap-4">
          {policySections.map((section) => (
            <article
              key={section.title}
              className="rounded-[20px] border border-[color:var(--site-border)] bg-[color:var(--site-bg-soft)] p-5 sm:p-6"
            >
              <h2 className="text-[1.15rem] font-semibold text-[color:var(--site-text-strong)]">
                {section.title}
              </h2>
              <div className="mt-4 grid gap-3 text-[0.95rem] leading-7 text-[color:var(--site-text)]">
                {section.body.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>
            </article>
          ))}
        </section>

        <footer className="rounded-[20px] border border-[color:var(--site-border)] bg-[color:var(--site-bg-strong)] p-5 text-[0.95rem] leading-7 text-[color:var(--site-text)] sm:p-6">
          <h2 className="text-[1.15rem] font-semibold text-[color:var(--site-text-strong)]">
            Contact
          </h2>
          <p className="mt-3">
            For privacy questions or deletion requests, email{" "}
            <a
              href={`mailto:${contactEmail}`}
              className="text-[color:var(--site-accent-soft)] underline-offset-4 hover:underline"
            >
              {contactEmail}
            </a>
            .
          </p>
        </footer>
      </main>
    </div>
  );
}
