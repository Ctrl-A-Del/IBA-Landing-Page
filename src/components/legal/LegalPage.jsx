import { useLayoutEffect } from "react";
import { GUTTER } from "../ui/Section";

/**
 * Shared layout for the Legal pages: a readable-width column inside `<main>`, with the page's
 * `document.title` set while it is mounted and the page opened at the top. Typography for the
 * Legal text lives in `src/index.css` under `.legal-prose`.
 */
const LegalPage = ({ title, children }) => {
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
        <div className="legal-prose mx-auto max-w-[44rem]">{children}</div>
      </div>
    </main>
  );
};

export default LegalPage;
