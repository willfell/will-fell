# LinkedIn and resume updates for the 2026-09-29 redesign

Written 2026-09-29 alongside the site redesign. The site's copy is the source of truth below; LinkedIn and the resume PDF should carry the same lines so the three stay consistent. Nothing here has been saved to LinkedIn yet.

The working rules from `docs/linkedin-handoff-state-2026-09-25.md` still apply: show Will the form contents and stop before every Save; Notify network stays Off; no suggested skill chips; skip the connect prompts.

## 1. Accuris, Principal Software Engineer: the description

LinkedIn's wording differs from the site's resume bullets (LinkedIn keeps "AgentGateway" and "Entra ID"; the site genericizes them to "one gateway" and "SSO"; LinkedIn has a technical-consultant line the resume does not). So this is the whole description as it should read on LinkedIn, in order. Against the original: bullet 1 credits the platform team, 2 is extended, 3 and 5 are new, 4 and 6 say K8s, and the AWS-accounts bullet is gone. The rest are the existing lines verbatim.

> • With the platform team, built and launched the MCP mesh on AgentGateway, giving engineering, product, and cross-functional teams governed access to 250+ tools with Entra ID auth and centralized observability
> • Designed and shipped multiple production MCP servers exposing internal systems to AI agents through natural language, including our own New Relic and PagerDuty servers in place of paid vendor connectors
> • Built the incident plugin that takes a PagerDuty alert to a root cause in New Relic and documents it in the team's Obsidian vault in the same pass
> • Operate 100+ microservices on multi-region K8s across 6 regions; led the multi-region expansion of compute and data tiers for multiple core services
> • With the platform team, rolled out the New Relic K8s operator so 400+ deployed services get consistent APM injection with no manual work from developers, standardizing naming and troubleshooting across the org
> • Help map out and drive the projects standardizing deployment patterns and CI/CD across 1,000+ repositories with template-driven K8s
> • Build and operate CDC pipelines from PostgreSQL into Databricks for mission-critical data
> • Act as technical consultant to engineering teams across the company on architecture, deployment, and AI adoption

Status 2026-10-02: saved on LinkedIn exactly as above (eight bullets), Notify network off. The headline was saved with "K8s" on 2026-09-30. At Will's request the AWS-accounts bullet was removed from LinkedIn and the site, and is not to be mentioned anywhere.

## 2. "Kubernetes" becomes "K8s" in prose

Will's call on 2026-09-29: the site says K8s everywhere. To match, on LinkedIn (the headline row was saved on 2026-09-30; the two bullet rows are covered by section 1):

| Field | Now | Proposed |
|---|---|---|
| Headline | Principal Software Engineer \| Agentic AI Infrastructure, MCP, Kubernetes at Scale | Principal Software Engineer \| Agentic AI Infrastructure, MCP, K8s at Scale |
| Accuris Principal bullet | Operate 100+ microservices on Kubernetes across 6 regions; led the multi-region buildout of compute and data tiers | Operate 100+ microservices on K8s across 6 regions; led the multi-region buildout of compute and data tiers |
| Accuris Principal bullet | Help map out and drive the standardization of deployment and CI/CD across 1,000+ repositories with templated Kubernetes | Help map out and drive the standardization of deployment and CI/CD across 1,000+ repositories with templated K8s |

The Kubernetes entry in Skills stays as is; that is LinkedIn's taxonomy, not prose.

## 3. Headline, optional

The site's own framing is deliberately broad ("Open to new roles") because Will does not want to be read as one lane. If the headline should say the same, one option:

> Principal Software Engineer | Agentic AI, MCP, K8s, Observability at Scale

Will's call. Section 2's K8s swap is the minimum change.

## 4. About, optional one-sentence addition

The site hero follows "wherever the gap is between what a client needs and what actually ships" with:

> Most of it starts with listening, so what gets built is what was actually needed.

Adding that sentence after the first paragraph of the LinkedIn About keeps the two in step. Will's call; the About was audited byte for byte on 2026-09-25 and is otherwise unchanged.

## 5. Open to Work

The 2026-09-25 list stands: Forward Deployed Engineer, Principal Software Engineer, Platform Engineer, Solutions Architect, AI Engineer. Remote plus Denver hybrid, visibility Recruiters only. Not started.

## 6. Resume PDF

The PDF is produced outside the repo. Carry section 1's bullets and section 2's wording into it. The site serves whatever is committed to both `app/public/WillFellhoelterResume.pdf` and `app/src/assets/WillFellhoelterResume.pdf` (see README); `scripts/verify-site.js` pins the served file's sha256, so update that constant when the new PDF lands.

## What already matches

- The Sauce description on the site is the frozen blurb LinkedIn has.
- Role names on the site now follow LinkedIn: forml; MCG Health, Cloud / DevOps Engineer; Cerner Corporation, System Engineer.
- The two factual corrections hold everywhere: "operations for" 100+ microservices, never "run"; "help map out" CI/CD across 1,000+ repos, never a solo claim.
- Accuris stays Remote on the site and resume and Hybrid on LinkedIn; forml stays one combined entry on the site and split on LinkedIn (both Will's 2026-09-26 rulings).

## 7. Site changes since (2026-10-01), for consistency

The site now writes "MCP Mesh" with a capital M and names AgentGateway on the work card and in the Principal role's first bullet. LinkedIn's Principal description already says "MCP mesh on AgentGateway"; changing "mesh" to "Mesh" there is optional and cosmetic. The AWS-accounts line is gone from both, at Will's request.
