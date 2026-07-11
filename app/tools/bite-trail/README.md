# BiteTrail Plan

BiteTrail is a personal and social food-place map. Users sign in, create shared place records, append their own visits, and optionally view friends' visible visits on the same map.

## Place And Visit Model

A place has one stable user-managed ID containing the store name, user-entered location, coordinates, and cuisine. BiteTrail does not automatically group malls, neighborhoods, similar names, or nearby coordinates.

Each visit is a separate append-only record attached to the place ID. It stores its user, date, rating, cost per person, ordered items, and comments. Users may delete only their own visits; place metadata is immutable. If the last valid visit is deleted, the place and related metadata are deleted.

The map and View entries list render one pin and one row per place. Averages use only visits visible under the current watch-list and filter selections. Rating averages display one decimal place and cost averages display two decimal places. The selected place view shows the summary followed by every visible visit in a fully expanded sub-container.

## RafflesGo Map Behavior To Reuse

RafflesGo uses Leaflet through React components:

- `rafflesgo-group-11/frontend/src/components/shared/LocationPickerMap.tsx` is the pin picker.
- `rafflesgo-group-11/frontend/src/pages/ReportSighting.tsx` embeds that picker inside each sighting form.
- `rafflesgo-group-11/frontend/src/pages/WalkDetails.tsx` renders saved sightings as read-only markers with `Popup` panels.

Important mechanics:

- Map tiles use OpenStreetMap through Leaflet's `TileLayer`.
- A map click calls `useMapEvents({ click })`, stores `[lat, lng]`, and passes fixed-precision strings back to the parent form.
- The marker is draggable; `dragend` reads `marker.getLatLng()` and updates the parent state.
- "Use My Current GPS" calls `navigator.geolocation.getCurrentPosition`, drops the marker at the current location, and pans/zooms there.
- Manual latitude/longitude fields can push coordinates back into the map through `externalLat` and `externalLng`.
- Saved records are rendered as `<Marker><Popup>...</Popup></Marker>` in the read-only map.

BiteTrail should reuse the same conceptual split:

- A reusable map picker for creating/editing one food-place entry.
- A read-only/exploratory map for many saved food entries.
- A selected-entry detail panel that can show richer information than a small popup.

## Core User Stories

- As a signed-in user, I can add a food-place pin from my current GPS location.
- As a signed-in user, I can click anywhere on the map to place a pin manually.
- As a signed-in user, I can drag a placed pin to correct its exact location.
- As a signed-in user, I can store the place name, cost per person, rating out of 10, comments, and optionally what I bought.
- As a signed-in user, I can edit or delete my own entries.
- As a signed-in user, I can generate a share code/link/QR for my list.
- As a signed-in user, I can add a friend's shared list to my watch list.
- As a viewer, I can show my entries and watched friends' entries together on the same map.
- As a viewer, I can click a pin or cluster to open the relevant list/detail panel.
- As a list owner, I can revoke or rotate my share code.
- As a viewer, I can remove a friend from my watch list.

## Planned Fields

Entry fields:

- `id`
- `ownerUserId`
- `placeName`
- `latitude`
- `longitude`
- `cuisineGenre` such as fast food, western, Korean, Japanese, cafe, dessert, hawker, etc.
- `costPerPerson`
- `currency`
- `ratingOutOf10` as a whole number
- `itemsBought` optional text/list
- `comments`
- `visitedAt`
- `createdAt`
- `updatedAt`
- `visibility` initially private to owner, visible through share relationships
- `source` own entry or watched friend's entry in the client view model

User/list fields:

- `userId`
- `displayName`
- `photoURL`
- `shareCodeHash`
- `shareCodeCreatedAt`
- `shareCodeRevokedAt` optional
- `watchingUserIds` or a separate watch relationship table/collection
- `blockedViewerIds` or revoked share relationships, depending on backend choice

## Implementation Todo

- [x] Choose final tool name and URL slug: BiteTrail at `/tools/bite-trail`.
- [x] Decide initial auth provider: Firebase Google Authentication.
- [x] Add `/tools` index route.
- [x] Add the first tool route under the selected slug.
- [x] Add Google sign-in smoke-test UI.
- [x] Add a Leaflet/OpenStreetMap map preview using sample food-entry data.
- [x] Add selected pin detail panel and cluster list panel.
- [x] Model repeated visits as one shared place with multiple visit records in the sample data.
- [x] Add marker clustering with `leaflet.markercluster`.
- [x] Use realistic OpenStreetMap tiles instead of a black/gray map style.
- [x] Style map pins as teardrops, with green for own entries and the landing page competition blue for friends.
- [ ] Decide final backend/storage shape for entries, share codes, watch lists, and revocation. Firebase is still the strongest current direction, but the separate Flask/Vercel backend is deferred for later.
- [ ] Correct the sample food-entry data before treating it as the model source of truth:
  - Ratings should be whole numbers out of 10, not decimal scores.
  - Entries need a cuisine genre such as fast food, western, Korean, Japanese, cafe, dessert, or hawker.
  - Sample copy should model the actual fields expected in the entry form.
- [ ] Add database schema and access rules.
- [ ] Build create/edit entry form.
- [ ] Build map picker based on RafflesGo's click/drag/GPS/manual-coordinate flow.
- [ ] Connect the current map preview to real persisted entries once storage is ready.
- [ ] Add share code generation and QR rendering.
- [ ] Add friend-list import by code/link.
- [ ] Add watch-list management.
- [ ] Add owner-side share revocation or code rotation.
- [ ] Add a non-destructive "Report store closure" signal and show the resulting likelihood indicator without closing the place for everyone.
- [ ] Add a refresh control beside the map pins badge for the future one-time data refresh workflow.
- [ ] Add empty, loading, auth-required, permission-denied, and offline/error states.
- [ ] Verify mobile map usability, especially GPS permission errors and bottom-sheet detail panels.

## Name

The selected product name is **BiteTrail**.

## Decisions So Far

- Tools route: `/tools`.
- BiteTrail route: `/tools/bite-trail`.
- Authentication smoke test: Firebase Google Authentication.
- Current map library: Leaflet.
- Current map tiles: OpenStreetMap default tiles.
- Current clustering package: `leaflet.markercluster`.
- Detail layout: desktop side panel, mobile-friendly stacked panel for now.
- Marker colors: own entries use the site green accent; friend entries use `--site-accent-cyan`, matching the landing page competition accent.
- Rating format: whole-number score out of 10.
- Required entry taxonomy: add cuisine genre.
- The current data is sample data for visual design only and should not be treated as final schema correctness.
