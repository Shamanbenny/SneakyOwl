"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { onAuthStateChanged, type User } from "firebase/auth";
import { FaGoogle, FaMapLocationDot } from "react-icons/fa6";

import { createFollowing, ensureBiteTrailProfile } from "@/lib/bite-trail";
import { signInWithGoogle } from "@/lib/firebase-auth";
import { getFirebaseClient } from "@/lib/firebase";

const BiteTrailJoinPanel = () => {
  const firebaseClient = useMemo(() => getFirebaseClient(), []);
  const searchParams = useSearchParams();
  const ownerUid = searchParams.get("uid")?.trim() || "";
  const [user, setUser] = useState<User | null>(null);
  const [isWorking, setIsWorking] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!firebaseClient) {
      return;
    }
    return onAuthStateChanged(firebaseClient.auth, setUser);
  }, [firebaseClient]);

  const signIn = async () => {
    if (!firebaseClient) {
      setMessage("BiteTrail sign-in is not configured yet.");
      return;
    }

    setIsWorking(true);
    setMessage(null);
    try {
      const credential = await signInWithGoogle(
        firebaseClient.auth,
        firebaseClient.googleProvider,
      );
      if (credential) {
        await ensureBiteTrailProfile(firebaseClient.db, credential.user);
      }
    } catch {
      setMessage("Google sign-in did not complete. Please try again.");
    } finally {
      setIsWorking(false);
    }
  };

  const follow = async () => {
    if (!firebaseClient || !user || !ownerUid) {
      return;
    }

    setIsWorking(true);
    setMessage(null);
    try {
      await ensureBiteTrailProfile(firebaseClient.db, user);
      await createFollowing(firebaseClient.db, user, ownerUid);
      setMessage("Added to your watched BiteTrail lists.");
    } catch (error) {
      setMessage(
        error instanceof Error ? error.message : "We could not add this list.",
      );
    } finally {
      setIsWorking(false);
    }
  };

  if (!ownerUid) {
    return (
      <section className="site-surface-card rounded-[26px] p-6 text-[color:var(--site-text)]">
        This BiteTrail friend link is incomplete.
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
          BiteTrail friend link
        </p>
        <h1 className="mt-2 text-[2rem] font-semibold text-[color:var(--site-text-strong)]">
          Add this meal map
        </h1>
        <p className="mt-3 leading-7 text-[color:var(--site-text-muted)]">
          Sign in, then add this person&apos;s BiteTrail list to your map.
        </p>
      </div>
      {!user ? (
        <button
          type="button"
          onClick={signIn}
          disabled={isWorking}
          className="site-button-primary inline-flex min-h-11 items-center justify-center gap-2 rounded-lg px-4 font-semibold disabled:opacity-55"
        >
          <FaGoogle className="h-4 w-4" aria-hidden="true" />
          {isWorking ? "Opening Google..." : "Sign in with Google"}
        </button>
      ) : (
        <button
          type="button"
          onClick={follow}
          disabled={isWorking}
          className="site-button-primary inline-flex min-h-11 items-center justify-center rounded-lg px-4 font-semibold disabled:opacity-55"
        >
          {isWorking ? "Adding list..." : "Add to my BiteTrail"}
        </button>
      )}
      {message ? (
        <p className="text-[0.84rem] leading-6 text-[color:var(--site-accent-soft)]">
          {message}
        </p>
      ) : null}
      <Link
        href="/tools/bite-trail"
        className="text-[0.82rem] font-semibold uppercase tracking-[0.12em] text-[color:var(--site-accent-soft)] hover:underline"
      >
        Open BiteTrail
      </Link>
    </section>
  );
};

export default BiteTrailJoinPanel;
