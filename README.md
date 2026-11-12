# ASTRA: ZERO HOUR

Two-page event site for the ASTRA intercollege defence problem-solving contest.

## Run locally

1. Install Node.js 20 or newer.
2. Copy `.env.example` to `.env.local`.
3. Set `NEXT_PUBLIC_SITE_URL` to the final public site origin.
4. Set `NEXT_PUBLIC_UNSTOP_REGISTRATION_URL` to the published ASTRA event URL on Unstop. Until then, the registration page labels its Unstop link as temporary.
5. Run `npm install`, then `npm run dev` and open `http://localhost:3000`.

For a production build, run `npm run build` and `npm start`.

## Content to confirm before launch

- Publish the Unstop event form and make **College name** a required field. The current page lists the exact team details that the form should collect; it does not collect or transmit participant data itself.
- Confirm the venue, schedule times, guest, sponsors, and event contact details before replacing their placeholders.
- Update the default site origin in the deployment environment so canonical URLs, sitemap, robots, and Event JSON-LD use the real domain.
- Submit the production sitemap in Google Search Console after deployment.

The countdown targets the start of 03 December 2026 in India Standard Time because an event start time has not been confirmed.
