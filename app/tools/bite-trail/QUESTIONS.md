# Clarification Questions

## Resolved Decisions

- Naming: the tool is named **BiteTrail** and lives at `/tools/bite-trail`.
- First tools route: `/tools`.
- Initial auth provider: Firebase Google Authentication.
- Map library: Leaflet.
- Map tiles: OpenStreetMap default tiles.
- Current map UI data: sample food entries only; not real backend data yet.
- Current clustering approach: `leaflet.markercluster`, with a plain marker fallback if clustering fails to load.
- Marker visual direction: compact circular pins, with larger teardrop clusters.
- Own-entry marker color: site green accent.
- Friend-entry marker color: `--site-accent-cyan`, matching the landing page competition accent.
- Cluster marker color: inverted black/accent teardrop with an accent count circle.
- Rating format: whole-number rating out of 10.
- Entry fields should include cuisine genre.
- Multiple visits belong to one user-managed place ID; each visit keeps its own rating, cost, date, ordered items, comments, and user.
- Place metadata is immutable and has no tracked initial creator. Users may delete only their own visits; deleting the final valid visit deletes the place metadata.
- Place averages use only visits visible after watch-list and owner filtering.
- Firebase client SDK plus Firestore Security Rules is the default data path. Flask/Vercel is deferred for privileged workflows only.
- The current map loads data once per page refresh; a future refresh control may explicitly reload it.
- Privacy page exists for OAuth verification support, but no main navigation link is required.

## Product Scope

1. Should the first version be personal-only first, then add sharing, or should sharing be included in the first usable version?
2. Should entries support photos of the food/place, or only text fields for now?
5. Should the app support search by place name/address, or only click/GPS pin placement at first?
6. Should we store exact coordinates, or offer a privacy mode that slightly blurs shared locations?
7. Should watched friends' entries be mixed directly into the map, or shown through toggles per friend?
8. Should friends be able to see your full historical list immediately after adding your code, or should you approve watchers first?
9. When you rotate/revoke a share code, should existing watchers keep access or lose access immediately?
10. Should owner-side removal of a watcher notify the removed viewer in-app, silently remove access, or both?
11. Should rating input be a segmented set of whole numbers, a stepper, or a slider constrained to integer values?
12. Should cost per person be a number only, or should it allow ranges like `$10-$15`?
13. Which default currency should be used: SGD, user's locale, or user-configurable?
14. Should comments be private notes, friend-visible by default, or configurable per entry?
15. Should cuisine genre be single-select, multi-select, or free-text with suggestions?
16. What initial cuisine genre set should ship? Current examples: fast food, western, Korean, Japanese, cafe, dessert, hawker.
17. Should users be able to export their list later as CSV/JSON?
18. Should the app work meaningfully offline, at least for viewing cached entries or drafting a new entry?
19. Should the public tools index show this as an experimental/beta tool or a polished utility?

## Technical Decisions

1. Is GitHub Pages/static export still the target deployment for SneakyOwl?
2. If static export remains required, are you comfortable with all auth/database interactions happening through a browser SDK?
3. Which future privileged workflows, if any, require the deferred Flask/Vercel backend instead of Firebase client SDK and Firestore Rules?
5. Should marker clustering stay on `leaflet.markercluster`, or should it eventually become a custom cluster layer for tighter styling/control?
6. Should map tiles remain OpenStreetMap default tiles long term, or should the tool use a custom tile provider/style later?
7. Should `mockFoodEntries.ts` be renamed to `sampleFoodEntries.ts` once the current UI pass settles?

## Sample Data Status

- Sample ratings are now whole numbers from 0 to 10.
- Sample entries now include typed cuisine genres such as fast food, western, Korean, Japanese, Thai, Indian, seafood, cafe, dessert, and hawker.
- The dataset includes repeated owners, ordinary nearby clusters, and a deliberately inseparable maximum-zoom cluster for validating the cluster-preview behavior.
- Sample visits represent the visit fields: place ID, cost per person, optional items bought, whole-number rating, comments, owner, and visit date.
- `mockFoodPlaces` derives one map/list place from one or more sample visits. Wingstop at Hillion Mall has six visits from three users for visible-average filtering tests.
