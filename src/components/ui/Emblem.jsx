/**
 * Emblem — the round gear-ring brand mark, shipped as its own asset (`img/emblem.png`).
 *
 * Shared by Nav and Footer so the two cannot drift apart. The PNG is a 256x256 disc cut once from
 * the Logo plate (source kept in `design-assets/source/`, crop recorded in its README), with
 * transparency outside the circle, so it needs no runtime cropping and sits on the navy surfaces
 * without a grey rectangle. 256 px covers about 2x density at the largest (footer) size.
 *
 * `className` sizes the disc (e.g. `h-10 w-10 sm:h-12 sm:w-12` in the nav, larger in the footer).
 * The hairline ring is part of the mark: both consumers sit on navy. The image is decorative
 * (empty alt): the company name is text wherever it is needed. `data-emblem` marks it for the
 * page test.
 */
const Emblem = ({ className = "" }) => (
  <img
    data-emblem
    src={`${process.env.PUBLIC_URL}/img/emblem.png`}
    alt=""
    width="256"
    height="256"
    decoding="async"
    className={`block rounded-full ring-1 ring-white/10 ${className}`}
  />
);

export default Emblem;
