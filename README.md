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

- One page: who Will is, three selected works, one line per role, contact in the footer
- Resume download (the PDF is produced outside the repo; commit it to both `app/public/` and `app/src/assets/`)
- Static export, responsive, no scroll-triggered animation
- Deployed by GitHub Actions on every merge to `main`

## Verification

From `app/`: `yarn images:validate && yarn build && yarn copy-resume`. `yarn build` type-checks and runs `yarn lint:check` (eslint without `--fix`) before `next build`, so CI's build step is also the lint gate; `yarn lint` is the autofixing variant for local use.
From the repo root: `npm run site:verify` renders `app/out/` in Playwright and checks page height, word count, required links, dead routes and the resume checksum. Screenshots land in `app/.screenshots/`.

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

