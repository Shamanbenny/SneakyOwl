"use client";

import { useEffect, useMemo, useState } from "react";
import { FaGoogle, FaUser } from "react-icons/fa6";

import { ensureBiteTrailProfile } from "@/lib/bite-trail";
import {
  getFirebaseAuthErrorMessage,
  getGoogleRedirectResult,
  signInWithGoogle,
} from "@/lib/firebase-auth";
import { getFirebaseClient } from "@/lib/firebase";

const LoginRequiredPanel = () => {
  const firebaseClient = useMemo(() => getFirebaseClient(), []);
  const [isSigningIn, setIsSigningIn] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!firebaseClient) {
      return;
    }

    getGoogleRedirectResult(firebaseClient.auth)
      .then(async (credential) => {
        if (credential) {
          await ensureBiteTrailProfile(firebaseClient.db, credential.user);
        }
      })
      .catch((error) => {
        setMessage(getFirebaseAuthErrorMessage(error));
      });
  }, [firebaseClient]);

  const loginWithGoogle = async () => {
    if (!firebaseClient) {
      setMessage("Firebase sign-in is not configured yet.");
      return;
    }

    setIsSigningIn(true);
    setMessage(null);
    try {
      const credential = await signInWithGoogle(
        firebaseClient.auth,
        firebaseClient.googleProvider,
      );
      if (credential) {
        await ensureBiteTrailProfile(firebaseClient.db, credential.user);
      }
    } catch (error) {
      setMessage(getFirebaseAuthErrorMessage(error));
    } finally {
      setIsSigningIn(false);
    }
  };

  return (
    <section className="site-surface-card grid max-w-[620px] gap-5 rounded-[26px] p-6 sm:p-8">
      <div>
        <h1 className="text-[1.8rem] font-semibold text-[color:var(--site-text-strong)] max-sm:text-[1.5rem]">
          Login to Sneaky Owl
        </h1>
        <p className="mt-3 leading-7 text-[color:var(--site-text-muted)]">
          Login is{" "}
          <strong className="font-bold text-[color:var(--site-accent)]">
            not required
          </strong>{" "}
          for most of the website, but doing so will allow you personalized
          features for the tools you use, and will also mean that you agree to
          our{" "}
          <a
            href="/privacy"
            className="text-[color:var(--site-accent)] hover:text-[color:var(--site-accent-soft)] hover:underline"
          >
            Privacy Policy
          </a>
          .
        </p>
      </div>
      <button
        type="button"
        onClick={loginWithGoogle}
        disabled={isSigningIn || !firebaseClient}
        className="site-button-primary inline-flex min-h-11 items-center justify-center gap-2 rounded-lg px-4 font-semibold disabled:opacity-55"
      >
        <FaGoogle className="h-4 w-4" aria-hidden="true" />
        {isSigningIn ? "Opening Google..." : "Login with Google"}
      </button>
      {message ? (
        <p className="text-[0.84rem] leading-6 text-[color:var(--site-accent-soft)]">
          {message}
        </p>
      ) : null}
    </section>
  );
};

export default LoginRequiredPanel;
