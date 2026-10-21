import Section from "../ui/Section";
import Reveal from "../ui/Reveal";
import { FOCUS_ON_LIGHT } from "./focus";
import { mailHref } from "./email";
import data from "../../data/data.json";

/**
 * Partner — "Partner gesucht" (partner-recruiting spec, DESIGN_PLAN.md C21, ticket 03).
 *
 * The company looks for partners, not staff: two Partnerrollen (Anwender & Pilotpartner,
 * Entwicklungspartner), each with a description and a quiet action that opens an email to the
 * company address. A secondary lane: no form, no named contact, no orange (B3), so the call stays
 * the page's only primary action.
 *
 * LAYOUT: variant C of ticket 01 (the approved verdict): two bordered boxes side by side from `md`,
 * stacked below it, each with title, description and action. There is no sector label.
 *
 * HEADINGS: eyebrow "Partner gesucht" -> H2 (names the section) -> intro -> one H3 per role.
 *
 * ACTIONS: `mailto:` links built with `mailHref` from `./email`, the same builder Kontakt's link uses. The ADDRESS
 * is read from `Contact.email` there (ADR 0003) and never stored in `Partner`; only the role subject
 * belongs here. The visible label already names the role, so no `aria-label` is needed. The style is
 * the quiet secondary button (navy outline, hard edges, B2/B3/B8) with the light-tone focus outline.
 *
 * COPY: `data.json` `Partner`; every string renders verbatim.
 */
const { eyebrow: EYEBROW, heading: HEADING, intro: INTRO, roles: ROLES } = data.Partner;

const HEADING_ID = "partner-heading";

const ACTION = `inline-flex items-center justify-center rounded-edge border border-brand px-5 py-3 font-body text-body-sm font-semibold text-brand no-underline transition-colors duration-150 hover:bg-brand hover:text-white ${FOCUS_ON_LIGHT}`;

const Partner = () => (
  <Section id="partner" tone="light" aria-labelledby={HEADING_ID}>
    <Reveal>
      <p className="text-eyebrow text-ink-500">{EYEBROW}</p>
      <h2 id={HEADING_ID} className="mt-3 text-display-lg text-ink-900">
        {HEADING}
      </h2>
      <p className="mt-5 max-w-2xl text-body-lg">{INTRO}</p>
    </Reveal>

    <div className="mt-12 grid gap-6 md:grid-cols-2 lg:mt-16">
      {ROLES.map(({ title, description, actionLabel, mailSubject }) => (
        <Reveal key={title}>
          <article className="h-full border border-ink-900/20 p-6 sm:p-8">
            <h3 className="text-display-md text-ink-900">{title}</h3>
            <p className="mt-4 text-body-lg">{description}</p>
            <a href={mailHref(mailSubject)} className={`${ACTION} mt-6 w-full sm:w-auto`}>
              {actionLabel}
            </a>
          </article>
        </Reveal>
      ))}
    </div>
  </Section>
);

export default Partner;
