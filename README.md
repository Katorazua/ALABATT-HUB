# ALABATT-HUB

ALABATT-HUB is a digital initiative for Rev. Fr. Moses Orshio Adasu
University, Makurdi, Benue State, Nigeria. This repository contains the Centre
for Open and Distance Learning (CODL) public landing page and a frontend-only
student portal prototype.

## Run locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Student portal demo

- Sign-in route: `/student-portal`
- Dashboard route: `/student-portal/dashboard`
- Demo email: `demo.student@alabatt-demo.test`
- Demo password: `CODLdemo2026!`

The sign-in screen also allows a local demo account to be created. Demo account
passwords are stored as salted digests, while profile, course, payment, and
notification examples are stored in browser local storage.

This is not production authentication or official university enrolment. The
dashboard uses sample records only. Do not enter real passwords, payment
details, or private student information. Payment actions do not contact a
provider or transfer money. Client-side route checks and browser storage do
not provide real security.

## Checks

```bash
npm run lint
npm run typecheck
npm run build
```
