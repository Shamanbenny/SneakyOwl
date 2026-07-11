"use client";

import { useState } from "react";
import Link from "next/link";
import {
  FaCheck,
  FaCopy,
  FaEyeSlash,
  FaGoogle,
  FaMapLocationDot,
  FaQrcode,
  FaShieldHalved,
  FaUser,
  FaUserMinus,
} from "react-icons/fa6";

import DropdownField from "@/app/components/shared/ui/DropdownField";

const MOCK_PROFILE = {
  displayName: "Benny SneakyOwl",
  email: "macdonaldbenny1@gmail.com",
  photoInitials: "BS",
};

const MOCK_CURRENCY_OPTIONS = [
  { currency: "Singapore dollar", value: "SGD" },
  { currency: "US dollar", value: "USD" },
  { currency: "Malaysian ringgit", value: "MYR" },
];

type MockFriend = {
  id: string;
  name: string;
  status: "Watching your list" | "You are watching";
};

const INITIAL_WATCH_LIST: MockFriend[] = [
  { id: "kai", name: "Kai", status: "Watching your list" },
  { id: "mira", name: "Mira", status: "You are watching" },
];

const ProfileSettings = () => {
  const [displayName, setDisplayName] = useState(MOCK_PROFILE.displayName);
  const [currency, setCurrency] = useState("SGD");
  const [mapStart, setMapStart] = useState("Singapore");
  const [sharingDefault, setSharingDefault] = useState("Private");
  const [locationPrivacy, setLocationPrivacy] = useState("Exact locations");
  const [saveMessage, setSaveMessage] = useState<string | null>(null);
  const [watchList, setWatchList] = useState(INITIAL_WATCH_LIST);
  const [shareMessage, setShareMessage] = useState<string | null>(null);

  const saveMockSettings = () => {
    setSaveMessage(
      "Saved for this preview only. Firebase and Firestore are not connected yet.",
    );
  };

  const copyShareLink = async () => {
    const shareLink =
      "https://sneakyowl.net/tools/bite-trail/join?code=MOCK-OWL";

    try {
      await navigator.clipboard.writeText(shareLink);
      setShareMessage("Mock share link copied.");
    } catch {
      setShareMessage("Copy is unavailable in this browser preview.");
    }
  };

  const removeFriend = (friendId: string) => {
    setWatchList((friends) =>
      friends.filter((friend) => friend.id !== friendId),
    );
    setShareMessage("Friend removed in this preview only.");
  };

  const hideFriend = (friendName: string) => {
    setShareMessage(`${friendName} hidden in this preview only.`);
  };

  return (
    <div className="grid gap-6">
      <header className="max-w-[780px]">
        <p className="text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-[color:var(--site-text-muted)]">
          Account settings
        </p>
        <h1 className="mt-3 text-[2.8rem] font-semibold leading-[1.05] text-[color:var(--site-text-strong)] sm:text-[4.2rem]">
          My profile
        </h1>
      </header>

      <section className="grid gap-6">
        <article className="site-surface-card rounded-[26px] p-5 sm:p-7">
          <div className="grid gap-4">
            <div>
              <label
                className="mb-2 block text-[0.72rem] font-semibold uppercase tracking-[0.16em] text-[color:var(--site-text-muted)]"
                htmlFor="profile-display-name"
              >
                Display name
              </label>
              <input
                id="profile-display-name"
                className="h-12 w-full rounded-xl border border-[color:var(--site-border-strong)] bg-[color:var(--site-bg-soft)] px-4 text-[color:var(--site-text-strong)] outline-none transition focus:border-[color:var(--site-accent-border-strong)] focus:ring-2 focus:ring-[color:var(--site-accent-focus-ring)]"
                value={displayName}
                onChange={(event) => setDisplayName(event.target.value)}
              />
            </div>

            <div>
              <label
                className="mb-2 block text-[0.72rem] font-semibold uppercase tracking-[0.16em] text-[color:var(--site-text-muted)]"
                htmlFor="profile-email"
              >
                Gmail address
              </label>
              <div className="relative">
                <FaGoogle
                  className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[color:var(--site-text-muted)]"
                  aria-hidden="true"
                />
                <input
                  id="profile-email"
                  className="h-12 w-full cursor-not-allowed rounded-xl border border-[color:var(--site-border)] bg-[color:var(--site-bg-strong)] pl-11 pr-4 text-[color:var(--site-text-muted)] opacity-80 outline-none"
                  value={MOCK_PROFILE.email}
                  readOnly
                  disabled
                />
              </div>
              <p className="mt-2 text-[0.78rem] leading-5 text-[color:var(--site-text-faint)]">
                This comes from Google sign-in and cannot be changed.
              </p>
            </div>
          </div>
        </article>

        <article className="site-surface-card rounded-[26px] p-5 sm:p-7">
          <div className="flex items-start gap-3">
            <Link
              href="/tools/bite-trail"
              aria-label="Open Bite Trail"
              title="Open Bite Trail"
              className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-[color:var(--site-border-strong)] bg-[color:var(--site-bg-soft)] text-[color:var(--site-accent-soft)] transition hover:border-[color:var(--site-accent-border-strong)] hover:bg-[color:var(--site-bg-strong)] hover:text-[color:var(--site-accent)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--site-accent-focus-ring)]"
            >
              <FaMapLocationDot className="h-5 w-5" aria-hidden="true" />
            </Link>
            <div>
              <h2 className="text-[2rem] font-semibold text-[color:var(--site-text-strong)]">
                Bite Trail preferences
              </h2>
            </div>
          </div>

          <div className="mt-7 grid gap-6 lg:grid-cols-2 xxl:grid-cols-[minmax(0,1fr)_minmax(0,2fr)_minmax(0,2fr)]">
            <div className="grid gap-5 lg:col-span-1 xxl:contents">
              <div className="grid gap-5 xxl:self-start">
                <label className="grid gap-2 text-[0.72rem] font-semibold uppercase tracking-[0.16em] text-[color:var(--site-text-muted)]">
                  Default currency
                  <DropdownField
                    ariaLabel="Default currency"
                    className="w-full"
                    options={MOCK_CURRENCY_OPTIONS.map(
                      ({ currency, value }) => ({
                        label: `${value} — ${currency}`,
                        value,
                      }),
                    )}
                    value={currency}
                    onChange={setCurrency}
                  />
                </label>

                <label className="grid gap-2 text-[0.72rem] font-semibold uppercase tracking-[0.16em] text-[color:var(--site-text-muted)]">
                  Default location for maps
                  <DropdownField
                    ariaLabel="Default location for maps"
                    className="w-full"
                    options={[
                      { label: "Singapore", value: "Singapore" },
                      { label: "Current location", value: "Current location" },
                    ]}
                    value={mapStart}
                    onChange={setMapStart}
                  />
                </label>
              </div>

              <div className="rounded-2xl border border-[color:var(--site-border)] bg-[color:var(--site-bg-soft)] p-4">
                <div className="flex items-start gap-3">
                  <FaQrcode
                    className="mt-1 h-5 w-5 shrink-0 text-[color:var(--site-accent-soft)]"
                    aria-hidden="true"
                  />
                  <div>
                    <h3 className="text-[1.05rem] font-semibold text-[color:var(--site-text-strong)]">
                      Add me as a friend
                    </h3>
                    <p className="mt-2 text-[0.82rem] leading-6 text-[color:var(--site-text-muted)]">
                      Share this QR code or link so a friend can add your list.
                    </p>
                  </div>
                </div>
                <div className="mt-4 flex min-h-28 items-center justify-center rounded-xl border border-dashed border-[color:var(--site-border-strong)] bg-[color:var(--site-bg-strong)] text-[color:var(--site-text-muted)]">
                  <FaQrcode
                    className="h-16 w-16"
                    aria-label="Mock BiteTrail share QR code"
                  />
                </div>
                <button
                  className="mt-4 inline-flex min-h-10 w-full items-center justify-center gap-2 rounded-lg border border-[color:var(--site-border-strong)] bg-[color:var(--site-bg-strong)] px-3 text-[0.78rem] font-semibold uppercase tracking-[0.1em] text-[color:var(--site-text)] transition hover:border-[color:var(--site-accent-border-strong)] hover:text-[color:var(--site-accent-soft)]"
                  type="button"
                  onClick={copyShareLink}
                >
                  <FaCopy className="h-3.5 w-3.5" aria-hidden="true" />
                  Copy invite link
                </button>
              </div>
            </div>

            <div className="rounded-2xl border border-[color:var(--site-border)] bg-[color:var(--site-bg-soft)] p-4 xxl:col-span-1">
              <div className="flex items-start gap-3">
                <FaUser
                  className="mt-1 h-5 w-5 shrink-0 text-[color:var(--site-accent-soft)]"
                  aria-hidden="true"
                />
                <div>
                  <h3 className="text-[1.05rem] font-semibold text-[color:var(--site-text-strong)]">
                    Friends/Watch lists
                  </h3>
                  <p className="mt-2 text-[0.82rem] leading-6 text-[color:var(--site-text-muted)]">
                    Hide a friend&apos;s list temporarily or revoke both access
                    entirely.
                  </p>
                </div>
              </div>
              <div className="mt-4 grid gap-3">
                {watchList.length > 0 ? (
                  watchList.map((friend) => (
                    <div
                      className="flex items-center justify-between gap-3 rounded-xl border border-[color:var(--site-border)] bg-[color:var(--site-bg-strong)] p-3"
                      key={friend.id}
                    >
                      <div className="min-w-0">
                        <p className="truncate text-[0.9rem] font-semibold text-[color:var(--site-text-strong)]">
                          {friend.name}
                        </p>
                        <p className="mt-1 text-[0.72rem] text-[color:var(--site-text-muted)]">
                          {friend.status}
                        </p>
                      </div>
                      <div className="flex shrink-0 items-center gap-1">
                        <button
                          className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-[color:var(--site-text-muted)] transition hover:bg-[color:var(--site-bg-soft)] hover:text-[color:var(--site-accent-soft)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--site-accent-focus-ring)]"
                          type="button"
                          aria-label={`Hide ${friend.name}`}
                          title={`Hide ${friend.name}`}
                          onClick={() => hideFriend(friend.name)}
                        >
                          <FaEyeSlash className="h-4 w-4" aria-hidden="true" />
                        </button>
                        <button
                          className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-[color:var(--site-text-muted)] transition hover:bg-red-500/10 hover:text-red-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--site-accent-focus-ring)]"
                          type="button"
                          aria-label={`Remove ${friend.name} from friends`}
                          title={`Remove ${friend.name} from friends`}
                          onClick={() => removeFriend(friend.id)}
                        >
                          <FaUserMinus className="h-4 w-4" aria-hidden="true" />
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="rounded-xl border border-dashed border-[color:var(--site-border-strong)] p-4 text-[0.82rem] leading-6 text-[color:var(--site-text-muted)]">
                    No friends in this preview list.
                  </p>
                )}
              </div>
            </div>
          </div>
          {shareMessage ? (
            <p className="mt-4 text-[0.78rem] leading-5 text-[color:var(--site-accent-soft)]">
              {shareMessage}
            </p>
          ) : null}
        </article>
      </section>

      <section className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.85fr)]">
        <article className="rounded-[20px] border border-[color:var(--site-border)] bg-[color:var(--site-bg-soft)] p-5 sm:p-6">
          <div className="flex items-start gap-3">
            <FaShieldHalved
              className="mt-1 h-5 w-5 shrink-0 text-[color:var(--site-accent-soft)]"
              aria-hidden="true"
            />
            <div>
              <h2 className="text-[1.15rem] font-semibold text-[color:var(--site-text-strong)]">
                Privacy and tool access
              </h2>
              <p className="mt-3 text-[0.9rem] leading-7 text-[color:var(--site-text)]">
                Signing in gives you access to the tools supported by SneakyOwl.
                Each tool still controls its own data visibility, and sharing
                remains opt-in where the tool offers it.
              </p>
              <Link
                className="mt-4 inline-flex items-center gap-2 text-[0.82rem] font-semibold uppercase tracking-[0.12em] text-[color:var(--site-accent-soft)] underline-offset-4 hover:underline"
                href="/privacy"
              >
                Read the Privacy Policy
                <FaUser className="h-3 w-3" aria-hidden="true" />
              </Link>
            </div>
          </div>
        </article>

        <div className="site-surface-card flex flex-col justify-between rounded-[20px] p-5 sm:p-6">
          <div>
            <h2 className="text-[1.15rem] font-semibold text-[color:var(--site-text-strong)]">
              Save profile settings
            </h2>
            <p className="mt-3 text-[0.9rem] leading-7 text-[color:var(--site-text-muted)]">
              This preview keeps changes in the page only. Persistence will be
              added after the profile fields and Firestore rules are finalized.
            </p>
          </div>
          <div className="mt-5">
            <button
              className="site-button-primary inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-lg px-4 text-[0.92rem] font-semibold"
              type="button"
              onClick={saveMockSettings}
            >
              <FaCheck className="h-4 w-4" aria-hidden="true" />
              Save preview
            </button>
            {saveMessage ? (
              <p className="mt-3 text-center text-[0.78rem] leading-5 text-[color:var(--site-accent-soft)]">
                {saveMessage}
              </p>
            ) : null}
          </div>
        </div>
      </section>
    </div>
  );
};

export default ProfileSettings;
