"use client";

import { useEffect, useMemo } from "react";

import { getGoogleRedirectResult } from "@/lib/firebase-auth";
import { getFirebaseClient } from "@/lib/firebase";

const FirebaseAuthBootstrap = () => {
  const firebaseClient = useMemo(() => getFirebaseClient(), []);

  useEffect(() => {
    if (!firebaseClient) {
      return;
    }

    getGoogleRedirectResult(firebaseClient.auth).catch(() => {
      // Page-level auth panels display sign-in errors where appropriate.
    });
  }, [firebaseClient]);

  return null;
};

export default FirebaseAuthBootstrap;
