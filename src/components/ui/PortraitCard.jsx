/**
 * PortraitCard — the framed light card for portraits over navy (ticket 02).
 *
 * Used by Unternehmen (DESIGN_PLAN.md §3 B7); it is the one definition of "framed card" on the page.
 *
 * WHY THE CROP IS INSIDE THE PRIMITIVE
 * `aspect-[3/4]` + `object-cover object-top` are baked in here rather than left to the callers. The
 * source portraits are all 3:4 (339×453, 481×642, 385×513) with the head near the top edge, so any
 * caller that re-derives the crop can get it subtly wrong. With the crop here, every portrait
 * shares one crop and cannot diverge. Callers may only constrain the CARD WIDTH
 * (`className="max-w-xs"`) — never the ratio or the object position.
 *
 * The frame is the one deliberate exception to §4.1's hard-edge rule: a white card, a 3px chamfer
 * (`rounded-edge`, the same radius as the CTA), a hairline ring and the wide low-opacity
 * `shadow-frame` that lifts it off #0a1f2e without reading as a soft bubble.
 *
 * INTERFACE
 *   <PortraitCard src={person.img} alt="Marcus Auner" name="Marcus Auner" role="Geschäftsführung" />
 * `name` and `role` are optional; when omitted only the portrait is framed.
 *
 * `fill` (boolean, default `false`, 11.1/C19): lets the card fill the height of its grid cell, so
 * cards in the same row share one height even when a wrapped name makes one caption taller than the
 * others. Names stay on one top line and the role is pinned to the bottom of the card, so roles in
 * a row share one baseline; the spare height falls between name and role.
 * Default behaviour is unchanged when the caller does not opt in. Exposed as `data-fill` so
 * a consumer's test can observe the option without asserting a class string.
 */
const PortraitCard = ({ src, alt, name, role, fill = false, className = "" }) => (
  <figure
    data-fill={fill || undefined}
    className={`w-full bg-white p-3 text-ink-600 shadow-frame ring-1 ring-frame rounded-edge ${
      fill ? "flex h-full flex-col" : ""
    } ${className}`}
  >
    {/*
      No `width`/`height` attributes on purpose: the three sources are 339x453, 385x513 and 481x642
      px, so a single hardcoded pair would be wrong for two of them. The reserved box is the CSS
      aspect ratio below (`aspect-[3/4]` + `w-full`), which already prevents layout shift.
    */}
    <img
      src={src}
      alt={alt}
      loading="lazy"
      decoding="async"
      className={`aspect-[3/4] w-full rounded-edge object-cover object-top ${fill ? "shrink-0" : ""}`}
    />
    {(name || role) && (
      <figcaption className={`px-1 pb-1 pt-4 ${fill ? "flex flex-1 flex-col" : ""}`}>
        {name && (
          <span className="block font-heading text-display-md font-bold text-ink-900">{name}</span>
        )}
        {role && (
          <span className={`block text-body-sm text-ink-500 ${fill ? "mt-auto pt-1" : "mt-1"}`}>
            {role}
          </span>
        )}
      </figcaption>
    )}
  </figure>
);

export default PortraitCard;
