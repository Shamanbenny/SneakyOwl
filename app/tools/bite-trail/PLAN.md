# BiteTrail Persistence and Access-Control Plan

## Current model

Shared account identity is stored at `users/{uid}`. BiteTrail is scoped below the
single Firestore document `tools/bite-trail`:

```text
tools/bite-trail/users/{uid}
tools/bite-trail/followings/{uid}/relationships/{friendUid}
tools/bite-trail/places/{placeId}/visits/{visitId}
```

The tool-user document stores `defaultCurrency`, `mapStart`, and
`hasCompletedTutorial`. A relationship document stores `friendUid`,
`friendDisplayName`, and `createdAt`; both directions must exist. Places are
global immutable metadata. Each visit owns `ownerUid` and a denormalized
`ownerDisplayName`, which Flask keeps in sync when the account display name is
changed.

## Operation split

| Operation | Handler | Reason |
|---|---|---|
| Read/save BiteTrail preferences | Frontend -> Firestore | Single owner document |
| Create a new global place and first visit | Frontend -> Firestore batch | Simple append-only write |
| Append a visit to a known place | Frontend -> Firestore | Owner-owned visit |
| Read own follow list | Frontend -> Firestore | Single owner subcollection |
| Add/remove a relationship | Flask | Reciprocal documents must change together |
| Read visible live places and visits | Flask | Resolves authorised owners and global parent places |
| Change display name | Flask | Updates Auth, shared profile, visits, and relationship caches before success |
| Delete a visit / account | Flask | Verifies ownership, deletes visits by indexed owner UID, and removes orphan places |

Flask requests authenticate with a Firebase ID token. The Admin SDK derives the
caller UID from that token and never trusts a UID supplied by the browser.

## Deployment

Deploy `firestore.rules` and `firestore.indexes.json` together:

```bash
firebase deploy --only firestore:rules,firestore:indexes --project sneakyowl-firebase
```

The collection-group index on `visits.ownerUid` supports the Flask live-feed,
display-name propagation, and account-cleanup queries.
