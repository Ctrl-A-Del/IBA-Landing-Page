import { useLayoutEffect } from "react";
import { GUTTER } from "../ui/Section";

/**
 * Shared layout for the Legal pages: a readable-width column inside `<main>`, with the page's
 * `document.title` set while it is mounted and the page opened at the top. Typography for the
 * Legal text lives in `src/index.css` under `.legal-prose`.
 *
 * `heading` is for a Legal text that has no h1 of its own (the Impressum): it is rendered as a
 * visually hidden h1, so the page has exactly one top-level heading. Omit it when the text brings
 * its own h1 (the Datenschutzerklärung).
 */
const LegalPage = ({ title, heading, children }) => {
  useLayoutEffect(() => {
    const previous = document.title;
    document.title = title;
    window.scrollTo(0, 0);
    return () => {
      document.title = previous;
    };
  }, [title]);

  return (
    <main className="bg-white pb-20 pt-32 lg:pb-28">
      <div className={GUTTER}>
        <div className="legal-prose mx-auto max-w-[44rem]">
          {heading && <h1 className="sr-only">{heading}</h1>}
          {children}
        </div>
      </div>
    </main>
  );
};

export default LegalPage;
