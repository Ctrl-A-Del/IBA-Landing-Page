# 0003: Company details in the Legal text come from data.json

Status: accepted

The Company details (name, postal address, phone, email, website, representative, register entry) and
the Legal page addresses and titles are kept once, in `src/data/data.json` (`Company`, `Contact`,
`LegalPages`), and every place that shows them reads them from there: the landing page, the Legal
text, the app's path lookup and the post-build copy of the Legal page documents. This partly reverses
the earlier rule that the Legal text is a verbatim transcription: its wording is still the company's
and is not edited, but the Company details inside it are filled in from data, in the same form the
landing page shows them (so `017661877599` became `0176 618 77 599`, and the email and website lost
their capital `I`). We chose this so that changing an address or a number is one edit that cannot
leave a stale copy on a legally required page.

## Considered options

- **Keep the Legal text fully verbatim**: no edit to legal wording ever, but every Company detail is
  then written twice, and a change to one copy silently leaves the other wrong.
- **Store a second, Legal-text-only form of each detail** (e.g. the unspaced phone number): no visible
  change, but two forms of one fact in the single source defeats its purpose.

## Consequences

- The Legal page fixtures (`src/__fixtures__/*.html`) carry the data-driven forms; they guard the
  wording, not the Company details.
- `index.html` meta tags and `public/CNAME` still name the town and the domain; they are static files
  read before the app runs and are out of scope here.
