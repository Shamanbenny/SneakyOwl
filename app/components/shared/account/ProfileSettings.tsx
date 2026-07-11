"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { onAuthStateChanged, updateProfile, type User } from "firebase/auth";
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
import LoginRequiredPanel from "@/app/components/shared/account/LoginRequiredPanel";
import {
  ensureBiteTrailProfile,
  getBiteTrailPreferences,
  getBiteTrailProfile,
  getBiteTrailShareLink,
  listFollowing,
  normalizeBiteTrailDisplayName,
  removeFollowing,
  saveBiteTrailPreferences,
  saveBiteTrailProfile,
  type BiteTrailCurrency,
  type BiteTrailFollowing,
  type BiteTrailMapStart,
} from "@/lib/bite-trail";
import { getFirebaseClient } from "@/lib/firebase";

const CURRENCY_OPTIONS = [
  { currency: "Singapore dollar", value: "SGD" },
  { currency: "US dollar", value: "USD" },
  { currency: "Malaysian ringgit", value: "MYR" },
];

const ProfileSettings = () => {
  const firebaseClient = useMemo(() => getFirebaseClient(), []);
  const [user, setUser] = useState<User | null>(null);
  const [displayName, setDisplayName] = useState("");
  const [currency, setCurrency] = useState<BiteTrailCurrency>("SGD");
  const [mapStart, setMapStart] = useState<BiteTrailMapStart>("Singapore");
  const [following, setFollowing] = useState<BiteTrailFollowing[]>([]);
  const [hiddenFriendIds, setHiddenFriendIds] = useState<Set<string>>(
    new Set(),
  );
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState<string | null>(null);
  const [shareMessage, setShareMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!firebaseClient) {
      setIsLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(
      firebaseClient.auth,
      async (nextUser) => {
        setUser(nextUser);
        setSaveMessage(null);
        setShareMessage(null);

        if (!nextUser) {
          setDisplayName("");
          setFollowing([]);
          setIsLoading(false);
          return;
        }

        try {
          await ensureBiteTrailProfile(firebaseClient.db, nextUser);
          const [profile, preferences, nextFollowing] = await Promise.all([
            getBiteTrailProfile(firebaseClient.db, nextUser.uid),
            getBiteTrailPreferences(firebaseClient.db, nextUser.uid),
            listFollowing(firebaseClient.db, nextUser.uid),
          ]);
          setDisplayName(
            normalizeBiteTrailDisplayName(
              nextUser.uid,
              profile?.displayName || nextUser.displayName,
            ),
          );
          setCurrency(preferences.defaultCurrency);
          setMapStart(preferences.mapStart);
          setFollowing(nextFollowing);
        } catch {
          setSaveMessage("We could not load your BiteTrail settings.");
        } finally {
          setIsLoading(false);
        }
      },
    );

    return unsubscribe;
  }, [firebaseClient]);

  const copyShareLink = async () => {
    if (!user) {
      setShareMessage("Sign in before sharing your BiteTrail list.");
      return;
    }

    try {
      await navigator.clipboard.writeText(getBiteTrailShareLink(user.uid));
      setShareMessage("Your BiteTrail friend link was copied.");
    } catch {
      setShareMessage("Copy is unavailable in this browser.");
    }
  };

  const saveSettings = async () => {
    if (!firebaseClient || !user) {
      setSaveMessage("Sign in to save your profile and BiteTrail preferences.");
      return;
    }

    const trimmedDisplayName = displayName.trim();
    if (!trimmedDisplayName) {
      setSaveMessage("Display name cannot be empty.");
      return;
    }

    setIsSaving(true);
    setSaveMessage(null);
    try {
      const safeDisplayName = normalizeBiteTrailDisplayName(
        user.uid,
        trimmedDisplayName,
      );
      await updateProfile(user, { displayName: safeDisplayName });
      await Promise.all([
        saveBiteTrailProfile(firebaseClient.db, user.uid, {
          displayName: safeDisplayName,
          photoURL: user.photoURL,
        }),
        saveBiteTrailPreferences(firebaseClient.db, user.uid, {
          defaultCurrency: currency,
          mapStart,
        }),
      ]);
      setDisplayName(safeDisplayName);
      setSaveMessage("Profile and BiteTrail preferences saved.");
    } catch {
      setSaveMessage("We could not save your settings. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  const stopFollowing = async (ownerUid: string) => {
    if (!firebaseClient || !user) {
      return;
    }

    try {
      await removeFollowing(firebaseClient.db, user.uid, ownerUid);
      setFollowing((friends) =>
        friends.filter((friend) => friend.ownerUid !== ownerUid),
      );
      setShareMessage("You are no longer watching that BiteTrail list.");
    } catch {
      setShareMessage("We could not remove that list. Please try again.");
    }
  };

  const visibleFollowing = following.filter(
    (friend) => !hiddenFriendIds.has(friend.ownerUid),
  );
  const isSignedIn = Boolean(user);

  if (isLoading) {
    return (
      <div className="flex min-h-[calc(100dvh-200px)] items-center justify-center">
        <section className="site-surface-card w-full max-w-[620px] rounded-[26px] p-6 text-[color:var(--site-text-muted)]">
          Checking your sign-in status...
        </section>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex min-h-[calc(100dvh-200px)] items-center justify-center">
        <LoginRequiredPanel />
      </div>
    );
  }
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
                className="h-12 w-full rounded-xl border border-[color:var(--site-border-strong)] bg-[color:var(--site-bg-soft)] px-4 text-[color:var(--site-text-strong)] outline-none transition focus:border-[color:var(--site-accent-border-strong)] focus:ring-2 focus:ring-[color:var(--site-accent-focus-ring)] disabled:cursor-not-allowed disabled:opacity-60"
                value={displayName}
                disabled={!isSignedIn || isLoading}
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
                  value={user?.email || "Sign in to view your account"}
                  readOnly
                  disabled
                />
              </div>
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
            <h2 className="text-[2rem] font-semibold text-[color:var(--site-text-strong)]">
              BiteTrail preferences
            </h2>
          </div>

          <div className="mt-7 grid gap-6 lg:grid-cols-2 xxl:grid-cols-[minmax(0,1fr)_minmax(0,2fr)_minmax(0,2fr)]">
            <div className="grid gap-5 lg:col-span-1 xxl:contents">
              <div className="grid gap-5 xxl:self-start">
                <label className="grid gap-2 text-[0.72rem] font-semibold uppercase tracking-[0.16em] text-[color:var(--site-text-muted)]">
                  Default currency
                  <DropdownField
                    ariaLabel="Default currency"
                    className="w-full"
                    options={CURRENCY_OPTIONS.map(
                      ({ currency: label, value }) => ({
                        label: `${value} — ${label}`,
                        value,
                      }),
                    )}
                    value={currency}
                    onChange={(value) =>
                      setCurrency(value as BiteTrailCurrency)
                    }
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
                    onChange={(value) =>
                      setMapStart(value as BiteTrailMapStart)
                    }
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
                      Share this link so a signed-in friend can add your list.
                    </p>
                  </div>
                </div>
                <div className="mt-4 flex min-h-28 items-center justify-center rounded-xl border border-dashed border-[color:var(--site-border-strong)] bg-[color:var(--site-bg-strong)] text-[color:var(--site-text-muted)]">
                  <FaQrcode
                    className="h-16 w-16"
                    aria-label="BiteTrail share link"
                  />
                </div>
                <button
                  className="mt-4 inline-flex min-h-10 w-full items-center justify-center gap-2 rounded-lg border border-[color:var(--site-border-strong)] bg-[color:var(--site-bg-strong)] px-3 text-[0.78rem] font-semibold uppercase tracking-[0.1em] text-[color:var(--site-text)] transition hover:border-[color:var(--site-accent-border-strong)] hover:text-[color:var(--site-accent-soft)] disabled:opacity-55"
                  type="button"
                  disabled={!isSignedIn}
                  onClick={copyShareLink}
                >
                  <FaCopy className="h-3.5 w-3.5" aria-hidden="true" /> Copy
                  friend link
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
                    Friends / watched lists
                  </h3>
                  <p className="mt-2 text-[0.82rem] leading-6 text-[color:var(--site-text-muted)]">
                    Hide a list locally or stop watching it.
                  </p>
                </div>
              </div>
              <div className="mt-4 grid gap-3">
                {visibleFollowing.length > 0 ? (
                  visibleFollowing.map((friend) => (
                    <div
                      className="flex items-center justify-between gap-3 rounded-xl border border-[color:var(--site-border)] bg-[color:var(--site-bg-strong)] p-3"
                      key={friend.ownerUid}
                    >
                      <div className="min-w-0">
                        <p className="truncate text-[0.9rem] font-semibold text-[color:var(--site-text-strong)]">
                          {friend.ownerDisplayName}
                        </p>
                        <p className="mt-1 text-[0.72rem] text-[color:var(--site-text-muted)]">
                          You are watching
                        </p>
                      </div>
                      <div className="flex shrink-0 items-center gap-1">
                        <button
                          className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-[color:var(--site-text-muted)] transition hover:bg-[color:var(--site-bg-soft)] hover:text-[color:var(--site-accent-soft)]"
                          type="button"
                          aria-label={`Hide ${friend.ownerDisplayName}`}
                          onClick={() =>
                            setHiddenFriendIds((ids) =>
                              new Set(ids).add(friend.ownerUid),
                            )
                          }
                        >
                          <FaEyeSlash className="h-4 w-4" aria-hidden="true" />
                        </button>
                        <button
                          className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-[color:var(--site-text-muted)] transition hover:bg-red-500/10 hover:text-red-300"
                          type="button"
                          aria-label={`Stop watching ${friend.ownerDisplayName}`}
                          onClick={() => stopFollowing(friend.ownerUid)}
                        >
                          <FaUserMinus className="h-4 w-4" aria-hidden="true" />
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="rounded-xl border border-dashed border-[color:var(--site-border-strong)] p-4 text-[0.82rem] leading-6 text-[color:var(--site-text-muted)]">
                    No watched BiteTrail lists yet.
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
                BiteTrail sharing is opt-in through a UID-based friend link.
              </p>
              <Link
                className="mt-4 inline-flex items-center gap-2 text-[0.82rem] font-semibold uppercase tracking-[0.12em] text-[color:var(--site-accent-soft)] underline-offset-4 hover:underline"
                href="/privacy"
              >
                Read the Privacy Policy{" "}
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
              {isSignedIn
                ? "Changes are saved to your authenticated BiteTrail profile."
                : "Sign in on BiteTrail to save profile settings."}
            </p>
          </div>
          <div className="mt-5">
            <button
              className="site-button-primary inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-lg px-4 text-[0.92rem] font-semibold disabled:opacity-55"
              type="button"
              disabled={!isSignedIn || isSaving}
              onClick={saveSettings}
            >
              <FaCheck className="h-4 w-4" aria-hidden="true" />
              {isSaving ? "Saving..." : "Save settings"}
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
