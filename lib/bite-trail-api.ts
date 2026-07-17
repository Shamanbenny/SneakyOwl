import type { User } from "firebase/auth";

const getApiBaseUrl = () =>
  process.env.NEXT_PUBLIC_SNEAKYOWL_API_BASE_URL?.replace(/\/$/, "") || "";

const callApi = async (
  user: User,
  path: string,
  method: "DELETE" | "POST",
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

export const deleteBiteTrailVisit = (
  user: User,
  placeId: string,
  visitId: string,
) =>
  callApi(
    user,
    `/v1/bite-trail/visits/${encodeURIComponent(user.uid)}/${encodeURIComponent(placeId)}/${encodeURIComponent(visitId)}`,
    "DELETE",
  );

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
