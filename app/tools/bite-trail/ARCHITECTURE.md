# Architecture Notes

## Frontend

SneakyOwl already has Leaflet installed and imports `leaflet/dist/leaflet.css` in `app/layout.tsx`, so the map implementation can stay in the existing stack.

Current implementation:

```text
app/tools/bite-trail/page.tsx
app/components/tools/bite-trail/
  BiteTrailAuthPanel.tsx
  BiteTrailMap.tsx
  BiteTrailSparklesTitle.tsx
  mockFoodEntries.ts
```

`BiteTrailMap.tsx` is the current Leaflet/OpenStreetMap map foundation. It uses
sample data for visual design, but the map component itself is intended to evolve into
the real BiteTrail map rather than remain a temporary mock component.

Longer-term component split:

```text
app/tools/bite-trail/page.tsx
app/components/tools/bite-trail/
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
- Use OpenStreetMap default tiles for now because they are more realistic and user-friendly than the previous black/gray map direction.
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

Current map UI decisions:

- The "Singapore" recenter button calls `setView(SINGAPORE_CENTER, SINGAPORE_ZOOM)` in `BiteTrailMap.tsx`.
- Change the default center by editing `SINGAPORE_CENTER`.
- Change the default zoom by editing `SINGAPORE_ZOOM`.
- Individual pins are teardrop markers, not regular circles.
- Own-entry pins use black border, green accent fill, and black inner dot.
- Friend-entry pins use the same shape but replace green with `--site-accent-cyan`, matching the landing page competition accent.
- Cluster pins use the inverted treatment: green accent border, black fill, and green inner count circle.

## Clustering

Current choice:

- Use `leaflet.markercluster` for the first implementation.
- Import the package client-side after Leaflet is loaded.
- If the marker-cluster chunk fails, fall back to a plain Leaflet feature group so the map still renders without clusters.

Alternative retained for later:

- If package compatibility is poor, compute clusters in client state using current map bounds/zoom and a screen-pixel radius.

Possible custom grid-based clustering algorithm:

- Convert lat/lng to map layer points with Leaflet's map projection.
- Bucket points by `clusterRadiusPx`, for example 44 to 56 px.
- For buckets with more than one entry, render one custom cluster marker with count.
- For single-entry buckets, render a normal marker.

This avoids coupling the app to an unmaintained React wrapper and keeps cluster panel behavior fully controlled.

## Backend Choice

Current decision:

- Firebase Google Authentication is already wired into the BiteTrail auth smoke test.
- The full data backend is still not implemented.
- The separate Flask/Vercel backend can still be added later, but it is deferred while the UI and Firebase auth foundation are validated.

Firebase remains the lower-friction first choice for BiteTrail storage:

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
  cuisineGenre
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
- `ratingOutOf10` should be stored as an integer.
- `cuisineGenre` should be added before real entry creation is implemented.

## Sample Data Status

`mockFoodEntries.ts` currently exists only to drive the visual map UI. It needs a cleanup pass before it is used as a schema reference:

- Rename or document it clearly as sample data if the filename becomes confusing.
- Convert ratings to whole numbers.
- Add cuisine genre values such as fast food, western, Korean, Japanese, cafe, dessert, and hawker.
- Keep the sample entries close to the fields expected in the real create/edit form.

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
/tools/bite-trail/join?code=<random-code>
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
