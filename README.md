# WykSofts Inc. landing page

A responsive company landing page for WykSofts Inc., a Nairobi software studio
offering mobile apps, websites, web applications, custom software, API
integrations, AI solutions, and cloud services.

## Run locally

```bash
npm install
npm run dev
```

Open the local address shown in the terminal.

## Validate

```bash
npm run build
node --test tests/rendered-html.test.mjs
```

## Publish with GitHub Pages

Generate the static Pages bundle:

```bash
npm run export:pages
```

The finished static site is written to `docs/`. In the GitHub repository, open
**Settings → Pages**, choose **Deploy from a branch**, then select the `main`
branch and `/docs` folder.

The published contact details are `support@mynomp.com` and
`+254 703 285 070`. The office location is Mirage Towers, Nairobi. The site
also includes selected work for Mynomp, City BBQ App, and SlimChickens App,
with projects advertised from $100 and final pricing based on scope.
