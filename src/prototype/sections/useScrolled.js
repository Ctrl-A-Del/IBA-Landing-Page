import { useEffect, useState } from "react";

/**
 * `true` once the page is scrolled more than `threshold` px from the top (decision B9: the nav is
 * transparent over the hero and solid navy once scrolled).
 *
 * The initial value is read synchronously, so a page restored mid-scroll (reload, back button)
 * paints the solid nav on the first frame instead of flashing transparent over light content.
 * React bails out of re-rendering when the boolean does not change, so the passive listener costs
 * one comparison per scroll event.
 */
const readScrolled = (threshold) =>
  typeof window !== "undefined" && (window.scrollY || 0) > threshold;

const useScrolled = (threshold = 8) => {
  const [isScrolled, setIsScrolled] = useState(() => readScrolled(threshold));

  useEffect(() => {
    const update = () => setIsScrolled(readScrolled(threshold));
    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, [threshold]);

  return isScrolled;
};

export default useScrolled;
