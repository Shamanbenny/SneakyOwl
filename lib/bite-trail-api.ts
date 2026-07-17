import type { User } from "firebase/auth";

import type { BiteTrailPlaceWithVisits } from "@/lib/bite-trail";

const getApiBaseUrl = () =>
  process.env.NEXT_PUBLIC_SNEAKYOWL_API_BASE_URL?.replace(/\/$/, "") || "";

const callApi = async (
  user: User,
  path: string,
  method: "DELETE" | "GET" | "POST",
  body?: unknown,
) => {
  const baseUrl = getApiBaseUrl();
  if (!baseUrl) {
    throw new Error("The BiteTrail API is not configured yet.");
  }

  const response = await fetch(`${baseUrl}${path}`, {
    method,
    headers: {
      Authorization: `Bearer ${await user.getIdToken()}`,
      ...(body ? { "Content-Type": "application/json" } : {}),
    },
    ...(body ? { body: JSON.stringify(body) } : {}),
  });

  if (!response.ok) {
    const payload = await response.json().catch(() => null);
    const message =
      payload && typeof payload.error === "string"
        ? payload.error
        : `The BiteTrail request could not be completed (${response.status}).`;
    throw new Error(message);
  }
};

const getApiJson = async <T>(user: User, path: string) => {
  const baseUrl = getApiBaseUrl();
  if (!baseUrl) {
    throw new Error("The BiteTrail API is not configured yet.");
  }

  const response = await fetch(`${baseUrl}${path}`, {
    headers: { Authorization: `Bearer ${await user.getIdToken()}` },
  });
  if (!response.ok) {
    const payload = await response.json().catch(() => null);
    throw new Error(
      payload && typeof payload.error === "string"
        ? payload.error
        : `The BiteTrail request could not be completed (${response.status}).`,
    );
  }

  return (await response.json()) as T;
};

export const deleteBiteTrailVisit = (
  user: User,
  placeId: string,
  visitId: string,
) =>
  callApi(
    user,
    `/v1/bite-trail/visits/${encodeURIComponent(placeId)}/${encodeURIComponent(visitId)}`,
    "DELETE",
  );

export const createBiteTrailFollowing = (user: User, friendUid: string) =>
  callApi(
    user,
    `/v1/bite-trail/friends/${encodeURIComponent(friendUid)}`,
    "POST",
  );

export const removeBiteTrailFollowing = (user: User, friendUid: string) =>
  callApi(
    user,
    `/v1/bite-trail/friends/${encodeURIComponent(friendUid)}`,
    "DELETE",
  );

export const getVisibleBiteTrailPlaces = (user: User) =>
  getApiJson<BiteTrailPlaceWithVisits[]>(user, "/v1/bite-trail/places");

export const updateSneakyOwlDisplayName = (user: User, displayName: string) =>
  callApi(user, "/v1/account/profile", "POST", { displayName });

export const deleteAllBiteTrailData = (user: User) =>
  callApi(user, "/v1/bite-trail/data", "DELETE");

export const deleteSneakyOwlAccount = async (user: User, email: string) => {
  try {
    await callApi(user, "/v1/account", "DELETE", { email });
  } catch (error) {
    if (error instanceof Error && error.message.endsWith("(404).")) {
      throw new Error(
        "Account deletion is not deployed on the SneakyOwl API yet.",
      );
    }

    throw error;
  }
};
