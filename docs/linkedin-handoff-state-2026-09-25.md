# Handoff brief: LinkedIn, site, resume

Written 2026-09-25 by the will-fell-linkedin-upgrade session. Read this plus `docs/content-ownership-2026-09-25.md` and you have the whole picture. That file holds the voice, the corrections, the dates and where content lives. This file holds what has actually been done and what is left.

## Read these first

1. `docs/content-ownership-2026-09-25.md` — canonical voice in Will's own words, the two factual corrections, locked date table, approved About copy, site and resume line numbers, resume build instructions.
2. `docs/linkedin-profile-backup-2026-09-22-before.md` — verbatim pre-edit snapshot of every editable LinkedIn field, with a rollback table. Covered by `.git/info/exclude`, contains Will's phone and email, must never be committed. The repo is public.

## Working rules Will set

- Show him the form contents and stop before every Save. Never save without his explicit go-ahead.
- **Notify network must stay Off.** He said "make sure that no updates are made to the network please". The toggle appears at the top of each experience dialog. It has persisted Off since I turned it off, but check it every time.
- Do not add the skill chips LinkedIn suggests in role dialogs. They are wrong.
- Skip the "connect with people you may know" prompt after each save. Do not connect with anyone.

## LinkedIn progress

| Section | State |
|---|---|
| 1. Headline | SAVED |
| 2. About | SAVED |
| 3a. Accuris Principal | SAVED |
| 3b. Accuris Senior | SAVED |
| 4. Forml Senior | SAVED |
| 5. Cerner | No-op, already Oct 2018 to Mar 2020 |
| 6. Sauce project | **Form open in the will-fell-linkedin (session 2) tab, description set and verified, month still Feb, NOT saved** |
| 7. Skills | Not started |
| 8. Featured | Not started |
| 9. Open to Work | Not started |
| 10. Fellhoelter Consulting | Dropped. Will said keep it off LinkedIn entirely |

### Section 6, where it stands

Re-opened on 2026-09-25 (second session) at `/details/projects/edit/forms/1238925589/`. The description was set with form_input and read back as an exact 352-character match to the site's Sauce blurb. The start month is still February 2026: the permission classifier blocked the select change, so Will sets May himself or approves it. Project name, GitHub media link, five skills and "Associated with" untouched. Will approved saving with May on 2026-09-26.

### Section 7, still undecided

Will approved adding all of these: Model Context Protocol (MCP), AI Agents, Artificial Intelligence (AI), Platform Engineering, Solution Architecture, Databricks, GitHub Actions, Kubernetes, Amazon Web Services (AWS), Terraform, Microsoft Entra ID, Customer Engagement, plus AgentGateway, Claude Code, GitHub Copilot, AWS Bedrock, Helm, Kargo, ArgoCD. Several already exist. Puppet and Chef are not on the profile, so that removal is a no-op. The three skills to pin were never confirmed; my recommendation was MCP, Kubernetes and Artificial Intelligence (AI).

### Sections 8 and 9, not started

Featured needs three links: willfellhoelter.com as "Portfolio", willfellhoelter.com/WillFellhoelterResume.pdf as "Resume", github.com/willfell/sauce as "Sauce: agentic operating loop for Obsidian". The section does not exist yet and is not offered in the Add section menu, so it may need a direct form URL like About did.

Open to Work: titles Forward Deployed Engineer, Principal Software Engineer, Platform Engineer, Solutions Architect, AI Engineer. Remote plus Denver hybrid. Start flexible. Visibility **Recruiters only**. Show Will the summary before saving.

## Known hazards

**Typing drops characters.** Using the type action on LinkedIn's rich text fields silently loses letters. The Sauce description came out with "becoe", "Claude Cod", "schedulng", "persistet", "deployent", "vaul". Use `form_input` on a textarea ref, or set the value directly, then verify with a read-back before saving.

**Audit done 2026-09-25.** About paragraphs 1 to 3 match the approved copy byte for byte. The three job descriptions (Accuris Principal, Accuris Senior, forml Senior) read back with no dropped characters. One difference: the About's closing paragraph on LinkedIn is not the approved "Sauce, an agentic operating loop for Obsidian: github.com/willfell/sauce" line. It is two paragraphs: "Denver. Open to forward deployed and platform roles." then "Passion project on the side, Sauce, an OS for Obsidian, supporting node graph development on top - github.com/willfell/sauce". Will ruled on 2026-09-26: keep it as is.

**LinkedIn sections can exist while invisible.** The About section did not render on the profile page and was absent from the Add section menu, yet it existed with content. The direct form URL `/in/will-fellhoelter-1aa17312b/add-edit/SUMMARY/` reached it. My first backup wrongly recorded it as absent; that is corrected now. Expect the same for Featured.

**Detail pages load slowly.** Skills, Education and Featured often render a spinner for 10 or more seconds. Scripted scrolling does not trigger their lazy load; real mouse scroll actions do.

## Site and resume, edited 2026-09-25, uncommitted

All eight site places and five resume places from the ownership doc are edited in the working tree. The About component now splits `description` on blank lines into paragraphs, and the site About uses the first three approved paragraphs. Resume title now matches the LinkedIn headline; summary is a condensed version of the approved About; the "promoted after 11 months" clause is gone. Resume rebuilt, exactly 2 pages, both PDF copies updated. tsc passes; eslint errors in data.tsx are pre-existing (55 before and after). The Senior "Led the migration of 1,000+ repositories" bullet was kept because Will saved that wording on LinkedIn.

Will ruled on 2026-09-26: keep Accuris as Remote on the site and resume and Hybrid on LinkedIn, and keep forml combined on the site and resume and split on LinkedIn. The live resume PDF still needs checking after this PR deploys.

## Sessions

will-fell-7e, will-fell-portfolio-upgrade and will-fell-resume-upgrade were all closed on 2026-09-25 after handing their state over. Their content is folded into the ownership doc. Nothing else holds this work.
