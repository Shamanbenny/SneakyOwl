"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  onAuthStateChanged,
  signOut,
  type User,
} from "firebase/auth";
import { QRCodeSVG } from "qrcode.react";
import {
  FaCheck,
  FaCopy,
  FaEyeSlash,
  FaGoogle,
  FaEye,
  FaMapLocationDot,
  FaQrcode,
  FaArrowRightFromBracket,
  FaRotateLeft,
  FaShieldHalved,
  FaTrashCan,
  FaUser,
  FaUserMinus,
} from "react-icons/fa6";

import DropdownField from "@/app/components/shared/ui/DropdownField";
import LoginRequiredPanel from "@/app/components/shared/account/LoginRequiredPanel";
import InfoTooltip from "@/app/components/shared/feedback/InfoTooltip";
import { useNotifications } from "@/app/components/shared/feedback/NotificationProvider";
import {
  ensureBiteTrailProfile,
  clearHiddenBiteTrailOwnerIds,
  getBiteTrailPreferences,
  getBiteTrailProfile,
  getBiteTrailShareLink,
  getHiddenBiteTrailOwnerIds,
  listFollowing,
  normalizeBiteTrailDisplayName,
  saveBiteTrailPreferences,
  type BiteTrailCurrency,
  type BiteTrailFollowing,
  type BiteTrailMapStart,
  setHiddenBiteTrailOwnerIds,
} from "@/lib/bite-trail";
import {
  revalidateFirebaseSession,
  withFirebaseSessionRetries,
} from "@/lib/firebase-auth";
import {
  deleteSneakyOwlAccount,
  removeBiteTrailFollowing,
  updateSneakyOwlDisplayName,
} from "@/lib/bite-trail-api";
import { getFirebaseClient } from "@/lib/firebase";

const CURRENCY_OPTIONS = [{ currency: "Singapore dollar", value: "SGD" }];

