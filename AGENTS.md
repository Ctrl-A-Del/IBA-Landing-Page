# AGENTS.md

Guidance for agents working in this repository.

## Project

Landing page for **Ingenieurbüro-Auner GmbH** (trench milling / Fräsen for energy and utility network
expansion). Create React App via `react-scripts` 5.0.1, React 17, Tailwind CSS v3, `lucide-react` for
icons. No router. Self-hosted latin-subset fonts.

## Commands

- Dev server: `npm start`
- Production build: `npm run build`
- Tests: `npm test`

`npm` only — there is no `yarn.lock`. Keep `package-lock.json` in sync; CI runs `npm ci`.

## Deploy

`.github/workflows/deploy.yml` publishes to the live site at `ingenieurbuero-auner.com` on **`push` to
`master`** only, so merging a PR deploys. Pull requests run `.github/workflows/check.yml` (tests and
build) and deploy nothing. Merging to `master` needs explicit human approval.

## Working notes

`DESIGN_PLAN.md` at the repo root is the design decision log and task tracker for the current
redesign. Read it first; its §1 facts are verified against the working tree, and §2 lists hard
constraints that must not be violated.

## Agent skills

### Issue tracker

Issues live as markdown files under `.scratch/<feature-slug>/`. See `docs/agents/issue-tracker.md`.

### Triage labels

The five canonical triage roles plus the `bug`/`enhancement` category roles, each label string equal
to its own name. See `docs/agents/triage-labels.md`.

### Domain docs

Single-context: `GLOSSARY.md` and `docs/adr/` at the repo root. See `docs/agents/domain.md`.
