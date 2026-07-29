"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  type AuthError,
  onAuthStateChanged,
  signOut,
  type User,
} from "firebase/auth";
import {
  FaArrowRightFromBracket,
  FaGoogle,
  FaMapLocationDot,
  FaUser,
} from "react-icons/fa6";

import InfoTooltip from "@/app/components/shared/feedback/InfoTooltip";
import {
  ensureBiteTrailProfile,
  normalizeBiteTrailDisplayName,
} from "@/lib/bite-trail";
import {
  getFirebaseAuthErrorMessage,
  signInWithGoogle,
} from "@/lib/firebase-auth";
import { getFirebaseClient } from "@/lib/firebase";

const getReadableAuthError = (error: unknown) => {
  const authError = error as Partial<AuthError>;

  if (authError.code === "auth/configuration-not-found") {
    return [
      "Firebase Auth is not configured for this project yet.",
      "Enable Authentication and the Google sign-in provider in Firebase Console, then confirm .env.local uses the Web app config from the same Firebase project.",
    ].join(" ");
  }

  if (authError.code === "auth/unauthorized-domain") {
    return [
      "This domain is not authorized for Firebase Auth.",
      "Add localhost and sneakyowl.net in Firebase Authentication > Settings > Authorized domains.",
    ].join(" ");
  }

  return getFirebaseAuthErrorMessage(error, "Google sign-in failed.");
};

const BiteTrailAuthPanel = () => {
  const firebaseClient = useMemo(() => getFirebaseClient(), []);
  const [user, setUser] = useState<User | null>(null);
  const [isAuthReady, setIsAuthReady] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  useEffect(() => {
    if (!firebaseClient) {
      setIsAuthReady(true);
      return;
    }

    const unsubscribe = onAuthStateChanged(firebaseClient.auth, (nextUser) => {
      setUser(nextUser);
      setIsAuthReady(true);
    });

    return unsubscribe;
  }, [firebaseClient]);

  const loginWithGoogle = async () => {
    if (!firebaseClient) {
      setAuthError("BiteTrail sign-in is not available right now.");
      return;
    }

    setIsSubmitting(true);
    setAuthError(null);

    try {
      const credential = await signInWithGoogle(
        firebaseClient.auth,
        firebaseClient.googleProvider,
      );
      if (credential) {
        await ensureBiteTrailProfile(firebaseClient.db, credential.user);
      }
    } catch (error) {
      setAuthError(getReadableAuthError(error));
    } finally {
      setIsSubmitting(false);
    }
  };

  const logout = async () => {
    if (!firebaseClient) {
      return;
    }

    setIsSubmitting(true);
    setAuthError(null);

    try {
      await signOut(firebaseClient.auth);
    } catch (error) {
      setAuthError(getFirebaseAuthErrorMessage(error, "Sign-out failed."));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="site-surface-card rounded-[26px] p-5 sm:p-6 xl:flex xl:flex-col xl:justify-center">
      <div className="mb-5 flex items-center gap-3">
        <span className="inline-flex h-11 w-11 items-center justify-center rounded-[0.75rem] border border-[color:var(--site-border-strong)] bg-[color:var(--site-bg-soft)] text-[color:var(--site-accent-soft)] max-sm:hidden">
          <FaMapLocationDot className="h-5 w-5" />
        </span>
        <div>
          <p className="text-[0.72rem] font-semibold uppercase tracking-[0.16em] text-[color:var(--site-text-muted)]">
            BiteTrail account
          </p>
          <h2 className="xxl:text-[1.3rem] xl:text-[1.15rem] max-sm:text-[1rem] font-semibold text-[color:var(--site-text-strong)] max-sm:text-[1.15rem]">
            {!isAuthReady ? "Checking session..." : null}
            {isAuthReady && !user ? "Get started here" : null}
            {isAuthReady && user ? (
              <span>
                Welcome back,{" "}
                {normalizeBiteTrailDisplayName(user.uid, user.displayName) +
                  " "}
                {user.email ? (
                  <span className="inline-flex align-middle">
                    <InfoTooltip
                      ariaLabel="Signed-in account"
                      preferredPlacement="top"
                      panelClassName="text-[color:var(--site-text-strong)]"
                    >
                      Signed in as {user.email}
                    </InfoTooltip>
                  </span>
                ) : null}
              </span>
            ) : null}
          </h2>
        </div>
      </div>

      {user ? (
        <div className="flex flex-col gap-4">
          <Link
            href="/profile"
            className="inline-flex h-11 items-center justify-center gap-2 rounded-lg border border-[color:var(--site-border-strong)] bg-[color:var(--site-bg-soft)] px-4 text-[0.92rem] font-semibold text-[color:var(--site-text)] transition hover:border-[color:var(--site-accent-border-strong)] hover:text-[color:var(--site-accent-soft)]"
          >
            <FaUser className="h-4 w-4" />
            My profile
          </Link>
          <button
            type="button"
            onClick={logout}
            disabled={isSubmitting || !isAuthReady}
            className="site-button-primary inline-flex h-11 items-center justify-center gap-2 rounded-lg px-4 text-[0.92rem] font-semibold disabled:pointer-events-none disabled:opacity-55"
          >
            <FaArrowRightFromBracket className="h-4 w-4" />
            Sign out
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={loginWithGoogle}
          disabled={isSubmitting || !isAuthReady}
          className="site-button-primary inline-flex h-11 w-full items-center justify-center gap-2 rounded-lg px-4 font-semibold disabled:pointer-events-none disabled:opacity-55 sm:text-[0.92rem]"
        >
          <FaGoogle className="h-4 w-4" />
          {isSubmitting ? "Opening Google..." : "Login with Google"}
        </button>
      )}

      {authError ? (
        <p className="mt-4 rounded-lg border border-red-400/30 bg-red-500/10 px-3 py-2 text-[0.86rem] leading-6 text-red-200">
          {authError}
        </p>
      ) : null}
    </div>
  );
};

export default BiteTrailAuthPanel;
