import type { User } from "firebase/auth";

const getApiBaseUrl = () =>
  process.env.NEXT_PUBLIC_SNEAKYOWL_API_BASE_URL?.replace(/\/$/, "") || "";

const callApi = async (user: User, path: string, method: "DELETE" | "POST") => {
  const baseUrl = getApiBaseUrl();
  if (!baseUrl) {
    throw new Error("The BiteTrail API is not configured yet.");
  }

  const response = await fetch(`${baseUrl}${path}`, {
    method,
    headers: {
      Authorization: `Bearer ${await user.getIdToken()}`,
    },
  });

  if (!response.ok) {
    throw new Error("The BiteTrail request could not be completed.");
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