const ProfileSettings = () => {
  const router = useRouter();
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
  const [isDeletingAccount, setIsDeletingAccount] = useState(false);
  const [isSigningOut, setIsSigningOut] = useState(false);
  const [deleteConfirmation, setDeleteConfirmation] = useState("");
  const [savedSettings, setSavedSettings] = useState<{
    displayName: string;
    currency: BiteTrailCurrency;
    mapStart: BiteTrailMapStart;
  } | null>(null);
  const { notify } = useNotifications();

  useEffect(() => {
    if (!firebaseClient) {
      setIsLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(
      firebaseClient.auth,
      async (nextUser) => {
        setUser(nextUser);
        setIsSigningOut(false);
        setIsDeletingAccount(false);
        setDeleteConfirmation("");

        if (!nextUser) {
          setDisplayName("");
          setSavedSettings(null);
          setFollowing([]);
          setHiddenFriendIds(new Set());
          setDeleteConfirmation("");
          setIsLoading(false);
          return;
        }

        try {
          await withFirebaseSessionRetries(nextUser, async () => {
            await revalidateFirebaseSession(nextUser);
            await ensureBiteTrailProfile(firebaseClient.db, nextUser);
            const [profile, preferences, nextFollowing] = await Promise.all([
              getBiteTrailProfile(firebaseClient.db, nextUser.uid),
              getBiteTrailPreferences(firebaseClient.db, nextUser.uid),
              listFollowing(firebaseClient.db, nextUser.uid),
            ]);
            const nextDisplayName = normalizeBiteTrailDisplayName(
              nextUser.uid,
              profile?.displayName || nextUser.displayName,
            );
            setDisplayName(nextDisplayName);
            setCurrency(preferences.defaultCurrency);
            setMapStart(preferences.mapStart);
            setSavedSettings({
              displayName: nextDisplayName,
              currency: preferences.defaultCurrency,
              mapStart: preferences.mapStart,
            });
            setFollowing(nextFollowing);
            setHiddenFriendIds(
              new Set(getHiddenBiteTrailOwnerIds(nextUser.uid)),
            );
          });
        } catch {
          setUser(null);
          setDisplayName("");
          setSavedSettings(null);
          setFollowing([]);
          setHiddenFriendIds(new Set());
          setDeleteConfirmation("");
          notify("We could not load your BiteTrail settings.", "error");
        } finally {
          setIsLoading(false);
        }
      },
    );

    return unsubscribe;
  }, [firebaseClient, notify]);

  const copyShareLink = async () => {
    if (!user) {
      notify("Sign in before sharing your BiteTrail list.", "error");
      return;
    }

    try {
      await navigator.clipboard.writeText(getBiteTrailShareLink(user.uid));
      notify("Your BiteTrail friend link was copied.");
    } catch {
      notify("Copy is unavailable in this browser.", "error");
    }
  };

  const saveSettings = async () => {
    if (!firebaseClient || !user) {
      notify(
        "Sign in to save your profile and BiteTrail preferences.",
        "error",
      );
      return;
    }

    const trimmedDisplayName = displayName.trim();
    if (!trimmedDisplayName) {
      notify("Display name cannot be empty.", "error");
      return;
    }

    setIsSaving(true);
    let displayNameSaved = false;
    try {
      const safeDisplayName = normalizeBiteTrailDisplayName(
        user.uid,
        trimmedDisplayName,
      );
      if (safeDisplayName !== savedSettings?.displayName) {
        await updateSneakyOwlDisplayName(user, safeDisplayName);
        await user.reload();
        displayNameSaved = true;
        setSavedSettings((current) =>
          current ? { ...current, displayName: safeDisplayName } : current,
        );
      }
      await saveBiteTrailPreferences(firebaseClient.db, user.uid, {
        defaultCurrency: currency,
        mapStart,
      });
      setDisplayName(safeDisplayName);
      setSavedSettings({ displayName: safeDisplayName, currency, mapStart });
      notify("Profile and BiteTrail preferences saved.");
    } catch {
      notify(
        displayNameSaved
          ? "Your display name was saved, but BiteTrail preferences could not be saved. Please try again."
          : "We could not save your settings. Please try again.",
        "error",
      );
    } finally {
      setIsSaving(false);
    }
  };

  const discardChanges = () => {
    if (!savedSettings) {
      return;
    }

    setDisplayName(savedSettings.displayName);
    setCurrency(savedSettings.currency);
    setMapStart(savedSettings.mapStart);
    notify("Unsaved profile changes were discarded.");
  };

  const deleteAccount = async () => {
    if (!user || !firebaseClient || !user.email) {
      return;
    }

    if (deleteConfirmation.trim().toLowerCase() !== user.email.toLowerCase()) {
      notify("Type your exact Gmail address to confirm account deletion.", "error");
      return;
    }

    setIsDeletingAccount(true);
    try {
      await deleteSneakyOwlAccount(user, user.email);
      clearHiddenBiteTrailOwnerIds(user.uid);
      await signOut(firebaseClient.auth);
      notify("Your account and saved data have been deleted.");
      router.replace("/tools/bite-trail");
    } catch (error) {
      notify(
        error instanceof Error
          ? error.message
          : "We could not delete your account. Please try again.",
        "error",
      );
    } finally {
      setIsDeletingAccount(false);
    }
  };

  const logout = async () => {
    if (!firebaseClient) {
      return;
    }

    setIsSigningOut(true);
    try {
      await signOut(firebaseClient.auth);
    } catch {
      setIsSigningOut(false);
      notify("We could not sign you out. Please try again.", "error");
    }
  };

  const stopFollowing = async (ownerUid: string) => {
    if (!firebaseClient || !user) {
      return;
    }

    try {
      await removeBiteTrailFollowing(user, ownerUid);
      setFollowing((friends) =>
        friends.filter((friend) => friend.ownerUid !== ownerUid),
      );
      const nextHiddenIds = new Set(hiddenFriendIds);
      nextHiddenIds.delete(ownerUid);
      setHiddenFriendIds(nextHiddenIds);
      setHiddenBiteTrailOwnerIds(user.uid, Array.from(nextHiddenIds));
      notify("You are no longer watching that BiteTrail list.");
    } catch {
      notify("We could not remove that list. Please try again.", "error");
    }
  };

  const toggleHiddenList = (friend: BiteTrailFollowing) => {
    if (!user) {
      return;
    }

    const isHidden = hiddenFriendIds.has(friend.ownerUid);
    const nextIds = new Set(hiddenFriendIds);

    if (isHidden) {
      nextIds.delete(friend.ownerUid);
    } else {
      nextIds.add(friend.ownerUid);
    }

    setHiddenFriendIds(nextIds);
    setHiddenBiteTrailOwnerIds(user.uid, Array.from(nextIds));
    notify(
      isHidden
        ? `${friend.ownerDisplayName}'s list is no longer hidden`
        : `${friend.ownerDisplayName}'s list is now hidden`,
    );
  };

  const isSignedIn = Boolean(user);
  const shareLink = user ? getBiteTrailShareLink(user.uid) : "";

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
          Configuration
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

            <div className="lg:flex lg:items-end lg:gap-4">
              <div className="min-w-0 flex-1">
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
              <button
                className="mt-4 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-lg border border-[color:var(--site-accent)] bg-transparent px-4 text-[0.92rem] font-semibold text-[color:var(--site-accent)] transition hover:border-[color:var(--site-accent-soft)] hover:text-[color:var(--site-accent-soft)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--site-accent)]/50 disabled:pointer-events-none disabled:opacity-55 lg:mt-0 lg:w-auto lg:shrink-0"
                type="button"
                onClick={logout}
                disabled={isSigningOut}
              >
                <FaArrowRightFromBracket
                  className="h-4 w-4"
                  aria-hidden="true"
                />
                {isSigningOut ? "Signing out..." : "Sign out"}
              </button>
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
              BiteTrail Profile
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
                      Share this link so you and a registered friend can add
                      each other to watch lists.
                    </p>
                  </div>
                </div>
                <div className="mt-4 flex min-h-28 items-center justify-center rounded-xl border border-dashed border-[color:var(--site-border-strong)] bg-[color:var(--site-bg-strong)] text-[color:var(--site-text-muted)]">
                  {shareLink ? (
                    <QRCodeSVG
                      aria-label="BiteTrail share link QR code"
                      bgColor="var(--site-bg-strong)"
                      fgColor="var(--site-text-strong)"
                      size={256}
                      title="BiteTrail share link QR code"
                      value={shareLink}
                    />
                  ) : (
                    <FaQrcode
                      className="h-16 w-16"
                      aria-label="Sign in to generate a BiteTrail share QR code"
                    />
                  )}
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
                    Hide a list locally or stop watching it entirely.
                    <span className="ml-1 inline-flex align-middle">
                      <InfoTooltip
                        ariaLabel="How hiding and stopping watching work"
                        preferredPlacement="top"
                        panelClassName="max-w-[280px] text-[color:var(--site-text-strong)]"
                      >
                        Hiding removes the list from your map only. Stop
                        watching removes the relationship from both sides, so
                        you also disappear from that user&apos;s watch list. We
                        recommend hiding for most situations.
                      </InfoTooltip>
                    </span>
                  </p>
                </div>
              </div>
              <div className="mt-4 grid gap-3">
                {following.length > 0 ? (
                  following.map((friend) => {
                    const isHidden = hiddenFriendIds.has(friend.ownerUid);

                    return (
                    <div
                      className={`flex items-center justify-between gap-3 rounded-xl border border-[color:var(--site-border)] bg-[color:var(--site-bg-strong)] p-3 ${isHidden ? "opacity-70" : ""}`}
                      key={friend.ownerUid}
                    >
                      <div className="min-w-0">
                        <p className="truncate text-[0.9rem] font-semibold text-[color:var(--site-text-strong)]">
                          {friend.ownerDisplayName}
                        </p>
                        <p className="mt-1 text-[0.72rem] text-[color:var(--site-text-muted)]">
                          {isHidden ? "List hidden" : "You are watching"}
                        </p>
                      </div>
                      <div className="flex shrink-0 items-center gap-1">
                        <InfoTooltip
                          ariaLabel={isHidden ? "Show list" : "Hide list"}
                          preferredPlacement="top"
                          panelClassName="text-[color:var(--site-text-strong)]"
                          trigger={
                            <button
                              className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-[color:var(--site-text-muted)] transition hover:bg-[color:var(--site-bg-soft)] hover:text-[color:var(--site-accent-soft)]"
                              type="button"
                              aria-label={isHidden ? "Show list" : "Hide list"}
                              onClick={() => toggleHiddenList(friend)}
                            >
                              {isHidden ? (
                                <FaEye className="h-4 w-4" aria-hidden="true" />
                              ) : (
                                <FaEyeSlash className="h-4 w-4" aria-hidden="true" />
                              )}
                            </button>
                          }
                        >
                          {isHidden ? "Show list" : "Hide list"}
                        </InfoTooltip>
                        <InfoTooltip
                          ariaLabel="Stop watching"
                          preferredPlacement="top"
                          panelClassName="text-[color:var(--site-text-strong)]"
                          trigger={
                            <button
                              className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-[color:var(--site-text-muted)] transition hover:bg-red-500/10 hover:text-red-300"
                              type="button"
                              aria-label="Stop watching"
                              onClick={() => stopFollowing(friend.ownerUid)}
                            >
                              <FaUserMinus className="h-4 w-4" aria-hidden="true" />
                            </button>
                          }
                        >
                          Stop watching
                        </InfoTooltip>
                      </div>
                    </div>
                    );
                  })
                ) : (
                  <p className="rounded-xl border border-dashed border-[color:var(--site-border-strong)] p-4 text-[0.82rem] leading-6 text-[color:var(--site-text-muted)]">
                    No watched BiteTrail lists yet.
                  </p>
                )}
              </div>
            </div>
          </div>
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
                You had agreed to SneakyOwl&apos;s Privacy Policy, which is
                applicable to all tools on this site, when you first signed in.
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
            <button
              className="mt-3 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-lg border border-[color:var(--site-accent-red)] bg-transparent px-4 text-[0.92rem] font-semibold text-[color:var(--site-accent-red)] transition hover:bg-red-500/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-400/50 disabled:pointer-events-none disabled:opacity-55"
              type="button"
              disabled={!isSignedIn || isSaving || !savedSettings}
              onClick={discardChanges}
            >
              <FaRotateLeft className="h-4 w-4" aria-hidden="true" />
              Discard changes
            </button>
          </div>
        </div>
      </section>

      <section className="rounded-[20px] border border-[color:var(--site-accent-red)] bg-[color:var(--site-bg-soft)] p-5 sm:p-6">
        <div className="flex items-start gap-3">
          <FaTrashCan
            className="mt-1 h-5 w-5 shrink-0 text-[color:var(--site-accent-red)]"
            aria-hidden="true"
          />
          <div className="w-full">
            <h2 className="text-[1.15rem] font-semibold text-[color:var(--site-text-strong)]">
              Delete account
            </h2>
            <p className="mt-3 text-[0.9rem] leading-7 text-[color:var(--site-text-muted)]">
              This permanently deletes your personal tools data, preferences,
              and SneakyOwl account. This cannot be
              undone.
            </p>
            <label
              className="mt-5 block text-[0.72rem] font-semibold uppercase tracking-[0.16em] text-[color:var(--site-text-muted)]"
              htmlFor="delete-account-confirmation"
            >
              Type &quot;{user.email}&quot; to confirm
            </label>
            <input
              id="delete-account-confirmation"
              className="mt-2 h-12 w-full rounded-xl border border-[color:var(--site-border-strong)] bg-[color:var(--site-bg-strong)] px-4 text-[color:var(--site-text-strong)] outline-none transition focus:border-[color:var(--site-accent-red)] focus:ring-2 focus:ring-red-400/30 disabled:cursor-not-allowed disabled:opacity-60"
              value={deleteConfirmation}
              disabled={!isSignedIn || isDeletingAccount}
              placeholder={user.email || undefined}
              onChange={(event) => setDeleteConfirmation(event.target.value)}
            />
            <button
              className="mt-4 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-lg border border-[color:var(--site-accent-red)] bg-transparent px-4 text-[0.92rem] font-semibold text-[color:var(--site-accent-red)] transition hover:bg-red-500/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-400/50 disabled:cursor-not-allowed disabled:opacity-55"
              type="button"
              disabled={
                !isSignedIn ||
                !user.email ||
                isDeletingAccount ||
                deleteConfirmation.trim().toLowerCase() !== user.email.toLowerCase()
              }
              onClick={deleteAccount}
            >
              <FaTrashCan className="h-4 w-4" aria-hidden="true" />
              {isDeletingAccount ? "Deleting account..." : "Confirm delete"}
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ProfileSettings;
