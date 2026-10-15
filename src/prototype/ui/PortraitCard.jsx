/**
 * PortraitCard — the framed light card for portraits over navy (ticket 02).
 *
 * Needed by ticket 08 (Team, DESIGN_PLAN.md §3 B7) AND ticket 09 (Kontakt, §3 C15 — Marcus Auner
 * appears again with his portrait and role). Those two tickets are built independently and must not
 * depend on each other, so this primitive is the shared definition of "framed card" for both.
 *
 * WHY THE CROP IS INSIDE THE PRIMITIVE
 * `aspect-[3/4]` + `object-cover object-top` are baked in here rather than left to the callers. The
 * source portraits are all 3:4 (339×453, 481×642, 385×513) with the head near the top edge, so any
 * caller that re-derives the crop can get it subtly wrong, and `parallelisation.md` §3 flags that 11 would
 * otherwise have to check that the two Marcus Auner crops in Team and Kontakt are identical. They
 * cannot diverge now: there is only one crop. Callers may only constrain the CARD WIDTH
 * (`className="max-w-xs"`) — never the ratio or the object position.
 *
 * The frame is the one deliberate exception to §4.1's hard-edge rule: a white card, a 3px chamfer
 * (`rounded-edge`, the same radius as the CTA), a hairline ring and the wide low-opacity
 * `shadow-frame` that lifts it off #0a1f2e without reading as a soft bubble.
 *
 * INTERFACE
 *   <PortraitCard src={person.img} alt="Marcus Auner" name="Marcus Auner" role="Geschäftsführung" />
 * `name` and `role` are optional; when omitted only the portrait is framed.
 */
const PortraitCard = ({ src, alt, name, role, className = "" }) => (
  <figure
    className={`w-full bg-white p-3 text-ink-600 shadow-frame ring-1 ring-frame rounded-edge ${className}`}
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
      className="aspect-[3/4] w-full rounded-edge object-cover object-top"
    />
    {(name || role) && (
      <figcaption className="px-1 pb-1 pt-4">
        {name && (
          <span className="block font-heading text-display-md font-bold text-ink-900">{name}</span>
        )}
        {role && <span className="mt-1 block text-body-sm text-ink-500">{role}</span>}
      </figcaption>
    )}
  </figure>
);

export default PortraitCard;
