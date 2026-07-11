import {
  getRedirectResult,
  signInWithPopup,
  type Auth,
  type GoogleAuthProvider,
  type UserCredential,
} from "firebase/auth";

let googleRedirectResultPromise: ReturnType<typeof getRedirectResult> | null =
  null;

export const signInWithGoogle = async (
  auth: Auth,
  provider: GoogleAuthProvider,
): Promise<UserCredential | null> => {
  return signInWithPopup(auth, provider);
};

export const getGoogleRedirectResult = (auth: Auth) => {
  googleRedirectResultPromise ??= getRedirectResult(auth);
  return googleRedirectResultPromise;
};

export const getFirebaseAuthErrorMessage = (
  error: unknown,
  fallback = "Google sign-in did not complete. Please try again.",
) => {
  const authError = error as { code?: string; message?: string };
  const code = authError.code?.replace(/^auth\//, "");
  return code ? `${fallback} (${code})` : fallback;
};
