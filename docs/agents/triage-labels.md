# Triage Labels

The skills speak in terms of canonical triage roles. This file maps those roles to the actual label
strings used in this repo's issue tracker.

## State roles

| Label in mattpocock/skills | Label in our tracker | Meaning                                  |
| -------------------------- | -------------------- | ---------------------------------------- |
| `needs-triage`             | `needs-triage`       | Maintainer needs to evaluate this issue  |
| `needs-info`               | `needs-info`         | Waiting on reporter for more information |
| `ready-for-agent`          | `ready-for-agent`    | Fully specified, ready for an AFK agent  |
| `ready-for-human`          | `ready-for-human`    | Requires human implementation            |
| `wontfix`                  | `wontfix`            | Will not be actioned                     |

## Category roles

Every triaged issue carries exactly one category role as well as one state role.

| Label in mattpocock/skills | Label in our tracker | Meaning                    |
| -------------------------- | -------------------- | -------------------------- |
| `bug`                      | `bug`                | Something is broken        |
| `enhancement`              | `enhancement`        | New feature or improvement |

## How this maps onto a local-markdown tracker

There are no real labels here. A state role is recorded as the value of the `Status:` line near the
top of an issue file, e.g. `Status: ready-for-agent`. Category is either carried by an explicit
`Type:` line or clear from the ticket's wording.

When a skill mentions a role (e.g. "apply the AFK-ready triage label"), use the corresponding string
from the tables above.

Edit the "Label in our tracker" columns to match whatever vocabulary you actually use.
