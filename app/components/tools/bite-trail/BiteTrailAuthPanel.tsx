"use client";

import { useEffect, useMemo, useState } from "react";
import {
  browserLocalPersistence,
  type AuthError,
  onAuthStateChanged,
  setPersistence,
  signInWithPopup,
  signOut,
  type User,
} from "firebase/auth";
import { FaArrowRightFromBracket, FaGoogle, FaMapLocationDot } from "react-icons/fa6";

import {
  getFirebaseClient,
  isFirebaseConfigured,
  requiredFirebaseEnvVars,
} from "@/lib/firebase";

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

  return error instanceof Error ? error.message : "Google sign-in failed.";
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
      return;
    }

    setIsSubmitting(true);
    setAuthError(null);

    try {
      await setPersistence(firebaseClient.auth, browserLocalPersistence);
      await signInWithPopup(firebaseClient.auth, firebaseClient.googleProvider);
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
      const message = error instanceof Error ? error.message : "Sign-out failed.";
      setAuthError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isFirebaseConfigured) {
    return (
      <div className="rounded-[22px] border border-[color:var(--site-accent-border-subtle)] bg-[color:var(--site-bg-soft)] p-5 text-[color:var(--site-text)] sm:p-6">
        <p className="mb-3 text-[0.72rem] font-semibold uppercase tracking-[0.16em] text-[color:var(--site-accent-soft)]">
          Firebase setup required
        </p>
        <p className="text-[0.95rem] leading-7 text-[color:var(--site-text-strong)]">
          BiteTrail is ready to use Firebase auth, but the frontend environment
          variables have not been filled in yet.
        </p>
        <div className="mt-4 grid gap-2 text-[0.82rem] text-[color:var(--site-text-muted)]">
          {requiredFirebaseEnvVars.map((envVar) => (
            <code
              key={envVar}
              className="rounded-lg border border-[color:var(--site-border)] bg-[color:var(--site-bg-strong)] px-3 py-2"
            >
              {envVar}
            </code>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-[22px] border border-[color:var(--site-border)] bg-[color:var(--site-bg-soft)] p-5 sm:p-6">
      <div className="mb-5 flex items-center gap-3">
        <span className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-[color:var(--site-accent-border-soft)] bg-[color:rgba(16,185,129,0.1)] text-[color:var(--site-accent-soft)]">
          <FaMapLocationDot className="h-5 w-5" />
        </span>
        <div>
          <p className="text-[0.72rem] font-semibold uppercase tracking-[0.16em] text-[color:var(--site-text-muted)]">
            BiteTrail account
          </p>
          <h2 className="text-[1.3rem] font-semibold text-[color:var(--site-text-strong)]">
            {isAuthReady
              ? user
                ? `Welcome back, ${user.displayName ?? "food explorer"}`
                : "Login with Google"
              : "Checking session..."}
          </h2>
        </div>
      </div>

      {user ? (
        <div className="flex flex-col gap-4">
          <div className="rounded-[18px] border border-[color:var(--site-border)] bg-[color:var(--site-bg-strong)] p-4">
            <p className="text-[0.85rem] text-[color:var(--site-text-muted)]">
              Signed in as
            </p>
            <p className="mt-1 break-words text-[color:var(--site-text-strong)]">
              {user.email}
            </p>
          </div>
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
          className="site-button-primary inline-flex h-11 w-full items-center justify-center gap-2 rounded-lg px-4 text-[0.92rem] font-semibold disabled:pointer-events-none disabled:opacity-55"
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
