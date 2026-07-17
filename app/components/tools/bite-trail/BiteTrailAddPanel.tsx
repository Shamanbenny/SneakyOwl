"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { onAuthStateChanged, type User } from "firebase/auth";
import { FaGoogle, FaMapLocationDot, FaSpinner } from "react-icons/fa6";

import { useNotifications } from "@/app/components/shared/feedback/NotificationProvider";
import {
  BITE_TRAIL_ADD_ERROR_MESSAGES,
  createFollowing,
  ensureBiteTrailProfile,
} from "@/lib/bite-trail";
import { signInWithGoogle } from "@/lib/firebase-auth";
import { getFirebaseClient } from "@/lib/firebase";

const ADD_NOTIFICATION_MESSAGES = {
  incompleteLink: "The BiteTrail friend link is incomplete.",
  signInNotConfigured: "BiteTrail sign-in is not configured yet.",
  signInFailed: "Google sign-in did not complete. Please try again later.",
  addSucceeded: "Friend successfully added to your watch list.",
  addFailed: "We could not add this BiteTrail list. Please try again.",
} as const;

type AddStatus = "loading-session" | "processing";

const BiteTrailAddPanel = () => {
  const firebaseClient = useMemo(() => getFirebaseClient(), []);
  const router = useRouter();
  const searchParams = useSearchParams();
  const ownerUid = searchParams.get("uid")?.trim() || "";
  const [user, setUser] = useState<User | null>(null);
  const [isAuthReady, setIsAuthReady] = useState(false);
  const [addStatus, setAddStatus] = useState<AddStatus>("loading-session");
  const [isSigningIn, setIsSigningIn] = useState(false);
  const hasStartedAddRef = useRef(false);
  const hasRedirectedRef = useRef(false);
  const { notify } = useNotifications();

  useEffect(() => {
    if (ownerUid || hasRedirectedRef.current) {
      return;
    }

    hasRedirectedRef.current = true;
    notify(ADD_NOTIFICATION_MESSAGES.incompleteLink, "error");
    router.replace("/tools/bite-trail");
  }, [notify, ownerUid, router]);

  useEffect(() => {
    if (!firebaseClient) {
      setIsAuthReady(true);
      return;
    }

    return onAuthStateChanged(firebaseClient.auth, (nextUser) => {
      setUser(nextUser);
      setIsAuthReady(true);
    });
  }, [firebaseClient]);

  const signIn = async () => {
    if (!firebaseClient) {
      notify(ADD_NOTIFICATION_MESSAGES.signInNotConfigured, "error");
      return;
    }

    setIsSigningIn(true);
    try {
      const credential = await signInWithGoogle(
        firebaseClient.auth,
        firebaseClient.googleProvider,
      );
      if (credential) {
        await ensureBiteTrailProfile(firebaseClient.db, credential.user);
      }
    } catch {
      notify(ADD_NOTIFICATION_MESSAGES.signInFailed, "error");
    } finally {
      setIsSigningIn(false);
    }
  };

  useEffect(() => {
    if (!isAuthReady || !user || !firebaseClient || !ownerUid) {
      return;
    }
    if (hasStartedAddRef.current) {
      return;
    }

    hasStartedAddRef.current = true;
    let isCancelled = false;

    const addFriend = async () => {
      try {
        setAddStatus("processing");
        await ensureBiteTrailProfile(firebaseClient.db, user);
        await createFollowing(firebaseClient.db, user, ownerUid);
        if (isCancelled) {
          return;
        }

        notify(ADD_NOTIFICATION_MESSAGES.addSucceeded);
        router.replace("/tools/bite-trail");
      } catch (error) {
        if (isCancelled) {
          return;
        }

        notify(ADD_NOTIFICATION_MESSAGES.addFailed, "error");
        router.replace("/tools/bite-trail");
      }
    };

    void addFriend();

    return () => {
      isCancelled = true;
    };
  }, [firebaseClient, isAuthReady, notify, ownerUid, router, user]);

  if (!ownerUid) {
    return null;
  }

  if (!isAuthReady || user) {
    return (
      <section
        className="site-surface-card mx-auto grid w-full max-w-[400px] gap-5 rounded-[26px] p-6 sm:p-8"
        aria-live="polite"
      >
        <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl border border-[color:var(--site-border-strong)] bg-[color:var(--site-bg-soft)] text-[color:var(--site-accent-soft)]">
          <FaSpinner className="h-5 w-5 animate-spin" aria-hidden="true" />
        </div>
        <div>
          <p className="text-[0.72rem] font-semibold uppercase tracking-[0.16em] text-[color:var(--site-text-muted)]">
            BiteTrail friend link
          </p>
          <h1 className="mt-2 text-[2rem] font-semibold text-[color:var(--site-text-strong)]">
            Adding friend
          </h1>
          <p className="mt-3 leading-7 text-[color:var(--site-text-muted)]">
            {addStatus === "processing"
              ? "We're trying to process your request."
              : "Loading your BiteTrail session..."}
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="site-surface-card mx-auto grid max-w-[620px] gap-5 rounded-[26px] p-6 sm:p-8">
      <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl border border-[color:var(--site-border-strong)] bg-[color:var(--site-bg-soft)] text-[color:var(--site-accent-soft)]">
        <FaMapLocationDot className="h-5 w-5" aria-hidden="true" />
      </div>
      <div>
        <p className="text-[0.72rem] font-semibold uppercase tracking-[0.16em] text-[color:var(--site-text-muted)]">
          Friend link for BiteTrail
        </p>
        <h1 className="mt-2 text-[2rem] font-semibold text-[color:var(--site-text-strong)]">
          Add to your watch list!
        </h1>
        <p className="mt-3 leading-7 text-[color:var(--site-text-muted)]">
          Sign in to add this friend&apos;s BiteTrail list to your watch list.
        </p>
      </div>
      <button
        type="button"
        onClick={signIn}
        disabled={isSigningIn}
        className="site-button-primary inline-flex min-h-11 items-center justify-center gap-2 rounded-lg px-4 font-semibold disabled:opacity-55"
      >
        <FaGoogle className="h-4 w-4" aria-hidden="true" />
        {isSigningIn ? "Opening Google..." : "Sign in with Google"}
      </button>
    </section>
  );
};

export default BiteTrailAddPanel;
