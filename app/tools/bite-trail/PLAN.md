# BiteTrail Persistence and Access-Control Plan

## Current state

- Firebase Google Authentication is wired into the frontend.
- Firestore is not connected yet.
- Profile, preferences, sharing, and friend controls are currently mock UI state.
- `sneakyowl-flask` is currently an untouched Flask/Vercel template.
- SneakyOwl uses static export, so browser-side Firebase SDK calls remain compatible.

## Architecture decision

Use Firebase Auth plus direct Firestore client SDK access for ordinary user-owned operations.

Use `sneakyowl-flask` with the Firebase Admin SDK for destructive, transactional, or coordinated multi-user operations.

The frontend sends a Firebase ID token to Flask:

```http
Authorization: Bearer <firebase-id-token>
```

Flask verifies the token, derives the authenticated UID from it, and never trusts a UID supplied in the request body.

## Operation split

| Operation | Handler | Reason |
|---|---|---|
| Add a visit to your own place | Frontend -> Firestore | Owner-scoped create protected by Security Rules |
| Create a new place with its first visit | Frontend -> Firestore batch | Simple atomic write owned by one user |
| Fetch your own visits | Frontend -> Firestore | Owner-only query |
| Fetch visible friend visits | Frontend -> Firestore | Query each explicitly authorized friend |
| Change display name | Frontend | Update Firebase Auth profile and Firestore profile |
| Change BiteTrail preferences | Frontend -> Firestore | User-owned document |
| Delete your visit | Flask backend | Transactionally delete the visit and clean up an orphaned place |
| Delete all BiteTrail data | Flask backend | Recursive/multi-collection deletion |
| Generate a share link | Frontend | Link contains the owner's Firebase Auth UID; no secret invite token |
| Accept a friend link | Frontend -> Firestore, or Flask for symmetric cleanup | The UID identifies the owner; the signed-in user is still authenticated normally |
| Remove a friend for both parties | Flask backend | Coordinated deletion/revocation |
| Revoke a viewer's access | Flask backend | Coordinated relationship/access update |
| Create a store-closure report | Frontend initially | User-owned report |
| Aggregate closure likelihood | Backend later | Cross-user aggregation |

## Simple friend-link model

The friend link should be intentionally simple:

```text
/tools/bite-trail/join?uid=<owner-firebase-auth-uid>
```

The Firebase Auth UID is an identifier, not a secret. It must not be treated as an invite password, Firebase ID token, or authorization credential. Never put a Firebase ID token in the URL.

When a signed-in user opens the link, the frontend can create:

```text
users/{viewerUid}/following/{ownerUid}
  status: "active"
  createdAt
```

The Firestore read rule for the owner's list can then require that the current viewer has an active `following/{ownerUid}` document. This means anyone who has the link can follow the owner's list; that is an intentional product tradeoff.

The owner does not need a reciprocal `viewers` document for the basic version. If the owner needs to stop a particular person from seeing the list, add an owner-controlled block document:

```text
users/{ownerUid}/blockedViewers/{viewerUid}
  createdAt
```

The read rule should require an active following document and the absence of a block document.

For the UI to show “people watching me” and to remove a relationship symmetrically, retain the Flask endpoint that deletes both relationship/block records. This is coordination rather than secrecy.

There is no need for `inviteTokens`, token hashes, expiry, QR-secret rotation, or invite rate limiting in the initial version. A QR code can simply encode the UID-based URL.

## Place ownership model

Places should be scoped to the list owner rather than globally shared documents.

A global place collection makes “fetch everything visible to me” difficult to secure with direct Firestore queries. Owner-scoped data lets the frontend query only known authorized owners and lets Security Rules validate access through a relationship document.

Two users may record the same restaurant independently. Optional place matching or merging can be introduced later as an explicit feature.

## Conceptual Firestore structure

The `bite-trail/` prefix is an organizational convention. Actual Firestore collections may be root collections such as `users` and `auditEvents`.

```text
bite-trail/
  users/
    {uid}/
      profile
      preferences/
        bite-trail

      following/
        {ownerUid}
          status
          createdAt
          updatedAt

      blockedViewers/
        {viewerUid}
          createdAt

      places/
        {placeId}
          name
          locationLabel
          latitude
          longitude
          cuisineGenre
          createdAt
          updatedAt

          visits/
            {visitId}
              ownerUid
              ratingOutOf10
              costPerPerson
              currency
              itemsBought
              comments
              visitedAt
              createdAt
              updatedAt

  auditEvents/
    {eventId}
      actorUid
      action
      targetUid
      createdAt
```

