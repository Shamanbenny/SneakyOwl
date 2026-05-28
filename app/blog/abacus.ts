export const ABACUS_BASE_URL = "https://abacus.jasoncameron.dev";
export const BLOG_ABACUS_NAMESPACE = "sneaky-owl";

const ABACUS_KEY_MAX_LENGTH = 64;

type BlogMetricSuffix = "3m" | "10m" | "likes";

const sanitizeSlugSegment = (slug: string) =>
  slug
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9_-]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "") || "post";

export const getBlogMetricKey = (slug: string, suffix: BlogMetricSuffix) => {
  const sanitizedSlug = sanitizeSlugSegment(slug);
  const staticPrefix = "blog_";
  const staticSuffix = `_${suffix}`;
  const maxSlugLength = ABACUS_KEY_MAX_LENGTH - staticPrefix.length - staticSuffix.length;
  const truncatedSlug = sanitizedSlug.slice(0, Math.max(3, maxSlugLength));

  return `${staticPrefix}${truncatedSlug}${staticSuffix}`;
};

export const getBlogStorageKey = (slug: string, suffix: string) =>
  `sneakyowl_blog_${sanitizeSlugSegment(slug)}_${suffix}`;

export const fetchAbacusCount = async (key: string) => {
  const response = await fetch(`${ABACUS_BASE_URL}/get/${BLOG_ABACUS_NAMESPACE}/${key}`);

  if (response.status === 404) {
    return 0;
  }

  if (!response.ok) {
    throw new Error(`Unexpected Abacus status ${response.status}`);
  }

  const data = (await response.json()) as { value?: number };

  return data.value ?? 0;
};

export const hitAbacusCounter = async (key: string) => {
  const response = await fetch(`${ABACUS_BASE_URL}/hit/${BLOG_ABACUS_NAMESPACE}/${key}`);

  if (!response.ok) {
    throw new Error(`Unexpected Abacus status ${response.status}`);
  }

  const data = (await response.json()) as { value?: number };

  return data.value ?? 0;
};
