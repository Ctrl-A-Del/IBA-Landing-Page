/**
 * The slash convention for Legal page addresses, kept once (spec "One source for the Company details
 * and the Legal page addresses"). `data.json` `LegalPages` stores bare slugs (`impressum`); a Legal
 * page is served at `/<slug>/`, and a path with or without either slash names the same page.
 *
 * Plain JavaScript (no JSX, no imports) so the app and the post-build copy step
 * (`scripts/copy-route-documents.js`) can both load it.
 */

/** The address a Legal page is served at: `impressum` → `/impressum/`. */
export const legalPageAddress = (slug) => `/${slug}/`;

/** The slug a path names, slashes dropped: `/impressum/`, `/impressum` → `impressum`. */
export const slugOfPath = (pathname) => pathname.replace(/^\/+|\/+$/g, "");
