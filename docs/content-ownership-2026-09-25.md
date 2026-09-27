# Content ownership: LinkedIn, site, resume

Written 2026-09-25 when the will-fell-portfolio-upgrade and will-fell-resume-upgrade sessions were retired and their work folded into the LinkedIn session. This file is the handoff record so nothing lives only in a closed session's memory.

This file is covered by `.git/info/exclude` only if it matches `docs/linkedin-profile-backup-*.md`. It does not, so it is committable. It contains no personal contact details.

## Canonical voice

Will's direction, verbatim:

- "slim this down, make the verbiage more subtle, not heroic, just cool"
- "it's not that i'm focusing on one specific thing, it's that i have experience everywhere, that i have experience in new up to date agentic ai infra experience at scale, that i have experience in all departments, focused on ensuring the end-goal for the client is defined, communicated, delivered no matter what element of the stack is needed"

He rejected any framing that says he is "focused on agentic AI infrastructure". Breadth is the lead claim. Agentic AI is where that breadth currently points, not the identity.

## Two factual corrections

These are claim errors, not style. Both are live in the site and the resume as of 2246376.

1. He does not "run 100+ microservices". He handles **operations for** 100+ microservices, and separately operates and manages a few of his own that the wider org depends on. The verb "operate" is acceptable. "Run" implies ownership he does not claim.
2. He does not "standardize deployments for 1,000+ repos" as a solo act. He **helps map out** the projects that standardize CI/CD across 1,000+ repos.

## Approved About copy, live on LinkedIn

```
Eight years across the stack: data, application logic, deploys, the Kubernetes underneath, the alerting on top. I usually end up wherever the gap is between what a client needs and what actually ships.

Lately that's agentic AI infrastructure. At Accuris I built the MCP mesh connecting 250+ tools to every team, handle operations for 100+ microservices across 6 regions, and run a few of my own the wider org depends on. I help map out the work standardizing CI/CD across 1,000+ repos. Most of it is making the agentic workflows developers already use hang together, from one person's setup out to the org.

Before that, first engineering hire at an AI startup, working with founders and enterprise clients.

Denver. Open to forward deployed and platform roles. Sauce, an agentic operating loop for Obsidian: github.com/willfell/sauce
```

Headline, live on LinkedIn: `Principal Software Engineer | Agentic AI Infrastructure, MCP, Kubernetes at Scale`

## Dates, locked

LinkedIn is the source of truth, by Will's instruction.

| Employer | Title | Dates |
|---|---|---|
| Accuris | Principal Software Engineer | Mar 2026 to Present |
| Accuris | Senior Software Engineer | Apr 2025 to Mar 2026 |
| forml | Senior Full Stack Engineer | Jan 2025 to Apr 2025 |
| forml | Full Stack Engineer | Aug 2024 to Jan 2025 |
| Project Canary | DevOps Engineer | May 2023 to Aug 2024 |
| Lendflow | DevSecOps Engineer | Aug 2021 to May 2023 |
| MCG Health | Cloud / DevOps Engineer | Mar 2020 to Aug 2021 |
| Cerner Corporation | System Engineer | Oct 2018 to Mar 2020 |

Sauce started May 2026. Its first commit is 2026-05-03. LinkedIn previously said Feb 2026.

Accuris location: LinkedIn says Denver, Colorado, Hybrid. Will chose to keep that. The site and resume both say Remote. Unreconciled, and his call.

forml is one combined Senior entry on the site and resume, and a two-entry split on LinkedIn. Will chose to keep the split on LinkedIn.

## Where the content lives

### Site

`app/src/data/data.tsx` is the only content file. Lines needing the corrections and the voice change, as of 2246376:

| Line | What it says now |
|---|---|
| 28 | meta description, "focused on agentic AI infrastructure" |
| 58 | hero subtitle, "building agentic AI platforms and Kubernetes infrastructure at scale" |
| 85 to 87 | aboutData.description, both wrong claims plus the rejected framing |
| 361 | Accuris Principal bullet, "Operate 100+ microservices", acceptable verb |
| 366 | Accuris Principal bullet, "Standardized deployment patterns across 1,000+ repositories", overstates |
| 388 | Accuris Senior bullet, "Led the migration of 1,000+ repositories" |
| 756 | Professional Work card, "running 100+ microservices" |
| 773 | Professional Work card, "Migrated 1,000+ repositories to GitHub and standardized CI/CD" |

The About component renders `description` as a single paragraph, so the four-paragraph LinkedIn copy collapses unless the component is changed.

### Resume

Source is `resume/index.html` plus `resume/resume.css`. Build with `npm run resume:build` from the repo root. Needs `npx playwright install chromium` on a fresh machine. The build fails unless the output is exactly two US Letter pages.

Output is written to both `app/public/WillFellhoelterResume.pdf` and `app/src/assets/WillFellhoelterResume.pdf`, because the deploy postbuild step copies `src/assets` over the exported site. Keep both in sync.

Previous Enhancv PDF archived at `app/public/archive/WillFellhoelterResume-2025-forml.pdf`.

Lines needing the corrections and the voice change:

| Line | What it says now |
|---|---|
| 11 | title line, "Principal Software Engineer \| Platform & Agentic AI Infrastructure" |
| 26 to 28 | summary, both wrong claims plus "now focused on agentic AI infrastructure" |
| 130 | "Operate 100+ microservices", acceptable verb |
| 132 | "Standardized deployment patterns across 1,000+ repositories", overstates |
| 145 | "Led the migration of 1,000+ repositories to GitHub" |

Trim order if the resume overflows two pages: Cerner and MCG to two bullets each, then Lendflow, before touching Accuris or forml. Layout intentionally echoes the old Enhancv look, two columns, experience left, sidebar right, green accent. Not pixel-identical.

## Decisions carried over from the retired sessions

- The site `<title>` string "Will Fellhoelter - Principal Software Engineer" was the portfolio session's choice, not dictated by Will. He only said to update the title.
- Sauce card image is Obsidian's official gradient SVG at `app/public/images/skills/obsidian.svg`. Will said to use the Obsidian logo. The Sauce why and how modal copy is his verbatim text.
- Accuris logo is a public-domain Wikimedia Commons PNG. The company's own SVG is a 404 and their brand site only has a "Formerly IHS" lockup.
- `chef.svg` was kept despite Will asking to delete the vagrant, packer, puppet and chef icons, because the MCG "Chef to Ansible Migration" card references it and deleting it fails the `yarn images:validate` CI gate. He has not ruled on dropping the icon from that card.
- Skills badges for "AI & Agent Platforms", Helm and Kargo are text only, per his instruction not to fetch icons.
- The Accuris Senior bullet originally read "promoted to Principal after 6 months". The resume session changed it to "after 11 months" to match the dates. Will later told the LinkedIn session to drop the line entirely, which is what LinkedIn now reflects.
- Strengths section was deleted from the resume. Achievements reduced to MCP Mesh at Scale, Security Compliance and Readiness, Hackathon 3rd Place. Skills lost Puppet, Chef, PHP, Domo and Cassandra, and gained an AI and Agent Platforms row.

## Open items

- The deploy triggered by 2246376 was never verified. The live PDF at willfellhoelter.com/WillFellhoelterResume.pdf is unconfirmed. The portfolio session did confirm the site HTML at that commit is live and that the PDF is a new 112,224-byte file.
- The stale remote branch `resume-update` still exists and is safe to delete.
- The worktree at `/Users/willfell/Documents/GitHub/will-fell-resume` is clean and fully merged; safe to remove.
