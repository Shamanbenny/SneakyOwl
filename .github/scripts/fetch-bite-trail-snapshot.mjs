import { createSign } from "node:crypto";
import { mkdir, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";

const ownerUid = "AXOel5MZ8Yelb5a1bHgFcieT80y2";
const outputPath = process.argv[2] ?? "dist/bite-trail.json";
const apiBaseUrl = process.env.BITE_TRAIL_API_BASE_URL?.replace(/\/$/, "");
const webApiKey = process.env.FIREBASE_WEB_API_KEY;
const serviceAccountJson = process.env.FIREBASE_SERVICE_ACCOUNT_JSON;

if (!apiBaseUrl || !webApiKey || !serviceAccountJson) {
  throw new Error(
    "BITE_TRAIL_API_BASE_URL, FIREBASE_WEB_API_KEY, and FIREBASE_SERVICE_ACCOUNT_JSON are required.",
  );
}

const serviceAccount = JSON.parse(serviceAccountJson);
const base64Url = (value) => Buffer.from(value).toString("base64url");

const issuedAt = Math.floor(Date.now() / 1000);
const unsignedToken = [
  base64Url(JSON.stringify({ alg: "RS256", typ: "JWT" })),
  base64Url(
    JSON.stringify({
      iss: serviceAccount.client_email,
      sub: serviceAccount.client_email,
      aud: "https://identitytoolkit.googleapis.com/google.identity.identitytoolkit.v1.IdentityToolkit",
      iat: issuedAt,
      exp: issuedAt + 3600,
      uid: ownerUid,
    }),
  ),
].join(".");
const signer = createSign("RSA-SHA256");
signer.update(unsignedToken);
const customToken = `${unsignedToken}.${signer
  .sign(serviceAccount.private_key)
  .toString("base64url")}`;

const identityResponse = await fetch(
  `https://identitytoolkit.googleapis.com/v1/accounts:signInWithCustomToken?key=${encodeURIComponent(webApiKey)}`,
  {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ token: customToken, returnSecureToken: true }),
  },
);

if (!identityResponse.ok) {
  const errorPayload = await identityResponse.json().catch(() => null);
  const firebaseError = errorPayload?.error;
  throw new Error(
    `Firebase custom-token exchange failed (${identityResponse.status}): ${
      firebaseError?.status || firebaseError?.message || "unknown Firebase error"
    }`,
  );
}

const { idToken } = await identityResponse.json();
const dataResponse = await fetch(`${apiBaseUrl}/v1/bite-trail/places`, {
  headers: { Authorization: `Bearer ${idToken}` },
});

if (!dataResponse.ok) {
  throw new Error(`BiteTrail API request failed (${dataResponse.status}).`);
}

const places = await dataResponse.json();
const snapshot = {
  fetchedAt: new Date().toISOString(),
  ownerUid,
  places,
  version: 1,
};

await mkdir(dirname(resolve(outputPath)), { recursive: true });
await writeFile(outputPath, `${JSON.stringify(snapshot, null, 2)}\n`);
