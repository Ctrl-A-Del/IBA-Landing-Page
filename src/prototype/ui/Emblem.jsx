/**
 * Emblem — the logo's gear-ring disc, CSS-cropped from the full plate (ticket 03, B6).
 *
 * Shared by Nav and Footer (11.1/R6) so the crop geometry exists once: both read the same brand
 * mark, so it cannot drift between them. The source is an opaque 540x935 JPEG, so the full plate
 * cannot sit on either without a grey rectangle around it; only the disc is shown.
 *
 * CROP MATHS (measured on the source): the gear ring sits in the 340x340 px square whose top-left
 * corner is at (135, 222). Scaling the image so 340 px fill the circle gives
 *   width = 540 / 340 = 158.8 %, left = -135 / 340 = -39.7 %, top = -222 / 340 = -65.3 %
 * of the (square) circle. `rounded-full` + `overflow-hidden` then clip the plate's wall away.
 *
 * `className` sizes the disc (e.g. `h-10 w-10 sm:h-12 sm:w-12` in the nav, larger in the footer);
 * the crop percentages are scale-invariant, so one `<img>` serves every size.
 */
const Emblem = ({ className = "" }) => (
  <span className={`relative block overflow-hidden rounded-full ${className}`}>
    <img
      src={`${process.env.PUBLIC_URL}/img/logo.jpg`}
      alt=""
      width="540"
      height="935"
      decoding="async"
      className="absolute left-[-39.7%] top-[-65.3%] h-auto w-[158.8%] max-w-none"
    />
  </span>
);

export default Emblem;
