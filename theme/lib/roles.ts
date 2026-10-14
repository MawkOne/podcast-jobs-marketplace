/**
 * The active role taxonomy. This marketplace is podcast-native, so the
 * taxonomy is the podcast production taxonomy (default "podcast") and exposes
 * it with the lookup helpers every page uses. Landing families, category
 * browse, and the SEO sitemap all follow from the taxonomy.
 *
 * Slugs drive the three landing families:
 *   /hire/{slug}                   hire landing      (plural slug)
 *   /{singularSlug}-jobs           jobs landing      (singular slug)
 *   /talent/search/{categorySlug}  category browse
 */
import { VERTICALS, VERTICAL_COPY, type Role, type VerticalId } from "@/lib/verticals";

export type { Role };

const requested = process.env.NEXT_PUBLIC_MARKETPLACE_VERTICAL as
  | VerticalId
  | undefined;

export const VERTICAL: VerticalId =
  requested && requested in VERTICALS ? requested : "podcast";

export const ROLES: Role[] = VERTICALS[VERTICAL];

/** Medium name for the active vertical, e.g. "Podcasts". */
export const MEDIUM = VERTICAL_COPY[VERTICAL].medium;

/** Who posts jobs in this vertical. */
export const PUBLISHER_PHRASE = VERTICAL_COPY[VERTICAL].publisherPhrase;

/** Phrase after the role in hire titles, e.g. "for Shows". */
export const HIRE_TITLE_PHRASE = VERTICAL_COPY[VERTICAL].hireTitlePhrase;

export function roleBySlug(slug: string): Role | undefined {
  return ROLES.find((role) => role.slug === slug);
}

/** Validate a /{role}-jobs landing slug, e.g. "podcast-editor-jobs". */
export function roleByJobsSlug(slug: string): Role | undefined {
  if (!slug.endsWith("-jobs")) return undefined;
  return ROLES.find((role) => `${role.singularSlug}-jobs` === slug);
}

export function roleByCategorySlug(categorySlug: string): Role | undefined {
  return ROLES.find((role) => role.categorySlug === categorySlug);
}

export function roleByName(name: string): Role | undefined {
  return ROLES.find((role) => role.name === name);
}
