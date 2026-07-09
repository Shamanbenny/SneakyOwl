# Clarification Questions

## Naming

Would you like to keep the temporary `food-map` name, or choose something else?

Current suggestions:

- NibbleAtlas
- MakanMarks
- CraveCartographer
- PlatePins
- BiteTrail
- Forkprints
- TasteTrace
- MealMosaic
- Pinchlist
- SnackSignal

My shortlist is `BiteTrail`.

## Product Scope

1. Should the first version be personal-only first, then add sharing, or should sharing be included in the first usable version?
2. Should entries support photos of the food/place, or only text fields for now?
3. Should users be able to attach multiple visits to the same place, or should each pin represent exactly one meal experience?
4. If a user visits the same restaurant twice, should that become two pins, one pin with multiple logs, or a prompt to update the existing place?
5. Should the app support search by place name/address, or only click/GPS pin placement at first?
6. Should we store exact coordinates, or offer a privacy mode that slightly blurs shared locations?
7. Should watched friends' entries be mixed directly into the map, or shown through toggles per friend?
8. Should friends be able to see your full historical list immediately after adding your code, or should you approve watchers first?
9. When you rotate/revoke a share code, should existing watchers keep access or lose access immediately?
10. Should owner-side removal of a watcher notify the removed viewer in-app, silently remove access, or both?
11. Should the rating be integer-only from 1 to 10, decimal from 0.0 to 10.0, or a quick slider?
12. Should cost per person be a number only, or should it allow ranges like `$10-$15`?
13. Which default currency should be used: SGD, user's locale, or user-configurable?
14. Should comments be private notes, friend-visible by default, or configurable per entry?
15. Should users be able to export their list later as CSV/JSON?
16. Should the app work meaningfully offline, at least for viewing cached entries or drafting a new entry?
17. Should the public tools index show this as an experimental/beta tool or a polished utility?

## Technical Decisions

1. Firebase or Supabase?
2. Is GitHub Pages/static export still the target deployment for SneakyOwl?
3. If static export remains required, are you comfortable with all auth/database interactions happening through a browser SDK?
4. Should we avoid introducing a backend server for now?
5. Should marker clustering depend on a package, or should we implement a small custom cluster layer?
6. Should map tiles remain OpenStreetMap default tiles, or should the tool use a custom tile provider/style?
