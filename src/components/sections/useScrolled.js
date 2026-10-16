import { useEffect, useState } from "react";

// How far the page must scroll before the nav turns solid (decision B9: transparent over the hero,
// solid navy once scrolled). A few pixels, so a stray trackpad nudge at the very top does not flip it.
const SOLID_AFTER_PX = 8;

const readScrolled = () => window.scrollY > SOLID_AFTER_PX;

/**
 * `true` once the page is scrolled more than `SOLID_AFTER_PX` from the top.
 *
 * The initial value is read synchronously, so a page restored mid-scroll (reload, back button)
 * paints the solid nav on the first frame instead of flashing transparent over light content.
 * React bails out of re-rendering when the boolean does not change, so the passive listener costs
 * one comparison per scroll event.
 */
const useScrolled = () => {
  const [isScrolled, setIsScrolled] = useState(readScrolled);

  useEffect(() => {
    const update = () => setIsScrolled(readScrolled());
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, []);

  return isScrolled;
};

export default useScrolled;
