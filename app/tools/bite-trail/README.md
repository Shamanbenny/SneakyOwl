# BiteTrail Plan

BiteTrail is a personal and social food-place map. Users sign in, create shared place records, append their own visits, and optionally view friends' visible visits on the same map.

## Place And Visit Model

A place has one stable user-managed ID containing the store name, user-entered location, coordinates, and cuisine. BiteTrail does not automatically group malls, neighborhoods, similar names, or nearby coordinates.

Each visit is a separate append-only record attached to the place ID. It stores its user, date, rating, cost per person, ordered items, and comments. Users may delete only their own visits; place metadata is immutable. If the last valid visit is deleted, the place and related metadata are deleted.

The map and View entries list render one pin and one row per place. Averages use only visits visible under the current watch-list and filter selections. Rating averages display one decimal place and cost averages display two decimal places. The selected place view shows the summary followed by every visible visit in a fully expanded sub-container.

Successful new-place and visit writes refresh the visible Firestore data automatically. The map does not yet subscribe to external Firestore changes in realtime.

The shared Profile page provides watch-list controls. Hide/Show is a per-user
local preference applied immediately to the viewer's map and does not write to
Firestore or require saving profile settings. Stop watching remains a
Firestore-backed relationship change and removes the watched list.

Profile also exposes Gmail-confirmed account deletion. The Flask backend removes
the user's BiteTrail data, preferences, reciprocal and legacy one-sided watch
records, Firestore profile, and Firebase Auth account before the client signs
out and returns to `/tools/bite-trail`.

## Session Recovery

When Firebase restores an authenticated user, BiteTrail and the shared Profile page validate the existing Firebase ID token before loading protected data. Session initialization gets three attempts total, with a three-second timeout per attempt; retries force-refresh the token before trying again. If all attempts time out or fail, the local UI treats the session as signed out and clears protected data. No token validation or refresh is attempted when Firebase has no restored user session.

## RafflesGo Map Behavior Reused

RafflesGo uses Leaflet through React components:

- `rafflesgo-group-11/frontend/src/components/shared/LocationPickerMap.tsx` is the pin picker.
- `rafflesgo-group-11/frontend/src/pages/ReportSighting.tsx` embeds that picker inside each sighting form.
- `rafflesgo-group-11/frontend/src/pages/WalkDetails.tsx` renders saved sightings as read-only markers with `Popup` panels.

Implemented mechanics:

- Map tiles use OpenStreetMap through Leaflet's `TileLayer`.
- BiteTrail's `+` button above "Center to me" requests GPS, centers the map, and drops a draggable new-place pin.
- The new-place pin and latitude/longitude inputs share one state source: map clicks while the location picker is active and marker `dragend` write fixed-precision coordinates, while valid typed coordinates move the pin.
- "Center to me" remains a browsing control and does not overwrite the new-place form coordinates.
- GPS uses `navigator.geolocation.getCurrentPosition` with high accuracy and a 10-second timeout.
- The add-location control changes to a red trash icon with a "Clear new pin" tooltip while a draft pin exists.
- Saved records remain read-only Leaflet markers; selecting a marker or cluster opens the BiteTrail detail/list panel.

BiteTrail should reuse the same conceptual split:

- A reusable map picker for creating/editing one food-place entry.
- A read-only/exploratory map for many saved food entries.
- A selected-entry detail panel that can show richer information than a small popup.

## Core User Stories

- As a signed-in user, I can add a food-place pin from my current GPS location.
- As a signed-in user, I can click the map while location picking is active to place a pin manually.
- As a signed-in user, I can drag a placed pin to correct its exact location.
- As a signed-in user, I can store the place name, cost per person, rating out of 10, comments, and optionally what I bought.
- As a signed-in user, I can append visits to an existing place and delete my own visits.
- As a signed-in user, I can generate a share code/link/QR for my list.
- As a signed-in user, I can add a friend's shared list to my watch list.
- As a viewer, I can show my entries and watched friends' entries together on the same map.
- As a viewer, I can click a pin or cluster to open the relevant list/detail panel.
- As a list owner, I can revoke or rotate my share code.
- As a viewer, I can remove a friend from my watch list.
- As a viewer, I can hide or show a watched friend's list locally without
  changing the watch relationship.

## Planned Fields

Visit fields:

- `id`
- `ownerUserId`
- `placeId`
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
- [x] Select Firebase Auth plus direct Firestore SDK access as the default backend path; use Flask/Vercel for privileged workflows.
- [x] Correct the sample data into grouped places and append-only visits with whole-number ratings, cuisine genres, and visible-average filtering.
- [x] Add database schema and access rules.
- [x] Build create/edit entry form.
- [x] Build map picker based on RafflesGo's click/drag/GPS/manual-coordinate flow.
- [x] Connect the map to Firestore-backed entries while retaining the static global source.
- [x] Add share-link generation and QR rendering.
- [x] Add friend-list import by link.
- [x] Add basic watch-list management, including local hide/show and stopping
  watching from the shared Profile page.
- [x] Add Gmail-confirmed account deletion and cleanup of reciprocal watch-list
  records.
- [ ] Add owner-side share revocation or code rotation.
- [ ] Add a non-destructive "Report store closure" signal and show the resulting likelihood indicator without closing the place for everyone.
- [ ] Add a manual refresh control beside the map pins badge for externally changed Firestore data; successful local saves already refresh automatically.
- [x] Add empty, loading, auth-required, permission-denied, and offline/error states.
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
- The static source is sample/global fallback data; user-created places and visits are persisted in Firestore.