Recommended actual paths:

```text
users/{uid}
users/{uid}/preferences/bite-trail
users/{uid}/following/{ownerUid}
users/{uid}/places/{placeId}
users/{uid}/places/{placeId}/visits/{visitId}
users/{uid}/blockedViewers/{viewerUid}
auditEvents/{eventId}
```

## Firestore Security Rules requirements

Frontend-writable documents:

- `users/{uid}` profile fields
- `users/{uid}/preferences/bite-trail`
- `users/{uid}/places/{placeId}` during creation
- `users/{uid}/places/{placeId}/visits/{visitId}` during creation

Rules must enforce:

- The authenticated user owns `{uid}` for writes.
- A visit's `ownerUid` equals `request.auth.uid`.
- Friends cannot write another user's places or visits.
- Place metadata is immutable after creation, unless explicitly editable fields are added later.
- Frontend visits are append-only; deletion goes through Flask.
- A viewer may create and delete only their own `following` document.
- An owner may create and delete only their own `blockedViewers` documents.
- Deletion/audit documents cannot be written by the frontend.
- Another user's data is readable only when an active relationship exists at:
  `users/{request.auth.uid}/following/{ownerUid}`.
- The read must also confirm that the owner has not blocked the viewer.

The frontend must first read its own `following` documents and then query its own data plus each authorized friend's path. It must not query all users and expect Security Rules to filter the result. Firestore queries are all-or-nothing with respect to rules.

## Flask API

Initial endpoint shape:

```text
DELETE /v1/bite-trail/friends/{friendUid}

DELETE /v1/bite-trail/visits/{ownerUid}/{placeId}/{visitId}
DELETE /v1/bite-trail/data

POST   /v1/bite-trail/viewers/{viewerUid}/revoke
```

Backend requirements:

- Verify the Firebase ID token with `firebase_admin.auth.verify_id_token`.
- Derive the actor UID from the verified token.
- Use Firestore transactions for friend changes and visit deletion.
- Use Admin SDK only after performing explicit authorization and input validation; Admin SDK writes bypass Firestore Rules.
- Add idempotency keys for symmetric friend removal and destructive operations.
- Never expose email addresses unless the product explicitly needs them.

## Visit deletion transaction

`DELETE /visits/...` should:

1. Verify that the caller owns the visit.
2. Delete or soft-delete the visit.
3. Check whether the place has any remaining active visits.
4. Delete the place if no active visits remain.
5. Write an audit event.
6. Return an idempotent success response if the visit was already deleted.

## Firebase setup required before implementation

1. Enable Firebase Authentication and the Google provider.
2. Add `localhost`, `sneakyowl.net`, and the deployed frontend domain to Authorized Domains.
3. Create Firestore in production mode.
4. Deploy explicit Firestore Security Rules.
5. Deploy indexes only when required by actual query errors.
6. Configure Firebase Admin credentials only in Vercel/backend environment variables.
7. Configure Flask CORS for the SneakyOwl origin.
8. Do not put Firebase Admin credentials or service-account JSON in frontend code.

Frontend environment variables:

```text
NEXT_PUBLIC_FIREBASE_API_KEY
NEXT_PUBLIC_FIREBASE_APP_ID
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID
NEXT_PUBLIC_FIREBASE_PROJECT_ID
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET
NEXT_PUBLIC_SNEAKYOWL_API_BASE_URL
```

Backend environment variables should include the Firebase project ID and Admin SDK credentials, stored only in the Flask/Vercel environment.

## Implementation order

1. Add Firestore client initialization beside the existing Firebase Auth initialization.
2. Define shared TypeScript types and validation for profiles, preferences, places, and visits.
3. Add Firestore Security Rules and emulator tests for owner/friend access.
4. Replace mock profile and preference state with direct Firestore/Auth updates.
5. Implement owner-scoped place and visit creation using a batch/transaction.
6. Replace sample map data with own and authorized-friend queries.
7. Implement Flask Firebase Admin initialization and token middleware.
8. Implement UID-link following and symmetric friend removal.
9. Implement transactional visit deletion and complete BiteTrail deletion.
10. Add audit logging, idempotency, loading states, and permission-denied handling.
