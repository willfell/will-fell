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

- Interactive portfolio showcasing projects and experiences
- Contact form for inquiries
- Optimized for performance and SEO
- Responsive design for all device types
- Deployed with a fully automated CI/CD pipeline

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

