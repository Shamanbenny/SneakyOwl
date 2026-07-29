import {
  getRedirectResult,
  signInWithPopup,
  type Auth,
  type GoogleAuthProvider,
  type User,
  type UserCredential,
} from "firebase/auth";

let googleRedirectResultPromise: ReturnType<typeof getRedirectResult> | null =
  null;

const SESSION_ATTEMPT_TIMEOUT_MS = 3000;
const MAX_SESSION_ATTEMPTS = 3;

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

export const revalidateFirebaseSession = async (user: User) => {
  try {
    await user.getIdTokenResult();
  } catch {
    await user.getIdToken(true);
  }
};

const withTimeout = <T>(promise: Promise<T>, timeoutMs: number) =>
  new Promise<T>((resolve, reject) => {
    const timeoutId = setTimeout(() => {
      reject(new Error("Firebase session validation timed out."));
    }, timeoutMs);

    promise.then(
      (value) => {
        clearTimeout(timeoutId);
        resolve(value);
      },
      (error) => {
        clearTimeout(timeoutId);
        reject(error);
      },
    );
  });

export const withFirebaseSessionRetries = async <T>(
  user: User,
  operation: () => Promise<T>,
) => {
  let lastError: unknown;

  for (let attempt = 0; attempt < MAX_SESSION_ATTEMPTS; attempt += 1) {
    try {
      const attemptOperation =
        attempt === 0
          ? operation()
          : user.getIdToken(true).then(() => operation());
      return await withTimeout(attemptOperation, SESSION_ATTEMPT_TIMEOUT_MS);
    } catch (error) {
      lastError = error;
    }
  }

  throw lastError instanceof Error
    ? lastError
    : new Error("Firebase session validation failed.");
};

export const getFirebaseAuthErrorMessage = (
  error: unknown,
  fallback = "Google sign-in did not complete. Please try again.",
) => {
  const authError = error as { code?: string; message?: string };
  const code = authError.code?.replace(/^auth\//, "");
  return code ? `${fallback} (${code})` : fallback;
};
