# Food Map Working Plan

`food-map` is the temporary working name for a personal and social food-place map. Users sign in, drop pins for places they have eaten at, record meal details, and optionally view friends' shared lists on the same map.

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

Food Map should reuse the same conceptual split:

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
- `costPerPerson`
- `currency`
- `ratingOutOf10`
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

- [ ] Choose final tool name and URL slug.
- [ ] Decide backend: Firebase is the most direct fit because RafflesGo already uses Firebase patterns; Supabase is also viable if relational sharing rules are preferred.
- [ ] Add `/tools` index route.
- [ ] Add the first tool route under the selected slug.
- [ ] Add Google sign-in.
- [ ] Add database schema and access rules.
- [ ] Build create/edit entry form.
- [ ] Build map picker based on RafflesGo's click/drag/GPS/manual-coordinate flow.
- [ ] Build read-only map with selected pin detail panel.
- [ ] Add marker clustering for nearby entries.
- [ ] Add cluster click panel listing all entries represented by that cluster.
- [ ] Add share code generation and QR rendering.
- [ ] Add friend-list import by code/link.
- [ ] Add watch-list management.
- [ ] Add owner-side share revocation or code rotation.
- [ ] Add empty, loading, auth-required, permission-denied, and offline/error states.
- [ ] Verify mobile map usability, especially GPS permission errors and bottom-sheet detail panels.

## Suggested Naming Directions

- **NibbleAtlas**: playful, compact, and map-forward.
- **MakanMarks**: Singapore-flavored, memorable, and pin/list oriented.
- **CraveCartographer**: distinctive, a little grand, and clearly map-based.
- **PlatePins**: direct, simple, and easy to understand.
- **BiteTrail**: emphasizes personal history and friend discovery.
- **Forkprints**: suggests a footprint of meals over time.
- **TasteTrace**: clean and flexible for future non-map food features.
- **MealMosaic**: good if the tool leans into friends' lists layered together.
- **Pinchlist**: short, app-like, and list/pin adjacent.
- **SnackSignal**: quirky and social, better if sharing becomes central.

## Current Recommendation

Use `NibbleAtlas` or `MakanMarks` if the app should feel memorable and personal. Use `PlatePins` if the priority is immediate clarity.
