# Architecture Notes

## Frontend

SneakyOwl already has Leaflet installed and imports `leaflet/dist/leaflet.css` in `app/layout.tsx`, so the map implementation can stay in the existing stack.

Current implementation:

```text
app/tools/bite-trail/page.tsx
app/components/tools/bite-trail/
  BiteTrailAuthPanel.tsx
  BiteTrailDataPanel.tsx
  BiteTrailMap.tsx
  BiteTrailMapData.tsx
  BiteTrailSparklesTitle.tsx
  BiteTrailWorkspace.tsx
  mockFoodEntries.ts
```

`BiteTrailMap.tsx` is the current Leaflet/OpenStreetMap map foundation. It combines
Firestore-backed places with the static sample source, while the map component remains
the real interactive BiteTrail map rather than a temporary mock-only component.

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
- The `+` control above "Center to me" uses `navigator.geolocation.getCurrentPosition`, centers the map, and creates a draggable draft pin.
- Map clicks set a pin only while location picking is active; dragging the draft marker updates the shared latitude/longitude values.
- The same control becomes a red delete button with a "Clear new pin" tooltip while a draft pin exists.
- "Center to me" only updates the read-only current-location display and map view.
- Manual coordinate inputs sync back to the draft marker when both values are valid.

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
  - Selects one place.
  - Opens a detail panel with visible-visit averages and the individual visit records.

Preferred detail UI:

- Desktop: right-side panel.
- Mobile: bottom sheet.
- Popup can remain as a lightweight preview, but the richer description panel should be outside the Leaflet popup so forms, actions, and long comments remain usable.

Current map UI decisions:

- The "Singapore" recenter button calls `setView(SINGAPORE_CENTER, SINGAPORE_ZOOM)` in `BiteTrailMap.tsx`.
- Change the default center by editing `SINGAPORE_CENTER`.
- Change the default zoom by editing `SINGAPORE_ZOOM`.
- Individual pins are compact circular markers.
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
- Firestore persistence is implemented for shared profiles, BiteTrail preferences, global places, visits, and reciprocal relationships.
- The client SDK handles simple owner-scoped configuration and append-only visit writes; Flask handles coordinated relationships, authorised live-place retrieval, destructive cleanup, and display-name fan-out.
- Hide/Show is intentionally local to the viewer: the selected watched-owner
  IDs are stored in browser local storage and filtered from that viewer's map.
  It does not mutate the shared relationship or require a profile-settings
  save. Stop watching remains the relationship-changing operation.
- The separate Flask/Vercel backend is used for cross-owner or multi-step workflows, while preserving direct Firestore access where the operation is simple and safely owner-scoped.

Firebase remains the lower-friction first choice for BiteTrail storage:

- RafflesGo already demonstrates Firebase auth, Firestore collections, and auth middleware patterns.
- Google sign-in is first-class.
- Firestore security rules are well suited for owner/private data plus share relationships.
- Static-export deployment can still talk directly to Firebase from the browser.

Supabase was considered but is not the current direction:

- Postgres tables can model users, entries, share tokens, watch relationships, and revocations cleanly.
- Row Level Security can express owner/viewer access.
- QR/share-code lookup can be implemented through a server/API route or Supabase RPC.

Do not introduce Flask as a proxy for simple owner-scoped Firestore operations. Use it when an operation must coordinate multiple documents, resolve cross-owner visibility, or maintain denormalized account data.

## Initial Firestore-Style Data Model (Superseded)

The original flat entry model below is retained as historical context only. The active model is documented in `Place And Visit Model` near the end of this file.

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
- `cuisineGenre` should be stored as a controlled category or validated value before real entry creation is implemented.

## Sample Data Status

`mockFoodEntries.ts` currently provides the static/global source for entries that should be available without a per-user Firestore query:

- Rename or document it clearly as sample data if the filename becomes confusing.
- Ratings are represented as whole numbers from 0 to 10.
- Cuisine genre is represented by a typed category set including fast food, western, Korean, Japanese, Thai, Indian, seafood, cafe, dessert, and hawker.
- The dataset includes repeated visits by the same list owner, normal clusters, and a deliberately inseparable maximum-zoom cluster.
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
/tools/bite-trail/add?uid=<owner-firebase-auth-uid>
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

## Place And Visit Model

The long-term storage model separates immutable shared place metadata from user-owned visits:

```text
tools/bite-trail/users/{uid}
  defaultCurrency
  mapStart
  hasCompletedTutorial

tools/bite-trail/followings/{uid}/relationships/{friendUid}
  friendUid
  friendDisplayName

tools/bite-trail/places/{placeId}
  name
  locationLabel
  latitude
  longitude
  cuisineGenre
  createdAt
  updatedAt

tools/bite-trail/places/{placeId}/visits/{visitId}
  ownerUid
  ownerDisplayName
  costPerPerson
  currency
  ratingOutOf10
  itemsBought
  comments
  visitedAt
  createdAt
```

Shared account identity remains at `users/{uid}` (`displayName`, `photoURL`). BiteTrail preferences and tutorial completion are tool-specific data under `tools/bite-trail/users/{uid}`. Place IDs are reused when another authorized user appends a visit. The app does not infer identity from mall, neighborhood, name similarity, or coordinate proximity. There is no tracked initial creator and no metadata-edit workflow. Users may delete only visits they created; when no valid visits remain, the place and related metadata are deleted.

The browser writes only simple owner-scoped configuration and new visit records. Flask coordinates reciprocal follow changes, returns the authenticated viewer's live authorised visits grouped by global place, deletes visits/account data, and fans display-name changes out to matching visits and relationship documents before reporting success. The static SneakyOwl source remains frontend-only; it replaces its placeholder visits only when the viewer follows the configured SneakyOwl UID.

The map and list render one item per place. Owner and watch-list filtering happens before aggregation, so averages only include visible visits. Rating averages display one decimal place and cost averages display two decimal places. The selected place panel shows the aggregate summary followed by every visible visit fully expanded with contributor, date, rating, cost, ordered items, and comments. Firestore data refreshes replace only the entry-marker layer; the Leaflet map instance, viewport, current-location overlay, and draft pin remain in place.

Closure reports are separate per-user signals with timestamps. They contribute to a future closure-likelihood indicator but never close or delete a place for everyone. The current map loads its data when authentication is ready and refreshes after successful writes. It is not a realtime listener for changes made elsewhere; a future refresh button can explicitly reload the current state.

## Static Export Risk

`next.config.mjs` currently uses static export. Firebase client SDK usage is compatible with that. Next API routes are not available in a static export deployment, so server-required workflows should either use Firebase services directly or require a deployment target change.
