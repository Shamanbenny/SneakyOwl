# Architecture Notes

## Frontend

SneakyOwl already has Leaflet installed and imports `leaflet/dist/leaflet.css` in `app/layout.tsx`, so the map implementation can stay in the existing stack.

Recommended component split:

```text
app/tools/[final-slug]/page.tsx
app/components/tools/[final-slug]/
  ToolShell.tsx
  AuthGate.tsx
  FoodEntryMap.tsx
  FoodLocationPicker.tsx
  FoodEntryForm.tsx
  EntryDetailPanel.tsx
  ClusterEntryList.tsx
  ShareListPanel.tsx
  WatchListPanel.tsx
  QRShareCode.tsx
```

Because Next.js App Router can render on the server, Leaflet components should be client-only. Use `"use client"` in map components and dynamic imports if hydration issues appear.

## Map Design

Creation/editing map:

- Starts centered on Singapore or the user's browser geolocation if permission is granted.
- Click on map sets a pin.
- Draggable marker updates the selected latitude/longitude.
- "Use current location" uses `navigator.geolocation.getCurrentPosition`.
- Manual coordinate inputs remain optional, but should still sync back to the marker if present.

Exploration map:

- Load all own entries and watched friends' shared entries.
- Normalize entries into a single client-side map item model.
- Render individual markers for sparse areas.
- Cluster nearby markers by zoom level.
- Cluster click behavior:
  - If zoomed out, optionally zoom toward cluster bounds.
  - Also open a side panel or bottom sheet with the represented entries.
- Marker click behavior:
  - Selects one entry.
  - Opens a detail panel with place name, owner, rating, cost, items bought, comments, and visit date.

Preferred detail UI:

- Desktop: right-side panel.
- Mobile: bottom sheet.
- Popup can remain as a lightweight preview, but the richer description panel should be outside the Leaflet popup so forms, actions, and long comments remain usable.

## Clustering

Options:

- Use a maintained Leaflet clustering package if compatible with React 19 and Next 15.
- If package compatibility is poor, compute clusters in client state using current map bounds/zoom and a screen-pixel radius.

First implementation can use a simple grid-based clustering algorithm:

- Convert lat/lng to map layer points with Leaflet's map projection.
- Bucket points by `clusterRadiusPx`, for example 44 to 56 px.
- For buckets with more than one entry, render one custom cluster marker with count.
- For single-entry buckets, render a normal marker.

This avoids coupling the app to an unmaintained React wrapper and keeps cluster panel behavior fully controlled.

## Backend Choice

Firebase is the lower-friction first choice:

- RafflesGo already demonstrates Firebase auth, Firestore collections, and auth middleware patterns.
- Google sign-in is first-class.
- Firestore security rules are well suited for owner/private data plus share relationships.
- Static-export deployment can still talk directly to Firebase from the browser.

Supabase remains a good alternative if relational permissions become complex:

- Postgres tables can model users, entries, share tokens, watch relationships, and revocations cleanly.
- Row Level Security can express owner/viewer access.
- QR/share-code lookup can be implemented through a server/API route or Supabase RPC.

Decision point:

- Pick Firebase for faster portfolio integration and easier static hosting.
- Pick Supabase if searchable relational queries, SQL analytics, or complex access-control joins are expected early.

## Firestore-Style Data Model

```text
users/{userId}
  displayName
  photoURL
  email
  activeShareCodeId
  createdAt
  updatedAt

users/{userId}/entries/{entryId}
  placeName
  latitude
  longitude
  geohash
  costPerPerson
  currency
  ratingOutOf10
  itemsBought
  comments
  visitedAt
  createdAt
  updatedAt

shareCodes/{codeId}
  ownerUserId
  codeHash
  active
  createdAt
  revokedAt

watchRelationships/{relationshipId}
  ownerUserId
  viewerUserId
  sourceCodeId
  status
  createdAt
  removedAt
```

Notes:

- Store only a hash of the share code server-side if possible.
- Use a random, high-entropy code, not an incrementing identifier.
- Revoking a code should prevent new watchers from joining.
- Existing watchers can either remain until explicitly removed or be removed on rotation; this is a product decision.

## Access Rules

Users can:

- Read and write their own profile.
- Read and write their own entries.
- Read entries for owners where an active watch relationship exists.
- Create a watch relationship by presenting a valid active share code.
- Delete their own watch relationships.

Owners can:

- Deactivate or rotate their share code.
- Remove specific viewers if owner-side watch management is implemented.
- Never edit another user's entries.

## QR and Share Codes

Share URL shape:

```text
/tools/[final-slug]/join?code=<random-code>
```

Manual entry:

```text
XXXX-XXXX-XXXX
```

The QR code should encode the URL, while the manual input accepts the bare code. The app should handle signed-out users by preserving the code through the sign-in flow.

## Privacy and Abuse Considerations

- Make the default state private.
- Make sharing explicit and revocable.
- Avoid exposing user email addresses to viewers.
- Show friend display names and avatars only after a watch relationship exists.
- Rate-limit or otherwise guard share-code lookups to prevent brute force.
- Consider location privacy warnings because food entries can reveal routines.

## Static Export Risk

`next.config.mjs` currently uses static export. Firebase client SDK usage is compatible with that. Next API routes are not available in a static export deployment, so server-required workflows should either use Firebase services directly or require a deployment target change.
