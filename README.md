# Will Fellhoelter Portfolio

A page to show my portfolio and provide some form of contact, you can see it on the world wide web [here](https://willfellhoelter.com)!

## Tech Stack

- **Frontend:** Next.js, React, TypeScript, Tailwind CSS
- **Backend:** Static site (no backend server)
- **CI/CD:** GitHub Actions
- **Infrastructure as Code:** Terraform
- **Hosting:** AWS S3 & AWS CloudFront
- **Domain Management:** AWS Route 53

## Features

- One dark page: hero, experience (roles with their logos, each expanding to its resume bullets), selected work, personal projects (Sauce), GitHub activity; email and links in the footer
- GitHub contribution calendar fetched at build time from the public profile into `app/src/data/github-contributions.json` (`yarn github:fetch`); the committed snapshot is the fallback whenever GitHub is unreachable. The window slides daily, so `yarn build` rewrites that file whenever the calendar moved: commit it to refresh the fallback, or `git checkout -- app/src/data/github-contributions.json` to drop it. The deploy can skip the fetch by passing `build_env: GITHUB_CONTRIBUTIONS_SKIP=1` to the shared workflow
- Resume download (the PDF is produced outside the repo; commit it to both `app/public/` and `app/src/assets/`)
- Static export, responsive; the only motion is a hero fade, smooth anchor scrolling and the roles' plus turning, all off under reduced motion
- Deployed by GitHub Actions on every merge to `main`

## Verification

From `app/`: `yarn images:validate && yarn github:fetch --check && yarn build && yarn copy-resume`. `yarn build` refreshes the GitHub snapshot first (skip it offline with `GITHUB_CONTRIBUTIONS_SKIP=1`), then type-checks and runs `yarn lint:check` (eslint without `--fix`) before `next build`, so CI's build step is also the lint gate; `yarn lint` is the autofixing variant for local use.
From the repo root: `npm run site:verify` renders `app/out/` in Playwright and checks page height, word count, required links, fonts, contrast, the roles, the GitHub band against the snapshot, dead routes and the resume checksum. Screenshots land in `app/.screenshots/`.

## Hosting and Deployment

### Static Site Hosting

- The site is built using Next.js and deployed as a static site.
- Static assets are hosted on AWS S3.

### Content Delivery

- AWS CloudFront is configured as the CDN to deliver content quickly and securely worldwide.
- It also ensures HTTPS using AWS Certificate Manager (ACM).

### CI/CD Pipeline

- GitHub Actions handle automatic deployment when changes are pushed to the main branch.
- Terraform scripts manage infrastructure provisioning, including S3 buckets, CloudFront distributions, and DNS records in Route 53.

