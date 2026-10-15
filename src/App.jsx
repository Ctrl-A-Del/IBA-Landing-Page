// Design v2 prototype switch (DESIGN_PLAN.md §3, D5).
//
// The redesign lives entirely under ./prototype/ and the whole app is reached through the single
// line below. To go back to the previous design, change the specifier to "./AppLegacy" — nothing
// else has to change. src/AppLegacy.jsx and everything under src/components/ are untouched by the
// prototype and stay recoverable until ticket 12 (post-approval migration) removes them.
export { default } from "./prototype/Prototype";
